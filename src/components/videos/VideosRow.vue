<template>
  <section class="row videos">
    <h2>{{ title }}</h2>
    <div class="videos__list">
      <app-videos-item v-for="(video, index) in videos" :key="video.id" :video="video" :index="index"></app-videos-item>
    </div>
  </section>
</template>
<script>
import AppVideosItem from './VideosItem'

export default {
  props: {
    videos: Array,
    title: String
  },
  components: {
    AppVideosItem
  }
}
</script>
