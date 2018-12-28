<template>
  <div class="container">
    <app-header></app-header>
    <transition name="fade-in" mode="out-in">
      <router-view></router-view>
    </transition>
    <app-notification></app-notification>
    <transition name="fade-in">
      <app-user-login v-if="$store.state.user.showUserModal"></app-user-login>
    </transition>
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
      'initUser',
      'onAuthStateChange'
    ])
  },
  created () {
    this.initUser()
    this.onAuthStateChange()
    if (!this.$route.params.id && !(this.$store.state.userData.streamers.length === 0)) {
      this.$router.push({ path: `/${this.$store.state.userData.streamers[0]}` })
    }
  }
}
</script>
