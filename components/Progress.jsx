import React from "react";
import { FaChartBar } from "react-icons/fa";

export default function ProgressTracking() {
  return (
    <div className="bg-white rounded-3xl p-6 px-8">
      <h1 className="font-bold text-4xl text-center">Progress Tracking</h1>
      <p className="text-center text-sm pb-4">
      Visualize your fitness journey with detailed progress reports.      </p>
     
      <div className="flex justify-center items-center">
        <FaChartBar className="text-[150px] "/>
      </div>
    </div>
  );
}
