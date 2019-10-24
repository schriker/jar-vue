<template>
    <div class="center-flex center-flex--overlow-hide">
        <div class="player">
          <transition name="fade-in" appear>
            <div v-if="video[0]" class="player__top">
              <span @click="copyMirko" class="hide-mobile"><i class="fas fa-play"></i>{{ video[0].duration }}</span>
              <i class="fas fa-eye"></i>{{ video[0].view_count }}
              <i class="fas fa-calendar"></i>{{ date }}
               <ul class="archive-type" style="margin-left: 15px;">
                <!-- <li @click="switchPlayer()" :class="{ 'archive-type__fb': !facebookPlayer, 'archive-type__yt': facebookPlayer }">
                  <a><i :class="{ 'fab fa-facebook-square': !facebookPlayer, 'fab fa-youtube': facebookPlayer }"></i>{{ !facebookPlayer ? 'Facebook Player' : 'YouTube Player' }}</a>
                </li> -->
               </ul>
              <input ref="mirkoInput" :value="mirkoLink" type="hidden" />
              <app-toggle-watched :videoId="video[0].id" :watched="video[0].watched"></app-toggle-watched>
              <app-toggle-book-marked :video="video[0]" :bookMarked="video[0].bookmarked"></app-toggle-book-marked>
            </div>
          </transition>
        <div ref="youTubePlayer" v-if="video[0].youTubeId"></div>
        <div v-else-if="$route.query.platform === 'facebook'" class="fb-video"
          :data-href="`https://www.facebook.com/facebook/videos/${$route.params.video}`"
          data-width="auto"
          data-height="auto"
          data-allowfullscreen="true"
          data-autoplay="false"
          data-show-captions="true">
        </div>
        <iframe
          v-else
          class="player__iframe"
          :src="videoURL"
          width="100%"
          frameborder="0"
          scrolling="false"
          allowfullscreen="true">
        </iframe>
        </div>
        <div  class="poorchat" :class="{ 'poorchat--close' : !showChat }">
          <div @click="showChat = !showChat" class="poorchat__hide"><i :class="{'fas fa-eye-slash': showChat, 'fas fa-eye': !showChat}"></i></div>
          <div class="player__top player__top--left-border">
            <a target="_blank" href="https://www.poorchat.net/subscriptions/jadisco"><i class="fas fa-heart"></i>Subskrybuj czatek</a>
          </div>
          <AppChat
            :class="{'hide': showJadisco}"
            :showTime.sync="showTime"
            :showImg.sync="showImg"
            :playerPosition.sync="playerPosition"
            :isPlaying.sync="isPlaying"
            :finished.sync="finished"
            :playbackRate.sync="playbackRate"
            :videoStartedDate="video[0].published_at"
            :videoFinishedDate="video[0].created_at"
            v-if="showChat && $route.query.platform === 'facebook'"
          />
          <iframe v-if="showChat && $route.query.platform !== 'facebook' || showJadisco" class="poorchat__container" frameborder="0" width="100%" id="jd-chat" src="https://client.poorchat.net/jadisco"></iframe>
          <div v-if="showOptions" @click="showOptions = false" class="chat__settings--backdrop"></div>
          <div class="chat__settings" v-if="showOptions">
            <h3>Opcje:</h3>
            <div @click="chatOptionsHandler('showTime')">Czas<i v-if="showTime" class="fas fa-check-square"></i></div>
            <div @click="chatOptionsHandler('showImg')">Obrazki<i v-if="showImg" class="fas fa-check-square"></i></div>
          </div>
          <div class="chat__options">
            <div @click="switchChat"><i class="fas fa-comments"></i>Czat Jadisco</div>
            <i @click="showOptions = !showOptions" class="fas fa-cog"></i>
          </div>
        </div>
    </div>
</template>
<script>
import AppToggleWatched from '../UI/ToggleWatched'
import AppToggleBookMarked from '../UI/ToggleBookMarked'
import AppChat from '../components/chat/Chat'
import { jarchiwumAPI } from '../helpers/axiosInstances'
import { mapActions, mapState } from 'vuex'

