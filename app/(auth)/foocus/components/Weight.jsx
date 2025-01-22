"use client";
import { useState } from "react";

const Weight = () => {
  // Updated initial weight to be halfway between start and target
  const startWeight = 50;
  const targetWeight = 75;
  const initialWeight = Math.round(
    startWeight + (targetWeight - startWeight) * 0.5
  ); // This will be 62.5
  const [currentWeight, setCurrentWeight] = useState(initialWeight);

  // Calculate completion percentage
  const progress =
    ((currentWeight - startWeight) / (targetWeight - startWeight)) * 100;
  const completedPercentage = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-md">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">Weight Gain Plan</h2>
      </div>

      {/* Progress Bar */}
      <div className="relative h-4 bg-gray-200 rounded-full mb-6 sm:mb-4">
        <div
          className="absolute h-full bg-black rounded-full transition-all duration-300"
          style={{ width: `${completedPercentage}%` }}
        />

        {/* Progress Lines */}
        <div className="absolute top-0 left-0 w-full h-full flex justify-between px-1">
          {[...Array(25)].map((_, index) => (
            <div key={index} className="h-full w-[1px] bg-white/30" />
          ))}
        </div>

        {/* Current Weight Indicator */}
        <div
          className="absolute -top-8 transition-all duration-300"
          style={{
            left: `${completedPercentage}%`,
            transform: "translateX(-50%)",
          }}
        >
          <div className="relative">
            <div className="bg-black text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-lg font-medium whitespace-nowrap">
              {currentWeight} kg
            </div>
            {/* Triangle Pointer */}
            <div
              className="absolute left-1/2 bottom-[-4px] transform -translate-x-1/2 
                         w-2 h-2 bg-black rotate-45"
            />
          </div>
        </div>
      </div>

      {/* Weight Range Labels */}
      <div className="flex justify-between text-xs sm:text-sm">
        <span>{startWeight} kg</span>
        <span>{targetWeight} kg</span>
      </div>

      {/* Update Weight Button */}
      <button
        onClick={() =>
          setCurrentWeight((prev) => Math.min(prev + 1, targetWeight))
        }
        className="mt-4 flex items-center gap-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 px-4 py-2 rounded-full transition-colors"
      >
        Update Weight
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
          />
        </svg>
      </button>
    </div>
  );
};

export default Weight;
