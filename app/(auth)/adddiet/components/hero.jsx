"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function page() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  return (
    <div className="flex ">
      <div className="flex justify-between  w-full md:pb-12 ">
        <div className="">
          <h1 className="text-3xl md:text-4xl font-poppins font-semibold">Add Diet</h1>
          <p className="text-sm">Fuel your body, not your cravings.</p>
        </div>
        <div className="hidden md:block">
          <h1 className="text-4xl font-poppins font-semibold ">Monday</h1>
          <p className="text-center text-sm">20 Jan 2024</p>
        </div>
      <div>
      <button onClick={() => router.push('/diet')} className="bg-black text-white px-8 py-2 rounded-full text-center">Back</button>
      </div>
        
      </div>
      
    </div>
    
  );
}
