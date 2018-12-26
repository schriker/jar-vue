<template>
  <div class="user-modal">
    <div @click="toggleUserModal" class="modal-backdrop"></div>
    <div class="content">
      <div class="content__box content__box--no-padding">
        <div @click="toggleUserModal" class="notification__close notification__close--modal"><i class="far fa-times-circle"></i></div>
        <ul class="user-modal__switches">
          <li class="active">Logowanie</li>
          <li>Rejestracja</li>
        </ul>
        <div>
          <form class="form">
            <div class="form__row">
              <label for="email"><i class="fas fa-user"></i></label>
              <input placeholder="E-Mail" class="input input--large-padding" type="text" name="email" id="email">
            </div>
            <div class="form__row">
              <label for="password"><i class="fas fa-unlock"></i></label>
              <input placeholder="Password" class="input input--large-padding" type="password" name="password" id="password">
            </div>
            <div>
              <input class="submit-btn submit-btn--large-padding" type="submit" value="Zaloguj">
            </div>
          </form>
        </div>
        <div>
          <p>Konto wymagane jest jeśli chcesz aby stan aplikacji tj. lista streamerów, zapisane video itd. były <br> synchronizowane pomiędzy resztą urządzeń i przeglądarek z których korzystasz.</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import { mapMutations } from 'vuex'

export default {
  methods: {
    ...mapMutations([
      'toggleUserModal'
    ])
  }
}
</script>
