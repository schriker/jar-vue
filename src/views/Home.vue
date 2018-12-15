<template>
  <div>
    <app-spinner v-if="loadingVideos"></app-spinner>
    <app-videos-list v-else :videos="videos[streamerName].videos"></app-videos-list>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import AppSpinner from '../components/Spinner'
import AppVideosList from '../components/videos/VideosList'

export default {
  components: {
    AppSpinner,
    AppVideosList
  },
  computed: {
    ...mapState({
      loadingVideos: 'loadingVideos',
      videos: 'videos'
    }),
    streamerName () {
      return this.$route.params.id
    }
  },
  watch: {
    '$route' () {
      this.$store.dispatch('fetchVideos', this.$route.params.id)
    }
  }
}
</script>
