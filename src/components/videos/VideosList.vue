<template>
  <section class="row videos">
    <h2>Dzisiaj</h2>
    <div class="videos__list">
      <app-videos-item v-for="n in 1" :key="n"></app-videos-item>
    </div>
  </section>
</template>
<script>
import AppVideosItem from './VideosItem'

export default {
  components: {
    AppVideosItem
  }
}
</script>
