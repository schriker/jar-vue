<template>
    <div class="center-flex center-flex--overlow-hide">
        <div class="player">
          <transition name="fade-in" appear>
            <div v-if="video[0]" class="player__top">
              <span class="hide-mobile"><i class="fas fa-play"></i>{{ video[0].duration }}</span>
              <i class="fas fa-eye"></i>{{ video[0].view_count }}
              <i class="fas fa-calendar"></i>{{ date }}
              <app-toggle-watched :videoId="video[0].id" :watched="video[0].watched"></app-toggle-watched>
              <app-toggle-book-marked :video="video[0]" :bookMarked="video[0].bookmarked"></app-toggle-book-marked>
            </div>
          </transition>
          <!-- <iframe
            class="player__iframe"
            :src="`https://player.twitch.tv/?video=v${$route.params.video}&autoplay=false`"
            width="100%"
            frameborder="0"
            scrolling="false"
            allowfullscreen="true">
          </iframe> -->
        </div>
        <div class="poorchat" :class="{ 'poorchat--close' : !showChat }">
          <div @click="showChat = !showChat" class="poorchat__hide"><i :class="{'fas fa-eye-slash': showChat, 'fas fa-eye': !showChat}"></i></div>
          <div class="player__top player__top--left-border">
            <a target="_blank" href="https://www.poorchat.net/subscriptions/jadisco"><i class="fas fa-heart"></i>Subskrybuj czatek</a>
          </div>
            <!-- <iframe v-if="showChat" class="poorchat__container" frameborder="0" width="100%" id="jd-chat" src="https://client.poorchat.net/jadisco"></iframe> -->
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
      let id = this.$route.params.id
      let userName = this.singleVideo[0].user_name
      if (userName && (userName.toLowerCase() !== id)) {
        this.$router.replace({ params: { id: userName.toLowerCase(), video: this.$route.params.video } })
      }
      return this.singleVideo
    },
    date () {
      let date = new Date(this.video[0].published_at)
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
    getVideo () {
      let videoData = {
        streamer: this.$route.params.id,
        video: this.$route.params.video
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
