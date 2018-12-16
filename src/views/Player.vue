<template>
    <div class="center-flex">
        <div class="player">
          <transition name="fade-in" appear>
            <div v-if="singleVideo[0]" class="player__top">
              <i class="fas fa-play"></i>{{ singleVideo[0].duration }}
              <i class="fas fa-eye"></i>{{ singleVideo[0].view_count }}
              <app-toggle-watched :videoId="singleVideo[0].id" :watched="singleVideo[0].watched"></app-toggle-watched>
              <app-toggle-book-marked :video="singleVideo[0]" :bookMarked="singleVideo[0].bookmarked"></app-toggle-book-marked>
            </div>
          </transition>
          <iframe
            class="player__iframe"
            :src="`https://player.twitch.tv/?video=v${$route.params.video}&autoplay=false`"
            width="100%"
            frameborder="0"
            scrolling="false"
            allowfullscreen="true">
          </iframe>
        </div>
        <div class="poorchat">
            <iframe frameborder="0" height="100%" width="100%"  id="jd-chat" src="https://client.poorchat.net/jadisco"></iframe>
        </div>
    </div>
</template>
<script>
import AppToggleWatched from '../UI/ToggleWatched'
import AppToggleBookMarked from '../UI/ToggleBookMarked'
import { mapActions, mapState } from 'vuex'

export default {
  components: {
    AppToggleWatched,
    AppToggleBookMarked
  },
  computed: {
    ...mapState([
      'singleVideo'
    ])
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
