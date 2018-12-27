<template>
  <div class="user-modal">
    <div @click="toggleUserModal" class="modal-backdrop"></div>
    <div class="content">
      <div class="content__box content__box--no-padding">
        <div @click="toggleUserModal" class="notification__close notification__close--modal"><i class="far fa-times-circle"></i></div>
        <ul class="user-modal__switches">
          <li @click="loginMode" :class="{ active: !user.isRegistration }">Logowanie</li>
          <li @click="registrationMode" :class="{ active: user.isRegistration }">Rejestracja</li>
        </ul>
        <div>
          <form @submit.prevent="formHandler()" novalidate="true" class="form">
            <div class="form__row">
              <label for="email"><i class="fas fa-user"></i></label>
              <input v-model="userName" placeholder="E-Mail" class="input input--large-padding" type="text" name="email" id="email">
            </div>
            <div class="form__row">
              <label for="password"><i class="fas fa-unlock"></i></label>
              <input v-model="password" placeholder="Password" class="input input--large-padding" type="password" name="password" id="password">
            </div>
            <div>
              <button :disabled="user.isSending" class="submit-btn submit-btn--large-padding" type="submit">{{ mode }}</button>
            </div>
          </form>
        </div>
        <div>
          <p>Konto wymagane jest jeśli chcesz aby stan aplikacji tj. lista streamerów, zapisane video itd. były  synchronizowane pomiędzy resztą urządzeń i przeglądarek z których korzystasz.</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import { mapMutations, mapState, mapActions } from 'vuex'

export default {
  data () {
    return {
      userName: null,
      password: null
    }
  },
  computed: {
    ...mapState([
      'user'
    ]),
    mode () {
      return this.user.isSending ? 'Czekaj...' : this.user.isRegistration ? 'Zarejestruj' : 'Zaloguj'
    }
  },
  methods: {
    ...mapMutations([
      'toggleUserModal',
      'registrationMode',
      'loginMode'
    ]),
    ...mapActions([
      'onSubmit',
      'displayNotification'
    ]),
    checkEmail (mail) {
      // eslint-disable-next-line
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(mail)
    },
    formHandler () {
      if (!this.userName) {
        this.displayNotification({ message: 'E-mail jest wymagany.', type: 'error' })
        return
      }
      if (!this.checkEmail(this.userName)) {
        this.displayNotification({ message: 'Podaj prawidłowy e-mail.', type: 'error' })
        return
      }
      if (!this.password) {
        this.displayNotification({ message: 'Podaj hasło.', type: 'error' })
        return
      }
      this.onSubmit({ userName: this.userName, password: this.password })
    }
  }
}
</script>
