<template>
    <div v-show="!hide" class="videos__item">
      <router-link :to="`/${video.user_name.toLowerCase()}/${video.id}?yt=${video.isYoutube}`" :video="isWatched"></router-link>
      <div class="videos__thumbnail">
        <div v-if="video.isNew" class="videos__badge videos__badge--new">new</div>
        <div class="videos__badge videos__badge--refresh" @click="refreshBookMark({index: index, video: video})" v-if="$route.path === '/bookmarks' "><i class="fas fa-sync-alt"></i></div>
        <app-toggle-book-marked @toggleBookMarked="isBookMarked = !isBookMarked" :video="video" :bookMarked="isBookMarked"></app-toggle-book-marked>
        <div class="videos__badge videos__badge--time"><i class="fas fa-play"></i>{{video.duration}}</div>
        <div class="videos__badge videos__badge--views"><i class="fas fa-eye"></i>{{ video.view_count }}</div>
        <img :src="video.thumbnail_url !== '' ? thumbnail : defaultThumbnail" alt="">
      </div>
      <div class="videos__title">
        <h3>{{ title }}</h3>
        <span>{{ date }}</span>
        <app-toggle-watched @toggleWatched="isWatched = !isWatched" :videoId="video.id" :watched="video.watched"></app-toggle-watched>
      </div>
    </div>
</template>
<script>
import AppToggleWatched from '../../UI/ToggleWatched'
import AppToggleBookMarked from '../../UI/ToggleBookMarked'
import { mapState, mapActions } from 'vuex'
import defaultThumbnail from '../../assets/default_thumbnail.jpg'

export default {
  data () {
    return {
      isWatched: this.video.watched,
      isBookMarked: this.video.bookmarked,
      defaultThumbnail,
      title: '',
      date: ''
    }
  },
  components: {
    AppToggleWatched,
    AppToggleBookMarked
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
    },
    thumbnail () {
      return this.video.thumbnail_url.replace('%{width}', '640').replace('%{height}', '360')
    }
  },
  methods: {
    ...mapActions([
      'refreshBookMark'
    ])
  },
  created () {
    if (this.video.title.length > 60) {
      this.title = this.video.title.substring(0, 60) + '...'
    } else {
      this.title = this.video.title
    }

    const date = new Date(this.video.published_at)
    this.date = date.toLocaleString('nl-NL')
  }
}
</script>
