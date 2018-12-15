<template>
  <div>
    <app-videos-row v-if="videos.today.length > 0" :videos="videos.today" :title="'Ostatnie 24h'"></app-videos-row>
    <app-videos-row v-if="videos.yesterday.length > 0" :videos="videos.yesterday" :title="'Ostatnie 48h'"></app-videos-row>
    <app-videos-row v-if="videos.older.length > 0" :videos="videos.older" :title="'Starsze'"></app-videos-row>
  </div>
</template>
<script>
import AppVideosRow from './VideosRow'

export default {
  props: {
    videos: Object
  },
  components: {
    AppVideosRow
  }
}
</script>
