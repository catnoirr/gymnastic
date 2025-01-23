'use client'
import { useState } from 'react'
import { auth, db } from '@/lib/firebase'
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile 
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { setCookie } from '@/lib/cookies'

export default function EmailAuth({ onBack }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')

  const saveUserData = async (user) => {
    try {
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        name: user.displayName || name || '',
        createdAt: new Date().toISOString(),
      }, { merge: true })

      const token = await user.getIdToken()
      setCookie('authToken', token, 7)
    } catch (error) {
      console.error('Error saving user data:', error)
    }
  }

  const handleEmailAuth = async (e) => {
    e.preventDefault()
    setError('')

    try {
      let userCredential
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(userCredential.user, {
          displayName: name
        })
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password)
      }

      if (userCredential.user) {
        await saveUserData(userCredential.user)
        window.location.href = '/foocus'
      }
    } catch (error) {
      setError(error.message)
      console.error('Email auth error:', error)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleEmailAuth} className="space-y-4">
        {isSignUp && (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            className="w-full px-6 py-3 rounded-full bg-gray-800 text-white text-lg border border-gray-700 focus:border-[#CDEA9F] focus:outline-none transition-colors"
            required
          />
        )}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full px-6 py-3 rounded-full bg-gray-800 text-white text-lg border border-gray-700 focus:border-[#CDEA9F] focus:outline-none transition-colors"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-6 py-3 rounded-full bg-gray-800 text-white text-lg border border-gray-700 focus:border-[#CDEA9F] focus:outline-none transition-colors"
          required
        />
        {error && (
          <p className="text-red-500 text-sm px-4">{error}</p>
        )}
        <button
          type="submit"
          className="w-full bg-[#CDEA9F] text-black py-4 px-6 rounded-full hover:bg-[#bcd98f] transition-colors text-lg font-medium shadow-lg hover:shadow-xl"
        >
          {isSignUp ? 'Sign Up' : 'Sign In'} with Email
        </button>

        <div className="flex flex-col space-y-3 mt-6">
          <button
            type="button"
            onClick={onBack}
            className="w-full px-6 py-3 rounded-full border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 transition-all flex items-center justify-center space-x-2 text-base"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
                clipRule="evenodd" 
              />
            </svg>
            <span>Back to login options</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError('')
              setName('')
            }}
            className="text-center text-sm text-gray-400 hover:text-white transition-colors py-2"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </form>
    </div>
  )
} 