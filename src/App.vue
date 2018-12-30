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

import { mapActions, mapState, mapMutations } from 'vuex'
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
    ...mapMutations([
      'isReturningFalse'
    ]),
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
    this.initUser()
    this.onAuthStateChange()
    if ((!this.$route.params.id && !(this.userData.streamers.length === 0)) || !this.userData.streamers.includes(this.streamerName)) {
      this.$router.push({ path: `/${this.userData.streamers[0]}` })
    }
    let db
    let request = indexedDB.open('firebaseLocalStorageDb', 1)
    request.onsuccess = (event) => {
      db = event.target.result
      let transaction = db.transaction(['firebaseLocalStorage'])
      let objectStore = transaction.objectStore('firebaseLocalStorage')
      let request = objectStore.getAll()
      request.onsuccess = (event) => {
        if (event.target.result.length === 0) {
          this.isReturningFalse()
          this.fetchStreamers(this.$route.params.id)
        }
      }
    }
  }
}
</script>
