'use client'

import { useState } from 'react'
import { db, auth } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import toast from 'react-hot-toast'

export default function AddSavings({ onClose, onComplete }) {
  const [user, loading] = useAuthState(auth)
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('daily')
  const [note, setNote] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      toast.error('Please log in to add savings')
      return
    }

    try {
      const savingsRef = collection(db, 'users', user.uid, 'savings')
      
      await addDoc(savingsRef, {
        amount: parseFloat(amount),
        category,
        note,
        createdAt: serverTimestamp()
      })

      setAmount('')
      setCategory('daily')
      setNote('')
      
      toast.success('Savings added successfully!')
      if (onComplete) onComplete()
      if (onClose) onClose()
    } catch (error) {
      toast.error('Failed to add savings')
      console.error(error)
    }
  }

  return (
    <div className="">
      <form onSubmit={handleSubmit} className="bg-white ">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Add Savings</h2>
        
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
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full h-12 pl-8 pr-4 rounded-2xl border border-gray-200
                         focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500
                         transition-colors duration-200"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Category
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['daily', 'weekly', 'monthly'].map((cat) => (
                <div key={cat}>
                  <input
                    type="radio"
                    name="category"
                    id={cat}
                    value={cat}
                    checked={category === cat}
                    onChange={(e) => setCategory(e.target.value)}
                    className="sr-only peer"
                  />
                  <label
                    htmlFor={cat}
                    className="flex items-center justify-center h-12 rounded-2xl border cursor-pointer
                             capitalize transition-colors duration-200
                             peer-checked:bg-green-500 peer-checked:text-white peer-checked:border-green-500
                             border-gray-200 hover:border-green-200"
                  >
                    {cat}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Note (Optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note about this saving..."
              rows={3}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200
                       focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500
                       transition-colors duration-200 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-green-500 text-white rounded-2xl font-medium
                     hover:bg-green-600 active:bg-green-700 disabled:opacity-50
                     transition-colors duration-200"
          >
            {loading ? 'Processing...' : 'Add Savings'}
          </button>
        </div>
      </form>
    </div>
  )
}
