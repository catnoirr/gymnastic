"use client"
import React from 'react'
import Hero from './components/hero'
import DietCardList from './components/DietCard'
import { Toaster } from 'react-hot-toast'

export default function page() {
  return (
    <div className='"md:bg-white/20 md:backdrop-blur-md md:rounded-3xl md:shadow-lg md:border md:border-white/20 rounded-3xl min-h-screen md:p-6 space-y-5 pb-20'>
      <Toaster position="top-center" />
      <Hero/>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 md:px-6'>
        <DietCardList />
      </div>
    </div>
  )
}
