<template>
  <div class="container">
    <app-header></app-header>
    <app-videos-list></app-videos-list>
    <app-notification></app-notification>
  </div>
</template>

<script>
import './style.scss'
import AppHeader from './components/header/Header'
import AppVideosList from './components/videos/VideosList'
import AppNotification from './components/Notification'

export default {
  components: {
    AppHeader,
    AppVideosList,
    AppNotification
  },
  mounted () {
    this.$store.dispatch('fetchStreamers')
  }
}
</script>
