'use client'
import React, { useState, useEffect } from 'react'
import { db, auth } from '@/lib/firebase'
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import { toast } from 'react-hot-toast'

const PriorityColors = {
  'A': 'bg-red-500',
  'B': 'bg-yellow-500',
  'C': 'bg-green-500'
}

const formatTime = (time) => {
  if (!time) return ''
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 || 12
  return `${hour12}:${minutes} ${ampm}`
}

export default function Reminder() {
  const [user] = useAuthState(auth)
  const [reminders, setReminders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPriority, setSelectedPriority] = useState('A')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [reminderToDelete, setReminderToDelete] = useState(null)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    // Create query for user's reminders
    const remindersRef = collection(db, 'users', user.uid, 'reminders')
    const q = query(remindersRef, orderBy('priority', 'asc'))

    // Set up real-time listener
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const fetchedReminders = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setReminders(fetchedReminders)
        setLoading(false)
      },
      (error) => {
        console.error('Error fetching reminders:', error)
        setLoading(false)
      }
    )

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [user])

  // Group reminders by priority
  const remindersByPriority = reminders.reduce((acc, reminder) => {
    if (!acc[reminder.priority]) {
      acc[reminder.priority] = []
    }
    acc[reminder.priority].push(reminder)
    return acc
  }, {})

  const currentPriorityReminders = remindersByPriority[selectedPriority] || []

  const handlePrevious = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? currentPriorityReminders.length - 1 : prev - 1
    )
  }

  const handleNext = () => {
    setCurrentIndex((prev) => 
      prev === currentPriorityReminders.length - 1 ? 0 : prev + 1
    )
  }

  const handlePriorityChange = (priority) => {
    setSelectedPriority(priority)
    setCurrentIndex(0)
  }

  const handleComplete = async (reminderId) => {
    try {
      const reminderRef = doc(db, 'users', user.uid, 'reminders', reminderId)
      await updateDoc(reminderRef, {
        completed: true,
        completedAt: new Date()
      })
      toast.success('Reminder marked as completed!')
    } catch (error) {
      console.error('Error completing reminder:', error)
      toast.error(`Failed to complete reminder: ${error.message}`)
    }
  }

  const handleDelete = async (reminderId) => {
    setReminderToDelete(reminderId)
    setShowDeleteConfirm(true)
  }

  const confirmDelete = async () => {
    try {
      const reminderRef = doc(db, 'users', user.uid, 'reminders', reminderToDelete)
      await deleteDoc(reminderRef)
      
      // Reset currentIndex if needed
      if (currentIndex >= currentPriorityReminders.length - 1) {
        setCurrentIndex(Math.max(0, currentPriorityReminders.length - 2))
      }
      toast.success('Reminder deleted')
      setShowDeleteConfirm(false)
    } catch (error) {
      console.error('Error deleting reminder:', error)
      toast.error(`Failed to delete reminder: ${error.message}`)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-lg w-full">
        <div className="space-y-6">
          {/* Priority buttons skeleton */}
          <div className="flex justify-between gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-[110px] h-12 rounded-3xl bg-gray-200 animate-pulse" />
            ))}
          </div>

          {/* Reminder content skeleton */}
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded-full w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded-full w-1/2 animate-pulse" />
          </div>

          {/* Action buttons skeleton */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <div className="w-10 h-10 rounded-xl bg-gray-200 animate-pulse" />
              <div className="w-10 h-10 rounded-xl bg-gray-200 animate-pulse" />
            </div>
            <div className="flex gap-2">
              <div className="w-10 h-10 rounded-xl bg-gray-200 animate-pulse" />
              <div className="w-10 h-10 rounded-xl bg-gray-200 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-lg w-full flex items-center justify-center">
        <p className="text-gray-500">Please log in to view reminders</p>
      </div>
    )
  }

  if (reminders.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-lg w-full   flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-gray-500 text-center">No reminders found.<br/>Add some reminders to get started!</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg w-full ">
      {/* Priority Toggle */}
      <div className="flex justify-between gap-4 mb-8">
        {['A', 'B', 'C'].map((priority) => (
          <button
            key={priority}
            onClick={() => handlePriorityChange(priority)}
            className={`relative w-[110px] h-12 rounded-3xl flex items-center justify-center text-base font-semibold transition-all
              ${selectedPriority === priority 
                ? 'bg-black text-white shadow-lg transform -translate-y-1' 
                : 'bg-gray-50 hover:bg-gray-100'
              }
              ${remindersByPriority[priority]?.length > 0 
                ? '' 
                : 'opacity-50'
              }
            `}
          >
            <div className="flex items-center gap-2 ">
              <div className={`w-2 h-2 rounded-full ${PriorityColors[priority]}`} />
              {priority}
            </div>
            {remindersByPriority[priority]?.length > 0 && (
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-black text-white text-sm flex items-center justify-center ">
                {remindersByPriority[priority].length}
              </div>
            )}
          </button>
        ))}
      </div>

      {currentPriorityReminders.length > 0 ? (
        <>
          {/* Progress Indicators */}
          <div className="flex justify-center space-x-2 mb-6">
            {currentPriorityReminders.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all
                  ${index === currentIndex 
                    ? `${PriorityColors[selectedPriority]} w-4` 
                    : 'bg-gray-200'
                  }`}
              />
            ))}
          </div>

          {/* Reminder Content */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-6 relative">
            <div className={`${currentPriorityReminders[currentIndex].completed ? 'opacity-50' : ''}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-3 h-3 rounded-full ${PriorityColors[selectedPriority]}`} />
                <h2 className="text-xl font-semibold flex-grow">
                  {currentPriorityReminders[currentIndex].heading}
                </h2>
                <span className="text-sm font-medium px-3 py-1 bg-white rounded-full text-gray-600">
                  {formatTime(currentPriorityReminders[currentIndex].time)}
                </span>
              </div>
              
              <p className="text-gray-600 leading-relaxed mb-4">
                {currentPriorityReminders[currentIndex].description}
              </p>
            </div>

            {currentPriorityReminders[currentIndex].completed && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-2xl pointer-events-none">
                <span className="bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-600">
                  Completed
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 relative z-10">
              {!currentPriorityReminders[currentIndex].completed ? (
                <button
                  onClick={() => handleComplete(currentPriorityReminders[currentIndex].id)}
                  className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                  title="Mark as complete"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </button>
              ) : (
                <button
                  className="p-2 rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed"
                  title="Already completed"
                  disabled
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </button>
              )}
              <button
                onClick={() => handleDelete(currentPriorityReminders[currentIndex].id)}
                className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                title="Delete reminder"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {currentIndex + 1} of {currentPriorityReminders.length}
            </span>
            <div className="flex space-x-3">
              <button
                onClick={handlePrevious}
                className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
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
                className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
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
        </>
      ) : (
        <div className="min-h-[200px] flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-center text-gray-500">
            No reminders found for Priority {selectedPriority}
          </p>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-3xl p-6 max-w-sm mx-4 shadow-xl">
            <h3 className="text-lg font-semibold mb-2">Delete Reminder</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this reminder?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
