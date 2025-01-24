"use client"
import React, { useState } from 'react';
import { IoBarbell } from "react-icons/io5";
import BottomDrawer from './BottomDrawer';

export default function AddWorkout({ onClose, isOpen }) {
  const [workoutData, setWorkoutData] = useState({
    name: '',
    sets: '',
    reps: '',
    weight: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle workout submission here
    console.log(workoutData);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorkoutData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <BottomDrawer isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-poppins font-semibold text-gray-800">Add New Workout</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Exercise Name
            </label>
            <input
              type="text"
              name="name"
              value={workoutData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter exercise name"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sets
              </label>
              <input
                type="number"
                name="sets"
                value={workoutData.sets}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Sets"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reps
              </label>
              <input
                type="number"
                name="reps"
                value={workoutData.reps}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Reps"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                name="weight"
                value={workoutData.weight}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Weight"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors mt-4"
          >
            Add Workout
          </button>
        </form>
      </div>
    </BottomDrawer>
  );
} 