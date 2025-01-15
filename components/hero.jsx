"use client";
import React, { useEffect, useState } from "react";

const FitnessAI = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false); // New state for closing animation

  // Open Modal
  const openModal = () => {
    setIsModalOpen(true);
    setIsClosing(false);
  };

  // Close Modal with animation
  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsClosing(false);
    }, 500); // Delay should match the animation duration
  };

  // Toggle Modal
  const toggleModal = () => {
    if (isModalOpen) {
      closeModal();
    } else {
      openModal();
    }
  };

  // Close when clicking outside
  const handleClickOutside = (event) => {
    if (event.target.id === "modal-overlay") {
      closeModal();
    }
  };

  // Disable scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  return (
    <div className="relative min-h-screen bg-black text-white flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center mt-4"
        style={{ backgroundImage: `url('/w1.jpg')` }}
      ></div>

      {/* Content Overlay */}
      <div className="relative z-10 top-40 text-center p-6 flex flex-col items-center">
        <h1 className="text-7xl md:text-8xl font-bold mb-6 leading-tight font-poppins">
          Fitness Meet Gymiee.
        </h1>
        <p className="text-lg md:text-xl max-w-4xl text-center mb-8">
          Achieve your fitness goals with Gymiee where calorie tracking is made easy, workout plans, habits, reminders, and more...
        </p>
      </div>

      {/* Navigation */}
      <div className="absolute top-6 left-6">
        <button className="text-white px-10 py-4 font-semibold rounded-full shadow hover:bg-gray-600 transition">
          About
        </button>
      </div>
      <div className="absolute top-6 right-6" onClick={toggleModal}>
        <button className="text-white font-semibold px-6 py-4 rounded-full shadow hover:bg-gray-600 transition">
          Main Menu
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          id="modal-overlay"
          className="fixed inset-0 flex justify-center md:items-center items-end bg-black bg-opacity-50 z-50"
          onClick={handleClickOutside}
        >
          <div
            className={`w-full max-w-lg ${
              isClosing ? "md:animate-jump-out " : "md:animate-jump-in  animate-flip-up"
            } md:animate-ease-in-out bg-white rounded-t-3xl md:rounded-3xl p-6 pt-2`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex justify-center pb-7" onClick={closeModal}>
              <div className="w-12 h-2 border bg-gymie-secondary rounded-3xl"></div>
            </div>
            <h2 className="text-4xl font-semibold text-black text-center">@gymiee</h2>
            <p className="mt-4 text-center text-xl text-black py-3 px-10 rounded-full bg-[#C2FFC7]  hover:scale-95 cursor-pointer font-medium hover:bg-[#FCFFC1]">
              Login & Register
            </p>
            <p className="mt-4 text-center text-xl font-medium text-black py-3 px-10 rounded-full bg-[#C2FFC7] hover:scale-95 cursor-pointer hover:bg-[#FCFFC1]">
              What Gymiee Serves
            </p>
            <p className="mt-4 text-center text-xl text-black py-3 px-10 rounded-full bg-[#C2FFC7] hover:scale-95 cursor-pointer font-medium hover:bg-[#FCFFC1]">
              About Gymiee
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FitnessAI;
