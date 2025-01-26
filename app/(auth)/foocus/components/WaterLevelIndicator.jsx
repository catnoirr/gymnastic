"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db, auth } from '@/lib/firebase';
import { doc, getDoc, updateDoc, onSnapshot, arrayUnion } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { FiPlus, FiMinus, FiSettings } from 'react-icons/fi';
import { IoWater } from 'react-icons/io5';
import { BsDropletFill } from 'react-icons/bs';
import WaterGoalDrawer from './WaterGoalDrawer';

const WaterLevelIndicator = () => {
  const [userId, setUserId] = useState(null);
  const [waterStats, setWaterStats] = useState({
    currentLevel: 0,
    targetLevel: 8,
    unit: 'glasses',
    date: new Date().toISOString().split('T')[0]
  });
  const [waterHistory, setWaterHistory] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Check for day change and reset
  useEffect(() => {
    if (!userId) return;

    const checkDayChange = async () => {
      const today = new Date().toISOString().split('T')[0];
      
      if (waterStats.date !== today) {
        const userRef = doc(db, 'users', userId);
        
        try {
          // Save yesterday's stats to history if it exists
          if (waterStats.date) {
            await updateDoc(userRef, {
              waterHistory: arrayUnion({
                date: waterStats.date,
                currentLevel: waterStats.currentLevel,
                targetLevel: waterStats.targetLevel
              })
            });
          }

          // Reset for new day
          const newStats = {
            currentLevel: 0,
            targetLevel: waterStats.targetLevel,
            unit: waterStats.unit,
            date: today
          };
          
          await updateDoc(userRef, { waterStats: newStats });
          setWaterStats(newStats);
        } catch (error) {
          console.error('Error resetting water stats:', error);
        }
      }
    };

    // Check immediately when component mounts
    checkDayChange();

    // Set up interval to check for day change
    const interval = setInterval(checkDayChange, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [userId, waterStats]);

  // Water stats and history listener
  useEffect(() => {
    if (!userId) {
      setIsLoading(true);
      return;
    }

    const userRef = doc(db, 'users', userId);
    const today = new Date().toISOString().split('T')[0];

    const unsubscribe = onSnapshot(userRef, async (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        
        if (!userData.waterStats || userData.waterStats.date !== today) {
          // Initialize new day's stats
          const newStats = {
            currentLevel: 0,
            targetLevel: userData.waterStats?.targetLevel || 8,
            unit: 'glasses',
            date: today
          };
          await updateDoc(userRef, { waterStats: newStats });
          setWaterStats(newStats);
        } else {
          setWaterStats(userData.waterStats);
        }

        // Set history
        setWaterHistory(userData.waterHistory || []);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const updateWaterLevel = async (increment) => {
    if (!userId) return;
    setIsAnimating(true);

    const userRef = doc(db, 'users', userId);
    const newLevel = Math.max(0, waterStats.currentLevel + increment);
    
    try {
      await updateDoc(userRef, {
        'waterStats.currentLevel': newLevel
      });

      // Show celebration when target is reached
      if (newLevel === waterStats.targetLevel) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }

      setTimeout(() => setIsAnimating(false), 500);
    } catch (error) {
      console.error('Error updating water level:', error);
      setIsAnimating(false);
    }
  };

  const updateWaterGoal = async (newGoal) => {
    if (!userId || newGoal < 1) return;
    
    const userRef = doc(db, 'users', userId);
    try {
      await updateDoc(userRef, {
        'waterStats.targetLevel': newGoal
      });
      setIsDrawerOpen(false);
    } catch (error) {
      console.error('Error updating water goal:', error);
    }
  };

  const percentage = Math.min((waterStats.currentLevel / waterStats.targetLevel) * 100, 100);
  const getProgressColor = () => {
    if (percentage < 30) return 'from-red-400 to-red-500';
    if (percentage < 70) return 'from-yellow-400 to-orange-400';
    return 'from-green-400 to-emerald-500';
  };

  const getDropletIcon = (index) => {
    if (waterStats.currentLevel > index) return BsDropletFill;
    if (waterStats.currentLevel === index) return BsDropletFill;
    return BsDropletFill;
  };

  const getDropletColor = (index) => {
    if (waterStats.currentLevel > index) return 'text-blue-500';
    if (waterStats.currentLevel === index) return 'text-blue-500';
    return 'text-gray-300';
  };

  if (isLoading) {
    return (
      <div className="relative w-full sm:max-w-[280px] p-6 bg-white backdrop-blur-xl rounded-[24px] shadow-sm overflow-hidden">
        <div className="relative space-y-5">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gray-200 animate-pulse" />
              <div>
                <div className="w-24 h-5 bg-gray-200 rounded animate-pulse" />
                <div className="w-20 h-4 bg-gray-200 rounded mt-1 animate-pulse" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-12 h-6 bg-gray-200 rounded-full animate-pulse" />
              <div className="w-8 h-8 bg-gray-200 rounded-xl animate-pulse" />
            </div>
          </div>

          {/* Circle Skeleton */}
          <div className="flex justify-center">
            <div className="relative w-48 h-48 sm:w-40 sm:h-40 rounded-full bg-gray-200 animate-pulse">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="space-y-2 text-center">
                  <div className="w-12 h-8 bg-gray-300 rounded mx-auto" />
                  <div className="w-20 h-4 bg-gray-300 rounded mx-auto" />
                </div>
              </div>
            </div>
          </div>

          {/* Controls Skeleton */}
          <div className="flex justify-center gap-20 mt-4">
            <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
            <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative w-full sm:max-w-[280px] p-6 bg-white backdrop-blur-xl rounded-[24px] shadow-sm overflow-hidden">
        {/* Subtle Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-white pointer-events-none" />

        {/* Minimalist Celebration Animation */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center z-50 bg-white/90 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex flex-col items-center"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <BsDropletFill className="w-12 h-12 text-blue-500/90" />
                </motion.div>
                <p className="mt-3 text-base font-light text-gray-800">Goal Achieved</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div 
                className="bg-blue-500/10 p-2 rounded-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <IoWater className="w-4 h-4 text-blue-500" />
              </motion.div>
              <div>
                <h2 className="text-base font-medium text-gray-800">Water Intake</h2>
                <p className="text-xs text-gray-400">Today's Progress</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <motion.div 
                className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {Math.round(percentage)}%
              </motion.div>
              
              <motion.button
                onClick={() => setIsDrawerOpen(true)}
                className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:bg-gray-100"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiSettings className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          {/* Main Water Display - Circular */}
          <div className="flex justify-center">
            <div className="relative w-48 h-48 sm:w-40 sm:h-40 bg-gradient-to-b from-blue-50/50 to-blue-100/50 rounded-full overflow-hidden">
              {/* Minimal Water Effect */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-blue-500/20 backdrop-blur-sm"
                initial={{ height: '0%' }}
                animate={{ 
                  height: `${percentage}%`,
                  y: isAnimating ? [0, -3, 3, 0] : 0
                }}
                transition={{ 
                  height: { duration: 0.8, ease: "easeOut" },
                  y: { duration: 0.5, ease: "easeInOut" }
                }}
              >
                <div className="absolute inset-0 opacity-50">
                  <div className="absolute inset-0 animate-wave-slow" 
                    style={{
                      backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-.2-31.6z' fill='%23FFFFFF'/%3E%3C/svg%3E\")",
                      backgroundRepeat: "repeat-x",
                      backgroundPosition: "center bottom",
                      backgroundSize: "50% auto",
                    }}
                  />
                </div>
              </motion.div>

              {/* Central Counter */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  animate={{ scale: isAnimating ? [1, 1.05, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <span className="text-4xl font-light text-gray-800">
                    {waterStats.currentLevel}
                  </span>
                  <div className="mt-0.5 text-xs text-gray-500 font-light">
                    of {waterStats.targetLevel} {waterStats.unit}
                  </div>
                </motion.div>
              </div>

              {/* Circular Progress Indicators */}
              <div className="absolute inset-0">
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-1.5">
                  {[...Array(waterStats.targetLevel)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className={`w-0.5 h-2 rounded-full transition-all duration-300 ${
                        i < waterStats.currentLevel 
                          ? 'bg-blue-500/40' 
                          : 'bg-blue-200/40'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-20 mt-4">
            <motion.button
              onClick={() => updateWaterLevel(-1)}
              className={`p-2.5 rounded-lg transition-all ${
                waterStats.currentLevel <= 0 
                  ? 'bg-gray-50 text-gray-300' 
                  : 'bg-blue-50 text-blue-500 hover:bg-blue-100'
              }`}
              whileHover={{ scale: waterStats.currentLevel <= 0 ? 1 : 1.02 }}
              whileTap={{ scale: waterStats.currentLevel <= 0 ? 1 : 0.98 }}
              disabled={waterStats.currentLevel <= 0}
            >
              <FiMinus className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              onClick={() => updateWaterLevel(1)}
              className={`p-2.5 rounded-lg transition-all ${
                waterStats.currentLevel >= waterStats.targetLevel 
                  ? 'bg-gray-50 text-gray-300' 
                  : 'bg-blue-50 text-blue-500 hover:bg-blue-100'
              }`}
              whileHover={{ scale: waterStats.currentLevel >= waterStats.targetLevel ? 1 : 1.02 }}
              whileTap={{ scale: waterStats.currentLevel >= waterStats.targetLevel ? 1 : 0.98 }}
              disabled={waterStats.currentLevel >= waterStats.targetLevel}
            >
              <FiPlus className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>

      <WaterGoalDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        currentGoal={waterStats.targetLevel}
        onUpdateGoal={updateWaterGoal}
        waterHistory={[...waterHistory, {
          date: waterStats.date,
          currentLevel: waterStats.currentLevel,
          targetLevel: waterStats.targetLevel
        }]}
      />

      <style jsx>{`
        @keyframes wave {
          0% { background-position-x: 0; }
          100% { background-position-x: 200%; }
        }
        .animate-wave-slow {
          animation: wave 15s linear infinite;
        }
      `}</style>
    </>
  );
};

export default WaterLevelIndicator; 