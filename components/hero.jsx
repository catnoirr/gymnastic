import React from "react";

const FitnessAI = () => {
  return (
    <div className="relative min-h-screen bg-black text-white flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60 "
        style={{
          backgroundImage: `url('/f2.jpg')`, // Replace with your image URL
        }}
      ></div>

      {/* Content Overlay */}
      <div className="relative z-10  top-40  text-center p-6 flex flex-col items-center">
        <h1 className="text-7xl md:text-8xl font-bold mb-6 leading-tight font-poppins">
          Fitness Meet Gymiee.
        </h1>
        <p className="text-lg md:text-xl max-w-4xl text-center mb-8">
          Achieve your fitness goals with gymiee where calories track made easy, workout plans, habiits, reminders and many more...
        </p>
        {/* <button className="bg-orange-500 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-lg hover:bg-orange-600 transition">
          Get Started
        </button> */}
      </div>

      {/* Metric Data */}
      

      {/* Navigation */}
      <div className="absolute top-6 left-6">
        <button className="bg-gray-700 text-white px-6 py-4 md:rounded-xl rounded-full shadow hover:bg-gray-600 transition">
          Contact Us
        </button>
      </div>
      <div className="absolute top-6 right-6">
        <button className="bg-gray-700 text-white text-bold  px-6 py-4 md:rounded-xl rounded-full shadow hover:bg-gray-600 transition">
          Main Menu
        </button>
      </div>
    </div>
  );
};

export default FitnessAI;
