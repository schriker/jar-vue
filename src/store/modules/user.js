import firebase from '../../firebase'
import errorHandler from '../../helpers/errorHandler'
import Vue from 'vue'

const db = firebase.firestore()

const state = {
  data: null,
  isSending: false,
  isFetching: true,
  isSync: false,
  isRegistration: false,
  showUserModal: false
}

const mutations = {
  toggleUserModal (state) {
    state.showUserModal = !state.showUserModal
  },
  isReturningFalse (state) {
    state.isReturning = false
  },
  setUserData (state, payload) {
    state.data = payload
  },
  registrationMode (state) {
    state.isRegistration = true
  },
  loginMode (state) {
    state.isRegistration = false
  },
  startSending (state) {
    state.isSending = true
  },
  doneSending (state) {
    state.isSending = false
  },
  startFetching (state) {
    state.isFetching = true
  },
  doneFetching (state) {
    state.isFetching = false
  },
  startSync (state) {
    state.isSync = true
  },
  doneSync (state) {
    state.isSync = false
  }
}

const actions = {
  onSubmit ({ commit, state, dispatch }, payload) {
    commit('startSending')

    if (state.isRegistration) {
      firebase.auth().createUserWithEmailAndPassword(payload.userName, payload.password)
        .then(user => {
          dispatch('success', user.user)
          dispatch('syncUserData')
        })
        .catch(error => dispatch('error', error))
    } else {
      firebase.auth().signInWithEmailAndPassword(payload.userName, payload.password)
        .then(user => {
          dispatch('success', user.user)
        })
        .catch(error => dispatch('error', error))
    }
  },
  success ({ commit, dispatch }, payload) {
    commit('setUserData', payload)
    dispatch('displayNotification', { type: 'success', message: 'Zostałeś zalogowany.' }, { root: true })
    commit('toggleUserModal')
    commit('doneSending')
  },
  error ({ commit, dispatch }, payload) {
    const message = errorHandler(payload.code)
    dispatch('displayNotification', { type: 'error', message: message }, { root: true })
    commit('doneSending')
  },
  onAuthStateChange ({ commit, dispatch, rootState }, payload) {
    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        dispatch('displayNotification', { type: 'success', message: 'Zostałeś zalogowany.' }, { root: true })
        commit('setUserData', user)
        dispatch('fetchUserData')
      } else {
        dispatch('initUser', null, { root: true })
        dispatch('routerRedirect', { data: rootState.userData, route: payload.id, playlistId: payload.playlistId, platform: Vue.router.history.current.params.platform })
        commit('doneFetching')
      }
    })
  },
  logOut ({ commit, dispatch, rootState }) {
    firebase.auth().signOut()
      .then(() => {
        commit('setUserData', null)
        dispatch('displayNotification', { type: 'success', message: 'Zostałeś wylogowany.' }, { root: true })
        dispatch('initUser', null, { root: true })
        Vue.router.push({ path: `/${rootState.userData.streamers[0]}` }) // There is some bug here after loging put user
        dispatch('fetchStreamers', rootState.userData.streamers[0], { root: true })
      })
      .catch(() => dispatch('displayNotification', { type: 'error', message: 'Wystąpił błąd.' }, { root: true }))
  },
  syncUserData ({ state, rootState, dispatch, commit }) {
    if (!state.isFetching) {
      commit('startSync')
      db.collection('users').doc(state.data.uid).set(rootState.userData)
        .then(() => {
          commit('doneSync')
        })
        .catch(() => dispatch('displayNotification', { type: 'error', message: 'Błąd podczas zapisywania danych.' }, { root: true }))
    }
  },
  fetchUserData ({ state, dispatch, commit }) {
    commit('startFetching')
    const user = db.collection('users').doc(state.data.uid)

    user.get()
      .then(async user => {
        if (user.exists) {
          const userObject = user.data()
          dispatch('initUser', userObject, { root: true })
          dispatch('routerRedirect', { data: userObject, route: Vue.router.history.current.params.id, platform: Vue.router.history.current.params.platform })
        } else {
          dispatch('displayNotification', { type: 'error', message: 'Użytkownik nie istnieje.' }, { root: true })
        }
        commit('doneFetching')
      })
      .catch(() => dispatch('displayNotification', { type: 'error', message: 'Błąd podczas pobierania użytkownika.' }, { root: true }))
  },
  async routerRedirect ({ dispatch, rootState }, payload) {
    if (!payload.route) {
      Vue.router.replace({ path: `/${rootState.userData.streamers[0]}` })
      dispatch('fetchStreamers', { streamerName: rootState.userData.streamers[0] }, { root: true })
    } else if (!payload.data.streamers.includes(payload.route)) {
      await dispatch('addStreamer', payload.route, { root: true })
      dispatch('fetchVideos', { streamerName: payload.route, loadMore: false }, { root: true })
    } else {
      dispatch('fetchStreamers', { streamerName: payload.route, playlistId: payload.playlistId, platform: payload.platform || 'twitch' }, { root: true })
    }
  }
}

export default {
  state,
  mutations,
  actions
}
