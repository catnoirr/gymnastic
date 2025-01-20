"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginPage from "@/app/login/page";
import Signup from "@/app/signup/page"
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast"

const FitnessAI = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeForm, setActiveForm] = useState("menu"); // 'menu', 'login', 'signup'
  const router = useRouter();
  // Open modal and reset to the main menu
  const openModal = () => {
    setIsModalOpen(true);
    setActiveForm("menu");
  };

  const handleAuthClick = (authType) => {
    if (authType === "login") {
      toast("Login to Gymiee",{
        duration:1500,
      });
      
      router.push("/login"); // Redirect to Login page
    } else if (authType === "signup") {
      toast("Register at Gymiee",{
        duration:1500,
      });
      router.push("/signup"); // Redirect to Sign Up page
    }
  };

  // Close modal and reset form view
  const closeModal = () => {
    setIsModalOpen(false);
    setActiveForm("menu");
  };

  // Disable scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  return (
    <div className="relative min-h-screen bg-black  flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center mt-4"
        style={{ backgroundImage: `url('/w1.jpg')` }}
      ></div>

      {/* Content */}
      <div className="relative z-10 top-40 text-center p-6 flex flex-col items-center">
        <h1 className="text-7xl md:text-8xl font-bold text-white mb-6 leading-tight font-poppins">
          Fitness Meet Gymiee.
        </h1>
        <p className="text-lg md:text-xl max-w-4xl text-white text-center mb-8">
          Achieve your fitness goals with Gymiee where calorie tracking is made
          easy, workout plans, habits, reminders, and more...
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
            className="fixed inset-0 flex md:justify-center  md:items-center items-end bg-black bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal} // Close on overlay click
          >
            <motion.div
              className="w-full max-w-lg     bg-white/20  backdrop-blur-md  border-white/30  shadow-lg rounded-t-3xl md:rounded-3xl p-6 pt-2"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 100 }}
              onDragEnd={(event, info) => {
                if (info.point.y > 500) {
                  closeModal(); // Close when dragged down
                }
              }}
              onClick={(e) => e.stopPropagation()} // Prevent modal click from closing
            >
              {/* <div className="w-full flex justify-center pb-4">
                <div className="w-12 h-2 bg-gray-400 rounded-3xl"></div>
              </div> */}

              {/* Dynamic Content Rendering */}
              {activeForm === "menu" && (
                <div>
                  <h2 className="text-4xl font-semibold text-white text-center">
                    @gymiee
                  </h2>
                  <p
                    className="mt-4 text-center text-xl text-black py-2 px-10 rounded-full bg-[#C2FFC7] cursor-pointer md:hidden "
                    onClick={() => setActiveForm("login")} // Open Login Form
                  >
                    Existing user -- Login
                  </p>
                  <p
                    className="mt-4 text-center text-xl text-black py-2 px-10 rounded-full bg-[#C2FFC7] cursor-pointer hidden md:block"
                    onClick={() =>  handleAuthClick("login")} // Open Login Form
                  >
                    Login
                  </p>
                  <p
                    className="mt-4 text-center text-xl text-black py-2 px-10 rounded-full bg-[#C2FFC7] cursor-pointer md:hidden"
                    onClick={() => setActiveForm("signup")} // Open Sign Up Form
                  >
                    New user -- Sign Up
                  </p>
                  <p
                    className="mt-4 text-center text-xl text-black py-2 px-10 rounded-full bg-[#C2FFC7] cursor-pointer hidden md:block"
                    onClick={() =>  handleAuthClick("signup")} // Open Sign Up Form
                  >
                    Sign Up
                  </p>
                  <p className="mt-4 text-center text-xl text-black py-2 px-10 rounded-full bg-[#C2FFC7]">
                    What Gymiee Serves
                  </p>
                </div>
              )}

              {activeForm === "login" && (
                <div className="py-4" >
                  <LoginPage setActiveForm={setActiveForm} />
                </div>
              )}

              {activeForm === "signup" && (
                <div className="py-4">
                 <Signup activeForm={activeForm} setActiveForm={setActiveForm}/>
                 
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
