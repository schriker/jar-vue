<template>
    <div @click="toggleBookmarked" class="videos__badge videos__badge--bookmark"><i class="fas fa-bookmark" :class="{'videos__badge--active': isBookMarked}"></i></div>
</template>
<script>
import { mapMutations, mapActions } from 'vuex'
export default {
  data () {
    return {
      isBookMarked: this.bookMarked
    }
  },
  props: {
    video: Object,
    bookMarked: Boolean
  },
  watch: {
    'bookMarked' () {
      this.isBookMarked = this.bookMarked
    }
  },
  methods: {
    ...mapMutations([
      'updateLocalStorage',
      'addToBookmarked',
      'removeFromBookmarked'
    ]),
    ...mapActions([
      'displayNotification'
    ]),
    toggleBookmarked () {
      this.$emit('toggleBookMarked')
      if (!this.isBookMarked) {
        this.isBookMarked = true
        this.addToBookmarked(this.video)
        this.displayNotification({ type: 'bookmarks', message: 'Dodano do ulubionych.' })
      } else {
        this.isBookMarked = false
        this.removeFromBookmarked(this.video.id)
        this.displayNotification({ type: 'bookmarks', message: 'Usunięto z ulubionych.' })
      }

      this.updateLocalStorage()
    }
  }
}
</script>
