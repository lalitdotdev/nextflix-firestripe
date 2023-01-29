// Import the functions you need from the SDKs you need

import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD2GuAG6dMQR1IzRWwDALQ8KQvJYVEWW7E",
  authDomain: "netflix-firestripe.firebaseapp.com",
  projectId: "netflix-firestripe",
  storageBucket: "netflix-firestripe.appspot.com",
  messagingSenderId: "484569001609",
  appId: "1:484569001609:web:f2f2127aaaf5a2b1efa058",
  measurementId: "G-5CMVDHSZ97",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const auth = getAuth();

export default app;
export { auth, db };
