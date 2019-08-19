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
          <iframe
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
            <iframe v-if="showChat" class="poorchat__container" frameborder="0" width="100%" id="jd-chat" src="https://client.poorchat.net/jadisco"></iframe>
        </div>
    </div>
</template>
<script>
import AppToggleWatched from '../UI/ToggleWatched'
import AppToggleBookMarked from '../UI/ToggleBookMarked'
import { mapActions, mapState } from 'vuex'

export default {
  data () {
    return {
      showChat: true
    }
  },
  metaInfo () {
    return {
      title: !(this.streamerName in this.streamers.data) ? 'Jarchiwum' : `Jarchiwum - ${this.streamers.data[this.streamerName].info.display_name}`
    }
  },
  components: {
    AppToggleWatched,
    AppToggleBookMarked
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
      if (this.$route.query.yt === 'true') {
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
    getVideo () {
      const videoData = {
        streamer: this.$route.params.id,
        video: this.$route.params.video,
        isYoutube: this.$route.query.yt !== 'false'
      }
      this.getSingleVideo(videoData)
    }
  },
  watch: {
    '$route' () {
      this.getVideo()
    }
  },
  created () {
    this.getVideo()
  }
}
</script>
