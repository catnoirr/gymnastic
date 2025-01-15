import React from "react";
import { Poppins } from "next/font/google";

// Load the Google font
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function Hero() {
  return (
    <div className="sm:p-6 ">
      <div className="flex flex-col items-center justify-center w-full sm:py-10 md:py-0 sm:px-6 md:px-12 bg-custom-gray sm:bg-[#D9D9D9] sm:shadow-md rounded-3xl b ">
        <h1 className="text-6xl md:text-4xl font-semibold pt-6 text-center">
          How's It Work
        </h1>
        <div className="flex flex-col md:flex-row items-center justify-between w-full mt-6 md:mt-0">
          <div className="md:w-1/2 sm:p-6 py-6 px-4 md:p-16 bg-white rounded-3xl">
            <h1 className="sm:text-2xl text-xl font-bold text-center md:text-left">
              Gymiee: Fitness Journey Simplified
            </h1>
            <p className="text-gray-700 text-lg mb-6 animate-fade-up text-center md:text-left">
              Transform your body and mind .
            </p>
            <div className="space-y-4">
              <div>
                <p className="text-xl font-medium font-poppins">
                  <span>1.</span> Login/Signup
                </p>
                <p className="text-sm ml-4">Create or Login to Gymiee</p>
              </div>

              <div>
                <p className="text-xl font-medium font-poppins">
                  <span>2.</span> Add Diet Plan
                </p>
                <p className="text-sm ml-4">Add your diet plan and food items.</p>
              </div>

              <div>
                <p className="text-xl font-medium font-poppins">
                  <span>3.</span> Add Workout Plan
                </p>
                <p className="text-sm ml-4">Add your workout plan and exercises.</p>
              </div>

              <div>
                <p className="text-xl font-medium font-poppins">
                  <span>4.</span> Track Progress
                </p>
                <p className="text-sm ml-4">Track your daily goals and overall progress.</p>
              </div>
            </div>
          </div>
          <div className="mt-8 md:mt-0 md:w-1/2 flex items-center justify-center relative ">
          
            <img
              src="/h1.png"
              alt="Gymiee Promotion"
              className="relative w-full md:w-[70%] object-cover animate-fade-down "
            />
          </div>
        </div>
      </div>
    </div>
  );
}
