<template>
    <button @click="setToggleWatched" class="btn" :class="{'btn--active': userData.hideWatched}">Ukryj obejrzane</button>
</template>
<script>
import { mapState, mapMutations } from 'vuex'

export default {
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
      'userData'
    ])
  }
}
</script>
