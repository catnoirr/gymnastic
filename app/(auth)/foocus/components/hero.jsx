"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import BottomDrawer from "../../workout/components/BottomDrawer";
import AddReminder from "../../reminders/components/add";

export default function page() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  return (
    <div className="flex ">
      <div className="flex justify-between  w-full md:pb-12 pt-3 ">
        <div className="">
          <h1 className="text-5xl md:text-4xl font-poppins font-semibold bg-gradient-to-r from-blue-600/60 to-purple-600/60 bg-clip-text text-transparent animate-gradient">
            Foocus
          </h1>
          <p className="text-sm">Focus on your goals.</p>
        </div>
        <div className="hidden md:block">
          <h1 className="text-4xl font-poppins font-semibold ">
            {new Date().toLocaleDateString('en-US', {weekday: 'long'})}
          </h1>
          <p className="text-center text-sm">
            {new Date().toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short', 
              year: 'numeric'
            })}
          </p>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => setIsOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-2.5 rounded-full text-center font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Reminder
          </button>
        </div>
      </div>
      <BottomDrawer isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="w-full h-full flex justify-center items-center">
        <AddReminder />

        </div>
      </BottomDrawer>
    </div>
  );
}
