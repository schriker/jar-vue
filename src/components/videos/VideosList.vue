<template>
  <div>
    <p>{{filtered.search}}</p>
    <app-videos-row v-if="videos.today.length > 0" :videos="filtered.today" :title="'Ostatnie 24h'"></app-videos-row>
    <app-videos-row v-if="videos.yesterday.length > 0" :videos="filtered.yesterday" :title="'Ostatnie 48h'"></app-videos-row>
    <app-videos-row v-if="videos.older.length > 0" :videos="filtered.older" :title="'Starsze'"></app-videos-row>
  </div>
</template>
<script>
import AppVideosRow from './VideosRow'

export default {
  props: {
    videos: Object,
    searchValue: String
  },
  components: {
    AppVideosRow
  },
  computed: {
    filtered () {
      let searchValue = this.searchValue.toLowerCase()
      let videos = {}

      for (let key in this.videos) {
        videos[key] = this.videos[key].filter((item) => item.title.toLowerCase().includes(searchValue))
      }

      return videos
    }
  }
}
</script>
