"use client"
import React, { useState } from "react";
import BottomDrawer from "./BottomDrawer";
import { FiCalendar, FiClock } from "react-icons/fi";
import { IoFitnessOutline, IoBarbell } from "react-icons/io5";
import { GiWeightScale } from "react-icons/gi";
import { LuRuler } from "react-icons/lu";

export default function Main() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);

  const exercises = [
    { name: "Flat Bench Press", icon: <IoBarbell className="w-6 h-6" /> },
    { name: "Squats", icon: <IoFitnessOutline className="w-6 h-6" /> },
    { name: "Deadlifts", icon: <IoBarbell className="w-6 h-6" /> },
    { name: "Pull-ups", icon: <IoFitnessOutline className="w-6 h-6" /> },
    { name: "Shoulder Press", icon: <IoBarbell className="w-6 h-6" /> },
    { name: "Bicep Curls", icon: <IoFitnessOutline className="w-6 h-6" /> },
  ];

  const handleExerciseClick = (exercise) => {
    setSelectedExercise(exercise);
    setIsDrawerOpen(true);
  };

  const days = ['M', 'T', 'W', 'Th', 'F', 'Sa'];
  const today = new Date().getDay();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row justify-between md:items-center gap-4">
        <h1 className="text-xl md:text-2xl font-poppins font-semibold">
          Exercise
        </h1>
        <div className="flex flex-wrap md:justify-center justify-between gap-2 sm:gap-4">
          {days.map((day, index) => (
            <div
              key={day}
              className={`text-lg font-poppins font-semibold ${
                index === today - 1 ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
              } w-10 h-10 flex items-center justify-center rounded-full cursor-pointer hover:scale-105 transition-transform`}
            >
              {day}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-8 sm:py-16">
        {exercises.map((exercise, index) => (
          <div
            key={index}
            onClick={() => handleExerciseClick(exercise)}
            className="flex items-center gap-4 bg-white rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] w-full"
          >
            <div className="p-3 bg-blue-50 rounded-xl text-blue-500">
              {exercise.icon}
            </div>
            <p className="text-base sm:text-lg font-poppins font-semibold text-gray-800">
              {exercise.name}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <FiCalendar className="w-6 h-6 text-blue-500" />
            <p className="text-xl sm:text-2xl font-poppins font-semibold text-gray-800">Daily Calories</p>
          </div>
          <p className="text-lg sm:text-xl font-poppins font-semibold text-blue-600">2000 kcal</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <GiWeightScale className="w-6 h-6 text-purple-500" />
            <p className="text-xl sm:text-2xl font-poppins font-semibold text-gray-800">Current Weight</p>
          </div>
          <p className="text-lg sm:text-xl font-poppins font-semibold text-purple-600">70kg</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <LuRuler className="w-6 h-6 text-green-500" />
            <p className="text-xl sm:text-2xl font-poppins font-semibold text-gray-800">Height</p>
          </div>
          <p className="text-lg sm:text-xl font-poppins font-semibold text-green-600">170cm</p>
        </div>
      </div>

      <BottomDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        {selectedExercise && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-50 rounded-xl text-blue-500">
                {selectedExercise.icon}
              </div>
              <h2 className="text-2xl font-poppins font-semibold text-gray-800">
                {selectedExercise.name}
              </h2>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500 mb-1">Sets</p>
                <p className="text-lg font-poppins font-semibold text-gray-800">3</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500 mb-1">Reps</p>
                <p className="text-lg font-poppins font-semibold text-gray-800">12</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500 mb-1">Weight</p>
                <p className="text-lg font-poppins font-semibold text-gray-800">60kg</p>
              </div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 flex items-center gap-3">
              <FiClock className="w-5 h-5 text-blue-500" />
              <p className="text-sm text-gray-600">Last workout: 3 days ago</p>
            </div>
          </div>
        )}
      </BottomDrawer>
    </div>
  );
}
