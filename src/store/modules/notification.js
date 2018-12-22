const state = {
  type: '',
  show: false,
  message: ''
}

const mutations = {
  showNotification (state, payload) {
    state.show = true
    state.message = payload.message
    state.type = payload.type
  },
  hideNotification (state) {
    state.show = false
  }
}

const actions = {
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

export default {
  state,
  mutations,
  actions
}
