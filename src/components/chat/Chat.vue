<template>
  <simplebar ref="div" class="chat" data-simplebar-auto-hide="tru">
  <div class="chat__message" v-for="message in messages" :key="message.uid">
    <AppChatMessage :badges.sync="badges" :emoticons.sync="emoticons" :message="message" />
  </div>
  </simplebar>
  <!-- <div class="chat__options">Tutaj opcje</div> -->
</template>
<script>
import axios from 'axios'
import shortid from 'shortid'
import { jarchiwumAPI } from '../../helpers/axiosInstances'
import AppChatMessage from './ChatMessage'
import simplebar from 'simplebar-vue'

export default {
  components: {
    AppChatMessage,
    simplebar
  },
  props: {
    playerPosition: Number,
    videoStartedDate: String,
    videoFinishedDate: String,
    isPlaying: Boolean
  },
  data () {
    return {
      messages: [],
      badges: {},
      emoticons: [],
      chatInterval: undefined,
      fetched: null,
      startTime: null,
      lastScrollTop: 0,
      scrollingUp: false
    }
  },
  methods: {
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
        const out = this.$refs.div.$el.SimpleBar.getScrollElement()
        const isScrolledToBottom = out.scrollHeight - out.clientHeight <= out.scrollTop + 1

        this.messages.push(message)
        this.$nextTick(() => {
          if (isScrolledToBottom) {
            out.scrollTop = out.scrollHeight - out.clientHeight
          }
        })
      }

      if (this.fetched.data.length === 0) {
        clearInterval(this.chatInterval)
        this.chatInterval = undefined
        await this.fetchMessages(this.messages[this.messages.length - 1].createdAt, this.videoFinishedDate)
      }

      this.startTime = new Date(new Date(this.startTime).getTime() + 1 * 50)
      if (this.messages.length > 50) {
        this.messages.splice(0, 1)
      }
    }
  },
  watch: {
    async isPlaying () {
      this.startTime = new Date(new Date(this.videoStartedDate).getTime() + this.playerPosition * 1000)
      if (this.isPlaying) {
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

<style>
  .chat {
    height: calc(100% - 33px);
  }
  .chat .simplebar-content > div {
    height: auto;
  }
</style>
