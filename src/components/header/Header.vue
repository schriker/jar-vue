<template>
    <header class="header row">
      <ul class="streamers-wraper">
          <li v-if="streamers.loading">
            <a>
              <app-streamer-placeholder></app-streamer-placeholder>
            </a>
          </li>
        <app-simplebar v-if="!streamers.loading" class="simplebar" data-simplebar-auto-hide="true">
          <li v-for="streamer in streamers.data" :key="streamer.info.id">
            <router-link :to="`/${streamer.info.login}`" active-class="active">
              <app-streamer :streamer="streamer"></app-streamer>
            </router-link>
          </li>
        </app-simplebar>
      </ul>
      <app-user-menu></app-user-menu>
    </header>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import AppStreamer from './Streamer'
import AppStreamerPlaceholder from './StreamerPlacholder'
import AppUserMenu from './UserMenu'
import AppSimplebar from 'simplebar-vue'
import 'simplebar/dist/simplebar.min.css'

export default {
  components: {
    AppStreamerPlaceholder,
    AppStreamer,
    AppUserMenu,
    AppSimplebar
  },
  computed: {
    ...mapState([
      'streamers'
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
    if (!this.streamers.data[this.streamerName]) {
      this.fetchStreamers(this.$route.params.id)
    } else {
      this.$store.dispatch('fetchVideos', { streamerName: this.$route.params.id, loadMore: false })
    }
  }
}
</script>

<style>
  .simplebar {
    height: 60px;
    width: 100%;
    flex: 1 1 auto;
  }
  .simplebar-content {
    display: flex;
  }

  .streamers-wraper {
    overflow: auto;
    overflow-y: hidden;
  }
</style>
