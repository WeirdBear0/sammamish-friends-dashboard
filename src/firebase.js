import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCTlzJNOlnH9bnQGUvElSQ7WVDzun_77os",
  authDomain: "sftasks-7311e.firebaseapp.com",
  projectId: "sftasks-7311e",
  storageBucket: "sftasks-7311e.firebasestorage.app",
  messagingSenderId: "762136570612",
  appId: "1:762136570612:web:8d74f8fccb8dc039980ca1",
  measurementId: "G-5MRWM1K69S"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
