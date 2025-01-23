'use client'
import { useState } from 'react'

const AddHabit = ({ onSubmit, onClose }) => {
  const [count, setCount] = useState(10) // Default count of 10

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
    <div className="p-6">
      <h3 className="text-xl font-bold mb-4">Add New Habit</h3>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g., Read Books"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              name="subtitle"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g., Read for 30 minutes daily"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Count
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCount(prev => Math.max(1, prev - 1))}
                className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg"
              >
                -
              </button>
              <input
                type="number"
                value={count}
                onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 text-center px-3 py-2 border border-gray-300 rounded-lg"
                min="1"
              />
              <button
                type="button"
                onClick={() => setCount(prev => prev + 1)}
                className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg"
              >
                +
              </button>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-black text-white rounded-lg"
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