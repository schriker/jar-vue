<template>
  <div class="container">
    <app-header></app-header>
    <router-view></router-view>
    <app-notification></app-notification>
  </div>
</template>

<script>

import { mapActions } from 'vuex'
import './style.scss'
import AppHeader from './components/header/Header'
import AppNotification from './components/Notification'

export default {
  components: {
    AppHeader,
    AppNotification
  },
  methods: {
    ...mapActions([
      'initUser',
      'fetchStreamers'
    ])
  },
  created () {
    if (!this.$route.params.id) {
      this.$router.push({ path: `/${this.$store.state.userData.streamers[0]}` })
    }
    this.initUser()
    this.fetchStreamers(this.$route.params.id)
  }
}
</script>
