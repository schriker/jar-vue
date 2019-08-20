<template>
    <div id="player-container" style="width: 100%; height:100%"></div>
</template>
<script lang="ts">
import Vue from "vue"
import { Component, Prop, Mixins } from 'vue-property-decorator'
import { mapActions, mapState } from 'vuex'
import PlayerBase from './PlayerBase'

declare var Twitch: any

@Component({
  methods: {
    ...mapActions([
      'getSingleVideo'
    ])
  }
})
export default class extends Mixins(PlayerBase) {
  twitchPlayer: any | null = null
  isPlayerPlaying = false
  isPlayerReady = false
  
  public getPlayerTime(){
    if(!this.isPlayerReady)
      return 0
    return this.twitchPlayer.getCurrentTime()
  }
  
  public getIsPlaying(){ // FIXME: chat not starts when player starts while window is not focused
    if(!this.isPlayerReady)
      return false
    //return !this.twitchPlayer.isPaused()
    return this.isPlayerPlaying
  }
  
  mounted() {
    const options = {
        video: this.videoId,
    }
    this.twitchPlayer = new Twitch.Player('player-container', options)
    
    const twitchPlayerIFrame = document.getElementById('player-container')!.children[0]
    twitchPlayerIFrame.removeAttribute('width')
    twitchPlayerIFrame.removeAttribute('height')
    twitchPlayerIFrame.setAttribute('class', 'player__iframe')
    
    this.twitchPlayer.addEventListener(Twitch.Player.READY, () => {
      this.isPlayerReady = true
      this.stateNotifyCallback()
    })
    this.twitchPlayer.addEventListener(Twitch.Player.PLAY, () => {
      this.isPlayerPlaying = true
      this.stateNotifyCallback()
    })
    this.twitchPlayer.addEventListener(Twitch.Player.PAUSE, () => {
      this.isPlayerPlaying = false
     this.stateNotifyCallback()
    })
    this.twitchPlayer.addEventListener(Twitch.Player.PLAYBACK_BLOCKED,() => {
      this.isPlayerPlaying = false
     this.stateNotifyCallback()
    })
    this.twitchPlayer.addEventListener(Twitch.Player.ENDED, () => {
      this.isPlayerPlaying = false
      this.stateNotifyCallback()
    })
    
    /* twitchPlayerIFrame.onmouseenter = () => this.isPlayerJustFocused = true
    twitchPlayerIFrame.onmouseleave = () => this.isPlayerJustFocused = false
    window.onblur = () => {
      if (this.isPlayerJustFocused) {
        this.playerStateNotify()
        setTimeout(function() { window.focus() }, 0);
      }
    } */
  }
}
</script>
