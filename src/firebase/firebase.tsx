import firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyDBW4jVgAJbfitb6ZLR9bSOCNcQd0JttGs',
  authDomain: 'hijrbeliobat.firebaseapp.com',
  databaseURL: 'https://hijrbeliobat.firebaseio.com',
  projectId: 'hijrbeliobat',
  storageBucket: 'hijrbeliobat.appspot.com',
  messagingSenderId: '266175432388'
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const db = firebase.database();
const auth = firebase.auth();
const storage = firebase.storage();
const authEmailProvider = firebase.auth.EmailAuthProvider;

export {
  db,
  auth,
  storage,
  authEmailProvider,
};
