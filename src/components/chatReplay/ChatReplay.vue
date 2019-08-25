<template>
    <div class="replay-chat">
        <div class="chat-content">
            <div id="chat-output" @scroll="updateScrollToBottomButton">
                <ul v-if="replayState=='ok'" class="chat-messages-dump">
                    <li v-for="(replayEvent, eventIndex) in visibleReplayEvents" :key="replayEvent.eventUid">
                        <app-chat-event 
                            :replay-event="replayEvent"
                            :stream-start-time="streamStartTime"
                            :embeds-map="embedsMap"
                            :emoticons-info="emoticonsInfo"
                            :jadisco-badges-info="jadiscoBadgesInfo"
                            :is-continuation-message="eventIndex > 0 && replayEvent.user && visibleReplayEvents[eventIndex-1].user == replayEvent.user"> <!--TODO: compare modes-->
                        </app-chat-event>
                    </li>
                </ul>
                <span v-else-if="replayState != 'loading'" class="replay-error-message">
                    <template v-if="replayState == 'cantDownload'" >Nie udało się pobrać powtórki czatq </template>
                    <template v-else-if="replayState == 'notAvailable'">Brak powtórki czatq dla tego streama </template>
                    <img v-if="emoticonsInfo" class="emoticon" :src="`https://static.poorchat.net/emoticons/${emoticonsInfo.find(e=>e.name=='Feels').file}/1x`" alt="Feels"/>
                    <br>
                    <a @click="disableChatCallback">Pokaż aktualny czat</a>
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
import { constants } from "crypto";
import AppPlayerBase from '../players/PlayerBase'
//@ts-ignore - ts doesn't like .vue files
import AppChatEvent from './ChatEvent'
import { UserMode, ReplayEvent, ReplayEventType, fetchReplayEvents, ReplayEmbedEvent } from "../../helpers/chatReplay"
import * as Utils from '../../helpers/utils'
import { performance } from "perf_hooks";

@Component({
    components: { AppChatEvent },
    name: 'ChatReplay'
})
export default class extends Vue {
    @Prop() streamingService: string
    @Prop() streamId: string
    @Prop({default: () => {}}) disableChatCallback: () => void
    @Prop({default: topic => {}}) setTopicCallback: (topic: string | null) => void

    player: AppPlayerBase | null = null
    fetchReplayEventsPromise: Promise<void> | null = null
    totalReplayEvents: ReplayEvent[] = []
    streamStartTime: Date
    embedsMap = new Map<string, ReplayEmbedEvent[]>()
    replayEventsAvailableFrom: number | null = null
    replayEventsAvailableTo: number | null = null
    jadiscoBadgesInfo: any | null = null
    emoticonsInfo: any | null = null
    
    updateHandle: NodeJS.Timeout | null = null
    //lastUpdatePlayerTime: number | null = null
    lastDispatchedEventIndex: number | null = null
    
    visibleReplayEvents: ReplayEvent[] = []
    showScrollToBottomButton = false
    replayState: 'loading' | 'ok' | 'cantDownload' | 'notAvailable' = 'loading'
    
    
    public setPlayer(player: AppPlayerBase) {
        this.player = player
        this.player.stateNotifyCallback = this.playerNotifyCallback
    }
    
    private playerNotifyCallback(){
        //console.log('Player time: ' + this.player.getPlayerTime()) 
        this.update()
    }

