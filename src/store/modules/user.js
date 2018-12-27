import firebase from '../../firebase'
import errorHandler from '../../helpers/errorHandler'

let db = firebase.firestore()
const settings = { timestampsInSnapshots: true }
db.settings(settings)

const state = {
  data: null,
  isSending: false,
  isRegistration: false,
  showUserModal: false
}

const mutations = {
  toggleUserModal (state) {
    state.showUserModal = !state.showUserModal
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
          dispatch('fetchUserData')
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
  onAuthStateChange ({ commit, dispatch }) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        dispatch('displayNotification', { type: 'success', message: 'Zostałeś zalogowany.' }, { root: true })
        commit('setUserData', user)
      }
    })
  },
  logOut ({ commit, dispatch }) {
    firebase.auth().signOut()
      .then(() => {
        commit('setUserData', null)
        dispatch('displayNotification', { type: 'success', message: 'Zostałeś wylogowany.' }, { root: true })
      })
      .catch(() => dispatch('displayNotification', { type: 'error', message: 'Wystąpił błąd.' }, { root: true }))
  },
  syncUserData ({ state, rootState, dispatch }) {
    db.collection('users').doc(state.data.uid).set(rootState.userData)
      .then(() => console.log('Dodano'))
      .catch(() => console.log('Err'))
  },
  fetchUserData ({ state }) {
    let user = db.collection('users').doc(state.data.uid)

    user.get()
      .then(user => {
        if (user.exists) {
          console.log('Document data:', user.data())
        } else {
          console.log('No such document!')
        }
      })
      .catch(error => {
        console.log('Error getting document:', error)
      })
  }
}

export default {
  state,
  mutations,
  actions
}
