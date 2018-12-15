import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import axios from 'axios'

axios.defaults.baseURL = 'https://api.twitch.tv/helix'
axios.defaults.headers.common['Client-ID'] = 'w87bqmg0y9ckftb2aii2tdielbr1rx'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    notification: {
      type: '',
      show: false,
      message: ''
    },
    userData: {
      hideWatched: false,
      streamers: ['wonziu', 'dzejth', 'nvidiageforcepl'],
      watched: [],
      bookmarks: []
    },
    loadingStreamers: true,
    loadingVideos: true,
    loadingMore: false,
    streamers: {}
  },
  mutations: {
    toggleWatched (state) {
      state.userData.hideWatched = !state.userData.hideWatched
    },
    updateStreamers (state, payload) {
      state.streamers = payload
      state.loadingStreamers = false
    },
    loadingVideosStart (state) {
      state.loadingVideos = true
    },
    loadingMoreStart (state) {
      state.loadingMore = true
    },
    updateVideos (state, payload) {
      state.streamers[payload.streamer].videos = payload.data
      state.loadingVideos = false
      state.loadingMore = false
    },
    addToWatched (state, payload) {
      state.userData.watched.push(payload)
    },
    removeFromWatched (state, payload) {
      let filteredArr = state.userData.watched.filter((id) => id !== payload)
      state.userData.watched = filteredArr
    },
    updateUserData (state, payload) {
      state.userData = payload
    },
    updateLocalStorage (state) {
      let userDataString = JSON.stringify(state.userData)
      localStorage.setItem('userData', userDataString)
    },
    showNotification (state, payload) {
      state.notification.show = true
      state.notification.message = payload.message
      state.notification.type = payload.type
    },
    hideNotification (state) {
      state.notification.show = false
    }
  },
  actions: {
    ...actions
  }
})
