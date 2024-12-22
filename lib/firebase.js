// app/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBLczbAydEVHmlQbyn2Gd7Up0B0BSCIlIM",
  authDomain: "gymnastic-27d07.firebaseapp.com",
  projectId: "gymnastic-27d07",
  storageBucket: "gymnastic-27d07.firebasestorage.app",
  messagingSenderId: "319729870982",
  appId: "1:319729870982:web:63d69f74d1be9195228907",
  measurementId: "G-7S69SNPE8H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
