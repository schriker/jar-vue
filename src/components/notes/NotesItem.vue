<template>
  <transition appear name="note-in" v-if="!hide">
    <div class="notes__item">
      <div class="notes__body chat__message">
        <span class="notes__author">{{message.author}}: </span>
        <span class="chat__body">
          <AppChatMessageParts v-for="part in messageComponents" :key="part.id" :part="part" />
        </span>
      </div>
    </div>
  </transition>
</template>

<script>
import AppChatMessageParts from '../chat/ChatMessageParts'
import { messageParser } from '../../helpers/messagePartsParser'
import { mapActions } from 'vuex'

export default {
  props: {
    message: Object,
    emoticons: Array
  },
  components: {
    AppChatMessageParts
  },
  data () {
    return {
      hide: false,
      messageComponents: []
    }
  },
  methods: {
    ...mapActions([
      'ommitTimeout',
      'resetOmmitTimeout'
    ])
  },
  created () {
    const timeOutId = setTimeout(() => {
      this.hide = true
      this.resetOmmitTimeout(timeOutId)
    }, 15000)
    this.ommitTimeout(timeOutId)
    this.messageComponents = messageParser(this.message.body, this.emoticons)
  }
}
</script>
