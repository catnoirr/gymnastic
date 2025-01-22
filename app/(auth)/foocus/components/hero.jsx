"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import BottomDrawer from "../../workout/components/BottomDrawer";

export default function page() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  return (
    <div className="flex ">
      <div className="flex justify-between  w-full md:pb-12 ">
        <div className="">
          <h1 className="text-3xl md:text-4xl font-poppins font-semibold">
            Foocus
          </h1>
          <p className="text-sm">Focus on your goals.</p>
        </div>
        <div className="hidden md:block">
          <h1 className="text-4xl font-poppins font-semibold ">Monday</h1>
          <p className="text-center text-sm">20 Jan 2024</p>
        </div>
        <div>
          <button
            onClick={() => setIsOpen(true)}
            className="bg-black text-white px-8 py-2 rounded-full text-center"
          >
            Add Reminder
          </button>
        </div>
      </div>
      <BottomDrawer isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-poppins font-semibold">Add Reminder</h1>
          <p className="text-sm">Add a reminder to focus on your goals.</p>
        </div>
      </BottomDrawer>
    </div>
  );
}
