import React from "react";

export default function page() {
  return (
    <div className="flex min-h-screen  rounded-3xl bg-[#F7F5F1]">
      <div className="flex justify-between  w-full p-6">
        <div className="">
          <h1 className="text-4xl font-poppins font-semibold">Hi! Sagar</h1>
          <p className="text-sm">Fuel your body, not your cravings.</p>
        </div>
        <div>
          <h1 className="text-4xl font-poppins font-semibold">Monday</h1>
          <p className="text-center text-sm">20 Jan 2024</p>
        </div>
      <div>
      <button className="bg-black text-white px-8 py-2 rounded-full text-center">Add Diet</button>
      </div>
        
      </div>
    </div>
  );
}
