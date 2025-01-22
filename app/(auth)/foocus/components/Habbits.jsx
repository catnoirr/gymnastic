'use client'
import { useState } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { FaUserCircle } from 'react-icons/fa'
import { IoMdAdd } from 'react-icons/io'

const Habits = () => {
  const [habits] = useState([
    {
      title: 'Book',
      subtitle: 'Rich Dad Poor Dad',
      completed: '10/100',
      progress: 10 // out of 10 segments shown in UI
    },
    {
      title: 'Drink Water',
      subtitle: 'Keep your body hydrated',
      completed: '7/10',
      progress: 7
    },
    {
      title: 'Workout',
      subtitle: 'Stay Fit',
      completed: '3/6',
      progress: 8
    },
    {
      title: 'Meals',
      subtitle: 'Fuel your body',
      completed: '4/6',
      progress: 8
    }
  ])

  return (
    <div className="bg-white rounded-3xl shadow-md p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Habits</h2>
        <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full">
          <IoMdAdd size={20} />
          Add New
        </button>
      </div>

      <div className="space-y-3">
        {habits.map((habit, index) => (
          <div
            key={index}
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
                Completed: {habit.completed}
              </div>
              <div className="flex gap-1">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 sm:w-1.5 h-4 sm:h-6 rounded-full ${
                      i < habit.progress ? 'bg-[#F4A261]' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <BsThreeDotsVertical className="text-gray-400 cursor-pointer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Habits
