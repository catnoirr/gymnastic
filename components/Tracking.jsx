
import React from "react";
import { FaFire } from "react-icons/fa";

export default function CalorisCard() {
  return (
    <div className="relative  rounded-3xl overflow-hidden p-6 px-8 border">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: 'url(/w1.jpg)' }}
      ></div>

      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-black opacity-20"></div>

      {/* Content */}
      <div className="relative z-10 text-white">
        <h1 className="font-bold text-4xl text-center">Workout Tracking</h1>
        <p className="text-center text-sm pb-4">Record and analyze your workouts to maximize results.</p>
        
        <div className="flex justify-center items-center">
        <div className="relative w-40 h-40 ">
          <div className="absolute inset-0 rounded-full border-4 border-gray-300"></div>
          <div
            className="absolute inset-0 rounded-full border-8 border-blue-700"
            style={{
              clipPath: "polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)",
            }}
          ></div>
        </div>
      </div>

      </div>
    </div>
  );
}

