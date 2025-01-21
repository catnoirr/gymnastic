"use client"
import React from "react";
import { useState } from "react";
import BottomDrawer from "./BottomDrawer";
import Popover from "./Popover";

export default function page() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Monday');
  
  return (
    <div className="flex ">
      <div className="flex justify-between  w-full md:pb-12 ">
        <div className="">
          <h1 className="text-4xl md:text-4xl font-poppins font-semibold">
            Workout
          </h1>
          <p className="text-sm">Fuel your body, not your cravings.</p>
        </div>
        <div className="hidden md:block">
          <h1 className="text-4xl font-poppins font-semibold ">{selectedDay}</h1>
          <p className="text-center text-sm">20 Jan 2024</p>
        </div>
        <div>
          <button onClick={() => setIsDrawerOpen(true)} className="bg-black text-white px-8 py-2 rounded-full text-center">
            Add New
          </button>
        </div>
      </div>
      <BottomDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <div>
          <h1 className="text-xl  md:text-2xl font-poppins font-semibold">Add New Workout</h1>
          <Popover 
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            className="mt-6"
          />
          <p className="text-sm font-poppins font-medium text-gray-700 mt-6 mb-2">Workout Name</p>
          <input type="text" placeholder="eg: Bench Press" className="w-full p-3 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" />
        </div>
      </BottomDrawer>
    </div>
  );
}
