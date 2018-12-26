<template>
  <div class="container">
    <app-header></app-header>
    <router-view></router-view>
    <app-notification></app-notification>
    <app-user-login v-if="$store.state.user.showUserModal"></app-user-login>
  </div>
</template>

<script>

import { mapActions } from 'vuex'
import './style.scss'
import AppHeader from './components/header/Header'
import AppNotification from './components/Notification'
import AppUserLogin from './components/user/UserLogin'

export default {
  components: {
    AppHeader,
    AppNotification,
    AppUserLogin
  },
  methods: {
    ...mapActions([
      'initUser'
    ])
  },
  created () {
    this.initUser()
    if (!this.$route.params.id && !(this.$store.state.userData.streamers.length === 0)) {
      this.$router.push({ path: `/${this.$store.state.userData.streamers[0]}` })
    }
  }
}
</script>
