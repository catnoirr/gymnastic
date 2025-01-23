'use client'
import { useState, useEffect, useCallback } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { FaUserCircle } from 'react-icons/fa'
import { IoMdAdd } from 'react-icons/io'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { db, auth } from '@/lib/firebase'
import { collection, query, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import BottomDrawer from '../../workout/components/BottomDrawer'
import AddHabit from './AddHabit'
import toast from 'react-hot-toast'

const HabitSkeleton = () => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-50 rounded-3xl px-6 py-4 sm:p-4 gap-3 sm:gap-0 animate-pulse">
    <div className="flex items-center gap-4 w-full sm:w-auto">
      <div className="w-6 h-6 bg-gray-200 rounded-full" />
      <div className="min-w-0 space-y-2">
        <div className="h-4 w-32 bg-gray-200 rounded" />
        <div className="h-3 w-24 bg-gray-200 rounded" />
      </div>
    </div>
    <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 w-full sm:w-auto">
      <div className="h-4 w-24 bg-gray-200 rounded" />
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-1.5 h-6 bg-gray-200 rounded-full" />
        ))}
      </div>
      <div className="w-4 h-4 bg-gray-200 rounded" />
    </div>
  </div>
)

const HabitsCardSkeleton = () => (
  <div className="bg-white rounded-3xl shadow-md p-6 w-full animate-pulse">
    <div className="flex justify-between items-center mb-6">
      <div className="h-8 w-32 bg-gray-200 rounded" />
      <div className="h-10 w-28 bg-gray-200 rounded-full" />
    </div>

    <div className="space-y-3">
      <HabitSkeleton />
      <HabitSkeleton />
      <HabitSkeleton />
    </div>
  </div>
)

