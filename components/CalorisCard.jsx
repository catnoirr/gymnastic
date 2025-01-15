import React from "react";
import { FaFire } from "react-icons/fa";

export default function CalorisCard() {
  return (
    <div className="bg-white rounded-3xl p-6 px-8">
      <h1 className="font-bold text-4xl text-center">Calorie Tracking</h1>
      <p className="text-center text-sm pb-4">Easily log meals and monitor daily calorie intake.</p>
      <div className=" flex justify-evenly items-center pb-4 ">
        <FaFire className="text-8xl text-[#D4B96C]" />
        <p className="text-8xl font-semibold ">340</p>
      </div>
      <div className=" flex justify-between">
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
  );
}
