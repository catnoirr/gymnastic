'use client'
import { useState, useEffect } from 'react'
import { auth, db } from '@/lib/firebase'
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { setCookie } from '@/lib/cookies'
import toast from 'react-hot-toast'

export default function EmailAuth({ onBack }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [isResetMode, setIsResetMode] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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

  const validatePassword = (password) => {
    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      return false
    }
    return true
  }

  const handleEmailAuth = async (e) => {
    e.preventDefault()
    setError('')

    if (!validatePassword(password)) {
      return
    }

    setIsLoading(true)
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
        if (isSignUp) {
          window.location.href = '/personalise'
        } else {
          window.location.href = '/foocus'
        }
      }
    } catch (error) {
      // Handle specific Firebase auth errors
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('This email is already registered. Please sign in instead.')
          break
        case 'auth/wrong-password':
          setError('Incorrect password. Please try again.')
          break
        case 'auth/user-not-found':
          setError('No account found with this email. Please sign up.')
          break
        case 'auth/invalid-email':
          setError('Please enter a valid email address.')
          break
        case 'auth/too-many-requests':
          setError('Too many failed attempts. Please try again later.')
          break
        default:
          setError('An error occurred. Please try again.')
          console.error('Email auth error:', error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordReset = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await sendPasswordResetEmail(auth, email)
      
      // Show success toast with countdown
      const toastId = toast.success('Password reset email sent!', {
        duration: 5000,
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        ),
      })

      // Update toast message with countdown
      let countdown = 5
      const interval = setInterval(() => {
        countdown -= 1
        toast.success(`Redirecting in ${countdown}s...`, {
          id: toastId,
          duration: 1000,
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        })
      }, 1000)

      // Redirect after 5 seconds
      setTimeout(() => {
        clearInterval(interval)
        setIsResetMode(false)
        setError('')
        setEmail('')
      }, 5000)
    } catch (error) {
      switch (error.code) {
        case 'auth/user-not-found':
          toast.error('No account found with this email.', {
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            ),
          })
          break
        case 'auth/invalid-email':
          toast.error('Please enter a valid email address.', {
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            ),
          })
          break
        default:
          toast.error('An error occurred. Please try again.', {
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            ),
          })
          console.error('Password reset error:', error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (isResetMode) {
    return (
      <div className="w-full max-w-md mx-auto">
        <form onSubmit={handlePasswordReset} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-6 py-3 rounded-full bg-gray-800 text-white text-lg border border-gray-700 focus:border-[#CDEA9F] focus:outline-none transition-colors"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#CDEA9F] text-black py-4 px-6 rounded-full hover:bg-[#bcd98f] transition-colors text-lg font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsResetMode(false)
              setError('')
            }}
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
            <span>Back to Sign In</span>
          </button>
        </form>
      </div>
    )
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
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-6 py-3 rounded-full bg-gray-800 text-white text-lg border border-gray-700 focus:border-[#CDEA9F] focus:outline-none transition-colors"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>
        </div>
        {!isSignUp && (
          <div className="text-right">
            <button
              type="button"
              onClick={() => {
                setIsResetMode(true)
                setError('')
              }}
              disabled={isLoading}
              className="text-sm text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Forgot Password?
            </button>
          </div>
        )}
        {error && (
          <p className="text-red-500 text-sm px-4">{error}</p>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#CDEA9F] text-black py-4 px-6 rounded-full hover:bg-[#bcd98f] transition-colors text-lg font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed relative"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </div>
          ) : (
            `${isSignUp ? 'Sign Up' : 'Sign In'} with Email`
          )}
        </button>

        <div className="flex flex-col space-y-3 mt-6">
          <button
            type="button"
            onClick={onBack}
            disabled={isLoading}
            className="w-full px-6 py-3 rounded-full border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 transition-all flex items-center justify-center space-x-2 text-base disabled:opacity-50 disabled:cursor-not-allowed"
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
            disabled={isLoading}
            className="text-center text-sm text-gray-400 hover:text-white transition-colors py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </form>
    </div>
  )
} 