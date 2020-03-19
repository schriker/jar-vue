const state = {
  type: '',
  show: false,
  message: '',
  ommitId: []
}

const mutations = {
  showNotification (state, payload) {
    state.show = true
    state.message = payload.message
    state.type = payload.type
  },
  hideNotification (state) {
    state.show = false
  },
  setOmmitTimeOut (state, payload) {
    state.ommitId = [
      ...state.ommitId,
      payload
    ]
  },
  resetOmmitTimeOut (state, payload) {
    state.ommitId = state.ommitId.filter(id => id !== payload)
  }
}

const actions = {
  displayNotification ({ commit, state }, payload) {
    commit('showNotification', payload)

    let notificationTimeOut = setTimeout(() => commit('hideNotification'), 4000)
    for (let i = 0; i < notificationTimeOut; i++) {
      if (!state.ommitId.includes(i)) {
        clearTimeout(i)
      }
    }
    if (payload.close) {
      clearTimeout(notificationTimeOut)
      commit('hideNotification')
    }
  },
  ommitTimeout ({ commit }, payload) {
    commit('setOmmitTimeOut', payload)
  },
  resetOmmitTimeout ({ commit }, payload) {
    commit('resetOmmitTimeOut', payload)
  }
}

export default {
  state,
  mutations,
  actions
}
