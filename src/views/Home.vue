<template>
  <div>
    <div class="player__top player__top--videos" v-if="!loadingVideos && streamers.data[streamerName].status.type">
      <div class="live">
        <div class="live__outer"></div>
        <div class="live__icon"></div>
      </div>
      <a target="_blank" :href="`https://pancernik.info/twitch/${streamerName}`">Live - Oglądaj na pancerniku!</a>
    </div>
      <div v-if="!loadingVideos" class="row filters">
        <app-watched-button></app-watched-button>
        <div class="search">
          <input name="search" id="search" class="input" placeholder="Filtruj wyniki..." v-model="searchValue" type="text">
          <label for="search"><i class="fas fa-search"></i></label>
        </div>
      </div>
    <app-spinner v-if="loadingVideos"></app-spinner>
    <app-videos-list v-else :searchValue="searchValue" :videos="videos"></app-videos-list>
    <div v-if="!loadingVideos" class="row load-more">
      <button :disabled="loadingMore" @click="fetchVideos({ streamerName: streamerName, loadMore: true })" class="btn">{{ loadingMore ? 'Pobieram...' : 'Załaduj więcej' }}</button>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import AppSpinner from '../components/Spinner'
import AppVideosList from '../components/videos/VideosList'
import AppWatchedButton from '../UI/WatchedButton'

export default {
  data () {
    return {
      searchValue: ''
    }
  },
  metaInfo () {
    return {
      title: !(this.streamerName in this.streamers.data) ? 'Jarchiwum' : `Jarchiwum - ${this.streamers.data[this.streamerName].info.display_name}`
    }
  },
  components: {
    AppSpinner,
    AppVideosList,
    AppWatchedButton
  },
  methods: {
    ...mapActions([
      'fetchVideos',
      'addStreamer'
    ])
  },
  computed: {
    ...mapState([
      'userData',
      'loadingVideos',
      'loadingMore',
      'streamers'
    ]),
    videos () {
      return this.streamers.data[this.streamerName].videos.videos
    },
    streamerName () {
      return this.$route.params.id
    }
  },
  async created () {
    if (!this.userData.streamers.includes(this.streamerName)) {
      await this.addStreamer(this.streamerName)
      this.fetchVideos({ streamerName: this.streamerName, loadMore: false })
    }
  }
}
</script>
