<template>
    <header class="header row">
      <ul>
        <li v-if="loadingStreamers">
          <a>
            <app-streamer-placeholder></app-streamer-placeholder>
          </a>
        </li>
        <li v-for="streamer in streamers" :key="streamer.info.id">
          <router-link :to="`/${streamer.info.login}`" active-class="active">
            <app-streamer :streamer="streamer"></app-streamer>
          </router-link>
        </li>
      </ul>
      <app-user-menu></app-user-menu>
    </header>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import AppStreamer from './Streamer'
import AppStreamerPlaceholder from './StreamerPlacholder'
import AppUserMenu from './UserMenu'

export default {
  components: {
    AppStreamerPlaceholder,
    AppStreamer,
    AppUserMenu
  },
  computed: {
    ...mapState([
      'streamers',
      'loadingStreamers'
    ])
  },
  methods: {
    ...mapActions([
      'fetchStreamers'
    ])
  },
  watch: {
    '$route' () {
      this.$store.dispatch('fetchVideos', { streamerName: this.$route.params.id, loadMore: false })
    }
  },
  created () {
    if (!this.streamers[this.streamerName]) {
      this.fetchStreamers(this.$route.params.id)
    } else {
      this.$store.dispatch('fetchVideos', { streamerName: this.$route.params.id, loadMore: false })
    }
  }
}
</script>
