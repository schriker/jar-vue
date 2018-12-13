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
      streamers: ['wonziu', 'dzejth', 'sovietwomble', 'nvidiageforcepl'],
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
    fetchStreamers ({ commit, state, dispatch }, streamerName) {
      let usersQueryString = ''
      let streamsQueryString = ''
      let streamers = {}

      for (let streamer of state.userData.streamers) {
        usersQueryString += `&login=${streamer}`
        streamsQueryString += `&user_login=${streamer}`
      }

      axios.get(`/users?${usersQueryString}`)
        .then(({ data: { data } }) => {
          for (let streamer of data) {
            streamers = {
              ...streamers,
              [streamer.login]: {
                info: {
                  ...streamer
                },
                status: {}
              }
            }
          }
          axios.get(`/streams?${streamsQueryString}`)
            .then(({ data: { data } }) => {
              for (let streamer of data) {
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
              commit('updateStreamers', streamers)
              dispatch('fetchVideos', streamerName)
            })
        })
    },
    fetchVideos ({ commit, state, dispatch }, streamerName) {
      if (!state.streamers[streamerName]) {
        dispatch('displayNotification', { type: 'error', message: 'Podany streamer nie istnieje.' })
      } else {
        axios.get(`/videos?user_id=${state.streamers[streamerName].info.id}`)
          .then((res) => console.log(res))
      }
    },
    displayNotification ({ commit }, payload) {
      commit('hideNotification')
      commit('showNotification', payload)
      setTimeout(() => commit('hideNotification'), 4000)
    }
  }
})
