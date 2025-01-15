import React from "react";

import { Poppins } from "next/font/google";

// Load the Google font
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});
export default function hero() {
  return (
    <div className="p-10 min-h-screen">
      <div className="flex flex-col  items-center justify-between w-full py-10 md:py-0  px-6 md:px-12  bg-custom-gray bg-[#D9D9D9] shadow-md rounded-3xl ">
        <h1 className="text-4xl font-semibold  pt-6">Hows's It Work</h1>
        <div className="flex items-center justify-between ">
          <div className="md:w-1/2 p-16   bg-white rounded-3xl">
            <h1 className="text-2xl font-bold">
              Gymiee: Fitness Journey Simplified
            </h1>
            <p className="text-gray-700 text-lg mb-6 animate-fade-up">
              Transform your body and mind with customized fitness plans.
            </p>
            <div className="space-y-4">
              <div>
                {" "}
                <p className="text-xl font-medium font-poppins">
                  <span>1.</span>Login/Signup
                </p>
                <p className="text-sm ml-4">Create or Login to Gymiee</p>
              </div>

              <div>
                {" "}
                <p className="text-xl font-medium font-poppins">
                  <span>2.</span>Add Diet Plan
                </p>
                <p className="text-sm ml-4">Add your diet plan and food items.</p>
              </div>

              <div>
                {" "}
                <p className="text-xl font-medium font-poppins ">
                  <span>3.</span>Add Workout Plan
                </p>
                <p className="text-sm ml-4">Add your workout plan  and exercises.</p>
              </div>

              <div>
                {" "}
                <p className="text-xl font-medium font-poppins ">
                  <span>4.</span>Track Progress
                </p>
                <p className="text-sm ml-4">Track your daily goals and overall progress.</p>
              </div>
            </div>
          </div>
          <div className="mt-8 md:mt-0 md:w-1/2 flex items-center justify-center relative">
            {/* Vibrant Black Ring */}
            

            {/* Image */}
            <img
              src="/h1.png"
              alt="Gymiee Promotion"
              className="relative  w-[70%] object-cover animate-fade-down"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
