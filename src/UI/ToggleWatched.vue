<template>
    <div @click="toggleWatched" class="videos__watched" :class="{'videos__watched--active': isWatched}"><i class="fas fa-check"></i></div>
</template>
<script>
import { mapMutations, mapActions } from 'vuex'

export default {
  data () {
    return {
      isWatched: this.watched
    }
  },
  props: {
    videoId: String,
    watched: Boolean
  },
  methods: {
    ...mapMutations([
      'addToWatched',
      'removeFromWatched',
      'updateLocalStorage'
    ]),
    ...mapActions([
      'displayNotification'
    ]),
    toggleWatched () {
      this.$emit('toggleWatched')
      if (this.isWatched) {
        this.isWatched = false
        this.removeFromWatched(this.videoId)
        this.displayNotification({ type: 'success', message: 'Usunięto z obejrzanych.' })
      } else {
        this.isWatched = true
        this.addToWatched(this.videoId)
        this.displayNotification({ type: 'success', message: 'Oznaczono jako obejrzane.' })
      }

      this.updateLocalStorage()
    }
  }
}
</script>
