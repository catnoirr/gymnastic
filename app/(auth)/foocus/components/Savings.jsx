'use client'
import React from 'react'

const Savings = () => {
  // You would typically get these values from your state management or API
  const todayAmount = 100
  const totalAmount = 500

  return (
    <div className="w-full max-w-sm bg-white shadow-md rounded-3xl">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">My Savings</h2>
          <button className="text-gray-400">
            <span className="text-2xl">...</span>
          </button>
        </div>

        {/* Circular Progress */}
        <div className="relative w-32 h-32 mx-auto mb-6">
          <div className="w-full h-full rounded-full border-8 border-blue-500"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-sm text-gray-600">Today</div>
            <div className="text-2xl font-bold text-gray-800">
              ${todayAmount}
            </div>
          </div>
        </div>

        {/* Total and Withdraw Button */}
        <div className="flex justify-between items-center">
          <div className="text-gray-800">
            <span className="font-medium">Total: </span>
            <span className="font-bold">${totalAmount}</span>
          </div>
          <button 
            className="bg-green-400 hover:bg-green-500 text-white px-6 py-2 rounded-full"
          >
            Withdraw
          </button>
        </div>
      </div>
    </div>
  )
}

export default Savings
