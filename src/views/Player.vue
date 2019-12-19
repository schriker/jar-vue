<template>
    <div class="center-flex center-flex--overlow-hide">
        <div class="player">
          <transition name="fade-in" appear>
            <div v-if="video[0]" class="player__top">
              <span @click="copyMirko" class="hide-mobile hide-medium"><i class="fas fa-play"></i>{{ video[0].duration }}</span>
              <span><i class="fas fa-eye"></i>{{ video[0].view_count }}</span>
              <span class="hide-mobile hide-medium"><i class="fas fa-calendar"></i>{{ date }}</span>
              <input ref="mirkoInput" :value="mirkoLink" type="hidden" />
              <ul class="archive-type">
                <li v-if="video[0].youTubeId && video[0].public" @click="switchPlayer()" :class="{ 'archive-type__fb': !facebookPlayer, 'archive-type__yt': facebookPlayer }">
                  <a><i :class="{ 'fab fa-facebook-square': !facebookPlayer, 'fab fa-youtube': facebookPlayer }"></i>{{ !facebookPlayer ? 'Facebook Player' : 'YouTube Player' }}</a>
                </li>
                <li @click="showHighLights=!showHighLights" v-if="video[0].highLights && video[0].highLights.length > 0" class="archive-type__highlights">
                  <a><i class="fas fa-fire"></i>Momenty</a>
                </li>
              </ul>
              <app-toggle-watched :videoId="video[0].id" :watched="video[0].watched"></app-toggle-watched>
              <app-toggle-book-marked :video="video[0]" :bookMarked="video[0].bookmarked"></app-toggle-book-marked>
            </div>
          </transition>
          <transition name="fade-in" appear v-if="video[0].highLights && video[0].highLights.length > 0">
            <AppHighLights @seekTo="seekToHandler" :end="video[0].created_at" :start="video[0].published_at" v-if="showHighLights" :highLights="video[0].highLights"  />
          </transition>
        <AppYoutubePlayer
          v-if="video[0].youTubeId && !facebookPlayer"
          :videoId="video[0].youTubeId"
          :seekTo.sync="seekTo"
          @playerEvent="playerEventsHandler"
          ref="youTubePlayer"
        />
        <AppFacebookPlayer
          v-else-if="$route.query.platform === 'facebook'"
          :videoId="$route.params.video"
          :seekTo.sync="seekTo"
          @playerEvent="playerEventsHandler"
          ref="facebookPlayer"
        />
        <iframe
          v-else
          class="player__iframe"
          :src="videoURL"
          width="100%"
          frameborder="0"
          scrolling="false"
          allowfullscreen="true">
        </iframe>
        </div>
        <div  class="poorchat" :class="{ 'poorchat--close' : !showChat }">
          <div @click="showChat = !showChat" class="poorchat__hide"><i :class="{'fas fa-eye-slash': showChat, 'fas fa-eye': !showChat}"></i></div>
          <div class="player__top player__top--left-border">
            <a target="_blank" href="https://www.poorchat.net/subscriptions/jadisco"><i class="fas fa-heart"></i>Subskrybuj czatek</a>
            <div class="poorchat__adjust">
              <i @click="adjustChatHandler('remove')" class="fas fa-angle-double-left"></i>
              <span>{{ chatAdjustment > 0 ? `+${chatAdjustment}` : chatAdjustment }}s</span>
              <i @click="adjustChatHandler('add')" class="fas fa-angle-double-right"></i>
            </div>
          </div>
          <AppChat
            :class="{'hide': showJadisco}"
            :showTime.sync="showTime"
            :showImg.sync="showImg"
            :playerPosition.sync="playerPosition"
            :isPlaying.sync="isPlaying"
            :finished.sync="finished"
            :playbackRate.sync="playbackRate"
            :videoStartedDate="video[0].published_at"
            :videoFinishedDate="video[0].created_at"
            :chatAdjustment="chatAdjustment"
            v-if="showChat && $route.query.platform === 'facebook'"
          />
          <iframe v-if="showChat && $route.query.platform !== 'facebook' || showJadisco" class="poorchat__container" frameborder="0" width="100%" id="jd-chat" src="https://client.poorchat.net/jadisco"></iframe>
          <div v-if="showOptions" @click="showOptions = false" class="chat__settings--backdrop"></div>
          <div class="chat__settings" v-if="showOptions">
            <h3>Opcje:</h3>
            <div @click="chatOptionsHandler('showTime')">Czas<i v-if="showTime" class="fas fa-check-square"></i></div>
            <div @click="chatOptionsHandler('showImg')">Obrazki<i v-if="showImg" class="fas fa-check-square"></i></div>
          </div>
          <div class="chat__options">
            <div @click="switchChat"><i class="fas fa-comments"></i>Czat Jadisco</div>
            <i @click="showOptions = !showOptions" class="fas fa-cog"></i>
          </div>
        </div>
    </div>
