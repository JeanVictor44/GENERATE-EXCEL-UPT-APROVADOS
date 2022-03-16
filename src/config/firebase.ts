import { initializeApp, } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseKey = process.env.REACT_APP_FIREBASE_KEY

const firebaseConfig = {
  apiKey: firebaseKey,
  authDomain: "uneb-data.firebaseapp.com",
  projectId: "uneb-data",
  storageBucket: "uneb-data.appspot.com",
  messagingSenderId: "961962400052",
  appId: "1:961962400052:web:90ddb728365e0f450cad61"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app)