"use client";
import React, { useState } from "react";
import BottomDrawer from "../../workout/components/BottomDrawer";

const WorkoutTable = ({ data }) => (
  <table className="w-full">
    <thead className="bg-gray-50/50 border-b text-center">
      <tr className="text-sm font-medium text-gray-600">
        <td className="py-4">Sets</td>
        <td className="py-4">Reps</td>
        <td className="py-4">Weight (kg)</td>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-100">
      {data.map((row, index) => (
        <tr
          key={index}
          className="text-gray-700 hover:bg-gray-50/50 transition-colors duration-200"
        >
          <td className="py-4 text-center font-medium">{row.sets}</td>
          <td className="py-4 text-center font-medium">{row.reps}</td>
          <td className="py-4 text-center font-medium">{row.weight}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const ActionButtons = () => (
  <div className="flex justify-end gap-3">
    <button className="bg-black text-white p-3 rounded-full text-center flex items-center hover:bg-gray-800 transition-colors duration-200 shadow-sm hover:shadow-md">
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
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
    </button>
    <button className="bg-black text-white p-3 rounded-full text-center flex items-center hover:bg-gray-800 transition-colors duration-200 shadow-sm hover:shadow-md">
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
          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
        />
      </svg>
    </button>
  </div>
);

export default function Main() {
  const [isOpenBench, setIsOpenBench] = useState(false);
  const [isOpenLat, setIsOpenLat] = useState(false);

  const workoutData = [
    { sets: 3, reps: 10, weight: 100 },
    { sets: 3, reps: 10, weight: 100 },
    { sets: 3, reps: 10, weight: 100 },
    { sets: 3, reps: 10, weight: 100 },
  ];

  return (
    <div className="flex flex-col gap-6 w-full pb-28">
      <div className="flex flex-col gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-poppins font-semibold text-gray-900">Chest Day</h1>
          <p className="text-sm text-gray-600">Chest day best day</p>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-lg font-semibold text-gray-800">Exercise</p>

          <div
            className="flex flex-col gap-6 border border-gray-200 p-6 bg-white rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 relative z-[1]"
            onClick={() => setIsOpenBench(true)}
          >
            <div className="flex items-center justify-center gap-2">
              <p className="text-xl font-semibold text-gray-800">Bench Press</p>
            </div>

            <WorkoutTable data={workoutData} />
            <ActionButtons />
          </div>

          <div
            className="flex flex-col gap-6 border border-gray-200 p-6 bg-white rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 relative z-[1]"
            onClick={() => setIsOpenLat(true)}
          >
            <div className="flex items-center justify-center gap-2">
              <p className="text-xl font-semibold text-gray-800">Lat Pull Down</p>
            </div>

            <WorkoutTable data={workoutData} />
            <ActionButtons />
          </div>
        </div>
      </div>

      <BottomDrawer isOpen={isOpenBench} onClose={() => setIsOpenBench(false)}>
        <div className="flex flex-col">
          <p className="text-2xl font-semibold text-gray-800 text-center">Bench Press</p>
          <p className="text-sm text-gray-600 text-center">Monday (12 jan 2024)</p>
          <WorkoutTable data={workoutData} />
        </div>
      </BottomDrawer>

      <BottomDrawer isOpen={isOpenLat} onClose={() => setIsOpenLat(false)}>
        <div className="flex flex-col">
          <p className="text-2xl font-semibold text-gray-800 text-center">Lat Pull Down</p>
          <p className="text-sm text-gray-600 text-center">Monday (12 jan 2024)</p>
          <WorkoutTable data={workoutData} />
        </div>
      </BottomDrawer>
    </div>
  );
}
