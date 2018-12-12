import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

axios.defaults.baseURL = 'https://api.twitch.tv/helix'
axios.defaults.headers.common['Client-ID'] = 'w87bqmg0y9ckftb2aii2tdielbr1rx'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userData: {
      streamers: ['wonziu', 'dzejth', 'urqueeen'],
      watched: [],
      bookmarks: []
    },
    loadingStreamers: true,
    streamers: {}
  },
  mutations: {
    updateStreamers (state, payload) {
      state.streamers = payload
      state.loadingStreamers = false
    }
  },
  actions: {
    fetchStreamers ({ commit, state }) {
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
            })
        })
    }
  }
})
