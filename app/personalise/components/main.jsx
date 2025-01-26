"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { auth, db } from '@/lib/firebase';
import { doc, updateDoc, setDoc } from 'firebase/firestore';

export default function PersonaliseForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    gender: "",
    weight: "",
    height: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        console.error('No user found');
        return;
      }

      // Update user profile
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        gender: formData.gender,
        weight: Number(formData.weight),
        height: Number(formData.height),
        isProfileComplete: true,
      });

      // Set initial weight in progress collection
      const weightRef = doc(db, 'users', userId, 'progress', 'weight');
      await setDoc(weightRef, {
        currentWeight: Number(formData.weight),
        startWeight: Number(formData.weight),
        targetWeight: Number(formData.weight), // Set same as current initially
        history: [{
          weight: Number(formData.weight),
          date: new Date().toISOString()
        }],
        updatedAt: new Date().toISOString()
      });

      window.location.href = '/foocus';
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
      {/* Background Illustrations */}
      <div className="absolute inset-0 pointer-events-none">
        {step === 1 && (
          <>
            <img
              src="/images/gender-bg-left.svg"
              alt=""
              className="absolute -left-16 top-1/4 w-64 h-64 opacity-20"
            />
            <img
              src="/images/gender-bg-right.svg"
              alt=""
              className="absolute -right-16 bottom-1/4 w-64 h-64 opacity-20"
            />
          </>
        )}
        {step === 2 && (
          <>
            <img
              src="/images/weight-bg-left.svg"
              alt=""
              className="absolute -left-16 top-1/4 w-64 h-64 opacity-20"
            />
            <img
              src="/images/dumbbell-bg.svg"
              alt=""
              className="absolute -right-16 bottom-1/4 w-64 h-64 opacity-20"
            />
          </>
        )}
        {step === 3 && (
          <>
            <img
              src="/images/height-bg-left.svg"
              alt=""
              className="absolute -left-16 top-1/4 w-64 h-64 opacity-20"
            />
            <img
              src="/images/ruler-bg.svg"
              alt=""
              className="absolute -right-16 bottom-1/4 w-64 h-64 opacity-20"
            />
          </>
        )}
      </div>

      {/* Main Content */}
      <div className=" min-h-screen flex justify-center px-4 py-8 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          {step === 1 && (
            <div className="text-left md:text-center">
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                className="mb-8 sm:mb-12"
              >
                <h2 className="text-5xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Welcome! Let's get started
                </h2>
                <p className="text-gray-600 text-2xl sm:text-xl">
                  Select your gender
                </p>
              </motion.div>

              <div className="flex flex-col md:flex-row  justify-around   md:items-center gap-20 sm:gap-8 md:gap-16 ">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    handleInputChange("gender", "male");
                    handleNext();
                    
                  }}
                  className="group relative "
                >
                  <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-lg opacity-20 group-hover:opacity-30 transition-opacity" />
                  <div className="relative w-40 h-40 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-white shadow-lg flex flex-col items-center justify-center border-2 border-blue-100 hover:border-blue-300 transition-colors">
                    <svg
                      className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span className="text-base sm:text-lg font-medium text-gray-700 mt-2">
                      Male
                    </span>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    handleInputChange("gender", "female");
                    handleNext();
                  }}
                  className="group relative flex justify-end"
                >
                  <div className="absolute inset-0 bg-pink-400/20 rounded-full blur-lg opacity-20 group-hover:opacity-30 transition-opacity" />
                  <div className="relative w-40 h-40 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-white shadow-lg flex flex-col items-center justify-center border-2 border-pink-100 hover:border-pink-300 transition-colors">
                    <svg
                      className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-pink-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span className="text-base sm:text-lg font-medium text-gray-700 mt-2">
                      Female
                    </span>
                  </div>
                </motion.button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="md:text-center">
              <div className="mb-8 sm:mb-10">
                <h2 className="text-5xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  What's your current weight?
                </h2>
                <p className="text-gray-600 text-lg sm:text-xl">
                  This helps us track your progress
                </p>
              </div>

              <div className="mb-8 pt-32 md:py-0">
                <img
                  src="/images/weight-scale.svg"
                  alt="Weight Scale"
                  className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 mx-auto mb-6 sm:mb-8 animate-float"
                />
                <div className="">
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.weight}
                      onChange={(e) =>
                        handleInputChange("weight", e.target.value)
                      }
                      placeholder="Enter weight"
                      className="w-full h-16 sm:h-18 text-center text-2xl sm:text-3xl bg-white border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-0 shadow-sm"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl sm:text-2xl">
                      kg
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-3 sm:gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBack}
                  className="px-12 sm:px-8 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-medium hover:bg-gray-50"
                >
                  Back
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  disabled={!formData.weight}
                  className="px-12 sm:px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:to-blue-700 shadow-md"
                >
                  Next
                </motion.button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="md:text-center">
              <div className="mb-8 sm:mb-10">
                <h2 className="text-5xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  How tall are you?
                </h2>
                <p className="text-gray-600 text-lg sm:text-xl">
                  Your height helps us calculate your BMI
                </p>
              </div>

              <div className="mb-8 pt-32 md:py-0">
                <img
                  src="/images/height-measure.svg"
                  alt="Height Measure"
                  className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 mx-auto mb-6 sm:mb-8 animate-float"
                />
                <div className="">
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.height}
                      onChange={(e) =>
                        handleInputChange("height", e.target.value)
                      }
                      placeholder="Enter height"
                      className="w-full h-16 sm:h-18 text-center text-2xl sm:text-3xl bg-white border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-0 shadow-sm"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl sm:text-2xl">
                      cm
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-3 sm:gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBack}
                  className="px-12 sm:px-8 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-medium hover:bg-gray-50"
                >
                  Back
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={!formData.height}
                  className="px-8 sm:px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:to-blue-700 shadow-md"
                >
                  Complete
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
