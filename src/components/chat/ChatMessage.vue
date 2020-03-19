<template>
  <div>
      <div
        :style="{borderColor: card && card.color === '#171a21' ? '#95A1B6' : card && card.color ? card.color : null}"
        class="chat__body--irc"
        v-if="message.author === 'irc.poorchat.net' && showImg">
        <span class="chat__body" v-html="messageText"></span>
        <AppChatCard :card="card" v-if="card" />
      </div>
      <div class="chat__message" v-else-if="message.author !== 'irc.poorchat.net'">
        <span v-if="showTime" class="chat__time">{{ isActionMessage ? '*' : time }}</span>
        <span v-if="!isActionMessage">
          <img v-if="icons.mods" :src="icons.mods" />
          <img v-tooltip.top-center="{ content: message.subscription, offset: 5 }" v-if="icons.subscription" :src="icons.subscription" />
          <img v-tooltip.top-center="{ content: message.subscriptiongifter, offset: 5 }" v-if="icons.subscriptionGifter" :src="icons.subscriptionGifter" />
        </span>
        <span class="chat__author" :style="{ color: color(message.color) }">{{ message.author }}</span>:
        <span :class="{ chat__body: true, 'chat__body--action': isActionMessage }">
          <AppChatMessageParts v-for="part in messageComponents" :key="part.id" :part="part" />
        </span>
      </div>
  </div>
</template>
<script>
import moment from 'moment'
import AppChatCard from './ChatCard'
import random from '../../helpers/random'
import AppChatMessageParts from './ChatMessageParts'
import { messageParser } from '../../helpers/messagePartsParser'

export default {
  props: {
    message: Object,
    badges: Object,
    mods: Array,
    emoticons: Array,
    showTime: Boolean,
    showImg: Boolean
  },
  components: {
    AppChatCard,
    AppChatMessageParts
  },
  data () {
    return {
      messageText: null,
      messageComponents: [],
      card: null,
      subscription: null,
      subscriptionGifter: null,
      mods_temp: {
        tr0lit: 'a',
        trasek: 'a',
        jarzyna: 'm',
        Wonziu: 'q',
        B4rt0: 'o',
        Navari: 'h',
        Pancernik: 'o',
        cbool222: 'h',
        Emil: 'h',
        dzej: 'h',
        Jaa: 'o',
        bltzkrg22: 'o',
        Pepego: 'o',
        michal: 'h',
        schriker: 'h',
        Vasu: 'h',
        kurak55: 'h',
        ratlooz: 'h',
        Macon: 'h',
        Glamhoth: 'h',
        Bonkol: 'h',
        kin_zadra: 'h',
        GeneratorFrajdy: 'h'
      }
    }
  },
  computed: {
    time () {
      moment.locale('pl')
      return moment(this.message.createdAt).format('LT')
    },
    isActionMessage () {
      const messageArr = this.message.body.split(' ')
      if (messageArr[0] === '\u0001ACTION') {
        return true
      } else {
        return false
      }
    },
    icons () {
      const icons = {}
      if (this.mods_temp[this.message.author]) {
        icons.mods = `https://static.poorchat.net/badges/${this.mods_temp[this.message.author]}/1x`
      }
      if (this.badges.subscriber.length > 0) {
        if (this.message.subscription > 0) {
          const badge = this.badges.subscriber.filter(badge => badge.months <= this.message.subscription)
          icons.subscription = `https://static.poorchat.net/badges/${badge[badge.length - 1].file}/1x`
        }
        if (this.message.subscriptiongifter > 0) {
          const [ giftBadges ] = this.mods.filter(mode => mode.mode === 'g')
          const badge = giftBadges.badges.filter(badge => badge.gifts <= this.message.subscriptiongifter)
          icons.subscriptionGifter = `https://static.poorchat.net/badges/${badge[badge.length - 1].file}/1x`
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
    if (this.message.author === 'irc.poorchat.net') {
      try {
        this.card = JSON.parse(this.message.body)
      } catch (error) {
        this.messageText = this.message.body
      }
    } else {
      this.messageComponents = messageParser(this.message.body, this.emoticons)
    }
  }
}
</script>
