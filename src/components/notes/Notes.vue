<template>
  <div class="notes" v-if="messages.length > 0">
    <AppNotesItem
      v-for="message in messages"
      :key="message.uid"
      :message="message"
      :emoticons.sync="emoticons" />
  </div>
</template>

<script>
import shortid from 'shortid'
import NotesWorker from './notes.worker'
import { jarchiwumAPI } from '../../helpers/axiosInstances'
import AppNotesItem from './NotesItem'

export default {
  components: {
    AppNotesItem
  },
  props: {
    playerPosition: Number,
    playbackRate: Number,
    isPlaying: Boolean,
    finished: Boolean,
    emoticons: Array
  },
  data () {
    return {
      messages: [],
      badges: {},
      fetched: null,
      startTime: null,
      notesWorker: new NotesWorker()
    }
  },
  methods: {
    async reStartChat () {
      this.notesWorker.postMessage({
        type: 'STOP'
      })
      this.startTime = this.playerPosition
      if (this.isPlaying && !this.finished) {
        try {
          await this.fetchMessages()
        } catch (error) {
          console.log(error)
        }
      }
    },
    addLocalMessage (message) {
      this.messages.push(message)
    },
    async fetchMessages () {
      try {
        const messages = await jarchiwumAPI.get(`/note?id=${this.$route.params.video}&streamer=${this.$route.params.id}&timestamp=${this.playerPosition}`)
        if (messages.data.length === 0) {
          this.notesWorker.postMessage({
            type: 'STOP'
          })
          const error = 'End of notes!'
          throw error
        }
        for (const message of messages.data) {
          message.uid = shortid.generate()
        }
        this.fetched = messages
        this.notesWorker.postMessage({
          type: 'START',
          fetched: this.fetched.data,
          messages: this.messages,
          startTime: this.startTime * 1000,
          playbackRate: this.playbackRate
        })
        this.notesWorker.onmessage = ({ data }) => {
          switch (data.type) {
            case 'ADD_MESSAGE':
              this.messages.push(data.message)
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
      this.notesWorker.postMessage({
        type: 'STOP'
      })
    },
    async playbackRate () {
      this.reStartChat()
    },
    async isPlaying () {
      this.startTime = this.playerPosition
      if (this.isPlaying && !this.finished) {
        try {
          await this.fetchMessages()
        } catch (error) {
          console.log(error)
        }
      }
      if (!this.isPlaying) {
        this.notesWorker.postMessage({
          type: 'STOP'
        })
      }
    }
  },
  destroyed () {
    this.notesWorker.terminate()
  }
}
</script>
