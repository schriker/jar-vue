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
      bookmarks: [],
      lastVisited: {
        wonziu: {
          date: ''
        },
        dzejth: {
          date: ''
        },
        nvidiageforcepl: {
          date: ''
        }
      }
    },
    singleVideo: [{}],
    loadingStreamers: true,
    loadingVideos: true,
    loadingMore: false,
    streamers: {}
  },
  mutations: {
    addStreamer (state, payload) {
      state.userData.streamers.push(payload)
      state.userData.lastVisited = {
        ...state.userData.lastVisited,
        [payload]: {
          date: ''
        }
      }
    },
    toggleWatched (state) {
      state.userData.hideWatched = !state.userData.hideWatched
    },
    setSingleVideo (state, payload) {
      state.singleVideo = payload
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
      payload.isNew = false
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
    removeStreamer (state, payload) {
      state.userData.streamers = state.userData.streamers.filter((streamer) => streamer !== payload)
    },
    updateLastVisited (state, payload) {
      state.userData.lastVisited[payload.streamer].date = payload.date
    },
    updateUserData (state, payload) {
      state.userData = payload
    },
    updateLocalStorage (state) {
      let userDataString = JSON.stringify(state.userData)
      localStorage.setItem('jarchiwumData', userDataString)
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
