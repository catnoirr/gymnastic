'use client'
import { useState } from 'react'
import GoogleSignIn from './GoogleSignIn'
import EmailAuth from './EmailAuth'

export default function LoginMain() {
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [error, setError] = useState('')

  const handleBack = () => {
    setShowEmailForm(false)
    setError('')
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-black to-gray-900 text-white">
      {/* Left Side - Image (Hidden on mobile, shown on desktop) */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 bg-black/30">
        <div className="relative w-full max-w-2xl">
          <div className="absolute -inset-1 bg-purple-500/30 rounded-3xl blur-3xl"></div>
          <img
            src="/login.png"
            alt="Fitness Journey"
            className="relative w-full h-auto object-contain rounded-2xl"
          />
        </div>
      </div>

      {/* Right Side - Login Content */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 lg:p-12">
        {/* Mobile Image (Hidden on desktop) */}
        <div className="relative w-full max-w-sm lg:hidden mb-8">
          <div className="absolute -inset-1 bg-purple-500/30 rounded-3xl blur-3xl"></div>
          <img
            src="/login.png"
            alt="Fitness Journey"
            className="relative w-full h-auto object-contain rounded-2xl"
          />
        </div>

        {/* Text Content */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-6xl lg:text-6xl font-bold tracking-tight">
            Track Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">Fitness</span> Journey
          </h1>
          <p className="text-gray-400 text-lg text-center hidden lg:block">
            Join thousands of fitness enthusiasts achieving their goals
          </p>
        </div>

        {/* Login Options */}
        <div className="w-full max-w-sm space-y-6">
          {!showEmailForm ? (
            <>
              <GoogleSignIn onError={setError} />

              <div className="relative hidden lg:block">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm ">
                  <span className="px-2 bg-gradient-to-br from-black to-gray-900 text-gray-400 rounded-full">
                    or
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowEmailForm(true)}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#CDEA9F] to-[#bcd98f] text-black py-5 px-4 rounded-full hover:opacity-90 transition-all duration-200 shadow-lg shadow-[#CDEA9F]/20"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">Continue with Email</span>
              </button>
            </>
          ) : (
            <EmailAuth onBack={handleBack} />
          )}
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
              <p className="text-red-500 text-sm text-center">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 