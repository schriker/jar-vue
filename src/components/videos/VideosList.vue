<template>
  <div>
    <app-videos-row v-if="today.length > 0" :videos="today" :title="'Ostatnie 24h'"></app-videos-row>
    <app-videos-row v-if="yesterday.length > 0" :videos="yesterday" :title="'Ostatnie 48h'"></app-videos-row>
    <app-videos-row v-if="older.length > 0" :videos="older" :title="'Starsze'"></app-videos-row>
  </div>
</template>
<script>
import AppVideosRow from './VideosRow'

export default {
  data () {
    return {
      today: [],
      yesterday: [],
      older: []
    }
  },
  props: {
    videos: Array
  },
  components: {
    AppVideosRow
  },
  methods: {
    checkDate () {
      let today = new Date()
      for (let video of this.videos) {
        let date = new Date(video.published_at)
        let hours = ((today.getTime() - date.getTime()) / (1000 * 60 * 60)).toFixed(1)
        if (hours < 24) {
          this.today.push(video)
        } else if (hours < 48 && hours >= 24) {
          this.yesterday.push(video)
        } else if (hours >= 48) {
          this.older.push(video)
        }
      }
    }
  },
  created () {
    this.checkDate()
  }
}
</script>
