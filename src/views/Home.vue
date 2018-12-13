<template>
  <div>
    {{ streamerName }}
  </div>
</template>
<script>
export default {
  computed: {
    streamerName () {
      return this.$route.params.id
    }
  },
  watch: {
    '$route' () {
      this.$store.dispatch('fetchVideos', this.$route.params.id)
    }
  }
}
</script>
