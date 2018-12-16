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
      bookmarksId: [],
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
      state.userData.bookmarks = state.userData.bookmarks.map((obj) => {
        if (obj.id === payload) {
          obj.watched = true
        }
        return obj
      })
    },
    removeFromWatched (state, payload) {
      state.userData.watched = state.userData.watched.filter((id) => id !== payload)
      state.userData.bookmarks = state.userData.bookmarks.map((obj) => {
        if (obj.id === payload) {
          obj.watched = false
        }
        return obj
      })
    },
    addToBookmarked (state, payload) {
      payload.bookmarked = true
      if (state.userData.watched.includes(payload.id)) {
        payload.watched = true
      }
      state.userData.bookmarksId.unshift(payload.id)
      state.userData.bookmarks.unshift(payload)
    },
    removeFromBookmarked (state, payload) {
      state.userData.bookmarksId = state.userData.bookmarksId.filter((id) => id !== payload)
      state.userData.bookmarks = state.userData.bookmarks.filter((obj) => obj.id !== payload)
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
