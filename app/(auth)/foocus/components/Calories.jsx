"use client";

import { useState, useEffect } from "react";
import { FiEdit, FiPlus, FiRefreshCw } from "react-icons/fi";
import { IoNutrition } from "react-icons/io5";
import { db, auth } from '@/lib/firebase';
import { doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import BottomDrawer from "../../workout/components/BottomDrawer";

const CaloriesSkeleton = () => (
  <div className="bg-white rounded-3xl shadow-md p-6 relative overflow-hidden animate-pulse">
    {/* Background Gradients */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute -right-32 -top-32 w-96 h-96 bg-gray-50/50 rounded-full blur-3xl"></div>
      <div className="absolute -left-32 -bottom-32 w-96 h-96 bg-gray-50/50 rounded-full blur-3xl"></div>
    </div>

    {/* Header Section */}
    <div className="relative flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="bg-gray-200 p-2.5 rounded-xl w-11 h-11"></div>
        <div>
          <div className="h-6 w-32 bg-gray-200 rounded-md"></div>
          <div className="h-4 w-24 bg-gray-200 rounded-md mt-2"></div>
        </div>
      </div>
      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
    </div>

    {/* Main Content */}
    <div className="relative flex items-center justify-between">
      {/* Stats Section */}
      <div className="flex flex-col gap-4">
        <div className="space-y-1">
          <div className="h-4 w-16 bg-gray-200 rounded-md"></div>
          <div className="h-8 w-28 bg-gray-200 rounded-md mt-2"></div>
        </div>

        <div className="space-y-1">
          <div className="h-4 w-16 bg-gray-200 rounded-md"></div>
          <div className="h-8 w-28 bg-gray-200 rounded-md mt-2"></div>
        </div>

        <div className="mt-2">
          <div className="h-8 w-36 bg-gray-200 rounded-lg"></div>
        </div>
      </div>

      {/* Progress Ring Skeleton */}
      <div className="relative w-48 h-48">
        <div className="w-full h-full rounded-full border-[12px] border-gray-100"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="h-4 w-16 bg-gray-200 rounded-md mx-auto mb-2"></div>
            <div className="h-8 w-20 bg-gray-200 rounded-md mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Calories = () => {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dailyStats, setDailyStats] = useState({
    targetCalories: 3000,
    consumedCalories: 0,
    date: new Date().toISOString().split('T')[0],
    isTargetReached: false
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [newTarget, setNewTarget] = useState("");

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
      setLoading(true); // Reset loading when auth state changes
    });

    return () => unsubscribe();
  }, []);

  // Daily stats listener
  useEffect(() => {
    if (!userId) return;

    const userRef = doc(db, 'users', userId);
    const today = new Date().toISOString().split('T')[0];

    const unsubscribe = onSnapshot(userRef, async (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        
        // Calculate total calories from completed meals today
        const completedMeals = (userData.diet || []).filter(meal => 
          meal.completed && meal.completedDate === today
        );
        const totalConsumed = completedMeals.reduce((sum, meal) => {
          return sum + (parseInt(meal.totalCalories) || 0);
        }, 0);

        // Check if target is newly reached
        const targetReached = totalConsumed >= (userData.dailyStats?.targetCalories || 3000);
        
        // If it's a new day, initialize new daily stats
        if (!userData.dailyStats || userData.dailyStats.date !== today) {
          const newStats = {
            targetCalories: userData.dailyStats?.targetCalories || 3000,
            consumedCalories: totalConsumed,
            date: today,
            isTargetReached: targetReached
          };
          
          await updateDoc(userRef, {
            dailyStats: newStats
          });
          
          setDailyStats(newStats);
        } else {
          // Update existing stats
          const updatedStats = {
            ...userData.dailyStats,
            consumedCalories: totalConsumed,
            isTargetReached: targetReached
          };
          
          await updateDoc(userRef, {
            dailyStats: updatedStats
          });
          
          setDailyStats(updatedStats);
        }
        setLoading(false); // Set loading to false when data is ready
      }
    });

    return () => unsubscribe();
  }, [userId]);

  if (loading) {
    return <CaloriesSkeleton />;
  }

  // Calculate percentage and ring properties
  const percentage = (dailyStats.consumedCalories / dailyStats.targetCalories) * 100;
  const radius = 65;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Calculate bubble position with responsive radius
  const calculateBubblePosition = () => {
    const angleRange = 270;
    const angle = (-100 + (percentage * angleRange) / 100) * (Math.PI / 180);
    
    // Make bubbleRadius responsive relative to the progress ring radius
    const bubbleRadius = radius * 1.23; // Slightly larger than the progress ring
    const x = 96 + bubbleRadius * Math.cos(angle);
    const y = 96 + bubbleRadius * Math.sin(angle);

    return { x, y };
  };

  const bubblePosition = calculateBubblePosition();

  const handleChangeGoal = async () => {
    if (!userId || !newTarget) return;
    
    const targetValue = Number(newTarget);
    if (!isNaN(targetValue) && targetValue > 0) {
      const userRef = doc(db, 'users', userId);
      try {
        await updateDoc(userRef, {
          'dailyStats.targetCalories': targetValue
        });
        setIsDrawerOpen(false);
        setNewTarget("");
      } catch (error) {
        console.error('Error updating calorie goal:', error);
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-md p-6 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -right-32 -top-32 w-96 h-96 bg-green-50/50 rounded-full blur-3xl"></div>
        <div className="absolute -left-32 -bottom-32 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl"></div>
      </div>

      {/* Header Section */}
      <div className="relative flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-2.5 rounded-xl shadow-lg">
            <IoNutrition className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Daily Calories</h2>
            <p className="text-sm text-gray-500">Track your intake</p>
          </div>
        </div>
        <svg className="w-12 h-12 text-gray-400" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Plate */}
          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2" fill="none"/>
          
          {/* Fork and knife */}
          <path d="M18,12 L18,36 M16,12 L16,20 M20,12 L20,20" 
            stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M30,12 C34,12 34,20 30,20 L30,36" 
            stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            
          {/* Steam lines */}
          <path d="M22,10 C22,8 24,8 24,10 M24,8 C24,6 26,6 26,8 M26,10 C26,8 28,8 28,10"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative flex items-center justify-between">
        {/* Stats Section */}
        <div className="flex flex-col gap-4 ">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Current</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-gray-800">
                {dailyStats.consumedCalories}
              </span>
              <span className="text-sm text-gray-500">kcal</span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-gray-500">Target</p>
            <div className="flex items-center gap-3">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-800">
                  {dailyStats.targetCalories}
                </span>
                <span className="text-sm text-gray-500">kcal</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setNewTarget(dailyStats.targetCalories.toString());
                    setIsDrawerOpen(true);
                  }}
                  className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                  title="Edit target calories"
                >
                  <FiPlus className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          </div>

          {/* Progress Status */}
          <div className="mt-2">
            {dailyStats.isTargetReached ? (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium">Target Reached!</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-sm font-medium">
                  {Math.max(dailyStats.targetCalories - dailyStats.consumedCalories, 0)} kcal remaining
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Ring */}
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-[100deg]">
            {/* Background circle */}
            <circle
              cx="96"
              cy="96"
              r={radius}
              className="stroke-gray-100"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${circumference * 0.75} ${circumference}`}
            />
            {/* Progress circle */}
            <circle
              cx="96"
              cy="96"
              r={radius}
              className={`${
                dailyStats.isTargetReached 
                  ? 'stroke-green-400' 
                  : 'stroke-blue-400'
              }`}
              strokeWidth="12"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={`${circumference * 0.75} ${circumference}`}
              style={{
                strokeDashoffset: strokeDashoffset,
                transition: "stroke-dashoffset 0.5s ease",
              }}
            />
          </svg>

          {/* Bubble Indicator */}
          <div 
            className="absolute transition-all duration-500 scale-90 sm:scale-100"
            style={{
              left: `${bubblePosition.x}px`,
              top: `${bubblePosition.y}px`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="relative">
              <div className={`
                relative group flex items-center gap-1.5 sm:gap-2 
                px-3 sm:px-4 py-1.5 sm:py-2 rounded-full
                shadow-lg border backdrop-blur-[2px]
                ${dailyStats.isTargetReached 
                  ? 'bg-green-50/90 border-green-200 text-green-600'
                  : 'bg-blue-50/90 border-blue-200 text-blue-600'
                }
              `}>
                <div className={`
                  h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full
                  ${dailyStats.isTargetReached 
                    ? 'bg-green-500 animate-pulse'
                    : 'bg-blue-500'
                  }
                `}/>
                <span className="text-xs sm:text-sm font-semibold whitespace-nowrap flex items-baseline gap-0.5 sm:gap-1">
                  {dailyStats.isTargetReached ? (
                    'Target Reached!'
                  ) : (
                    <>
                      <span>
                        {Math.round(100 - (dailyStats.consumedCalories / dailyStats.targetCalories * 100))}%
                      </span>
                      <span className="text-[10px] sm:text-xs opacity-75">remaining</span>
                    </>
                  )}
                </span>
                
                {/* Pointer */}
                <div className={`
                  absolute left-1/2 -bottom-1 sm:-bottom-1.5 -translate-x-1/2
                  w-2 sm:w-3 h-2 sm:h-3 rotate-45
                  border-r border-b
                  ${dailyStats.isTargetReached 
                    ? 'bg-green-50/90 border-green-200'
                    : 'bg-blue-50/90 border-blue-200'
                  }
                `}/>
              </div>

              {/* Glow effect when target reached */}
              {dailyStats.isTargetReached && (
                <div className="absolute inset-0 -m-0.5 rounded-full animate-pulse-slow">
                  <div className="absolute inset-0 rounded-full bg-green-300/20 blur-sm"/>
                </div>
              )}
            </div>
          </div>

          {/* Center Text */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-sm font-medium text-gray-500">Progress</div>
            <div className="text-2xl font-bold text-gray-800">
              {Math.round((dailyStats.consumedCalories / dailyStats.targetCalories) * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Drawer for Target Calories */}
      <BottomDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setNewTarget("");
        }}
      >
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Update Calorie Target</h2>
            <p className="text-sm text-gray-500">Set your daily calorie target to track your nutrition goals.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="targetCalories" className="block text-sm font-medium text-gray-700 mb-1">
                Target Calories
              </label>
              <input
                id="targetCalories"
                type="number"
                value={newTarget}
                onChange={(e) => setNewTarget(e.target.value)}
                placeholder="Enter target calories"
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleChangeGoal}
              disabled={!newTarget || isNaN(Number(newTarget)) || Number(newTarget) <= 0}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl font-medium
                hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Update Target
            </button>
          </div>
        </div>
      </BottomDrawer>
    </div>
  );
};

export default Calories;
