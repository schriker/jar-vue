<template>
  <div class="container">
    <app-header></app-header>
    <transition name="fade-in" mode="out-in">
      <router-view></router-view>
    </transition>
    <app-notification></app-notification>
    <transition name="fade-in">
      <app-user-login v-if="user.showUserModal"></app-user-login>
    </transition>
    <app-sync-icon v-if="user.isSync"></app-sync-icon>
  </div>
</template>

<script>

import { mapActions, mapState } from 'vuex'
import './style.scss'
import AppHeader from './components/header/Header'
import AppNotification from './components/Notification'
import AppUserLogin from './components/user/UserLogin'
import AppSyncIcon from './UI/SyncIcon'

export default {
  components: {
    AppHeader,
    AppNotification,
    AppUserLogin,
    AppSyncIcon
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
    this.onAuthStateChange({ id: this.$route.params.id, playlistId: this.$route.params.playlistId, platform: this.$route.params.platform })
  }
}
</script>
