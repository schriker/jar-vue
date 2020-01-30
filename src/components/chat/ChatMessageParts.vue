<template>
  <span v-if="part.type === 'text'" v-html="messageBody" :key="part.id"></span>
  <span v-tooltip.top-center="{ content: part.value, offset: 5 }" v-else v-html="messageBody" :key="part.id"></span>
</template>
<script>
import ircf from 'irc-formatting'

export default {
  props: {
    part: Object
  },
  computed: {
    messageBody () {
      if (this.part.type === 'text') {
        return ircf.renderHtml(this.part.body)
      } else {
        return this.part.body
      }
    }
  }
}
</script>
