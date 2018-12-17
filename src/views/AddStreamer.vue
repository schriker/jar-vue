<template>
    <div class="center-flex">
        <div class="content">
            <div class="content__box">
                Podaj nazwę Twitch użytkownika, którego chcesz <br> dodać do listy obserwowanych.
                <form @submit.prevent="onSubmit">
                    <input v-model="streamerName" placeholder="Wonziu" type="text" name="user" id="user">
                    <button class="submit-btn" type="submit"><i class="fas fa-plus"></i></button>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      streamerName: ''
    }
  },
  methods: {
    ...mapActions([
      'displayNotification',
      'addStreamer'
    ]),
    onSubmit () {
      if (this.streamerName === '') {
        this.displayNotification({ type: 'error', message: 'Podaj nazwę uzytkownika.' })
      } else {
        this.addStreamer(this.streamerName)
      }
    }
  }
}
</script>
