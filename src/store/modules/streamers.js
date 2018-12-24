import axios from 'axios'

const state = {
  data: {},
  loading: true
}

const mutations = {
  fetchingStart () {
    state.loading = true
  },
  updateStreamers (state, payload) {
    state.data = payload
    state.loading = false
  }
}

const actions = {
  async fetchStreamers ({ commit, dispatch, rootState }, streamerName) {
    commit('fetchingStart')
    if (rootState.userData.streamers.length === 0) {
      commit('updateStreamers', {})
      dispatch('displayNotification', { type: 'error', message: 'Brak stremerów do wyświetlenia.' }, { root: true })
      return
    }
    let usersQueryString = ''
    let streamsQueryString = ''
    let streamers = {}

    for (let streamer of rootState.userData.streamers) {
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
            videos: {
              videos: {
                today: [],
                yesterday: [],
                older: []
              },
              pagination: {}
            }
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
      dispatch('displayNotification', { type: 'error', message: 'Wystąpił bląd.' }, { root: true })
    }

    commit('updateStreamers', streamers)
    dispatch('fetchVideos', { streamerName: streamerName, loadMore: false }, { root: true })
  }
}

export default {
  state,
  mutations,
  actions
}
