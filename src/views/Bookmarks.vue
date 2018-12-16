<template>
    <div :class="{'center-flex': userData.bookmarks.length === 0}">
        <app-videos-row v-if="userData.bookmarks.length > 0" :videos="userData.bookmarks" :title="'Twoje ulubione'"></app-videos-row>
        <div v-else class="content">
            <div class="content__box">
                Nie posiadasz żadnych ulubionych filmów.<br />Dodaj coś do tej listy.
            </div>
        </div>
    </div>
</template>
<script>
import AppVideosRow from '../components/videos/VideosRow'
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState([
      'userData'
    ])
  },
  components: {
    AppVideosRow
  }
}
</script>
