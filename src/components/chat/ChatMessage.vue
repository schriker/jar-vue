<template>
  <div>
      <div
        :style="{borderColor: card && card.color ? card.color : null}"
        class="chat__body--irc"
        v-if="message.author === 'irc.poorchat.net' && showImg">
        <span class="chat__body" v-html="messageText"></span>
        <AppChatCard :card="card" v-if="card" />
      </div>
      <div v-else-if="message.author !== 'irc.poorchat.net'">
        <span v-if="showTime" class="chat__time">{{ time }}</span>
        <img v-for="icon in icons" :key="icon" :src="icon" />
        <span class="chat__author" :style="{ color: color(message.color) }">{{ message.author }}</span>:
        <span class="chat__body" v-html="messageText"></span>
        <div  v-if="ogContent" v-html="ogContent"></div>
      </div>
  </div>
</template>
<script>
import moment from 'moment'
import AppChatCard from './ChatCard'
import linkifyHtml from 'linkifyjs/html'
import random from '../../helpers/random'
import ircf from 'irc-formatting'
import emojisArray from '../../helpers/emojis'

export default {
  props: {
    message: Object,
    badges: Object,
    emoticons: Array,
    ogContent: null,
    showTime: Boolean,
    showImg: Boolean
  },
  components: {
    AppChatCard
  },
  data () {
    return {
      messageText: null,
      card: null,
      mods: {
        tr0lit: 'a',
        trasek: 'a',
        jarzyna: 'm',
        Wonziu: 'q',
        B4rt0: 'o',
        Navari: 'o',
        Pancernik: 'o',
        cbool222: 'h',
        Emil: 'h',
        dzej: 'h',
        Jaa: 'h',
        michal: 'h',
        schriker: 'h',
        Vasu: 'h',
        kurak55: 'h',
        ratlooz: 'h',
        Macon: 'h',
        Glamhoth: 'h',
        Bonkol: 'h',
        kin_zadra: 'h'
      }
    }
  },
  computed: {
    time () {
      moment.locale('pl')
      return moment(this.message.createdAt).format('LT')
    },
    icons () {
      const icons = []
      if (this.mods[this.message.author]) {
        icons.push(`https://static.poorchat.net/badges/${this.mods[this.message.author]}/1x`)
      }
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
    for (const emoticon of this.emoticons) {
      message = message.replace(new RegExp('\\b' + emoticon.name + '\\b', 'g'), () => `<img class="chat__emoticon" src="https://static.poorchat.net/emoticons/${emoticon.file}/1x" />`)
    }
    if (this.message.author === 'irc.poorchat.net') {
      try {
        this.card = JSON.parse(this.message.body)
      } catch (error) {
        this.messageText = this.message.body
      }
    } else {
      const withEmojis = message.replace((new RegExp(/:(\b.*?\b)[:\s]/, 'g')), el => {
        const shordcode = el.replace(new RegExp(/(:)/, 'g'), '')
        const emoji = emojisArray.filter(el => el.shortcodes.includes(shordcode))
        if (emoji.length === 0) {
          return el
        } else {
          return emoji[0].emoji
        }
      })
      this.messageText = ircf.renderHtml(window.twemoji.parse(withEmojis))
    }
  }
}
</script>
