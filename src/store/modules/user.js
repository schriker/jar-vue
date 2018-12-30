import firebase from '../../firebase'
import errorHandler from '../../helpers/errorHandler'
import Vue from 'vue'

let db = firebase.firestore()
const settings = { timestampsInSnapshots: true }
db.settings(settings)

const state = {
  data: null,
  isSending: false,
  isFetching: true,
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
    let message = errorHandler(payload.code)
    dispatch('displayNotification', { type: 'error', message: message }, { root: true })
    commit('doneSending')
  },
  onAuthStateChange ({ commit, dispatch }, payload) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        dispatch('displayNotification', { type: 'success', message: 'Zostałeś zalogowany.' }, { root: true })
        commit('setUserData', user)
        dispatch('fetchUserData')
      } else {
        dispatch('initUser', null, { root: true })
        dispatch('fetchStreamers', payload, { root: true })
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
        Vue.router.push({ path: `/${rootState.userData.streamers[0]}` })
        dispatch('fetchStreamers', rootState.userData.streamers[0], { root: true })
      })
      .catch(() => dispatch('displayNotification', { type: 'error', message: 'Wystąpił błąd.' }, { root: true }))
  },
  syncUserData ({ state, rootState, dispatch }) {
    if (!state.isFetching) {
      db.collection('users').doc(state.data.uid).set(rootState.userData)
        .then(() => {
          // Add some sync animation here
        })
        .catch(() => dispatch('displayNotification', { type: 'error', message: 'Błąd podczas zapisywania danych.' }, { root: true }))
    }
  },
  fetchUserData ({ state, dispatch, commit, rootState }) {
    commit('startFetching')
    let user = db.collection('users').doc(state.data.uid)

    user.get()
      .then(user => {
        if (user.exists) {
          let userObject = user.data()
          dispatch('initUser', userObject, { root: true })

          if (!userObject.streamers.includes(Vue.router.history.current.params.id)) {
            Vue.router.push({ path: `/${rootState.userData.streamers[0]}` })
          } else {
            dispatch('fetchStreamers', Vue.router.history.current.params.id, { root: true })
          }
        } else {
          dispatch('displayNotification', { type: 'error', message: 'Użytkownik nie istnieje.' }, { root: true })
        }
        commit('doneFetching')
      })
      .catch(() => dispatch('displayNotification', { type: 'error', message: 'Błąd podczas pobierania użytkownika.' }, { root: true }))
  }
}

export default {
  state,
  mutations,
  actions
}
