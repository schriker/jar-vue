<template>
  <div v-show="!hide" class="videos__item">
    <a href=""></a>
    <div class="videos__thumbnail">
      <!-- <div class="videos__badge videos__badge--new">new</div> -->
      <div class="videos__badge videos__badge--bookmark"><i class="fas fa-bookmark"></i></div>
      <div class="videos__badge videos__badge--time"><i class="fas fa-play"></i>{{video.duration}}</div>
      <div class="videos__badge videos__badge--views"><i class="fas fa-eye"></i>{{ video.view_count }}</div>
      <img :src="thumbnail !== '' ? thumbnail : defaultThumbnail" alt="">
    </div>
    <div class="videos__title">
      <h3>{{ title }}</h3>
      <span>{{ date }}</span>
      <div @click="toogleWatched" class="videos__watched" :class="{'videos__watched--active': isWatched}"><i class="fas fa-check"></i></div>
    </div>
  </div>
</template>
<script>
import { mapMutations, mapActions, mapState } from 'vuex'
import defaultThumbnail from '../../assets/default_thumbnail.jpg'

export default {
  data () {
    return {
      isWatched: this.video.watched,
      defaultThumbnail,
      thumbnail: '',
      title: '',
      date: ''
    }
  },
  props: {
    video: Object,
    index: Number
  },
  computed: {
    ...mapState([
      'userData'
    ]),
    hide () {
      return this.isWatched && this.userData.hideWatched
    }
  },
  methods: {
    ...mapMutations([
      'addToWatched',
      'removeFromWatched',
      'updateLocalStorage'
    ]),
    ...mapActions([
      'displayNotification'
    ]),
    toogleWatched () {
      if (this.isWatched) {
        this.isWatched = false
        this.removeFromWatched(this.video.id)
        this.updateLocalStorage()
        this.displayNotification({ type: 'success', message: 'Usunięto z obejrzanych.' })
      } else {
        this.isWatched = true
        this.addToWatched(this.video.id)
        this.updateLocalStorage()
        this.displayNotification({ type: 'success', message: 'Oznaczono jako obejrzane.' })
      }
    }
  },
  created () {
    this.thumbnail = this.video.thumbnail_url.replace('%{width}', '640').replace('%{height}', '360')

    if (this.video.title.length > 60) {
      this.title = this.video.title.substring(0, 60) + '...'
    } else {
      this.title = this.video.title
    }

    let date = new Date(this.video.published_at)
    this.date = date.toLocaleString('nl-NL')
  }
}
</script>
