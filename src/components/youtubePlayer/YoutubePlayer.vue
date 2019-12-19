<template>
<div class="player__wrapper">
  <div id="yt_player"></div>
</div>
</template>
<script>
export default {
  data () {
    return {
      player: null
    }
  },
  props: {
    videoId: String,
    seekTo: Number
  },
  methods: {
    getPlayerPosition () {
      if (this.player) {
        return this.player.getCurrentTime()
      }
    },
    loadYouTubeApi () {
      const onPlaybackRateChange = () => {
        this.$emit('playerEvent', {
          name: 'playbackRateChange',
          playbackRate: player.getPlaybackRate(),
          position: player.getCurrentTime()
        })
      }
      const onPlayerStateChange = (event) => {
        const { data: state } = event
        this.$emit('playerEvent', {
          name: 'playbackRate',
          playbackRate: player.getPlaybackRate()
        })
        switch (state) {
          case 0:
            player.seekTo(0)
            player.pauseVideo()
            this.$emit('playerEvent', {
              name: 'ended'
            })
            break
          case 2:
            this.$emit('playerEvent', {
              name: 'paused'
            })
            break
          case 3:
            this.$emit('playerEvent', {
              name: 'buffering'
            })
            break
          case 1:
            this.$emit('playerEvent', {
              name: 'playing',
              position: player.getCurrentTime()
            })
            break
        }
      }
      const onPlayerError = () => {
        player.pauseVideo()
        this.$emit('playerEvent', {
          name: 'error'
        })
      }
      const onReady = () => {
        this.player = player
      }
      let player = new window.YT.Player('yt_player', {
        height: '100%',
        width: '100%',
        videoId: this.videoId,
        playerVars: {
          enablejsapi: 1,
          origin: 'https://jarchiwum.pl'
        },
        events: {
          'onReady': onReady,
          'onStateChange': onPlayerStateChange,
          'onPlaybackRateChange': onPlaybackRateChange,
          'onError': onPlayerError
        }
      })
    }
  },
  watch: {
    seekTo () {
      if (this.seekTo > 0) {
        this.player.seekTo(this.seekTo / 1000 - 15)
        this.player.playVideo()
      }
    }
  },
  beforeDestroy () {
    this.player.destroy()
  },
  mounted () {
    if (window.YT !== undefined && this.videoId) {
      this.loadYouTubeApi()
    } else if (this.videoId) {
      window.addEventListener('load', () => {
        this.loadYouTubeApi()
      })
    }
  }
}
</script>
