<template>
  <div>
    <div v-if="!loadingVideos" class="row filters">
      <app-watched-button></app-watched-button>
      <input class="input input--dark" placeholder="Szukana fraza..." v-model="searchValue" type="text">
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
  components: {
    AppSpinner,
    AppVideosList,
    AppWatchedButton
  },
  methods: {
    ...mapActions([
      'fetchVideos'
    ])
  },
  computed: {
    ...mapState([
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
  }
}
</script>
