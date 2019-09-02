<template>
  <div ref="imgContainer">
      <span v-if="showTime" class="chat__time">{{ time }}</span>
      <img v-for="icon in icons" :key="icon" :src="icon" />
      <span class="chat__author" :style="{ color: color(message.color) }">{{ message.author }}</span>:
      <span class="chat__body" v-html="messageText"></span>
      <div  v-if="ogContent" v-html="ogContent"></div>
  </div>
</template>
<script>
import moment from 'moment'
import linkifyHtml from 'linkifyjs/html'
import random from '../../helpers/random'
import imagesLoaded from 'imagesloaded'

export default {
  props: {
    message: Object,
    badges: Object,
    emoticons: Array,
    ogContent: null,
    showTime: Boolean,
    showImg: Boolean
  },
  data () {
    return {
      messageText: null
      // icons: []
    }
  },
  computed: {
    time () {
      moment.locale('pl')
      return moment(this.message.createdAt).format('LT')
    },
    icons () {
      const icons = []
      if (this.badges.subscriber.length > 0) {
        if (this.message.subscription > 0) {
          const badge = this.badges.subscriber.filter(badge => badge.months <= this.message.subscription)
          icons.push(`https://static.poorchat.net/badges/${badge[badge.length - 1].file}/1x`)
        }
        if (this.message.subscriptiongifter > 0) {
          icons.push('https://static.poorchat.net/badges/g/1x')
        }
      }
      return icons
    }
  },
  methods: {
    color (color) {
      const userColors = ['#FF0000', '#FF8000', '#FFFF00', '#80FF00', '#008000', '#00FF80', '#00FFFF', '#0080FF', '#0000FF', '#8000FF', '#FF00FF', '#FF0080']

      if (color === '') {
        return userColors[random(0, userColors.length - 1)]
      } else {
        return color
      }
    }
  },
  created () {
    let message = linkifyHtml(this.message.body, {
      defaultProtocol: 'https'
    })
    const urlsFromMessageBody = new Set(this.message.body.match(/\bhttps?:\/\/\S+/gi))
    if (urlsFromMessageBody.size > 0) {
      for (const url of [...urlsFromMessageBody]) {
        if (/\.(?:jpg|jpeg|gif|png)$/i.test(url) && this.showImg) {
          message += `<a target="_blank" href="${url}"><img class="chat__img" src=${url} /></a>`

          this.$nextTick().then(() => {
            const img = document.querySelectorAll('.chat__img')
            console.log(img[img.length - 1])
            imagesLoaded(img[img.length - 1], () => {
              this.$emit('scrollToBottom')
            })
          })
        }
        // call api for og here
        // try {
        //     const result = await ogs({ url: url })
        //     if (result.success) {
        //         openGraphs.push(result)
        //     }
        // } catch (eror) {
        //     console.log(eror)
        // }
      }
    }
    for (const emoticon of this.emoticons) {
      message = message.replace(new RegExp(emoticon.name, 'g'), () => `<img class="chat__emoticon" src="https://static.poorchat.net/emoticons/${emoticon.file}/1x" />`)
    }
    this.messageText = message
  }
}
</script>
