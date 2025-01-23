'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { db, auth } from '@/lib/firebase'
import { collection, query, getDocs } from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import AddSavings from './addsavings'
import BottomDrawer from '../../workout/components/BottomDrawer'
import WithdrawSavings from './WithdrawSavings'
import { motion } from 'framer-motion'

const Savings = () => {
  const [user] = useAuthState(auth)
  const [isOpen, setIsOpen] = useState(false)
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false)
  const [todayAmount, setTodayAmount] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState(0)

  const fetchSavings = useCallback(async () => {
    if (!user) return

    try {
      const savingsRef = collection(db, 'users', user.uid, 'savings')
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      // Get first day of current month
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

      const querySnapshot = await getDocs(savingsRef)
      
      let total = 0
      let todayTotal = 0
      let monthWithdrawal = 0

      querySnapshot.forEach((doc) => {
        const saving = doc.data()
        total += saving.amount

        // Check if the saving is from today
        const savingDate = saving.createdAt?.toDate()
        if (savingDate) {
          savingDate.setHours(0, 0, 0, 0)
          if (savingDate.getTime() === today.getTime()) {
            todayTotal += saving.amount
          }
          
          // Check if it's a withdrawal from current month
          if (savingDate >= firstDayOfMonth && saving.type === 'withdrawal') {
            monthWithdrawal += Math.abs(saving.amount)
          }
        }
      })

      setTotalAmount(total)
      setTodayAmount(todayTotal)
      setMonthlyWithdrawal(monthWithdrawal)
    } catch (error) {
      console.error('Error fetching savings:', error)
    }
  }, [user])

  useEffect(() => {
    fetchSavings()
  }, [fetchSavings])

  const handleTransactionComplete = () => {
    fetchSavings()
  }

  // Format number to Indian currency format
  const formatIndianCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }).format(amount)
  }

  // Get current month name
  const getCurrentMonth = () => {
    return new Date().toLocaleString('default', { month: 'long' })
  }

  // Calculate progress percentage for the circle
  const calculateProgress = () => {
    if (totalAmount + monthlyWithdrawal === 0) return 0
    return (monthlyWithdrawal / (totalAmount + monthlyWithdrawal)) * 100
  }

  // Generate SVG path for progress arc
  const generateArcPath = (percentage) => {
    const radius = 70 // Slightly smaller than container to account for stroke width
    const circumference = 2 * Math.PI * radius
    const strokeDasharray = `${(percentage * circumference) / 100} ${circumference}`
    
    return {
      radius,
      circumference,
      strokeDasharray
    }
  }

  return (
    <div className="w-full md:max-w-sm max-w-md mx-auto bg-gradient-to-b from-white to-gray-50 shadow-lg rounded-3xl border border-gray-100">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">My Savings</h2>
            <p className="text-xs text-gray-500 mt-0.5">Track your financial progress</p>
          </div>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            className="w-9 h-9 flex items-center justify-center bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors" 
            onClick={() => setIsOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </motion.button>
        </div>

        {/* Circular Progress */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative w-36 h-36 mx-auto mb-6"
        >
          {/* SVG for progress circle */}
          <svg
            className="w-full h-full -rotate-90 transform"
            viewBox="0 0 160 160"
          >
            {/* Background circle */}
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="12"
              className="opacity-25"
            />
            
            {/* Progress circle */}
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="#EF4444"
              strokeWidth="12"
              strokeLinecap="round"
              className="drop-shadow-md"
              style={{
                strokeDasharray: generateArcPath(calculateProgress()).strokeDasharray,
                transition: 'stroke-dasharray 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            />
          </svg>

          {/* Content overlay */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full px-1">
            <div className="text-[10px] font-medium text-gray-500 mb-0.5">Balance</div>
            <div className="text-xl font-bold text-gray-800 leading-none mb-1">
              ₹{formatIndianCurrency(totalAmount)}
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="text-[7px] font-medium text-gray-400 uppercase tracking-wider leading-none">
                {getCurrentMonth()} Withdrawals
              </div>
              <div className="text-sm font-semibold text-red-500 leading-none">
                ₹{formatIndianCurrency(monthlyWithdrawal)}
              </div>
              <div className="text-[8px] font-medium text-gray-400 mt-1 bg-gray-100/80 rounded-full px-1.5 py-0.5 inline-block mx-auto">
                {calculateProgress().toFixed(1)}% withdrawn
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl p-3 shadow-sm border border-gray-100"
          >
            <div className="text-xs font-medium text-gray-500 mb-0.5">Total Savings</div>
            <div className="text-base font-bold text-gray-800">
              ₹{formatIndianCurrency(totalAmount + monthlyWithdrawal)}
            </div>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl p-3 shadow-sm border border-gray-100"
          >
            <div className="text-xs font-medium text-gray-500 mb-0.5">Today's Activity</div>
            <div className="text-base font-bold text-gray-800">
              ₹{formatIndianCurrency(todayAmount)}
            </div>
          </motion.div>
        </div>

        {/* Withdraw Button */}
        <button 
          onClick={() => setIsWithdrawOpen(true)}
          disabled={totalAmount <= 0}
          className="w-full bg-green-400 hover:bg-green-500 text-white py-2.5 rounded-xl
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors duration-200 text-sm font-medium"
        >
          Withdraw Savings
        </button>
      </div>

      {/* Bottom Drawers */}
      <BottomDrawer isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <AddSavings 
          onClose={() => setIsOpen(false)} 
          onComplete={handleTransactionComplete}
        />
      </BottomDrawer>
      <BottomDrawer isOpen={isWithdrawOpen} onClose={() => setIsWithdrawOpen(false)}>
        <WithdrawSavings 
          onClose={() => setIsWithdrawOpen(false)} 
          onComplete={handleTransactionComplete}
          availableAmount={totalAmount}
        />
      </BottomDrawer>
    </div>
  )
}

export default Savings
