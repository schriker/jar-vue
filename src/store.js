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
      streamers: ['wonziu', 'dzejth', 'sovietwomble', 'nvidiageforcepl', 'urqueeen'],
      watched: [],
      bookmarks: []
    },
    loadingStreamers: true,
    streamers: {},
    loadingVideos: true,
    videos: {}
  },
  mutations: {
    updateStreamers (state, payload) {
      state.streamers = payload
      state.loadingStreamers = false
    },
    initVideos (state, payload) {
      state.videos = payload
    },
    loadingVideosStart (state) {
      state.loadingVideos = true
    },
    updateVideos (state, payload) {
      state.videos[payload.streamer] = payload.data
      state.loadingVideos = false
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
      let videos = {}

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
              status: {}
            }
          }
          videos = {
            ...videos,
            [streamer.login]: {
              videos: [],
              pagination: {}
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
      commit('initVideos', videos)
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

          payload.data = {
            pagination: {
              ...pagination
            },
            videos: [
              ...videosArr
            ]
          }
        } catch (error) {
          console.log(error)
          dispatch('displayNotification', { type: 'error', message: 'Wystąpił bląd.' })
        }
        commit('updateVideos', payload)
      }
    },
    displayNotification ({ commit }, payload) {
      commit('hideNotification')
      commit('showNotification', payload)
      setTimeout(() => commit('hideNotification'), 5000)
    }
  }
})
