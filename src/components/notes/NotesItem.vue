<template>
  <transition appear name="note-in" v-if="!hide">
    <div class="notes__item">
      <div class="notes__body"><span class="notes__author">{{message.author}}: </span>{{message.body}}</div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    message: Object
  },
  data () {
    return {
      hide: false
    }
  },
  created () {
    setTimeout(() => {
      this.hide = true
    }, 15000)
  }
}
</script>
