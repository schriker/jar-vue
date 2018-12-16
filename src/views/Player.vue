<template>
    <div class="center-flex">
        <div class="player">
          <div class="player__top">{{shortTitle}}</div>
          {{ singleVideo[0].watched }}
          {{ singleVideo[0].bookmarked }}
          <!-- <iframe
            class="player__iframe"
            :src="`https://player.twitch.tv/?video=v${$route.params.video}&autoplay=false`"
            width="100%"
            frameborder="0"
            scrolling="false"
            allowfullscreen="true">
          </iframe> -->
        </div>
        <div class="poorchat">
            <iframe frameborder="0" height="100%" width="100%"  id="jd-chat" src="https://client.poorchat.net/jadisco"></iframe>
        </div>
    </div>
</template>
<script>
import { mapActions, mapState, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'shortTitle'
    ]),
    ...mapState([
      'singleVideo'
    ])
  },
  methods: {
    ...mapActions([
      'getSingleVideo'
    ])
  },
  created () {
    let videoData = {
      streamer: this.$route.params.id,
      video: this.$route.params.video
    }
    this.getSingleVideo(videoData)
  }
}
</script>
