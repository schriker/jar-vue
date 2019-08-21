<template>
    <div class="replay-chat">
        <div class="chat-content">
            <div id="chat-output" @scroll="updateScrollToBottomButton">
                <ul v-if="replayState=='ok'" class="chat-messages-dump">
                    <li v-for="(rechatEvent, eventIndex) in visibleRechatEvents" :key="rechatEvent.id">
                        <app-chat-event 
                            :rechat-event="rechatEvent"
                            :emoticons-info="emoticonsInfo"
                            :jadisco-badges-info="jadiscoBadgesInfo"
                            :is-continuation-message="eventIndex > 0 && rechatEvent.user && visibleRechatEvents[eventIndex-1].user == rechatEvent.user"> <!--TODO: compare modes-->
                        </app-chat-event>
                    </li>
                </ul>
                <span v-else-if="replayState != 'loading'" class="replay-error-message">
                    <template v-if="replayState == 'cantDownload'" >Nie udało się pobrać powtórki czatq </template>
                    <template v-else-if="replayState == 'notAvailable'">Brak powtórki czatq dla tego streama </template>
                    <img v-if="emoticonsInfo" class="emoticon" :src="`https://static.poorchat.net/emoticons/${emoticonsInfo.find(e=>e.name=='Feels').file}/1x`" alt="Feels"/>
                </span>
                <a class="scroll-to-bottom-button"
                    v-if="showScrollToBottomButton"
                    @click="scrollToBottom">Więcej wiadomości poniżej
                </a>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue"
import { Component, Prop } from 'vue-property-decorator'
import axios from 'axios'
import AppPlayerBase from '../players/PlayerBase'
//@ts-ignore - ts doesn't like .vue files
import AppChatEvent from './ChatEvent'
import { UserMode, RechatEvent, RechatEventType, fetchRechatEvents } from "../../helpers/chatReplay"
import * as Utils from '../../helpers/utils'

@Component({
    components: { AppChatEvent }
})
export default class extends Vue {
    @Prop() streamingService: string
    @Prop() streamId: string

    player: AppPlayerBase | null = null
    fetchRechatEventsPromise: Promise<void> | null = null
    totalRechatEvents: RechatEvent[] = []
    rechatEventsAvailableFrom: number | null = null
    rechatEventsAvailableTo: number | null = null
    updateVisibleEventsHandle: NodeJS.Timeout | null = null
    jadiscoBadgesInfo: any | null = null
    emoticonsInfo: any | null = null
    
    visibleRechatEvents: RechatEvent[] = []
    showScrollToBottomButton = false
    replayState: 'loading' | 'ok' | 'cantDownload' | 'notAvailable' = 'loading'
    
    private playerNotifyCallback(){
        //console.log('Player time: ' + this.player.getPlayerTime()) 
        this.updateVisibleEvents()
    }

    public setPlayer(player: AppPlayerBase) {
        this.player = player
        this.player.stateNotifyCallback = this.playerNotifyCallback
    }

    private scrollToBottom(){
        const el = document.getElementById('chat-output')!
        el.scrollTop = el.scrollHeight - el.clientHeight
    }

    private isScrollAtBottom(): boolean{
        const el = document.getElementById('chat-output')
        if(!el)
            return true
        if(el.scrollHeight <= el.clientHeight)
            return true
        return (el.scrollHeight - el.scrollTop) - el.clientHeight < 20
    }

    private updateScrollToBottomButton(){
        this.showScrollToBottomButton = !this.isScrollAtBottom()
    }
  
    private updateVisibleEvents(){
        if(this.updateVisibleEventsHandle != null){
            clearTimeout(this.updateVisibleEventsHandle);
            this.updateVisibleEventsHandle = null;
        }
        
        if(!this.player)
            return
            
        if(!this.player.getIsPlaying())
            this.updateVisibleEventsHandle = setTimeout(this.updateVisibleEvents, 500)
        
        const wasScrollAtBottom = this.isScrollAtBottom()
        
        const playerTime = this.player.getPlayerTime() * 1000;
        //console.log('updateVisibleEvents:: time: ' + playerTime + ' playing: ' + this.isPlayerPlaying());
        let eventsEnd = 0
        for(; eventsEnd < this.totalRechatEvents.length; eventsEnd++){
            if(this.totalRechatEvents[eventsEnd].playerTimeMs > playerTime)
                break
        }

        this.visibleRechatEvents = this.totalRechatEvents
            .filter(event => event.printable)
            .slice(Math.max(0, eventsEnd - 200), eventsEnd)
        
        if(wasScrollAtBottom)
            setTimeout(this.scrollToBottom)            
        
        if(eventsEnd < this.totalRechatEvents.length){
            const nextUpdateTimeout = Utils.clamp(this.totalRechatEvents[eventsEnd].playerTimeMs - playerTime, 200, 20)
            this.updateVisibleEventsHandle = setTimeout(this.updateVisibleEvents, nextUpdateTimeout)
            //console.log('next updateVisibleEvents in: ' + nextUpdateTimeout)
        } else {
            //console.log('reached last event (' + eventsEnd + ')')
        }
    }

    created(){
        axios.get('https://api.poorchat.net/v1/channels/jadisco/badges').then(
            resp => { this.jadiscoBadgesInfo = resp.data }, 
            error => console.error('Could not fetch badges info: ' + error))
            
        axios.get('https://api.poorchat.net/v1/emoticons').then(
            resp => { this.emoticonsInfo = resp.data }, 
            error => console.error('Could not fetch emoticons info: ' + error))

        this.fetchRechatEventsPromise = fetchRechatEvents(this.streamingService, this.streamId)
            .then(res => { 
                this.totalRechatEvents = res.events
               /*  this.rechatEventsAvailableFrom = res.availableTimeFrom
                this.rechatEventsAvailableTo = res.availableTimeTo */
            })
    }
    
    async mounted() {
        this.updateScrollToBottomButton()
        
        try {
            await this.fetchRechatEventsPromise!
        } catch(e) {
            this.replayState = 'cantDownload'
            throw e
        }
        
        if(this.replayState != 'cantDownload') {
            if(this.totalRechatEvents.length == 0){
                this.replayState = 'notAvailable'
            } else {
                this.replayState = 'ok'
                this.updateVisibleEvents()
            }
        }
    }
}
</script>