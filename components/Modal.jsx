"use client"
import React, { useEffect, useState } from "react";


const FitnessAI = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Toggle the modal visibility
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);

  };

   // Close the modal when clicking outside the modal content
   const handleClickOutside = (event) => {
    if (event.target.id === "modal-overlay") {
      setIsModalOpen(false);
    }
  };

    // Disable scrolling when modal is open
    useEffect(() => {
      if (isModalOpen) {
        document.body.style.overflow = "hidden";
        
      } else {
        document.body.style.overflow = "auto";
      }
  
      // Cleanup scroll lock on component unmount
      return () => {
        document.body.style.overflow = "auto";
      };
    }, [isModalOpen]);

  return (
    <div className="relative min-h-screen bg-black text-white flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center  mt-4   "
        style={{
          backgroundImage: url('/w1.jpg'), // Replace with your image URL
        }}
      ></div>

      {/* Content Overlay */}
      <div className="relative z-10  top-40  text-center p-6 flex flex-col items-center">
        <h1 className="text-7xl md:text-8xl font-bold mb-6 leading-tight font-poppins ">
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
        <button className=" text-white px-10 py-4 font-semibold  rounded-full shadow hover:bg-gray-600 transition">
          About
        </button>
      </div>
      <div className="absolute top-6 right-6 "  onClick={toggleModal}>
        <button className=" text-white font-semibold text-bold  px-6 py-4  rounded-full shadow hover:bg-gray-600 transition">
          Main Menu
        </button>
      </div>

        {/* Modal */}
      {isModalOpen && (
        <div
          id="modal-overlay"
          className="fixed inset-0 flex justify-center md:items-center items-end  bg-black bg-opacity-50 z-50"
          onClick={handleClickOutside}
        >
          <div className="w-full max-w-lg  animate-flip-up md:animate-jump-in animate-delay-0 animate-ease-in-out bg-white rounded-t-3xl md:rounded-3xl p-6 pt-2 " onClick={(e) => e.stopPropagation()}>
            <div className="w-full flex justify-center pb-7  " onClick={toggleModal}><div className="w-12 h-2 border bg-gymie-secondary rounded-3xl"  onClick={toggleModal}></div></div>
            <h2 className="text-4xl font-semibold text-black text-center">@gymiee</h2>
            <p className="mt-4 text-center  text-xl text-black  py-2 px-10 rounded-full bg-[#C2FFC7]">Login & Register</p>
            <p className="mt-4 text-center text-xl text-black  py-2 px-10 rounded-full bg-[#C2FFC7]">What gymiee serve</p>
            <p className="mt-4 text-center  text-xl text-black  py-2 px-10 rounded-full bg-[#C2FFC7]">About gymiee</p>
            <div className="flex justify-center mt-4">
              {/* <button
                onClick={toggleModal}
                className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300"
              >
                Close Modal
              </button> */}
            </div>
          </div>
        </div>
      )}
    </div>

    
  );
};

export default FitnessAI;