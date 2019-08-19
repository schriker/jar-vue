import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import notification from './modules/notification'
import streamers from './modules/streamers'
import user from './modules/user'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
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
    loadingVideos: true,
    loadingMore: false
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
    updateStreamersList (state, payload) {
      state.userData.streamers = [
        ...payload
      ]
    },
    toggleWatched (state) {
      state.userData.hideWatched = !state.userData.hideWatched
    },
    setSingleVideo (state, payload) {
      state.singleVideo = payload
    },
    loadingVideosStart (state) {
      state.loadingVideos = true
    },
    loadingVideosStop (state) {
      state.loadingVideos = false
    },
    loadingMoreStart (state) {
      state.loadingMore = true
    },
    updateVideos (state, payload) {
      state.streamers.data[payload.streamer].videos = payload.data
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
    onRefreshBookMark (state, payload) {
      Vue.set(state.userData.bookmarks, payload.index, payload.newVideo)
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
      state.userData.streamers = state.userData.streamers.filter((streamer) => streamer.toLowerCase() !== payload.toLowerCase())
    },
    updateLastVisited (state, payload) {
      state.userData.lastVisited[payload.streamer].date = payload.date
    },
    updateUserData (state, payload) {
      state.userData = payload
    },
    updateLocalStorage (state) {
      const userDataString = JSON.stringify(state.userData)
      localStorage.setItem('jarchiwumData', userDataString)
    }
  },
  actions: {
    ...actions
  },
  modules: {
    notification,
    streamers,
    user
  }
})
