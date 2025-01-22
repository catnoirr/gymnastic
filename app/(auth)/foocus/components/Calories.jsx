"use client";

import { useState } from "react";
import { FiEdit, FiPlus } from "react-icons/fi";

const Calories = () => {
  const [calorieGoal, setCalorieGoal] = useState(3000);
  const [currentCalories, setCurrentCalories] = useState(1000);

  // Calculate percentage for the progress ring
  const percentage = (currentCalories / calorieGoal) * 100;
  const radius = 65; // Smaller radius for a smaller circle
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const handleAddCalories = () => {
    const calories = prompt("Enter calories to add:");
    if (calories && !isNaN(calories)) {
      setCurrentCalories((prev) => prev + Number(calories));
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-md p-6 flex  justify-between">
      <div className="flex flex-col justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">
            Daily Calories Intake
          </h2>
          <p className="text-gray-400 text-sm">Eat Healthy Stay Healthy</p>
        </div>
        <div className="flex gap-3">
          <button
            className="flex items-center gap-2 text-sm bg-yellow-50 hover:bg-yellow-100 text-yellow-600 px-4 py-2 rounded-full transition-colors duration-200"
            onClick={() => {
              const newGoal = prompt("Enter new calorie goal:", calorieGoal);
              if (newGoal && !isNaN(newGoal)) {
                setCalorieGoal(Number(newGoal));
              }
            }}
          >
            Change Goal
            <FiEdit className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="relative w-48 h-48">
        {/* Progress Ring */}
        <svg className="w-full h-full transform -rotate-[100deg]">
          {/* Background circle */}
          <circle
            cx="96"
            cy="96"
            r={radius}
            className="stroke-[#f0f0f0]"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${circumference * 0.75} ${circumference}`}
          />
          {/* Progress circle */}
          <circle
            cx="96"
            cy="96"
            r={radius}
            className="stroke-[#86efac]"
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={`${circumference * 0.75} ${circumference}`}
            style={{
              strokeDashoffset: strokeDashoffset,
              transition: "stroke-dashoffset 0.5s ease",
            }}
          />
        </svg>

        {/* Current calories bubble */}
        <div className="absolute -right-1 top-8">
          <div className="relative">
            <div className="bg-black text-white text-xs px-3 py-1.5 rounded-md">
              {currentCalories}
            </div>
            <div className="absolute -bottom-1 right-4 w-3 h-3 bg-black transform rotate-45"></div>
          </div>
        </div>

        {/* Center text */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-gray-400 mb-1">Goal</div>
          <div className="text-4xl font-bold text-gray-800">{calorieGoal}</div>
          <div className="text-gray-400 text-xs mt-1">Kcl</div>
        </div>
      </div>
    </div>
  );
};

export default Calories;
