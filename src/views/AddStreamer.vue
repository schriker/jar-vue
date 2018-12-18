<template>
    <div class="center-flex">
        <div class="content">
            <div class="content__box">
                <p>Podaj nazwę Twitch użytkownika, którego chcesz dodać do listy obserwowanych.</p>
                <form @submit.prevent="onSubmit">
                    <input @keyup.enter="onSubmit" v-model="streamerName" placeholder="Wonziu" type="text" name="user" id="user">
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
        this.displayNotification({ type: 'error', message: 'Podaj nazwę streamera.' })
      } else {
        this.addStreamer(this.streamerName)
        this.streamerName = ''
      }
    }
  }
}
</script>
