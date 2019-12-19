<template>
  <div class="player__wrapper">
    <div class="fb-video"
      :data-href="`https://www.facebook.com/facebook/videos/${this.videoId}`"
      data-width="auto"
      data-height="auto"
      data-allowfullscreen="true"
      data-autoplay="false"
      data-show-captions="true">
    </div>
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
        return this.player.getCurrentPosition()
      }
    },
    loadFacebookAPI () {
      window.fbAsyncInit = () => {
        window.FB.Canvas.setAutoResize(7)
        window.FB.init({
          appId: '2331553136926174',
          xfbml: true,
          version: 'v4.0'
        })
      }
      window.FB.Event.subscribe('xfbml.ready', msg => {
        if (msg.type === 'video') {
          let player = msg.instance
          this.player = player
          player.subscribe('startedPlaying', () => {
            this.$emit('playerEvent', {
              name: 'playing',
              position: player.getCurrentPosition()
            })
          })
          player.subscribe('paused', () => {
            this.$emit('playerEvent', {
              name: 'paused',
              position: player.getCurrentPosition()
            })
          })
          player.subscribe('finishedPlaying', () => {
            player.seek(0)
            player.pause()
            this.$emit('playerEvent', {
              name: 'ended'
            })
          })
          player.subscribe('startedBuffering', () => {
            player.pause()
            this.$emit('playerEvent', {
              name: 'buffering'
            })
          })
          player.subscribe('error', () => {
            player.pause()
            this.$emit('playerEvent', {
              name: 'error'
            })
          })
        }
      })
    }
  },
  watch: {
    seekTo () {
      if (this.seekTo > 0) {
        this.player.seek(this.seekTo / 1000 - 15)
        this.player.play()
      }
    }
  },
  mounted () {
    if (window.FB !== undefined) {
      window.FB.XFBML.parse()
      this.loadFacebookAPI()
    } else {
      window.addEventListener('load', () => {
        this.loadFacebookAPI()
      })
    }
  }
}
</script>
