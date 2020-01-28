import { jarchiwumAPI } from '../../helpers/axiosInstances'
import Cookies from 'js-cookie'

const state = {
  user: null
}

const mutations = {
  setUser (state, payload) {
    state.user = payload
  },
  logoutUser () {
    state.user = null
  }
}

const actions = {
  async poorchatAuthUser ({ commit }) {
    try {
      const response = await jarchiwumAPI.get('/auth', {
        withCredentials: true
      })
      commit('setUser', response.data)
    } catch (error) {
      console.log(error)
    }
  },
  poorchatLogoutUser ({ commit }) {
    Cookies.remove('payload_cookie', { domain: '.jarchiwum.pl' })
    commit('logoutUser')
  },
  async poorchatGetAccessToken ({ commit }, payload) {
    try {
      const response = await jarchiwumAPI.post('/auth/callback', {
        code: payload
      }, {
        withCredentials: true
      })
      commit('setUser', response.data)
    } catch (error) {
      console.log(error)
    }
  }
}

export default {
  state,
  mutations,
  actions
}
