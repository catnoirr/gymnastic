import React from 'react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
  <h1 className="text-8xl font-extrabold text-gray-800 ">Gymiee</h1>
  <p className="text-2xl md:text-3xl font-light text-gray-600 mb-4">
    Oops! Page under construction.
  </p>
  <p className="text-center text-gray-500 mb-8">
    Sagar is trying to do his best to build this as soon as possible.
  </p>
  <a
    href="/"
    className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
  >
    Go Back Home
  </a>
</div>

  )
}
