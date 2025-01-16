"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Login  from '@/app/login/page'

const FitnessAI = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginFormOpen, setIsLoginFormOpen] = useState(false); // Controls Login Form view
  const [isSignupFormOpen, setIsSignupFormOpen] = useState(false); // Controls Login Form view

  // Open modal and reset to main menu
  const openModal = () => {
    setIsModalOpen(true);
    setIsLoginFormOpen(false); // Reset to main menu
    setIsSignupFormOpen(false);

  };

  // Close modal and reset views
  const closeModal = () => {
    setIsModalOpen(false);
    setIsLoginFormOpen(false);
    setIsSignupFormOpen(false);
  };

  // Disable scrolling when modal is open
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

      {/* Content */}
      <div className="relative z-10 top-40 text-center p-6 flex flex-col items-center">
        <h1 className="text-7xl md:text-8xl font-bold mb-6 leading-tight font-poppins">
          Fitness Meet Gymiee.
        </h1>
        <p className="text-lg md:text-xl max-w-4xl text-center mb-8">
          Achieve your fitness goals with Gymiee where calorie tracking is made easy, workout plans, habits, reminders, and more...
        </p>
      </div>

      {/* Navigation */}
      <div className="absolute top-6 right-6" onClick={openModal}>
        <button className="text-white font-semibold px-6 py-4 rounded-full shadow hover:bg-gray-600 transition">
          Main Menu
        </button>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            id="modal-overlay"
            className="fixed inset-0 flex justify-center md:items-center items-end bg-black bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal} // Close on overlay click
          >
            <motion.div
              className="w-full max-w-lg bg-white rounded-t-3xl md:rounded-3xl p-6 pt-2"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 300 }}
              onDragEnd={(event, info) => {
                if (info.point.y > 100) {
                  closeModal(); // Close when dragged down
                }
              }}
              onClick={(e) => e.stopPropagation()} // Prevent modal click from closing
            >
              <div className="w-full flex justify-center pb-4">
                <div className="w-12 h-2 bg-gray-400 rounded-3xl"></div>
              </div>

              {/* Conditional Rendering */}
              {!isLoginFormOpen ? (
                // Main Menu
                <div>
                  <h2 className="text-4xl font-semibold text-black text-center">@gymiee</h2>
                  <p
                    className="mt-4 text-center text-xl text-black py-2 px-10 rounded-full bg-[#C2FFC7] cursor-pointer"
                    onClick={() => setIsLoginFormOpen(true)} // Open Login Form
                  >
                    Login & Register
                  </p>
                  <p className="mt-4 text-center text-xl text-black py-2 px-10 rounded-full bg-[#C2FFC7]">
                    What Gymiee Serves
                  </p>
                </div>
              )  : (
                // Login Form
                <div>
                  {/* <h2 className="text-3xl font-semibold text-black text-center">
                    Login to Gymiee
                  </h2> */}
                  <div className="mt-6 flex flex-col gap-4">
                    {/* <input
                      type="email"
                      placeholder="Email"
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                    <button
                      type="submit"
                      className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition"
                    >
                      Login
                    </button> */}
                    <Login/>
                    {/* <button
                      type="button"
                      onClick={() => setIsLoginFormOpen(false)} // Back to Main Menu
                      className="w-full bg-gray-300 text-black py-3 rounded-lg hover:bg-gray-400 transition"
                    >
                      Back
                    </button> */}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FitnessAI;
