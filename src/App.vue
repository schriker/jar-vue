<template>
  <div class="container">
    <transition name="fade-in">
      <app-basic-modal @closeModal="toggleFirstVisitModal" v-if="firstVisit">
        <p>Hej, jeśli korzystasz z FireFoxa i nie widzisz materiałów z Facebooka możesz spróbować wyłączyć blokowanie treści dla tej witryny:</p>
        <img width="300px" :src="FireFox" alt="FireFox Error">
        <p>Jeśli nie zadziałało, a masz zainstalowany dodatek <b>Facebook Container</b> sprawdź czy wyłączenie go nie pomoże. </p>
        <button @click="firstVisit = false" class="submit-btn submit-btn--large-padding" type="submit">Zamknij</button>
      </app-basic-modal>
    </transition>
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
import './ircstyles.css'
import AppHeader from './components/header/Header'
import AppNotification from './components/Notification'
import AppUserLogin from './components/user/UserLogin'
import AppSyncIcon from './UI/SyncIcon'
import AppBasicModal from './UI/BasicModal'
import FireFox from './assets/ff_error.jpg'

export default {
  components: {
    AppHeader,
    AppNotification,
    AppUserLogin,
    AppSyncIcon,
    AppBasicModal
  },
  data: () => ({
    firstVisit: false,
    FireFox
  }),
  methods: {
    ...mapActions([
      'initUser',
      'onAuthStateChange',
      'fetchStreamers',
      'poorchatGetAccessToken',
      'poorchatAuthUser'
    ]),
    toggleFirstVisitModal () {
      this.firstVisit = !this.firstVisit
    }
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
    if (this.$route.query.code) {
      this.poorchatGetAccessToken(this.$route.query.code)
      // Send request to api with code walue
      // On server get access token and send it as a cookie
      // Also send info about user and store it in localStorage
      // On visit also auth user
    } else {
      this.poorchatAuthUser()
    }
    setTimeout(() => {
      const firstVisit = !!localStorage.getItem('firstVisit')
      if (!firstVisit) {
        this.firstVisit = true
        localStorage.setItem('firstVisit', 1)
      }
    }, 2000)
    this.onAuthStateChange({ id: this.$route.params.id, playlistId: this.$route.params.playlistId, platform: this.$route.params.platform })
  }
}
</script>
