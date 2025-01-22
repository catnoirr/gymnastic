'use client'

import { useState, useEffect } from 'react'
import { db, auth } from '@/lib/firebase'
import { collection, setDoc, doc, getDocs } from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import toast from 'react-hot-toast'

export default function AddReminder() {
  const [user, loading, error] = useAuthState(auth)

  useEffect(() => {
    console.log('Auth State:', {
      user: user ? {
        uid: user.uid,
        email: user.email,
        isAnonymous: user.isAnonymous,
      } : null,
      loading,
      error: error?.message
    })
  }, [user, loading, error])

  const [formData, setFormData] = useState({
    priority: 'A',
    time: '11:00',
    heading: '',
    description: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (loading) {
      toast.error('Authentication is still loading...')
      return
    }

    if (error) {
      toast.error(`Authentication error: ${error.message}`)
      return
    }

    if (!user) {
      toast.error('Please log in to add reminders')
      return
    }

    try {
      // Ensure user document exists
      const userDocRef = doc(db, 'users', user.uid)
      await setDoc(userDocRef, {
        email: user.email,
        updatedAt: new Date(),
      }, { merge: true })

      // Reference to the user's reminders subcollection
      const remindersRef = collection(db, 'users', user.uid, 'reminders')

      // Get the current number of reminders
      const existingRemindersSnapshot = await getDocs(remindersRef)
      const reminderCount = existingRemindersSnapshot.size

      // Create a custom document ID
      const reminderId = `reminder${reminderCount + 1}`

      // Add or overwrite the reminder document
      const reminderDocRef = doc(remindersRef, reminderId)
      await setDoc(reminderDocRef, {
        ...formData,
        completed: false,
        createdAt: new Date(),
      })

      // Reset form after successful submission
      setFormData({
        priority: 'A',
        time: '11:00',
        heading: '',
        description: ''
      })

      toast.success('Reminder added successfully!')
    } catch (error) {
      console.error('Detailed error:', error)
      toast.error(`Failed to add reminder: ${error.message}`)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="w-full ">
      <form onSubmit={handleSubmit} className="bg-white ">
        <h2 className="text-xl font-medium text-gray-900 mb-6">Add Reminder</h2>
        
        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-3 ">Priority</label>
            <div className="flex gap-3">
              {['A', 'B', 'C'].map((priority) => (
                <div key={priority} className="flex-1 ">
                  <input
                    type="radio"
                    name="priority"
                    value={priority}
                    id={`priority-${priority}`}
                    checked={formData.priority === priority}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <label
                    htmlFor={`priority-${priority}`}
                    className="flex items-center justify-center h-12 w-full rounded-full border 
                             cursor-pointer transition-colors duration-200
                             peer-checked:bg-gray-900 peer-checked:text-white peer-checked:border-gray-900
                             border-gray-200 hover:border-gray-300 text-gray-600"
                  >
                    {priority}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full h-12 px-3 rounded-full border border-gray-200 
                       focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900
                       transition-colors duration-200"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Heading</label>
            <input
              type="text"
              placeholder="What do you need to do?"
              name="heading"
              value={formData.heading}
              onChange={handleChange}
              className="w-full h-12 px-3 rounded-full border border-gray-200 
                       focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900
                       transition-colors duration-200"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Description</label>
            <textarea
              placeholder="Add some details..."
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 rounded-3xl border border-gray-200 
                       focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900
                       transition-colors duration-200 resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-gray-900 text-white rounded-full font-medium
                     hover:bg-gray-800 active:bg-gray-950
                     transition-colors duration-200"
          >
            Add Reminder
          </button>
        </div>
      </form>
    </div>
  )
}
