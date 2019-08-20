<template>
  <div class="replay-chat">
    <div class="chat-content">
      <div id="chat-output" @scroll="updateScrollToBottomButton">
        <ul class="chat-messages-dump">
          <li v-for="(rechatEvent, eventIndex) in visibleRechatEvents" :key="rechatEvent.id">
            <app-chat-event 
              :rechat-event="rechatEvent"
              :emoticons-info="emoticonsInfo"
              :jadisco-badges-info="jadiscoBadgesInfo"
              :is-continuation-message="eventIndex > 0 && rechatEvent.user && visibleRechatEvents[eventIndex-1].user == rechatEvent.user"> <!--TODO: compare modes-->
            </app-chat-event>
          </li>
        </ul>
        <a class="scroll-to-bottom-button"
          v-if="showScrollToBottomButton"
          @click="scrollToBottom">Więcej wiadomości poniżej</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { Component, Prop } from 'vue-property-decorator'
import axios from 'axios'
import AppPlayerBase from '../players/PlayerBase'
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
    totalRechatEvents: RechatEvent[] = []
    visibleRechatEvents: RechatEvent[] = []
    updateTimeoutHandle: NodeJS.Timeout | null = null
    showScrollToBottomButton = false
    jadiscoBadgesInfo: any | null = null
    emoticonsInfo: any | null = null
  
   /*  const testRechatEvents = [
      {
        type: RechatEventType.Message,
        id: 0,
        playerTimeMs: 0,
        user: "jarzyna",
        userColor: "#FF0000",
        userSubscriptionMonths: 0,
        userGiftedSubscriptionMonths: 0,
        userModes: ["globalModerator"],
        displayTime: "21:37",
        message: "Kto chce bana?"
      }
    ] */
    
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
        if(this.updateTimeoutHandle != null){
            clearTimeout(this.updateTimeoutHandle);
            this.updateTimeoutHandle = null;
        }
        
        if(!this.player || !this.player.getIsPlaying())
            return
        
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
            setTimeout(this.scrollToBottom, 0)
        
        if(eventsEnd <  this.totalRechatEvents.length){
            const nextUpdateTimeout = Utils.clamp(this.totalRechatEvents[eventsEnd].playerTimeMs - playerTime, 200, 20)
            this.updateTimeoutHandle = setTimeout(this.updateVisibleEvents, nextUpdateTimeout)
            //console.log('next updateVisibleEvents in: ' + nextUpdateTimeout)
        } else {
            //console.log('reached last event (' + eventsEnd + ')')
        }
    }

    async created(){
        this.updateScrollToBottomButton()

        axios.get('https://api.poorchat.net/v1/channels/jadisco/badges').then(
            resp => { this.jadiscoBadgesInfo = resp.data }, 
            error => console.error('Could not fetch badges info: ' + error))
            
        axios.get('https://api.poorchat.net/v1/emoticons').then(
            resp => { this.emoticonsInfo = resp.data }, 
            error => console.error('Could not fetch emoticons info: ' + error))

        this.totalRechatEvents = await fetchRechatEvents(this.streamingService, this.streamId)
        this.updateVisibleEvents()
    }
}
</script>