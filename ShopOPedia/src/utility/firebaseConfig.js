// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAqItBnejr-4q29MVYbmgkTXOPhFWZfYhg',
  authDomain: 'shopopedia-2431b.firebaseapp.com',
  projectId: 'shopopedia-2431b',
  storageBucket: 'shopopedia-2431b.firebasestorage.app',
  messagingSenderId: '889686619259',
  appId: '1:889686619259:web:29e5621c0f3c9c451bdede',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
export { app as firebaseApp, db }
