// app/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { setCookie } from '@/lib/cookies';

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

// Add this function to refresh the token
export const refreshToken = async () => {
  try {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const newToken = await currentUser.getIdToken(true);
      setCookie('token', newToken, {
        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
  }
};

export const logout = async () => {
  try {
    await auth.signOut();
    deleteCookie('token');
  } catch (error) {
    console.error('Error logging out:', error);
  }
};
