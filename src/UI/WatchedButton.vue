<template>
    <button @click="setToggleWatched" class="btn" :class="{'btn--active': userData.hideWatched}">Ukryj obejrzane</button>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  methods: {
    ...mapMutations([
      'toggleWatched'
    ]),
    ...mapActions([
      'saveData'
    ]),
    setToggleWatched () {
      this.toggleWatched()
      this.saveData()
    }
  },
  computed: {
    ...mapState([
      'userData'
    ])
  }
}
</script>
