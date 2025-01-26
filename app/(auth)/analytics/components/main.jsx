"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IoWaterOutline, IoFitnessOutline, IoScaleOutline, IoTrendingUpOutline } from 'react-icons/io5';
import { GiKnifeFork } from 'react-icons/gi';
import WaterChart from './WaterChart';
import WorkoutChart from './WorkoutChart';
import WeightChart from './WeightChart';
import CalorieChart from './CalorieChart';
import HabitStreaks from './HabitStreaks';
import InsightCard from './InsightCard';
import { db, auth } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const timeRanges = ['1W', '1M', '3M', '6M', '1Y', 'ALL'];

const StatCardSkeleton = () => (
  <div className="bg-white rounded-2xl p-6 shadow-sm relative overflow-hidden">
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
        <div className="h-8 w-16 bg-gray-300 rounded"></div>
      </div>
      <div className="p-3 rounded-xl bg-gray-200">
        <div className="w-6 h-6"></div>
      </div>
    </div>
    <div className="flex items-center gap-1 mt-4">
      <div className="h-4 w-12 bg-gray-200 rounded"></div>
      <div className="h-4 w-24 bg-gray-200 rounded"></div>
    </div>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent skeleton-animation"></div>
  </div>
);

const ChartSkeleton = () => (
  <div className="bg-white rounded-2xl p-6 shadow-sm relative overflow-hidden">
    <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
    <div className="h-[300px] bg-gray-100 rounded-lg"></div>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent skeleton-animation"></div>
  </div>
);

const HabitStreaksSkeleton = () => (
  <div className="bg-white rounded-2xl p-6 shadow-sm relative overflow-hidden">
    <div className="h-6 w-32 bg-gray-200 rounded mb-6"></div>
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center justify-between">
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent skeleton-animation"></div>
  </div>
);

const InsightCardSkeleton = () => (
  <div className="bg-white rounded-2xl p-6 shadow-sm relative overflow-hidden">
    <div className="h-6 w-24 bg-gray-200 rounded mb-6"></div>
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>
      ))}
    </div>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent skeleton-animation"></div>
  </div>
);

