'use client'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { setCookie } from '@/lib/cookies'
import { useState } from 'react'

export default function GoogleSignIn({ onError }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    if (isLoading) return
    
    setIsLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({
        prompt: 'select_account'
      })
      
      const result = await signInWithPopup(auth, provider)
      
      if (result.user) {
        const isNewUser = await saveUserData(result.user)
        window.location.href = isNewUser ? '/personalise' : '/foocus'
      }
    } catch (error) {
      console.error('Google sign in error:', error)
      const errorMessage = error.code === 'auth/popup-closed-by-user' 
        ? 'Sign in was cancelled. Please try again.'
        : 'Failed to sign in with Google. Please try again.'
      onError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const saveUserData = async (user) => {
    try {
      // Check if user document already exists
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      const isNewUser = !userDoc.exists()

      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        name: user.displayName || '',
        createdAt: isNewUser ? new Date().toISOString() : userDoc.data().createdAt,
        isProfileComplete: false
      }, { merge: true })

      const token = await user.getIdToken()
      setCookie('authToken', token, 7)
      
      return isNewUser
    } catch (error) {
      console.error('Error saving user data:', error)
      return false
    }
  }

  return (
    <button
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      className={`w-full flex items-center justify-center space-x-2 bg-white text-black py-3 px-4 rounded-full transition-colors ${
        isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
      }`}
    >
      <img
        src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
        alt="Google"
        className="h-10"
      />
      <span>{isLoading ? 'Signing in...' : 'Continue with Google'}</span>
    </button>
  )
} 