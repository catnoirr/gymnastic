import React from "react";
import { Poppins } from "next/font/google";

// Load the Google font
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function Hero() {
  return (
    <div className="relative sm:p-6">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center  "
        style={{ backgroundImage: 'url(/w.jpg)' }} // Replace with your image path
      ></div>

      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black opacity-10  "></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full   md:px-48    rounded-3xl pt-96 pb-7">
        <h1 className="text-6xl md:text-4xl text-white font-semibold pt-6 text-center">
          How's It Work
        </h1>
        <div className=" flex flex-col-reverse md:flex-row items-center justify-between w-full mt-6 md:mt-0 p-6 ">
        <div className=" w-full flex sm:p-6 py-6 px-4 md:p-16 bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl shadow-lg">
        <div className="lg:w-[50%]">
  <h1 className="sm:text-2xl text-xl font-bold text-center md:text-left text-white">
    Gymiee: Fitness Journey Simplified
  </h1>
  <p className="text-gray-200 text-lg mb-6 animate-fade-up text-center md:text-left">
    Transform your body and mind.
  </p>
  <div className="space-y-4">
    {[
      { step: "1.", title: "Login/Signup", desc: "Create or Login to Gymiee" },
      { step: "2.", title: "Add Diet Plan", desc: "Add your diet plan and food items." },
      { step: "3.", title: "Add Workout Plan", desc: "Add your workout plan and exercises." },
      { step: "4.", title: "Track Progress", desc: "Track your daily goals and overall progress." },
    ].map(({ step, title, desc }) => (
      <div key={step}>
        <p className="text-xl font-medium text-white">
          <span>{step}</span> {title}
        </p>
        <p className="text-sm ml-4 text-gray-200">{desc}</p>
      </div>
    ))}
  </div>

  </div>
  <div className="mt-8 md:mt-0 w-full md:w-1/2 lg:flex items-center justify-center hidden ">
  <img
    src="/hero.png"
    alt="Gymiee Promotion"
    className="w-4/5 lg:w-[90%]  object-cover animate-fade-down"
  />
</div>

</div>




          
        </div>
      </div>
    </div>
  );
}
