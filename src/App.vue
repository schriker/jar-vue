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

import { mapActions, mapState } from 'vuex'
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
      'onAuthStateChange',
      'fetchStreamers'
    ])
  },
  computed: {
    ...mapState([
      'userData',
      'user'
    ]),
    streamerName () {
      return this.$route.params.id
    }
  },
  created () {
    this.onAuthStateChange(this.$route.params.id)
  }
}
</script>
