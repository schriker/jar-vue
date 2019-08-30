<template>
    <div class="center-flex center-flex--overlow-hide">
        <div class="player">
          <transition name="fade-in" appear>
            <div v-if="video[0]" class="player__top">
              <span @click="copyMirko" class="hide-mobile"><i class="fas fa-play"></i>{{ video[0].duration }}</span>
              <i class="fas fa-eye"></i>{{ video[0].view_count }}
              <i class="fas fa-calendar"></i>{{ date }}
              <input ref="mirkoInput" :value="mirkoLink" type="hidden" />
              <app-toggle-watched :videoId="video[0].id" :watched="video[0].watched"></app-toggle-watched>
              <app-toggle-book-marked :video="video[0]" :bookMarked="video[0].bookmarked"></app-toggle-book-marked>
            </div>
          </transition>
        <div v-if="$route.query.platform === 'facebook'" class="fb-video"
          :data-href="`https://www.facebook.com/facebook/videos/${$route.params.video}`"
          data-width="auto"
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
        <div class="poorchat" :class="{ 'poorchat--close' : !showChat }">
          <div @click="showChat = !showChat" class="poorchat__hide"><i :class="{'fas fa-eye-slash': showChat, 'fas fa-eye': !showChat}"></i></div>
          <div class="player__top player__top--left-border">
            <a target="_blank" href="https://www.poorchat.net/subscriptions/jadisco"><i class="fas fa-heart"></i>Subskrybuj czatek</a>
          </div>
          <AppChat
            :playerPosition.sync="playerPosition"
            :isPlaying.sync="isPlaying"
            :videoStartedDate="video[0].published_at"
            :videoFinishedDate="video[0].created_at"
            v-if="showChat && $route.query.platform === 'facebook'"
          />
          <iframe v-if="showChat && $route.query.platform !== 'facebook'" class="poorchat__container" frameborder="0" width="100%" id="jd-chat" src="https://client.poorchat.net/jadisco"></iframe>
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
      playerPosition: 0,
      player: null,
      isPlaying: false
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
      const isYoutube = this.$route.query.yt !== 'false'
      const platform = isYoutube ? 'Youtube' : 'Twitch'
      let link = isYoutube ? 'https://www.youtube.com/watch?v=' : 'https://www.twitch.tv/videos/'
      link = `${link}${this.$route.params.video}`
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
    loadFacebookAPI () {
      if (this.$route.query.platform === 'facebook') {
        jarchiwumAPI.get(`/updateviews?id=${this.$route.params.video}`)
      }
      window.fbAsyncInit = () => {
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
          })
          this.player.subscribe('paused', () => {
            this.playerPosition = this.player.getCurrentPosition()
            this.isPlaying = false
          })
          this.player.subscribe('finishedPlaying', () => {
            this.player.pause()
            this.isPlaying = false
          })
          this.player.subscribe('startedBuffering', () => {
            this.player.pause()
            this.isPlaying = false
          })
        }
      })
    },
    getVideo () {
      const videoData = {
        streamer: this.$route.params.id,
        video: this.$route.params.video,
        platform: this.$route.query.platform
      }
      this.getSingleVideo(videoData)
    }
  },
  watch: {
    '$route' () {
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
  created () {
    this.getVideo()
  }
}
</script>
