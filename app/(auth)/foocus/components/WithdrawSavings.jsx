'use client'

import { useState } from 'react'
import { db, auth } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import toast from 'react-hot-toast'

export default function WithdrawSavings({ onClose, onComplete, availableAmount }) {
  const [user, loading] = useAuthState(auth)
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      toast.error('Please log in to withdraw')
      return
    }

    const withdrawAmount = parseFloat(amount)
    if (withdrawAmount > availableAmount) {
      toast.error('Insufficient balance')
      return
    }

    try {
      const savingsRef = collection(db, 'users', user.uid, 'savings')
      
      await addDoc(savingsRef, {
        amount: -withdrawAmount, // Negative amount for withdrawals
        category: 'withdrawal',
        note,
        createdAt: serverTimestamp(),
        type: 'withdrawal'
      })

      setAmount('')
      setNote('')
      
      toast.success('Withdrawal successful!')
      if (onComplete) onComplete() // Trigger refresh of parent component
      if (onClose) onClose()
    } catch (error) {
      toast.error('Failed to process withdrawal')
      console.error(error)
    }
  }

  // Format number to Indian currency format
  const formatIndianCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }).format(amount)
  }

  return (
    <div className="">
      <form onSubmit={handleSubmit} className="bg-white ">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Withdraw Savings</h2>
        
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
              <input
                type="number"
                min="0"
                max={availableAmount}
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`Available: ₹${formatIndianCurrency(availableAmount)}`}
                className="w-full h-12 pl-8 pr-4 rounded-2xl border border-gray-200
                         focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500
                         transition-colors duration-200"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Note (Optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note about this withdrawal..."
              rows={3}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200
                       focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500
                       transition-colors duration-200 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !amount || parseFloat(amount) > availableAmount}
            className="w-full h-12 bg-red-500 text-white rounded-2xl font-medium
                     hover:bg-red-600 active:bg-red-700 disabled:opacity-50
                     transition-colors duration-200"
          >
            {loading ? 'Processing...' : 'Withdraw'}
          </button>
        </div>
      </form>
    </div>
  )
} 