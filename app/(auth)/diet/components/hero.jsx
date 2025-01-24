"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";


export default function page() {

  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  return (
    <div className="flex ">
      <div className="flex justify-between  w-full md:pb-12 ">
        <div className="">
          <h1 className="text-5xl md:text-4xl font-poppins font-semibold bg-gradient-to-r from-blue-600/60 to-purple-600/60 bg-clip-text text-transparent animate-gradient">
            Diet
          </h1>
          <p className="text-sm">Fuel your body, not your cravings.</p>
        </div>
        <div className="hidden md:block">
          <h1 className="text-4xl font-poppins font-semibold ">Monday</h1>
          <p className="text-center text-sm">20 Jan 2024</p>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => router.push('/adddiet')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-2.5 rounded-full text-center font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Diet
          </button>
        </div>
      </div>
      
    </div>
  );
}
