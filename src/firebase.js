// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCTlzJNOlnH9bnQGUvElSQ7WVDzun_77os",
  authDomain: "sftasks-7311e.firebaseapp.com",
  projectId: "sftasks-7311e",
  storageBucket: "sftasks-7311e.firebasestorage.app",
  messagingSenderId: "762136570612",
  appId: "1:762136570612:web:8d74f8fccb8dc039980ca1",
  measurementId: "G-5MRWM1K69S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);