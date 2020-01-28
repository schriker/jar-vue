<template>
  <transition appear name="note-in" v-if="!hide">
    <div class="notes__item">
      <div class="notes__body chat__message"><span class="notes__author">{{message.author}}: </span><span class="chat__body" v-html="messageText"></span></div>
    </div>
  </transition>
</template>

<script>
import linkifyHtml from 'linkifyjs/html'
import replaceTag from '../../helpers/escapeTags'

export default {
  props: {
    message: Object,
    emoticons: Array
  },
  data () {
    return {
      hide: false,
      messageText: null
    }
  },
  created () {
    setTimeout(() => {
      this.hide = true
    }, 15000)

    let message = linkifyHtml(this.message.body.replace(/[&<>]/g, replaceTag), {
      defaultProtocol: 'https'
    })

    for (const emoticon of this.emoticons) {
      message = message.replace(new RegExp('\\b' + emoticon.name + '\\b', 'g'), () => `<img class="chat__emoticon" src="https://static.poorchat.net/emoticons/${emoticon.file}/4x" />`)
    }

    this.messageText = message
  }
}
</script>
