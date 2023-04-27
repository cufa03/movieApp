import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCclhfotp2ie3Y0L9z4FJ3w0z84aWieCi8',
  authDomain: 'movie-app-9999d.firebaseapp.com',
  projectId: 'movie-app-9999d',
  storageBucket: 'movie-app-9999d.appspot.com',
  messagingSenderId: '163828624196',
  appId: '1:163828624196:web:07325c791deb6d751e0511',
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();

export { auth };
export default db;
