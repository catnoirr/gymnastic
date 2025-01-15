import React from 'react'

import { Poppins } from 'next/font/google'

// Load the Google font
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700'],
})
export default function hero() {
  return (
    <div className="bg-gray-50 flex">
  <div className="flex flex-col md:flex-row items-center justify-between w-full py-10 md:py-0  px-6 md:px-12  bg-custom-gray bg-gymie-secondary shadow-md ">
    <div className="md:w-1/2 text-center md:text-left">
      <h1 className={`text-3xl md:text-6xl font-semibold animate-fade-up text-gray-900 mb-4 font ${poppins.className}`}>
        UNLEASH YOUR POWER WITH GYMIEE
      </h1>
      <p className="text-gray-700 text-lg mb-6 animate-fade-up">
        Transform your body and mind with customized fitness plans.
      </p>
      <button className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition duration-200 animate-fade-left">
        JOIN NOW
      </button>
    </div>
    <div className="mt-8 md:mt-0 md:w-1/2 flex items-center justify-center relative">
  {/* Vibrant Black Ring */}
  <div className="absolute w-72 h-72 md:w-[70%] md:h-[80%] rounded-full bg-gradient-to-r from-black via-gray-800 to-black shadow-lg shadow-black/50 animate-fade-up  animate-ease-in-out animate-once"></div>

  {/* Image */}
  <img
    src="/hero.png"
    alt="Gymiee Promotion"
    className="relative  w-[70%] object-cover animate-fade-down"
  />
</div>

  </div>
</div>

  )
}