export default {
  data () {
    return {
      showChat: true,
      facebookPlayer: false,
      playerPosition: 0,
      player: null,
      isPlaying: false,
      playbackRate: 1,
      finished: false,
      showOptions: false,
      showJadisco: false,
      showTime: true,
      showImg: true,
      componentKey: 0
    }
  },
  metaInfo () {
    return {
      title: !(this.streamerName in this.streamers.data) ? 'Jarchiwum' : `Jarchiwum - ${this.streamers.data[this.streamerName].info.display_name}`
    }
  },
  components: {
    AppToggleWatched,
    AppToggleBookMarked,
    AppChat
  },
  computed: {
    ...mapState([
      'singleVideo',
      'streamers'
    ]),
    video () {
      const id = this.$route.params.id
      const userName = this.singleVideo[0].user_name
      if (userName && (userName.toLowerCase() !== id)) {
        this.$router.replace({ params: { id: userName.toLowerCase(), video: this.$route.params.video } })
      }
      return this.singleVideo
    },
    videoURL () {
      if (this.$route.query.platform === 'youtube') {
        return `https://www.youtube.com/embed/${this.$route.params.video}?autoplay=0`
      } else {
        return `https://player.twitch.tv/?video=v${this.$route.params.video}&autoplay=false`
      }
    },
    mirkoLink () {
      const platform = this.$route.query.platform
      let link = platform === 'youtube' ? `https://www.youtube.com/watch?v=${this.$route.params.video}` : platform === 'twitch' ? `https://www.twitch.tv/videos/${this.$route.params.video}` : `https://jarchiwum.pl/wonziu/${this.$route.params.video}?platform=facebook`
      return `${link} (${platform})(**${this.video[0].duration}**)(_${this.video[0].title}_)`
    },
    date () {
      const date = new Date(this.video[0].published_at)
      return date.toLocaleString('nl-NL')
    },
    streamerName () {
      return this.$route.params.id
    }
  },
  methods: {
    ...mapActions([
      'getSingleVideo'
    ]),
    copyMirko () {
      this.$refs.mirkoInput.setAttribute('type', 'text')
      this.$refs.mirkoInput.select()
      document.execCommand('copy')
      this.$refs.mirkoInput.setAttribute('type', 'hidden')
    },
    switchChat () {
      this.isPlaying = false
      this.isPlaying = true
      this.showJadisco = !this.showJadisco
    },
    switchPlayer () {
      this.facebookPlayer = !this.facebookPlayer
    },
    chatOptionsHandler (option) {
      this[option] = !this[option]
      const localStorageOptions = {
        showImg: this.showImg,
        showTime: this.showTime
      }
      localStorage.setItem('chatOptions', JSON.stringify(localStorageOptions))
    },
    loadYouTubeApi () {
      const onPlaybackRateChange = () => {
        this.playbackRate = player.getPlaybackRate()
        this.playerPosition = player.getCurrentTime()
      }
      const onPlayerStateChange = (event) => {
        const { data: state } = event
        this.playbackRate = player.getPlaybackRate()
        switch (state) {
          case 0:
            // console.log('Ended')
            player.seekTo(0)
            player.pauseVideo()
            this.finished = true
            this.isPlaying = false
            break
          case 2:
            // console.log('Paused')
            this.isPlaying = false
            break
          case 3:
            // console.log('Buffering')
            this.isPlaying = false
            break
          case 1:
            if (!this.isPlaying) {
              // console.log('Playing')
              this.playerPosition = player.getCurrentTime()
              this.isPlaying = true
              this.finished = false
            }
            break
        }
      }
      const onPlayerError = () => {
        player.pauseVideo()
        this.isPlaying = false
      }
      const onReady = () => {
        this.player = player
      }
      let player = new window.YT.Player(this.$refs.youTubePlayer, {
        height: '100%',
        width: '100%',
        videoId: this.video[0].youTubeId,
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
    },
    loadFacebookAPI () {
      if (this.$route.query.platform === 'facebook') {
        jarchiwumAPI.get(`/updateviews?id=${this.$route.params.video}`)
      }
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
          this.player = msg.instance

          this.player.subscribe('startedPlaying', () => {
            this.playerPosition = this.player.getCurrentPosition()
            this.isPlaying = true
            this.finished = false
          })
          this.player.subscribe('paused', () => {
            this.playerPosition = this.player.getCurrentPosition()
            this.isPlaying = false
          })
          this.player.subscribe('finishedPlaying', () => {
            this.player.seek(0)
            this.player.pause()
            this.finished = true
            this.isPlaying = false
          })
          this.player.subscribe('startedBuffering', () => {
            this.player.pause()
            this.isPlaying = false
          })

          this.player.subscribe('error', () => {
            this.player.pause()
            this.isPlaying = false
          })
        }
      })
    },
    async getVideo () {
      const videoData = {
        streamer: this.$route.params.id,
        video: this.$route.params.video,
        platform: this.$route.query.platform
      }
      await this.getSingleVideo(videoData)
      if (window.YT !== undefined && this.video[0].youTubeId) {
        this.loadYouTubeApi()
      } else if (this.video[0].youTubeId) {
        window.addEventListener('load', () => {
          this.loadYouTubeApi()
        })
      }
    }
  },
  watch: {
    async '$route' () {
      this.getVideo()
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
  },
  async created () {
    this.getVideo()
    const options = JSON.parse(localStorage.getItem('chatOptions'))
    if (options) {
      for (const option in options) {
        this[option] = options[option]
      }
    }
  }
}
</script>
