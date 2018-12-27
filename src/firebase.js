import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

const config = {
  apiKey: 'AIzaSyBAJVFx6lD4e7H7ZVzlf9Oyo980MZ9qYrQ',
  authDomain: 'jarchiwum-811aa.firebaseapp.com',
  databaseURL: 'https://jarchiwum-811aa.firebaseio.com',
  projectId: 'jarchiwum-811aa',
  storageBucket: 'jarchiwum-811aa.appspot.com',
  messagingSenderId: '600942471247'
}
export default firebase.initializeApp(config)