export default function Main() {
  const [selectedRange, setSelectedRange] = useState('1M');
  const [isLoading, setIsLoading] = useState(true);
  const [hasNewInsights, setHasNewInsights] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [stats, setStats] = useState({
    water: { completion: 0, trend: 0 },
    workout: { completed: 0, total: 0, trend: 0 },
    weight: { change: 0, trend: 0 },
    calories: { completion: 0, trend: 0 }
  });

  // Add auth state listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setAuthChecked(true);
      if (!user) {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!authChecked) return;
    
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const weightRef = doc(db, 'users', user.uid, 'progress', 'weight');

    const unsubscribers = [];

    // Main user data listener
    unsubscribers.push(
      onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          // Check for new insights
          const lastViewedInsight = localStorage.getItem('lastViewedInsight');
          const latestInsightDate = userData.latestInsightDate;
          if (latestInsightDate && (!lastViewedInsight || new Date(latestInsightDate) > new Date(lastViewedInsight))) {
            setHasNewInsights(true);
          }
          
          const today = new Date().toISOString().split('T')[0];
          const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
          
          // Get dates for the last 30 days
          const dates = Array.from({ length: 30 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return date.toISOString().split('T')[0];
          });

          // Calculate workout stats for last 30 days
          let completedWorkouts = 0;
          let totalWorkouts = 0;

          // Check each of the last 30 days
          dates.forEach(dateStr => {
            // First check workoutHistory
            if (userData.workoutHistory?.[dateStr]?.isCompleted) {
              completedWorkouts++;
              totalWorkouts++;
              return;
            }

            // If not in history, check the day's workouts
            const date = new Date(dateStr);
            const dayName = days[date.getDay()];
            
            if (userData[dayName]?.workouts) {
              const exercises = Object.values(userData[dayName].workouts).flatMap(w => 
                Object.values(w.exercises || {})
              );
              if (exercises.length > 0) {
                totalWorkouts++;
                if (exercises.every(ex => ex.isCompleted)) {
                  completedWorkouts++;
                }
              }
            }
          });

          // Calculate water stats
          const waterHistory = userData.waterHistory || [];
          let waterCompletion = 0;
          let totalDays = 0;

          // Check today's water stats first
          if (userData.waterStats && userData.waterStats.date === today) {
            if (userData.waterStats.currentLevel >= userData.waterStats.targetLevel) {
              waterCompletion += 100;
            }
            totalDays++;
          }

          // Then check history (excluding today if it's in history)
          waterHistory.forEach(day => {
            if (day.date !== today) {
              if (day.currentLevel >= day.targetLevel) {
                waterCompletion += 100;
              }
              totalDays++;
            }
          });

          waterCompletion = totalDays > 0 ? Math.round(waterCompletion / totalDays) : 0;

          // Calculate calorie stats
          const dietData = userData.diet || [];
          const completedMeals = dietData.filter(meal => meal.completed);
          const calorieCompletion = completedMeals.length > 0
            ? Math.round(completedMeals.reduce((sum, meal) => sum + (meal.totalCalories / userData.dailyStats?.targetCalories * 100), 0) / completedMeals.length)
            : 0;

          setStats(prev => ({
            ...prev,
            water: { 
              completion: waterCompletion,
              trend: waterCompletion - (prev.water.completion || 0)
            },
            workout: {
              completed: completedWorkouts,
              total: totalWorkouts,
              trend: completedWorkouts - (prev.workout.completed || 0)
            },
            calories: {
              completion: calorieCompletion,
              trend: calorieCompletion - (prev.calories.completion || 0)
            }
          }));
        }
        setIsLoading(false);
      })
    );

    // Weight data listener
    unsubscribers.push(
      onSnapshot(weightRef, (doc) => {
        if (doc.exists()) {
          const weightData = doc.data();
          const history = weightData.history || [];
          if (history.length >= 2) {
            const sortedHistory = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));
            const latestWeight = sortedHistory[0].weight;
            const previousWeight = sortedHistory[1].weight;
            const change = latestWeight - previousWeight;
            
            setStats(prev => ({
              ...prev,
              weight: {
                change: Math.abs(change).toFixed(1),
                trend: change
              }
            }));
          }
        }
      })
    );

    return () => unsubscribers.forEach(unsubscribe => unsubscribe());
  }, [authChecked]);

  if (!authChecked) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <HabitStreaksSkeleton />
          <div className="lg:col-span-2">
            <InsightCardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (!auth.currentUser) {
    window.location.href = '/login';
    return null;
  }

  return (
    <div className="space-y-6">
      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .skeleton-animation {
          animation: shimmer 2s infinite;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #CBD5E1 transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #CBD5E1;
          border-radius: 20px;
        }
        .hero-gradient {
          background: linear-gradient(
            135deg,
            rgba(96, 165, 250, 0.1) 0%,
            rgba(244, 114, 182, 0.1) 100%
          );
        }
        .text-gradient {
          background: linear-gradient(to right, #3b82f6, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:24px_24px]"></div>
        <div className="absolute h-32 w-full "></div>
        <div className="relative  py-4 md:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-5xl font-bold">
              <span className="text-gradient">PowerTrack</span>
              {/* <span className="text-gray-800"> Pro</span> */}
            </h1>
            <p className="text-gray-600 text-lg mt-2">
              Your complete fitness progress at a glance
            </p>
          </div>

          {/* Quick Stats in Hero */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {[
              {
                title: "Water Goal Completion",
                value: `${stats.water.completion}%`,
                icon: <IoWaterOutline className="w-6 h-6 text-blue-500" />,
                iconBg: "bg-blue-50",
                trend: stats.water.trend,
                suffix: "%"
              },
              {
                title: "Workout Completion",
                value: `${stats.workout.completed}/${stats.workout.total}`,
                icon: <IoFitnessOutline className="w-6 h-6 text-green-500" />,
                iconBg: "bg-green-50",
                trend: stats.workout.trend,
                suffix: ""
              },
              {
                title: "Weight Change",
                value: `${stats.weight.change} kg`,
                icon: <IoScaleOutline className="w-6 h-6 text-purple-500" />,
                iconBg: "bg-purple-50",
                trend: stats.weight.trend,
                suffix: "kg",
                invertTrend: true
              },
              {
                title: "Calorie Target",
                value: `${stats.calories.completion}%`,
                icon: <GiKnifeFork className="w-6 h-6 text-orange-500" />,
                iconBg: "bg-orange-50",
                trend: stats.calories.trend,
                suffix: "%"
              }
            ].map((stat, index) => (
              <div key={stat.title} className="relative">
                {isLoading ? (
                  <StatCardSkeleton />
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-600">{stat.title}</p>
                        <h3 className="text-2xl font-bold mt-1 text-gray-800">{stat.value}</h3>
                      </div>
                      <div className={`p-3 rounded-xl ${stat.iconBg}`}>
                        {stat.icon}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <IoTrendingUpOutline 
                        className={`w-4 h-4 ${
                          (stat.invertTrend ? -stat.trend : stat.trend) >= 0 
                            ? 'text-green-500' 
                            : 'text-red-500'
                        }`} 
                      />
                      <span className={`text-sm ${
                        (stat.invertTrend ? -stat.trend : stat.trend) >= 0 
                          ? 'text-green-500' 
                          : 'text-red-500'
                      }`}>
                        {Math.abs(stat.trend)}{stat.suffix}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">vs last period</span>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[
          {
            title: "Water Intake Progress",
            component: <WaterChart timeRange={selectedRange} />
          },
          {
            title: "Workout Completion",
            component: <WorkoutChart timeRange={selectedRange} />
          },
          {
            title: "Weight Progress",
            component: <WeightChart timeRange={selectedRange} />
          },
          {
            title: "Calorie Tracking",
            component: <CalorieChart timeRange={selectedRange} />
          }
        ].map((chart, index) => (
          <div key={chart.title} className="relative">
            {isLoading ? (
              <ChartSkeleton />
            ) : (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{chart.title}</h3>
                {chart.component}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative min-h-[300px]">
          {isLoading ? (
            <HabitStreaksSkeleton />
          ) : (
            <div className="bg-white rounded-2xl p-6 shadow-sm h-full">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Habit Streaks</h3>
              <div className="h-[calc(100%-40px)]">
                <HabitStreaks />
              </div>
            </div>
          )}
        </div>
        <div className="relative min-h-[300px]">
          {isLoading ? (
            <InsightCardSkeleton />
          ) : (
            <div className="bg-white rounded-2xl p-6 shadow-sm h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">AI Insights</h3>
                {hasNewInsights && (
                  <div className="relative">
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                  </div>
                )}
              </div>
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <InsightCard 
                  hasNewInsights={hasNewInsights}
                  onView={() => {
                    setHasNewInsights(false);
                    localStorage.setItem('lastViewedInsight', new Date().toISOString());
                  }} 
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 