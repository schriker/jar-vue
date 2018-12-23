<template>
<transition name="fade-in" appear>
    <li>
        <router-link :to="`/${streamer.info.login}`" active-class="active"></router-link>
        <div class="streamer">
            <div class="streamer__icon">
                <!-- <div class="streamer__badge">4</div> -->
                <div @click="atRemoveStreamer" class="streamer__remove">
                    <i class="fas fa-minus-circle"></i>
                </div>
                <img :src="streamer.info.profile_image_url" alt="">
            </div>
            <div class="streamer__title">
                <span>{{ streamer.info.display_name }}</span>
                <div v-if="streamer.status.type" class="streamer__status">
                    <span>ON</span> {{ streamer.status.viewer_count }}
                </div>
                <div v-else class="streamer__status streamer__status--off">
                    <span>OFF</span>
                </div>
            </div>
        </div>
    </li>
</transition>
</template>
<script>
import { mapMutations, mapActions } from 'vuex'

export default {
  props: {
    streamer: Object
  },
  methods: {
    ...mapMutations([
      'removeStreamer',
      'updateLocalStorage'
    ]),
    ...mapActions([
      'fetchStreamers',
      'displayNotification'
    ]),
    async atRemoveStreamer () {
      this.removeStreamer(this.streamer.info.display_name.toLowerCase())
      this.updateLocalStorage()
      await this.fetchStreamers(this.$store.state.userData.streamers[0])
      this.$router.push({ path: `/${this.$store.state.userData.streamers[0]}` })
      this.displayNotification({ type: 'error', message: 'Streamer został usunięty.' })
    }
  }
}
</script>
