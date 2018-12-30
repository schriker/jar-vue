<template>
    <header class="header row">
      <ul class="streamers-wraper">
          <li class="streamer__placeholder" v-if="streamers.loading || user.isFetching">
            <a>
              <app-streamer-placeholder></app-streamer-placeholder>
            </a>
          </li>
        <app-simplebar v-if="!streamers.loading && !user.isFetching" class="simplebar" data-simplebar-auto-hide="true">
          <app-draggable v-model="streamersList" :options="{ disabled: sortable }">
              <app-streamer v-for="streamer in streamers.data" :key="streamer.info.id" :streamer="streamer"></app-streamer>
          </app-draggable>
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
import AppDraggable from 'vuedraggable'
import 'simplebar/dist/simplebar.min.css'

export default {
  data () {
    return {
      sortable: false
    }
  },
  components: {
    AppStreamerPlaceholder,
    AppStreamer,
    AppUserMenu,
    AppSimplebar,
    AppDraggable
  },
  computed: {
    ...mapState([
      'streamers',
      'user'
    ]),
    streamersList: {
      get () {
        return this.$store.state.userData.streamers
      },
      set (value) {
        this.$store.commit('updateStreamersList', value)
        this.fetchStreamers(this.$route.params.id)
      }
    }
  },
  methods: {
    ...mapActions([
      'fetchStreamers'
    ])
  },
  watch: {
    '$route' () {
      if (this.$route.params.id) {
        this.$store.dispatch('fetchVideos', { streamerName: this.$route.params.id, loadMore: false })
      }
    }
  },
  created () {
    this.sortable = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  }
}
</script>

<style>
  .simplebar {
    height: 60px;
    width: 100%;
    flex: 1 1 auto;
  }
  .simplebar-content > div {
    display: flex;
    height: 100%;
  }

  .streamers-wraper {
    overflow: auto;
    overflow-y: hidden;
  }
</style>
