<template>
    <transition name="slide-in" appear>
        <div v-if="notification.show" class="notification" :class="`notification--${notification.type}`">
            {{ notification.message }}
        <div @click="$store.dispatch('displayNotification', { close: true })" class="notification__close"><i class="far fa-times-circle"></i></div>
        </div>
    </transition>
</template>
<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState([
      'notification'
    ])
  }
}
</script>
