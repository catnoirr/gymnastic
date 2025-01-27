"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginPage from "@/app/login/page";
import Signup from "@/app/signup/page"
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast"

const FitnessAI = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeForm, setActiveForm] = useState("menu");
  const router = useRouter();

  const handleDownload = (platform) => {
    const fileName = platform === 'android' ? 'gymiee.apk' : 'Gymiee Setup 1.0.0.exe';
    const link = document.createElement('a');
    link.href = `/${fileName}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast(
      <div className="flex items-center gap-2">
        {platform === 'android' ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.85 1.23 12.95 1 12 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C6.97 3.26 6 5.01 6 7h12c0-1.99-.97-3.75-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z"/>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
          </svg>
        )}
        <span>Downloading {platform === 'android' ? 'Android' : 'Windows'} app...</span>
      </div>,
      {
        duration: 3000,
        style: {
          background: '#4CAF50',
          color: 'white',
        },
      }
    );
  };

  const openModal = () => {
    setIsModalOpen(true);
    setActiveForm("menu");
  };

  const handleAuthClick = (authType) => {
    if (authType === "auth") {
      toast.success("Welcome to Gymiee", {
        duration: 1500,
        position: 'top-center',
      });
      router.push("/auth");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setActiveForm("menu");
  };

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] flex flex-col overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[1000px] h-[1000px] rounded-full bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-red-500/10 blur-3xl -top-[40%] -right-[20%]" />
        <div className="absolute w-[1000px] h-[1000px] rounded-full bg-gradient-to-br from-blue-500/10 via-emerald-500/5 to-purple-500/10 blur-3xl -bottom-[40%] -left-[20%]" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex-1 flex items-center py-16 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Column - Text Content */}
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-left space-y-10"
            >
              <div className="space-y-6">
                <h2 className="text-6xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                    Fitness Meet
                  </span>
                  <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500">
                    Gymiee
                  </span>
                </h2>
                <p className="text-lg sm:text-xl text-gray-400 max-w-xl">
                  Transform your fitness journey with AI-powered guidance, personalized workouts, and smart habit tracking.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pb-8">
                <button 
                  onClick={() => handleAuthClick("auth")}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white font-medium text-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all hover:-translate-y-0.5"
                >
                  Get Started Free
                </button>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleDownload('android')}
                    className="flex-1 sm:flex-none px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all hover:-translate-y-0.5"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.85 1.23 12.95 1 12 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C6.97 3.26 6 5.01 6 7h12c0-1.99-.97-3.75-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z"/>
                      </svg>
                      Android
                    </span>
                  </button>
                  <button
                    onClick={() => handleDownload('windows')}
                    className="flex-1 sm:flex-none px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all hover:-translate-y-0.5"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
                      </svg>
                      Windows
                    </span>
                  </button>
                </div>
              </div>

              {/* Features List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="group relative p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors duration-300">Smart Analytics</h3>
                      <p className="text-gray-400 text-sm mt-1">Track progress with AI-powered insights and detailed performance metrics</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="group relative p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors duration-300">Workout Plans</h3>
                      <p className="text-gray-400 text-sm mt-1">Personalized routines that adapt to your progress and goals</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="group relative p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-pink-400 transition-colors duration-300">Habit Building</h3>
                      <p className="text-gray-400 text-sm mt-1">Smart reminders and streak tracking to keep you motivated</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="group relative p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors duration-300">Real-time Guidance</h3>
                      <p className="text-gray-400 text-sm mt-1">AI-powered form correction and real-time feedback</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Column - Image/Visual */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative lg:h-[600px] hidden lg:block"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-transparent rounded-3xl" />
              <div className="absolute inset-0 backdrop-blur-3xl rounded-3xl overflow-hidden flex items-center justify-center p-12">
                <motion.svg 
                  viewBox="0 0 400 400" 
                  className="w-full h-full" 
                  xmlns="http://www.w3.org/2000/svg"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1 }}
                >
                  {/* Background Circle */}
                  <motion.circle 
                    cx="200" 
                    cy="200" 
                    r="180" 
                    className="fill-purple-500/10"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                  
                  {/* Dumbbell Icon */}
                  <motion.g 
                    className="transform translate-x-[125px] translate-y-[150px]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  >
                    <rect x="0" y="20" width="150" height="10" rx="5" className="fill-white/80" />
                    <circle cx="30" cy="25" r="25" className="fill-purple-500/80" />
                    <circle cx="120" cy="25" r="25" className="fill-purple-500/80" />
                    
                    {/* Pulse Effects */}
                    <motion.circle
                      cx="30"
                      cy="25"
                      r="25"
                      className="stroke-purple-500/40"
                      fill="none"
                      strokeWidth="2"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0, 0.3]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <motion.circle
                      cx="120"
                      cy="25"
                      r="25"
                      className="stroke-purple-500/40"
                      fill="none"
                      strokeWidth="2"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0, 0.3]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5
                      }}
                    />
                  </motion.g>

                  {/* Curved Lines */}
                  <motion.path 
                    d="M100,200 C100,100 300,300 300,200" 
                        stroke="#8B5CF6" 
                    strokeWidth="4"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 0.8 }}
                  />
                  <motion.path 
                    d="M100,150 C100,50 300,250 300,150" 
                        stroke="#EC4899" 
                    strokeWidth="4"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 1 }}
                  />
                  <motion.path 
                    d="M100,250 C100,150 300,350 300,250" 
                        stroke="#10B981" 
                    strokeWidth="4"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 1.2 }}
                  />

                  {/* Floating Circles */}
                  <motion.circle 
                    cx="150" 
                    cy="150" 
                    r="8" 
                    className="fill-purple-500/80"
                    animate={{
                      y: [-10, 10, -10],
                      scale: [1, 1.2, 1],
                      opacity: [0.6, 1, 0.6]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <motion.circle 
                    cx="250" 
                    cy="150" 
                    r="8" 
                    className="fill-pink-500/80"
                    animate={{
                      y: [-10, 10, -10],
                      scale: [1, 1.2, 1],
                      opacity: [0.6, 1, 0.6]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1
                    }}
                  />
                  <motion.circle 
                    cx="200" 
                    cy="250" 
                    r="8" 
                    className="fill-emerald-500/80"
                    animate={{
                      y: [-10, 10, -10],
                      scale: [1, 1.2, 1],
                      opacity: [0.6, 1, 0.6]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 2
                    }}
                  />
                </motion.svg>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            id="modal-overlay"
            className="fixed inset-0 flex md:justify-center md:items-center items-end bg-black/70 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="w-full max-w-lg bg-black/50 backdrop-blur-xl border border-white/10 shadow-2xl rounded-t-3xl md:rounded-3xl p-8"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 100 }}
              onDragEnd={(event, info) => {
                if (info.point.y > 500) {
                  closeModal();
                }
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Dynamic Content Rendering */}
              {activeForm === "menu" && (
                <div className="space-y-6">
                  <h2 className="text-5xl font-bold text-white text-center mb-10">@gymiee</h2>
                  <div className="space-y-4">
                    <button
                      className="w-full text-center text-xl font-medium text-black py-4 px-10 rounded-2xl bg-gradient-to-r from-[#C2FFC7] to-[#A8FFB0] hover:opacity-90 transition-all duration-300 cursor-pointer md:hidden"
                      onClick={() => setActiveForm("login")}
                    >
                      Existing user -- Login
                    </button>
                    <button
                      className="w-full text-center text-xl font-medium text-black py-4 px-10 rounded-2xl bg-gradient-to-r from-[#C2FFC7] to-[#A8FFB0] hover:opacity-90 transition-all duration-300 cursor-pointer hidden md:block"
                      onClick={() => handleAuthClick("login")}
                    >
                      Login
                    </button>
                    <button
                      className="w-full text-center text-xl font-medium text-black py-4 px-10 rounded-2xl bg-gradient-to-r from-[#C2FFC7] to-[#A8FFB0] hover:opacity-90 transition-all duration-300 cursor-pointer md:hidden"
                      onClick={() => setActiveForm("signup")}
                    >
                      New user -- Sign Up
                    </button>
                    <button
                      className="w-full text-center text-xl font-medium text-black py-4 px-10 rounded-2xl bg-gradient-to-r from-[#C2FFC7] to-[#A8FFB0] hover:opacity-90 transition-all duration-300 cursor-pointer hidden md:block"
                      onClick={() => handleAuthClick("signup")}
                    >
                      Sign Up
                    </button>
                    <button 
                      className="w-full text-center text-xl font-medium text-black py-4 px-10 rounded-2xl bg-gradient-to-r from-[#C2FFC7] to-[#A8FFB0] hover:opacity-90 transition-all duration-300"
                    >
                      What Gymiee Serves
                    </button>
                  </div>
                </div>
              )}

              {activeForm === "login" && (
                <div className="py-4">
                  <LoginPage setActiveForm={setActiveForm} />
                </div>
              )}

              {activeForm === "signup" && (
                <div className="py-4">
                  <Signup activeForm={activeForm} setActiveForm={setActiveForm} />
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
