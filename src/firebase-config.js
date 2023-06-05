// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "@firebase/firestore"
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const apiKey = process.env.REACT_APP_FIREBASE_API_KEY;
const firebaseConfig = {

  apiKey: apiKey,

  authDomain: "weather-app-7dd48.firebaseapp.com",

  projectId: "weather-app-7dd48",

  storageBucket: "weather-app-7dd48.appspot.com",

  messagingSenderId: "1047747259552",

  appId: "1:1047747259552:web:e76e36e765a21b15c92dc5"

};




// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
