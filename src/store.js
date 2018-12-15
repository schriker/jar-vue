import Vue from 'vue'
import Vuex from 'vuex'
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
      streamers: ['wonziu', 'dzejth', 'nvidiageforcepl'],
      watched: [],
      bookmarks: []
    },
    loadingStreamers: true,
    loadingVideos: true,
    streamers: {}
  },
  mutations: {
    updateStreamers (state, payload) {
      state.streamers = payload
      state.loadingStreamers = false
    },
    loadingVideosStart (state) {
      state.loadingVideos = true
    },
    updateVideos (state, payload) {
      state.streamers[payload.streamer].videos = payload.data
      state.loadingVideos = false
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
    async fetchStreamers ({ commit, state, dispatch }, streamerName) {
      let usersQueryString = ''
      let streamsQueryString = ''
      let streamers = {}

      for (let streamer of state.userData.streamers) {
        usersQueryString += `&login=${streamer}`
        streamsQueryString += `&user_login=${streamer}`
      }

      try {
        const { data: { data: users } } = await axios.get(`/users?${usersQueryString}`)

        for (let streamer of users) {
          streamers = {
            ...streamers,
            [streamer.login]: {
              info: {
                ...streamer
              },
              status: {},
              videos: {}
            }
          }
        }

        const { data: { data: streams } } = await axios.get(`/streams?${streamsQueryString}`)

        for (let streamer of streams) {
          let streamerLogin = streamer.user_name.toLowerCase()

          streamers = {
            ...streamers,
            [streamerLogin]: {
              ...streamers[streamerLogin],
              status: {
                ...streamer
              }
            }
          }
        }
      } catch (error) {
        console.log(error)
        dispatch('displayNotification', { type: 'error', message: 'Wystąpił bląd.' })
      }

      commit('updateStreamers', streamers)
      dispatch('fetchVideos', streamerName)
    },
    async fetchVideos ({ commit, state, dispatch }, streamerName) {
      if (!state.streamers[streamerName]) {
        dispatch('displayNotification', { type: 'error', message: 'Podany streamer nie istnieje.' })
      } else {
        commit('loadingVideosStart')
        let payload = {
          streamer: streamerName,
          data: {
            // ...state.videos[streamerName].videos add that when loading more
            videos: [],
            pagination: {}
          }
        }
        try {
          const { data: { data: videosArr, pagination } } = await axios.get(`/videos?user_id=${state.streamers[streamerName].info.id}`)

          payload.data.pagination = {
            ...pagination
          }
          for (let video of videosArr) {
            let videoObject = {
              ...video,
              watched: state.userData.watched.includes(video.id)
            }
            payload.data.videos.push(videoObject)
          }
        } catch (error) {
          console.log(error)
          dispatch('displayNotification', { type: 'error', message: 'Wystąpił bląd.' })
        }
        commit('updateVideos', payload)
      }
    },
    initUser ({ state, commit }) {
      let userDataString = JSON.stringify(state.userData)
      let userDataObject = JSON.parse(localStorage.getItem('userData'))

      if (localStorage.getItem('userData')) {
        commit('updateUserData', userDataObject)
      } else {
        localStorage.setItem('userData', userDataString)
      }
    },
    displayNotification ({ commit }, payload) {
      commit('showNotification', payload)

      let notificationTimeOut = window.setTimeout(() => commit('hideNotification'), 4000)
      while (notificationTimeOut--) {
        window.clearTimeout(notificationTimeOut)
      }

      if (payload.close) {
        clearTimeout(notificationTimeOut)
        commit('hideNotification')
      }
    }
  }
})
