<template>
  <div v-bar class="chat">
    <div ref="div">
      <div class="chat__message" v-for="message in messages" :key="message.uid">
        <AppChatMessage
          @scrollToBottom="scrollImg"
          :showTime.sync="showTime"
          :showImg.sync="showImg"
          :badges.sync="badges"
          :emoticons.sync="emoticons"
          :message="message" />
      </div>
      <div ref="bottom"></div>
      <div @click="scrollToBottom" v-if="scrollingUp" class="chat__more">więcej wiadomości</div>
    </div>
    <div class="chat__error" v-if="messages.length === 0"><i class="fas fa-comments"></i></div>
  </div>
</template>
<script>
import axios from 'axios'
import shortid from 'shortid'
import { jarchiwumAPI } from '../../helpers/axiosInstances'
import AppChatMessage from './ChatMessage'

export default {
  components: {
    AppChatMessage
  },
  props: {
    playerPosition: Number,
    videoStartedDate: String,
    videoFinishedDate: String,
    isPlaying: Boolean,
    finished: Boolean,
    showTime: Boolean,
    showImg: Boolean
  },
  data () {
    return {
      messages: [],
      badges: {},
      emoticons: [],
      chatInterval: undefined,
      fetched: null,
      startTime: null,
      scrollingUp: false
    }
  },
  methods: {
    scrollToBottom () {
      this.$refs.bottom.scrollIntoView()
      this.scrollingUp = false
    },
    scrollImg () {
      const out = this.$refs.div
      const isScrolledToBottom = out.scrollHeight - out.clientHeight <= out.scrollTop + 100
      if (isScrolledToBottom) {
        this.scrollingUp = false
        this.$refs.bottom.scrollIntoView()
      }
    },
    async fetchMessages (gt, lt) {
      try {
        const messages = await jarchiwumAPI.post('/message', {
          gt: gt,
          lt: lt
        })
        for (const message of messages.data) {
          message.uid = shortid.generate()
        }
        this.fetched = messages
        if (this.chatInterval === undefined) {
          this.chatInterval = setInterval(this.messageInterval, 50)
        }
      } catch (error) {
        console.log(error)
      }
    },
    async messageInterval () {
      const messagesInView = this.fetched.data.filter((message, index) => {
        const condition = new Date(message.createdAt) <= this.startTime
        if (condition) {
          this.fetched.data.splice(index, 1)
        }
        return condition
      })

      for (let message of messagesInView) {
        const out = this.$refs.div
        const isScrolledToBottom = out.scrollHeight - out.clientHeight <= out.scrollTop + 100

        this.messages.push(message)
        this.$nextTick().then(() => {
          if (isScrolledToBottom) {
            this.scrollingUp = false
            this.$refs.bottom.scrollIntoView()
          } else {
            this.scrollingUp = true
          }
        })
      }

      if (this.fetched.data.length === 0 && this.messages.length !== 0) {
        clearInterval(this.chatInterval)
        this.chatInterval = undefined
        await this.fetchMessages(this.messages[this.messages.length - 1].createdAt, this.videoFinishedDate)
      }

      this.startTime = new Date(new Date(this.startTime).getTime() + 1 * 50)
      if (this.messages.length > 100) {
        this.messages.splice(0, 1)
      }
    }
  },
  watch: {
    finished () {
      this.messages = []
      this.fetched = null
      clearInterval(this.chatInterval)
      this.chatInterval = undefined
    },
    async isPlaying () {
      this.startTime = new Date(new Date(this.videoStartedDate).getTime() + this.playerPosition * 1000)
      if (this.isPlaying && !this.finished) {
        try {
          await this.fetchMessages(this.startTime, this.videoFinishedDate)
        } catch (error) {
          console.log(error)
        }
      }
      if (!this.isPlaying) {
        clearInterval(this.chatInterval)
        this.chatInterval = undefined
      }
    }
  },
  async created () {
    const emoticons = await axios.get('https://api.poorchat.net/v1/emoticons')
    const badges = await axios.get('https://api.poorchat.net/v1/channels/jadisco/badges')
    this.badges = badges.data
    this.emoticons = emoticons.data
  }
}
</script>
