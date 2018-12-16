<template>
  <div v-show="!hide" class="videos__item">
    <router-link :to="`/${$route.params.id}/${video.id}`" :video="isWatched"></router-link>
    <div class="videos__thumbnail">
      <!-- <div class="videos__badge videos__badge--new">new</div> -->
      <div @click="toggleBookmarked" class="videos__badge videos__badge--bookmark"><i class="fas fa-bookmark" :class="{'videos__badge--active': isBookMarked}"></i></div>
      <div class="videos__badge videos__badge--time"><i class="fas fa-play"></i>{{video.duration}}</div>
      <div class="videos__badge videos__badge--views"><i class="fas fa-eye"></i>{{ video.view_count }}</div>
      <img :src="thumbnail !== '' ? thumbnail : defaultThumbnail" alt="">
    </div>
    <div class="videos__title">
      <h3>{{ title }}</h3>
      <span>{{ date }}</span>
      <div @click="toggleWatched" class="videos__watched" :class="{'videos__watched--active': isWatched}"><i class="fas fa-check"></i></div>
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
      isBookMarked: this.video.bookmarked,
      defaultThumbnail,
      thumbnail: '',
      title: '',
      date: ''
    }
  },
  props: {
    video: Object
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
      'updateLocalStorage',
      'addToBookmarked',
      'removeFromBookmarked'
    ]),
    ...mapActions([
      'displayNotification'
    ]),
    toggleWatched () {
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
    },
    toggleBookmarked () {
      if (!this.isBookMarked) {
        this.isBookMarked = true
        this.addToBookmarked(this.video)
        this.updateLocalStorage()
        this.displayNotification({ type: 'bookmarks', message: 'Dodano do ulubionych.' })
      } else {
        this.isBookMarked = false
        this.removeFromBookmarked(this.video.id)
        this.updateLocalStorage()
        this.displayNotification({ type: 'bookmarks', message: 'Usunięto z ulubionych.' })
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
