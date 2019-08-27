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
      <transition name="fade-in">
        <app-basic-modal @closeModal="toggleRemovingModal" v-if="streamers.removingAlert">
          <div class="removing-icon">
            <img :src="streamers.removingName.info.profile_image_url" alt="">
            {{ streamers.removingName.info.display_name }} zostanie usnięty z listy.
            <button @click="atRemoveStreamer" class="submit-btn submit-btn--large-padding" type="submit">Ok</button>
          </div>
        </app-basic-modal>
      </transition>
    </header>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

import AppStreamer from './Streamer'
import AppStreamerPlaceholder from './StreamerPlacholder'
import AppUserMenu from './UserMenu'
import AppSimplebar from 'simplebar-vue'
import AppDraggable from 'vuedraggable'
import AppBasicModal from '../../UI/BasicModal'
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
    AppDraggable,
    AppBasicModal
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
    ...mapMutations([
      'removeStreamer',
      'toggleRemovingModal'
    ]),
    ...mapActions([
      'fetchStreamers',
      'displayNotification',
      'saveData'
    ]),
    async atRemoveStreamer () {
      this.removeStreamer(this.streamers.removingName.info.display_name.toLowerCase())
      this.toggleRemovingModal(null)
      this.saveData()
      await this.fetchStreamers(this.$store.state.userData.streamers[0])
      this.$router.push({ path: `/${this.$store.state.userData.streamers[0]}` })
      this.displayNotification({ type: 'error', message: 'Streamer został usunięty.' })
    }
  },
  watch: {
    '$route' () {
      if (this.$route.params.platform === 'facebook') {
        this.$store.dispatch('fetchVideos', { streamerName: this.$route.params.id, loadMore: false, playlistId: null, platform: 'facebook' })
      } else if (this.$route.params.platform === 'youtube') {
        this.$store.dispatch('fetchVideos', { streamerName: this.$route.params.id, loadMore: false, playlistId: this.$route.params.playlistId, platform: 'youtube' })
      } else if (this.$route.params.id) {
        this.$store.dispatch('fetchVideos', { streamerName: this.$route.params.id, loadMore: false, playlistId: null, platform: 'twitch' })
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
