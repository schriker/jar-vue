<template>
  <div>
    <div class="player__top player__top--videos" v-if="!loadingVideos && streamers.data[streamerName].status.type">
      <div class="live">
        <div class="live__outer"></div>
        <div class="live__icon"></div>
      </div>
      <a target="_blank" :href="`https://pancernik.info/twitch/${streamerName}`">Live - Oglądaj na pancerniku!</a>
    </div>
    <app-spinner v-if="(streamers.loading || user.isFetching || loadingVideos)"></app-spinner>
    <transition name="fade-in" appear>
      <div v-if="((!streamers.loading && !user.isFetching) && !loadingVideos)">
          <div class="row filters">
            <app-watched-button></app-watched-button>
            <div class="search">
              <input name="search" id="search" class="input" placeholder="Filtruj wyniki..." v-model="searchValue" type="text">
              <label for="search"><i class="fas fa-search"></i></label>
            </div>
          </div>
        <app-videos-list :searchValue="searchValue" :videos="videos"></app-videos-list>
        <div class="row load-more">
          <button :disabled="loadingMore" @click="fetchVideos({ streamerName: streamerName, loadMore: true })" class="btn">{{ loadingMore ? 'Pobieram...' : 'Załaduj więcej' }}</button>
        </div>
      </div>
    </transition>
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
      'fetchStreamers',
      'fetchVideos'
    ])
  },
  computed: {
    ...mapState([
      'userData',
      'loadingVideos',
      'loadingMore',
      'streamers',
      'user'
    ]),
    videos () {
      return this.streamers.data[this.streamerName].videos.videos
    },
    streamerName () {
      return this.$route.params.id
    }
  },
  created () {
    if (!this.userData.streamers.includes(this.streamerName)) {
      this.$router.push({ path: `/${this.$store.state.userData.streamers[0]}` })
      this.fetchStreamers(this.$store.state.userData.streamers[0])
    }
  }
}
</script>
