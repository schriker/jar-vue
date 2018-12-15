<template>
  <div>
    <div v-if="!loadingVideos" class="row filters">
      <button @click="setToggleWatched" class="btn" :class="{'btn--active': userData.hideWatched}">Ukryj obejrzane</button>
    </div>
    <app-spinner v-if="loadingVideos"></app-spinner>
    <app-videos-list v-else :videos="streamers[streamerName].videos.videos"></app-videos-list>
    <div v-if="!loadingVideos" class="row load-more">
      <button :disabled="loadingMore" @click="fetchVideos({ streamerName: streamerName, loadMore: true })" class="btn">{{ loadingMore ? 'Pobieram...' : 'Załaduj więcej' }}</button>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import AppSpinner from '../components/Spinner'
import AppVideosList from '../components/videos/VideosList'

export default {
  components: {
    AppSpinner,
    AppVideosList
  },
  methods: {
    ...mapMutations([
      'toggleWatched',
      'updateLocalStorage'
    ]),
    ...mapActions([
      'fetchVideos'
    ]),
    setToggleWatched () {
      this.toggleWatched()
      this.updateLocalStorage()
    }
  },
  computed: {
    ...mapState([
      'loadingVideos',
      'loadingMore',
      'streamers',
      'userData'
    ]),
    streamerName () {
      return this.$route.params.id
    }
  },
  watch: {
    '$route' () {
      this.$store.dispatch('fetchVideos', { streamerName: this.$route.params.id, loadMore: false })
    }
  }
}
</script>
