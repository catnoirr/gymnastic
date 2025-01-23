'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { db, auth } from '@/lib/firebase'
import { collection, query, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import AddSavings from './addsavings'
import BottomDrawer from '../../workout/components/BottomDrawer'
import WithdrawSavings from './WithdrawSavings'
import { motion } from 'framer-motion'

const SavingsSkeleton = () => {
  return (
    <div className="w-full md:max-w-sm flex justify-center items-center">
      <div className="w-full bg-gradient-to-b from-white to-gray-50 shadow-lg rounded-3xl border border-gray-100 p-6">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="h-6 w-24 bg-gray-200 rounded-md animate-pulse"></div>
            <div className="h-3 w-32 bg-gray-200 rounded-md mt-2 animate-pulse"></div>
          </div>
          <div className="flex gap-2">
            <div className="w-9 h-9 bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="w-9 h-9 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>
        </div>

        {/* Circle Skeleton */}
        <div className="relative w-36 h-36 mx-auto mb-6">
          <div className="w-full h-full rounded-full bg-gray-200 animate-pulse"></div>
        </div>

        {/* Stats Row Skeleton */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
            <div className="h-3 w-20 bg-gray-200 rounded-md animate-pulse mb-2"></div>
            <div className="h-5 w-24 bg-gray-200 rounded-md animate-pulse"></div>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
            <div className="h-3 w-20 bg-gray-200 rounded-md animate-pulse mb-2"></div>
            <div className="h-5 w-24 bg-gray-200 rounded-md animate-pulse"></div>
          </div>
        </div>

        {/* Button Skeleton */}
        <div className="h-10 w-full bg-gray-200 rounded-xl animate-pulse"></div>
      </div>
    </div>
  )
}

const Savings = () => {
  const [user, loading] = useAuthState(auth)
  const [isOpen, setIsOpen] = useState(false)
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false)
  const [todayAmount, setTodayAmount] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState(0)
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const fetchSavings = useCallback(async () => {
    if (!user) return

    try {
      const savingsRef = collection(db, 'users', user.uid, 'savings')
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      const querySnapshot = await getDocs(savingsRef)
      
      let total = 0
      let todayTotal = 0
      let monthWithdrawal = 0

      querySnapshot.forEach((doc) => {
        const saving = doc.data()
        total += saving.amount

        const savingDate = saving.createdAt?.toDate()
        if (savingDate) {
          savingDate.setHours(0, 0, 0, 0)
          if (savingDate.getTime() === today.getTime()) {
            todayTotal += saving.amount
          }
          
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

  // Add reset function
  const handleReset = async () => {
    if (!user) return

    try {
      const savingsRef = collection(db, 'users', user.uid, 'savings')
      const querySnapshot = await getDocs(savingsRef)
      
      // Delete all savings documents
      const deletePromises = querySnapshot.docs.map(doc => 
        deleteDoc(doc.ref)
      )
      
      await Promise.all(deletePromises)
      
      // Reset local state
      setTotalAmount(0)
      setTodayAmount(0)
      setMonthlyWithdrawal(0)
      setIsResetConfirmOpen(false)
      
    } catch (error) {
      console.error('Error resetting savings:', error)
    }
  }

  // If not mounted or loading or no user, show skeleton
  if (!mounted || loading || !user) {
    return <SavingsSkeleton />
  }

  return (
    <div className=" w-full md:max-w-sm flex justify-center items-center">
    <div className="w-full  bg-gradient-to-b from-white to-gray-50 shadow-lg rounded-3xl border border-gray-100">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">My Savings</h2>
            <p className="text-xs text-gray-500 mt-0.5">Track your financial progress</p>
          </div>
          <div className="flex gap-2">
            <motion.button 
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 flex items-center justify-center bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors" 
              onClick={() => setIsResetConfirmOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </motion.button>
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
          className="w-full bg-gradient-to-r from-green-500/30 to-blue-500/30 hover:from-indigo-600 
                   hover:to-purple-600  py-3.5 rounded-2xl shadow-lg
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-300 
                   disabled:to-gray-400 transition-all duration-300 text-sm font-semibold
                   flex items-center justify-center gap-2.5 active:scale-[0.98]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
          </svg>
          Withdraw Funds
        </button>
      </div>
      </div>
      {/* Bottom Drawers */}
      <BottomDrawer isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="w-full h-full ">
        <AddSavings 
          onClose={() => setIsOpen(false)} 
          onComplete={handleTransactionComplete}
        />
        </div>
        
      </BottomDrawer>
      <BottomDrawer isOpen={isWithdrawOpen} onClose={() => setIsWithdrawOpen(false)}>
        <div className="w-full h-full">
        <WithdrawSavings 
          onClose={() => setIsWithdrawOpen(false)} 
          onComplete={handleTransactionComplete}
          availableAmount={totalAmount}
        />
        </div>
      </BottomDrawer>

      {/* Reset Confirmation Dialog */}
      <BottomDrawer isOpen={isResetConfirmOpen} onClose={() => setIsResetConfirmOpen(false)}>
        <div className="p-6 w-full">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Reset Savings</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to reset all your savings data? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setIsResetConfirmOpen(false)}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gray-100 text-gray-700 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleReset}
              className="flex-1 py-2.5 px-4 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600"
            >
              Reset All
            </button>
          </div>
        </div>
      </BottomDrawer>
    </div>
  )
}

export default Savings
