import React from "react";
import { Poppins } from "next/font/google";

// Load the Google font
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function Hero() {
  return (
    <div className="relative sm:p-6 bg-black min-h-screen">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60"
        style={{ backgroundImage: "url(/a.jpg)" }} // Replace with your image path
      ></div>

      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black opacity-10"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full   md:px-16    rounded-3xl pt-96 pb-7">
        <h1 className="text-6xl md:text-4xl text-white font-semibold pt-6  w-full px-8 ">
          About
        </h1>
        <div className=" flex flex-col-reverse md:flex-row items-center justify-between w-full  md:mt-0 p-6 ">
          <div className=" w-full flex sm:p-6 py-6 px-4 md:p-16 bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl shadow-lg">
            <div className="lg:w-[50%]">
              <h1 className="sm:text-2xl text-xl font-bold text-center md:text-left text-white">
                Gymiee: Fitness Journey Simplified
              </h1>
              <p className="text-gray-200 text-lg mb-6 animate-fade-up text-center md:text-left">
                Transform your body and mind.
              </p>
              <div className="space-y-4 text-white flex flex-col md:flex-row justify-between gap-10">
                <p>
                  At Gymiee, we simplify your fitness journey by providing a
                  seamless platform to track workouts, manage diet plans, and
                  monitor your progress. Whether you're just starting your
                  fitness journey or you're a seasoned athlete, Gymiee offers
                  the tools you need to stay on track. <br /> <br /> Our platform is designed
                  to help you create personalized workout and diet plans that
                  align with your specific goals. With our easy-to-use
                  interface, tracking your daily calorie intake, exercises, and
                  progress has never been easier. <br /> <br />Join Gymiee today and take
                  control of your fitness journey with the right tools to help
                  you succeed. Start transforming your body and mind today!
                </p>
                <div className="hidden">
                    <p>Developer</p>

                </div>
              </div>
            </div>
            {/* <div className="mt-8 md:mt-0 w-full md:w-1/2 lg:flex items-center justify-center hidden ">
              <img
                src="/hero.png"
                alt="Gymiee Promotion"
                className="w-4/5 lg:w-[90%]  object-cover animate-fade-down"
              />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
