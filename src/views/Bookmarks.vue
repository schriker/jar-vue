<template>
    <div :class="{'center-flex': userData.bookmarks.length === 0}">
        <div v-if="userData.bookmarks.length > 0">
            <div class="row filters">
                <app-watched-button></app-watched-button>
            </div>
            <app-videos-row :videos="userData.bookmarks" :title="'Twoje ulubione'"></app-videos-row>
        </div>
        <div v-if="userData.bookmarks.length === 0" class="content">
            <div class="content__box">
                Nie posiadasz żadnych ulubionych filmów.<br />Dodaj coś do tej listy.
            </div>
        </div>
    </div>
</template>
<script>
import AppVideosRow from '../components/videos/VideosRow'
import AppWatchedButton from '../UI/WatchedButton'
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState([
      'userData'
    ])
  },
  components: {
    AppVideosRow,
    AppWatchedButton
  }
}
</script>