    private scrollToBottom(){
        const el = document.getElementById('chat-output')!
        el.scrollTop = el.scrollHeight - el.clientHeight
        this.updateScrollToBottomButton()
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
  
    private update(){
        this.cancelPendingUpdate()
        
        if(!this.player || this.totalReplayEvents.length == 0)
            return
            
        if(!this.player.getIsPlaying())
            this.updateHandle = setTimeout(this.update, 500)
        
        const wasScrollAtBottom = this.isScrollAtBottom()
        const playerTime = this.player.getPlayerTime() * 1000;
        
        let dispatchEventsStartIndex: number | null
        if(this.lastDispatchedEventIndex == null){
            dispatchEventsStartIndex = 0
        } else {
            const lastDispatchedEventTime = this.totalReplayEvents[this.lastDispatchedEventIndex].playerTimeMs
            
            if(lastDispatchedEventTime == playerTime) {
                // We're in the same time as before - do nothing
                dispatchEventsStartIndex = null
            } else if(lastDispatchedEventTime > playerTime) {
                // Playback shifted backwards, reapply all events
                dispatchEventsStartIndex = 0
                this.visibleReplayEvents = []
                this.setTopicCallback(null)
            } else {
                dispatchEventsStartIndex = this.lastDispatchedEventIndex + 1
                
                if(dispatchEventsStartIndex >= this.totalReplayEvents.length)
                    dispatchEventsStartIndex = null    
            }
        }
        
        if(dispatchEventsStartIndex != null) {
            for(let i = dispatchEventsStartIndex; i < this.totalReplayEvents.length; i++){
                const event = this.totalReplayEvents[i]
                
                if(event.playerTimeMs > playerTime)
                    break
                
                if(event.printable) {
                    this.visibleReplayEvents.push(event)
                } else if(event.type == ReplayEventType.TopicChanged) {
                    this.setTopicCallback(event.topic)
                }
                
                this.lastDispatchedEventIndex = i
            }
        }  
        
        this.visibleReplayEvents.splice(0, Math.max(this.visibleReplayEvents.length - 200, 0))
        
        if(wasScrollAtBottom)
            setTimeout(this.scrollToBottom)            
        
        const prevEventIndex = this.lastDispatchedEventIndex == null ? -1 : this.lastDispatchedEventIndex
        if(prevEventIndex < this.totalReplayEvents.length - 1){
            const nextEventPlayerTime = this.totalReplayEvents[prevEventIndex + 1].playerTimeMs
            const nextUpdateTimeout = Utils.clamp(nextEventPlayerTime - playerTime, 200, 20)
            this.updateHandle = setTimeout(this.update, nextUpdateTimeout)
            //console.log('next update in: ' + nextUpdateTimeout)
        } else {
            //console.log('reached last event (' + eventsEnd + ')')
        }
    }
    
    private cancelPendingUpdate(){
         if(this.updateHandle != null){
            clearTimeout(this.updateHandle)
            this.updateHandle = null
        }
    }

    created(){
        axios.get('https://api.poorchat.net/v1/channels/jadisco/badges').then(
            resp => { this.jadiscoBadgesInfo = resp.data }, 
            error => console.error('Could not fetch badges info: ' + error))
            
        axios.get('https://api.poorchat.net/v1/emoticons').then(
            resp => { this.emoticonsInfo = resp.data }, 
            error => console.error('Could not fetch emoticons info: ' + error))

        this.fetchReplayEventsPromise = fetchReplayEvents(this.streamingService, this.streamId)
            .then(res => { 
                this.totalReplayEvents = res.events
                this.streamStartTime = res.streamStartTime
                
                this.embedsMap.clear()
                for(const event of this.totalReplayEvents){
                    if(event.type === ReplayEventType.Embed && event.msgid){
                        if(this.embedsMap.has(event.msgid))
                            this.embedsMap.get(event.msgid)!.push(event)
                        else
                            this.embedsMap.set(event.msgid, [event])
                    }
                }
                
               /*  this.replayEventsAvailableFrom = res.availableTimeFrom
                this.replayEventsAvailableTo = res.availableTimeTo */
            }, error => console.error(error))
    }
    
    async mounted() {
        this.updateScrollToBottomButton()
        
        try {
            await this.fetchReplayEventsPromise!
        } catch(e) {
            this.replayState = 'cantDownload'
            throw e
        }
        
        if(this.replayState != 'cantDownload') {
            if(this.totalReplayEvents.length == 0){
                this.replayState = 'notAvailable'
            } else {
                this.replayState = 'ok'
                this.update()
            }
        }
    }
    
    activated() {
        this.scrollToBottom()
        this.update()
    }
    
    deactivated() {
        this.cancelPendingUpdate()
    }
    
    beforeDestroy() {
        this.cancelPendingUpdate()
    }
}
</script>