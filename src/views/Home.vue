<template>
  <div>
    <div v-if="!loadingVideos" class="row filters">
      <button @click="setToggleWatched" class="btn" :class="{'btn--active': userData.hideWatched}">Ukryj obejrzane</button>
    </div>
    <app-spinner v-if="loadingVideos"></app-spinner>
    <app-videos-list v-else :videos="streamers[streamerName].videos.videos"></app-videos-list>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
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
    setToggleWatched () {
      this.toggleWatched()
      this.updateLocalStorage()
    }
  },
  computed: {
    ...mapState([
      'loadingVideos',
      'streamers',
      'userData'
    ]),
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