</template>
<script>
import AppToggleWatched from '../UI/ToggleWatched'
import AppToggleBookMarked from '../UI/ToggleBookMarked'
import AppChat from '../components/chat/Chat'
import AppYoutubePlayer from '../components/youtubePlayer/YoutubePlayer'
import AppFacebookPlayer from '../components/facebookPlayer/FacebookPlayer'
import AppHighLights from '../components/highlights/HighLights'
import { jarchiwumAPI } from '../helpers/axiosInstances'
import { mapActions, mapState } from 'vuex'

export default {
  data () {
    return {
      showChat: true,
      showHighLights: false,
      facebookPlayer: false,
      playerPosition: 0,
      player: null,
      chatAdjustment: 0,
      isPlaying: false,
      playbackRate: 1,
      finished: false,
      showOptions: false,
      showJadisco: false,
      showTime: true,
      showImg: true,
      componentKey: 0,
      seekTo: 0
    }
  },
  metaInfo () {
    return {
      title: !(this.streamerName in this.streamers.data) ? 'Jarchiwum' : `Jarchiwum - ${this.streamers.data[this.streamerName].info.display_name}`
    }
  },
  components: {
    AppToggleWatched,
    AppToggleBookMarked,
    AppYoutubePlayer,
    AppFacebookPlayer,
    AppChat,
    AppHighLights
  },
  computed: {
    ...mapState([
      'singleVideo',
      'streamers'
    ]),
    video () {
      const id = this.$route.params.id
      const userName = this.singleVideo[0].user_name
      if (userName && (userName.toLowerCase() !== id)) {
        this.$router.replace({ params: { id: userName.toLowerCase(), video: this.$route.params.video } })
      }
      return this.singleVideo
    },
    videoURL () {
      if (this.$route.query.platform === 'youtube') {
        return `https://www.youtube.com/embed/${this.$route.params.video}?autoplay=0`
      } else {
        return `https://player.twitch.tv/?video=v${this.$route.params.video}&autoplay=false`
      }
    },
    mirkoLink () {
      const platform = this.$route.query.platform
      let link = platform === 'youtube' ? `https://www.youtube.com/watch?v=${this.$route.params.video}` : platform === 'twitch' ? `https://www.twitch.tv/videos/${this.$route.params.video}` : `https://jarchiwum.pl/wonziu/${this.$route.params.video}?platform=facebook`
      return `${link} (${platform})(**${this.video[0].duration}**)(_${this.video[0].title}_)`
    },
    date () {
      const date = new Date(this.video[0].published_at)
      return date.toLocaleString('nl-NL')
    },
    streamerName () {
      return this.$route.params.id
    }
  },
  methods: {
    ...mapActions([
      'getSingleVideo'
    ]),
    seekToHandler (time) {
      this.seekTo = time
    },
    copyMirko () {
      this.$refs.mirkoInput.setAttribute('type', 'text')
      this.$refs.mirkoInput.select()
      document.execCommand('copy')
      this.$refs.mirkoInput.setAttribute('type', 'hidden')
    },
    switchChat () {
      this.isPlaying = false
      this.isPlaying = true
      this.showJadisco = !this.showJadisco
    },
    switchPlayer () {
      this.isPlaying = false
      this.facebookPlayer = !this.facebookPlayer
    },
    playerEventsHandler (event) {
      switch (event.name) {
        case 'ended':
          this.finished = true
          this.isPlaying = false
          break
        case 'paused':
          if (event.position) {
            this.playerPosition = event.position
          }
          this.isPlaying = false
          break
        case 'buffering':
          this.isPlaying = false
          break
        case 'playing':
          if (!this.isPlaying) {
            this.playerPosition = event.position
            this.isPlaying = true
            this.finished = false
            this.seekTo = 0
          }
          break
        case 'playbackRate':
          this.playbackRate = event.playbackRate
          break
        case 'playbackRateChange':
          this.playbackRate = event.playbackRate
          this.playerPosition = event.position
          break
        case 'error':
          this.isPlaying = false
          break
      }
    },
    adjustChatHandler (method) {
      if (this.video[0].youTubeId && !this.facebookPlayer) {
        this.playerPosition = this.$refs.youTubePlayer.getPlayerPosition()
      } else if (this.$route.query.platform === 'facebook') {
        this.playerPosition = this.$refs.facebookPlayer.getPlayerPosition()
      }

      if (method === 'add') {
        this.chatAdjustment += 5
      } else {
        this.chatAdjustment -= 5
      }
    },
    chatOptionsHandler (option) {
      this[option] = !this[option]
      const localStorageOptions = {
        showImg: this.showImg,
        showTime: this.showTime
      }
      localStorage.setItem('chatOptions', JSON.stringify(localStorageOptions))
    },
    async getVideo () {
      const videoData = {
        streamer: this.$route.params.id,
        video: this.$route.params.video,
        platform: this.$route.query.platform
      }
      await this.getSingleVideo(videoData)
    }
  },
  mounted () {
    if (this.$route.query.platform === 'facebook') {
      jarchiwumAPI.get(`/updateviews?id=${this.$route.params.video}&streamer=${this.$route.params.id}`)
    }
  },
  async created () {
    this.getVideo()
    const options = JSON.parse(localStorage.getItem('chatOptions'))
    if (options) {
      for (const option in options) {
        this[option] = options[option]
      }
    }
  }
}
</script>
