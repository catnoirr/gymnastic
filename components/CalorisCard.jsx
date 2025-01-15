import React from "react";
import { FaFire } from "react-icons/fa";

export default function CalorisCard() {
  return (
    <div className="relative  rounded-3xl overflow-hidden p-6 px-8 border">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40 animate-fade-up  animate-infinite "
        style={{ backgroundImage: 'url(/food.jpg)' }}
      ></div>

      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-black opacity-20"></div>

      {/* Content */}
      <div className="relative z-10 text-white">
        <h1 className="font-bold text-4xl text-center">Calorie Tracking</h1>
        <p className="text-center text-sm pb-4">Easily log meals and monitor daily calorie intake.</p>
        <div className="flex justify-evenly items-center pb-4">
          <FaFire className="text-8xl text-[#D4B96C]" />
          <p className="text-8xl font-semibold">340</p>
        </div>
        <div className="flex justify-between">
          <div>
            <p className="text-xl font-medium">Protein</p>
            <p>100g</p>
          </div>
          <div>
            <p className="text-xl font-medium">Carbohydrate</p>
            <p>90g</p>
          </div>
        </div>
      </div>
    </div>
  );
}
