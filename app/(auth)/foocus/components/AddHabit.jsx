'use client'
import { useState } from 'react'

const AddHabit = ({ onSubmit, onClose }) => {
  const [count, setCount] = useState(10)

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    onSubmit({
      title: formData.get('title'),
      subtitle: formData.get('subtitle'),
      totalCount: parseInt(count),
      currentCount: 0
    })
  }

  return (
    <div className=" bg-white dark:bg-gray-800   transition-all duration-200">
      <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Add New Habit
      </h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              required
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 
                dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 
                focus:border-transparent transition-all duration-200 dark:text-white 
                placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="e.g., Read Books"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
              Description
            </label>
            <input
              type="text"
              name="subtitle"
              required
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 
                dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 
                focus:border-transparent transition-all duration-200 dark:text-white 
                placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="e.g., Read for 30 minutes daily"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
              Target Count
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setCount(prev => Math.max(1, prev - 1))}
                className="w-12 h-12 flex items-center justify-center bg-gray-100 
                  dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 
                  transition-colors duration-200 active:scale-95"
              >
                <span className="text-xl font-medium text-gray-600 dark:text-gray-300">-</span>
              </button>
              <input
                type="number"
                value={count}
                onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-24 text-center px-4 py-3 bg-gray-50 dark:bg-gray-700 
                  border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 
                  focus:ring-indigo-500 focus:border-transparent transition-all 
                  duration-200 dark:text-white"
                min="1"
              />
              <button
                type="button"
                onClick={() => setCount(prev => prev + 1)}
                className="w-12 h-12 flex items-center justify-center bg-gray-100 
                  dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 
                  transition-colors duration-200 active:scale-95"
              >
                <span className="text-xl font-medium text-gray-600 dark:text-gray-300">+</span>
              </button>
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 
                dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 
                transition-colors duration-200 font-medium active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-indigo-500 text-white rounded-xl 
                hover:bg-indigo-600 transition-colors duration-200 font-medium 
                active:scale-[0.98]"
            >
              Add Habit
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddHabit 