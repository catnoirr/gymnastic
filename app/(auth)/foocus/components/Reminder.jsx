'use client'
import React, { useState } from 'react'

const reminders = [
  {
    id: 'A',
    title: 'Attend Lectures',
    description: 'Show up, stay sharp, and succeed. Every lecture counts, Sagar!'
  },
  {
    id: 'B',
    title: 'Stay Hydrated',
    description: 'Remember to drink water throughout the day. Stay refreshed!'
  },
  {
    id: 'C',
    title: 'Take Breaks',
    description: 'Regular breaks help maintain focus and productivity.'
  }
]

export default function Reminder() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? reminders.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === reminders.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-md max-w-sm">
      <div className="flex space-x-2 mb-4">
        {reminders.map((reminder, index) => (
          <div
            key={reminder.id}
            className={`w-6 h-6 rounded-full flex items-center justify-center text-sm
              ${index === currentIndex 
                ? 'bg-black text-white' 
                : index < currentIndex 
                  ? 'bg-green-200' 
                  : 'bg-yellow-200'
              }`}
          >
            {reminder.id}
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-2">
        {reminders[currentIndex].title}
      </h2>
      <p className="text-gray-600 mb-4">
        {reminders[currentIndex].description}
      </p>

      <div className="flex justify-end space-x-2">
        <button
          onClick={handlePrevious}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <button
          onClick={handleNext}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
