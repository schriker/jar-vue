<template>
  <div v-bar class="chat">
    <div ref="div">
      <div v-for="message in messages" :key="message.uid">
        <AppChatMessage
          v-if="message.type !== 'MODE'"
          @scrollToBottom="scrollToBottom"
          :showTime.sync="showTime"
          :showImg.sync="showImg"
          :badges.sync="badges"
          :mods.sync="mods"
          :userMods.sync="userMods"
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
import shortid from 'shortid'
import { jarchiwumAPI } from '../../helpers/axiosInstances'
import AppChatMessage from './ChatMessage'
import ChatWorker from './chat.worker'
import debounce from 'lodash.debounce'

export default {
  components: {
    AppChatMessage
  },
  props: {
    playerPosition: Number,
    videoStartedDate: String,
    videoFinishedDate: String,
    playbackRate: Number,
    isPlaying: Boolean,
    finished: Boolean,
    showTime: Boolean,
    showImg: Boolean,
    emoticons: Array,
    badges: Object,
    mods: Array,
    userMods: Array,
    chatAdjustment: Number
  },
  data () {
    return {
      messages: [],
      fetched: null,
      startTime: null,
      scrollingUp: false,
      chatWorker: new ChatWorker()
    }
  },
  methods: {
    scrollToBottom () {
      this.$refs.bottom.scrollIntoView()
      this.scrollingUp = false
    },
    debounceRestartChat: debounce(function () {
      this.reStartChat()
    }, 500),
    scrollEventHandler (event) {
      const out = event.target
      const isScrolledToBottom = out.scrollHeight - out.clientHeight <= out.scrollTop + 100
      if (isScrolledToBottom) {
        this.scrollingUp = false
      }
    },
    async reStartChat () {
      this.chatWorker.postMessage({
        type: 'STOP'
      })
      this.startTime = new Date(new Date(this.videoStartedDate).getTime() + this.playerPosition * 1000 + this.chatAdjustment * 1000)
      if (this.isPlaying && !this.finished) {
        try {
          await this.fetchMessages(this.startTime, this.videoFinishedDate)
        } catch (error) {
          console.log(error)
        }
      }
    },
    async fetchMessages (gt, lt) {
      try {
        const messages = await jarchiwumAPI.post('/message', {
          gt: gt,
          lt: lt,
          streamer: this.$route.params.id
        })
        if (messages.data.length === 0) {
          this.chatWorker.postMessage({
            type: 'STOP'
          })
        }
        for (const message of messages.data) {
          message.uid = shortid.generate()
        }
        this.fetched = messages

        this.chatWorker.postMessage({
          type: 'START',
          fetched: this.fetched.data,
          messages: this.messages,
          startTime: this.startTime,
          playbackRate: this.playbackRate
        })
        this.chatWorker.onmessage = ({ data }) => {
          switch (data.type) {
            case 'ADD_MESSAGE':
              const out = this.$refs.div
              const isScrolledToBottom = out.scrollHeight - out.clientHeight <= out.scrollTop + 100

              this.messages.push(data.message)
              this.$nextTick().then(() => {
                if (isScrolledToBottom) {
                  this.scrollingUp = false
                  this.$refs.bottom.scrollIntoView()
                } else {
                  this.scrollingUp = true
                }
              })
              break
            case 'FETCH':
              this.startTime = data.startTime
              this.fetchMessages(this.messages[this.messages.length - 1].createdAt, this.videoFinishedDate)
              break
            case 'SPLICE': {
              this.messages = data.messages
            }
          }
        }
      } catch (error) {
        console.log(error)
      }
    }
  },
  watch: {
    finished () {
      this.messages = []
      this.fetched = null
      this.chatWorker.postMessage({
        type: 'STOP'
      })
    },
    async playbackRate () {
      this.reStartChat()
    },
    chatAdjustment () {
      this.debounceRestartChat()
    },
    async isPlaying () {
      this.startTime = new Date(new Date(this.videoStartedDate).getTime() + this.playerPosition * 1000 + this.chatAdjustment * 1000)
      if (this.isPlaying && !this.finished) {
        try {
          await this.fetchMessages(this.startTime, this.videoFinishedDate)
        } catch (error) {
          console.log(error)
        }
      }
      if (!this.isPlaying) {
        this.chatWorker.postMessage({
          type: 'STOP'
        })
      }
    }
  },
  mounted () {
    this.$refs.div.addEventListener('scroll', this.scrollEventHandler)
  },
  destroyed () {
    this.chatWorker.terminate()
  }
}
</script>
