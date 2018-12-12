<template>
  <div class="container">
    <app-header></app-header>
    <router-view></router-view>
    <app-notification></app-notification>
  </div>
</template>

<script>
import './style.scss'
import AppHeader from './components/header/Header'
import AppNotification from './components/Notification'

export default {
  components: {
    AppHeader,
    AppNotification
  },
  created () {
    this.$store.dispatch('fetchStreamers')
    this.$router.push({ path: `/${this.$store.state.userData.streamers[0]}` })
  }
}
</script>