const Habits = () => {
  const [user] = useAuthState(auth)
  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAddHabitOpen, setIsAddHabitOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedHabit, setSelectedHabit] = useState(null)
  const [editProgress, setEditProgress] = useState(0)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)

  // Fetch habits from Firebase
  const fetchHabits = useCallback(async () => {
    if (!user) return

    try {
      setLoading(true)
      const habitsRef = collection(db, 'users', user.uid, 'habits')
      const querySnapshot = await getDocs(habitsRef)
      
      const habitsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      setHabits(habitsData)
    } catch (error) {
      console.error('Error fetching habits:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchHabits()
  }, [fetchHabits])

  useEffect(() => {
    if (selectedHabit) {
      setEditProgress(selectedHabit.progress)
    }
  }, [selectedHabit])

  // Add new habit
  const handleAddHabit = async (habitData) => {
    if (!user) return

    try {
      const habitsRef = collection(db, 'users', user.uid, 'habits')
      await addDoc(habitsRef, {
        ...habitData,
        createdAt: new Date(),
        progress: 0,
      })
      fetchHabits()
      setIsAddHabitOpen(false)
    } catch (error) {
      console.error('Error adding habit:', error)
    }
  }

  // Update habit progress
  const handleUpdateProgress = async (habitId, newProgress, totalCount) => {
    if (!user) return

    try {
      const habitRef = doc(db, 'users', user.uid, 'habits', habitId)
      const updatedProgress = Math.min(newProgress, totalCount)
      await updateDoc(habitRef, {
        progress: updatedProgress
      })
      
      // Show toast when habit is completed
      if (updatedProgress === totalCount) {
        const habit = habits.find(h => h.id === habitId)
        toast.success(
          <div className="flex items-center gap-2">
            <span className="text-xl"></span>
            <span className="text-center">Congrats!</span>
          </div>,
          {
            duration: 3000,
            style: {
              background: '#10B981',
              color: 'white',
              padding: '12px 24px'
            }
          }
        )
      }
      
      fetchHabits()
    } catch (error) {
      console.error('Error updating habit progress:', error)
    }
  }

  // Delete habit
  const handleDeleteHabit = async (habitId) => {
    if (!user) return

    try {
      const habitRef = doc(db, 'users', user.uid, 'habits', habitId)
      await deleteDoc(habitRef)
      fetchHabits()
    } catch (error) {
      console.error('Error deleting habit:', error)
    }
  }

  // Update the progress bar rendering in the main habits list
  const renderProgressBars = (progress, totalCount) => {
    // Show max 10 bars, combine progress if more
    const maxBars = 10
    const barsToShow = Math.min(maxBars, totalCount)
    const progressPerBar = totalCount / barsToShow
    
    return [...Array(barsToShow)].map((_, i) => {
      const progressForThisBar = (progress / totalCount) * barsToShow
      return (
        <div
          key={i}
          onClick={() => handleUpdateProgress(habit.id, Math.ceil((i + 1) * progressPerBar), totalCount)}
          className={`w-1 sm:w-1.5 h-4 sm:h-6 rounded-full cursor-pointer ${
            i < progressForThisBar ? 'bg-[#F4A261]' : 'bg-gray-200'
          }`}
        />
      )
    })
  }

  if (loading) {
    return <HabitsCardSkeleton />
  }

  return (
    <div className="bg-white rounded-3xl shadow-md p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Habits</h2>
        <button 
          onClick={() => setIsAddHabitOpen(true)}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full"
        >
          <IoMdAdd size={20} />
          Add New
        </button>
      </div>

      <div className="space-y-3">
        {habits.map((habit) => (
          <div
            key={habit.id}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#FDF4EA] rounded-3xl px-6 py-4 sm:p-4 gap-3 sm:gap-0"
          >
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <FaUserCircle className="text-gray-400 min-w-[24px]" size={24} />
              <div className="min-w-0">
                <h3 className="font-semibold truncate">{habit.title}</h3>
                <p className="text-sm text-gray-600 truncate">{habit.subtitle}</p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 w-full sm:w-auto">
              <div className="text-sm text-gray-600 whitespace-nowrap">
                Completed: {habit.progress}/{habit.totalCount}
              </div>
              <div className="flex gap-1">
                {renderProgressBars(habit.progress, habit.totalCount)}
              </div>
              <div className="relative">
                <BsThreeDotsVertical 
                  className="text-gray-400 cursor-pointer" 
                  onClick={() => {
                    setSelectedHabit(habit)
                    setIsEditMode(true)
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Habit Dialog */}
      <BottomDrawer isOpen={isAddHabitOpen} onClose={() => setIsAddHabitOpen(false)}>
        <AddHabit 
          onSubmit={handleAddHabit}
          onClose={() => setIsAddHabitOpen(false)}
        />
      </BottomDrawer>

      {/* Edit Dialog */}
      <BottomDrawer isOpen={isEditMode} onClose={() => {
        setIsEditMode(false)
        setSelectedHabit(null)
        setEditProgress(0)
      }}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Manage Habit</h3>
            {selectedHabit && (
              <button
                onClick={() => setIsDeleteConfirmOpen(true)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
              >
                <RiDeleteBin6Line size={20} />
              </button>
            )}
          </div>
          {selectedHabit && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">{selectedHabit.title}</h4>
                <p className="text-sm text-gray-500 mb-4">{selectedHabit.subtitle}</p>
                
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Update Progress ({editProgress}/{selectedHabit.totalCount})
                  </label>
                  
                  {/* Progress Controls */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setEditProgress(prev => Math.max(0, prev - 1))}
                      className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={editProgress}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0
                        setEditProgress(Math.min(Math.max(0, value), selectedHabit.totalCount))
                      }}
                      className="w-20 text-center px-3 py-2 border border-gray-300 rounded-lg"
                      min="0"
                      max={selectedHabit.totalCount}
                    />
                    <button
                      type="button"
                      onClick={() => setEditProgress(prev => Math.min(prev + 1, selectedHabit.totalCount))}
                      className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg"
                    >
                      +
                    </button>
                  </div>
                  {/* Progress Bar */}
                  <div className="flex gap-1">
                    {(() => {
                      const maxBars = 10
                      const barsToShow = Math.min(maxBars, selectedHabit.totalCount)
                      const progressPerBar = selectedHabit.totalCount / barsToShow
                      
                      return [...Array(barsToShow)].map((_, i) => {
                        const progressForThisBar = (editProgress / selectedHabit.totalCount) * barsToShow
                        return (
                          <div
                            key={i}
                            className={`flex-1 h-2 rounded-full ${
                              i < progressForThisBar ? 'bg-[#F4A261]' : 'bg-gray-200'
                            }`}
                          />
                        )
                      })
                    })()}
                  </div>
                </div>

                {/* Update Button */}
                <div className="mt-6">
                  <button
                    onClick={async () => {
                      await handleUpdateProgress(
                        selectedHabit.id,
                        editProgress,
                        selectedHabit.totalCount
                      )
                      setIsEditMode(false)
                      setSelectedHabit(null)
                    }}
                    className="w-full bg-black text-white py-2.5 rounded-lg"
                  >
                    Update Progress
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </BottomDrawer>

      {/* Delete Confirmation Dialog */}
      <BottomDrawer 
        isOpen={isDeleteConfirmOpen} 
        onClose={() => setIsDeleteConfirmOpen(false)}
      >
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Delete Habit</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete "{selectedHabit?.title}"? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setIsDeleteConfirmOpen(false)}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gray-100 text-gray-700 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                handleDeleteHabit(selectedHabit.id)
                setIsDeleteConfirmOpen(false)
                setIsEditMode(false)
                setSelectedHabit(null)
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </BottomDrawer>
    </div>
  )
}

export default Habits
