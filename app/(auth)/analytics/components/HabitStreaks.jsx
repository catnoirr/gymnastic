"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IoWaterOutline, IoFitnessOutline, IoScaleOutline } from 'react-icons/io5';
import { GiKnifeFork } from 'react-icons/gi';
import { db, auth } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const HabitStreaks = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const weightRef = doc(db, 'users', user.uid, 'progress', 'weight');

    // Set up multiple listeners
    const unsubscribers = [];

    // Main user data listener (for water, workouts, calories)
    unsubscribers.push(
      onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          const processedHabits = processHabitData(userData);
          setHabits(processedHabits);
        }
        setLoading(false);
      })
    );

    // Weight data listener
    unsubscribers.push(
      onSnapshot(weightRef, (doc) => {
        if (doc.exists()) {
          const weightData = doc.data();
          setHabits(prev => {
            const weightHabit = {
              name: 'Weight Tracking',
              icon: IoScaleOutline,
              color: 'purple',
              streak: calculateWeightStreak(weightData.history || []),
              completion: calculateCompletion(weightData.history || [], 'weight')
            };
            return prev.map(h => h.name === 'Weight Tracking' ? weightHabit : h);
          });
        }
      })
    );

    return () => unsubscribers.forEach(unsubscribe => unsubscribe());
  }, []);

  const processHabitData = (userData) => {
    const habitData = [
      {
        name: 'Water Intake',
        icon: IoWaterOutline,
        color: 'blue',
        streak: calculateWaterStreak(userData.waterHistory || [], userData.waterStats),
        completion: calculateCompletion(userData.waterHistory || [], 'water', userData)
      },
      {
        name: 'Workouts',
        icon: IoFitnessOutline,
        color: 'green',
        streak: calculateWorkoutStreak(userData),
        completion: calculateCompletion(null, 'workout', userData)
      },
      {
        name: 'Weight Tracking',
        icon: IoScaleOutline,
        color: 'purple',
        streak: 0, // Will be updated by weight listener
        completion: 0 // Will be updated by weight listener
      },
      {
        name: 'Calorie Tracking',
        icon: GiKnifeFork,
        color: 'orange',
        streak: calculateCalorieStreak(userData.diet || [], userData.dailyStats),
        completion: calculateCompletion(userData.diet || [], 'calorie', userData.dailyStats)
      }
    ];

    return habitData;
  };

  const calculateWaterStreak = (history, currentStats) => {
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    
    // Check today's stats first
    if (currentStats && currentStats.date === today) {
      if (currentStats.currentLevel >= currentStats.targetLevel) {
        streak = 1;
      }
    }
    
    // Then check history
    for (let i = history.length - 1; i >= 0; i--) {
      const entry = history[i];
      if (entry.date === today) continue; // Skip today as it's handled above
      if (entry.currentLevel >= entry.targetLevel) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const calculateWorkoutStreak = (userData) => {
    let streak = 0;
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = new Date();
    const todayIndex = today.getDay();
    const todayStr = today.toISOString().split('T')[0];
    
    // First check today in workoutHistory
    if (userData.workoutHistory?.[todayStr]?.isCompleted) {
      streak = 1;
    } else {
      // If not in history, check today's workouts
      const todayDay = days[todayIndex];
      if (userData[todayDay]?.workouts) {
        const exercises = Object.values(userData[todayDay].workouts).flatMap(w => 
          Object.values(w.exercises || {})
        );
        if (exercises.length > 0 && exercises.every(ex => ex.isCompleted)) {
          streak = 1;
        }
      }
    }
    
    // Then check previous days
    let checkDate = new Date(today);
    checkDate.setDate(today.getDate() - 1); // Start from yesterday
    
    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      const dayIndex = checkDate.getDay();
      const dayName = days[dayIndex];
      
      // First check in workoutHistory
      if (userData.workoutHistory?.[dateStr]?.isCompleted) {
        streak++;
      } else {
        // If not in history, check the day's workouts
        if (userData[dayName]?.workouts) {
          const exercises = Object.values(userData[dayName].workouts).flatMap(w => 
            Object.values(w.exercises || {})
          );
          if (exercises.length > 0 && exercises.every(ex => ex.isCompleted)) {
            streak++;
          } else {
            break; // Break the streak if we find an incomplete day
          }
        } else {
          break; // Break the streak if no workouts found
        }
      }
      
      checkDate.setDate(checkDate.getDate() - 1);
    }
    
    return streak;
  };

  const calculateWeightStreak = (history) => {
    if (!history || history.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Sort history by date in descending order
    const sortedHistory = [...history].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
    
    // Check each day starting from the most recent
    let currentDate = today;
    let historyIndex = 0;
    
    while (historyIndex < sortedHistory.length) {
      const entry = sortedHistory[historyIndex];
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      
      // If the entry is from today or a past consecutive day
      if (entryDate.getTime() === currentDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
        historyIndex++;
      } else if (entryDate.getTime() < currentDate.getTime()) {
        // Found a gap in the streak
        break;
      } else {
        // Entry is from a future date, skip it
        historyIndex++;
      }
    }
    
    return streak;
  };

  const calculateCalorieStreak = (diet, dailyStats) => {
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    
    // Check today first
    if (dailyStats && dailyStats.date === today) {
      if (dailyStats.consumedCalories <= dailyStats.targetCalories) {
        streak = 1;
      }
    }
    
    // Group meals by date and check if target was met
    const mealsByDate = diet.reduce((acc, meal) => {
      if (meal.completed && meal.completedDate && meal.completedDate !== today) {
        if (!acc[meal.completedDate]) {
          acc[meal.completedDate] = {
            calories: 0,
            target: dailyStats?.targetCalories || 3000
          };
        }
        acc[meal.completedDate].calories += parseInt(meal.totalCalories) || 0;
      }
      return acc;
    }, {});
    
    // Convert to array and sort by date
    const sortedDates = Object.entries(mealsByDate)
      .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA));
    
    // Calculate streak
    for (const [_, data] of sortedDates) {
      if (data.calories <= data.target) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const calculateCompletion = (history, type, userData = null) => {
    // Get dates for the last 30 days
    const today = new Date();
    const dates = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    });

    if (type === 'workout' && userData) {
      let completedDays = 0;
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

      // Check each of the last 30 days
      dates.forEach(dateStr => {
        // First check workoutHistory
        if (userData.workoutHistory?.[dateStr]?.isCompleted) {
          completedDays++;
          return;
        }

        // If not in history, check the day's workouts
        const date = new Date(dateStr);
        const dayName = days[date.getDay()];
        
        if (userData[dayName]?.workouts) {
          const exercises = Object.values(userData[dayName].workouts).flatMap(w => 
            Object.values(w.exercises || {})
          );
          if (exercises.length > 0 && exercises.every(ex => ex.isCompleted)) {
            completedDays++;
          }
        }
      });

      return Math.round((completedDays / 30) * 100);
    }

    if (type === 'calorie' && Array.isArray(history)) {
      let completedDays = 0;
      
      // Group meals by date
      const mealsByDate = history.reduce((acc, meal) => {
        if (meal.completed && meal.completedDate) {
          const date = meal.completedDate;
          if (!acc[date]) {
            acc[date] = 0;
          }
          acc[date] += parseInt(meal.totalCalories) || 0;
        }
        return acc;
      }, {});

      // Check each of the last 30 days
      dates.forEach(date => {
        const dailyCalories = mealsByDate[date] || 0;
        const targetCalories = userData?.targetCalories || 2500;
        
        if (dailyCalories > 0 && dailyCalories <= targetCalories) {
          completedDays++;
        }
      });

      return Math.round((completedDays / 30) * 100);
    }

    if (type === 'water') {
      if (!history) return 0;
      
      let completedDays = 0;
      const todayStr = dates[0]; // First date is today
      
      // Check today's stats first if available
      if (userData?.waterStats && userData.waterStats.date === todayStr) {
        if (userData.waterStats.currentLevel >= userData.waterStats.targetLevel) {
          completedDays++;
        }
      }
      
      // Create a map of history entries for efficient lookup
      const historyMap = history.reduce((acc, entry) => {
        acc[entry.date] = entry;
        return acc;
      }, {});
      
      // Check each of the last 30 days (excluding today if we already counted it)
      dates.slice(userData?.waterStats?.date === todayStr ? 1 : 0).forEach(date => {
        const entry = historyMap[date];
        if (entry && entry.currentLevel >= entry.targetLevel) {
          completedDays++;
        }
      });
      
      return Math.round((completedDays / 30) * 100);
    }

    if (type === 'weight') {
      if (!history || history.length === 0) return 0;
      
      // Create a Set of dates with weight entries
      const weightDates = new Set(history.map(entry => entry.date));
      // Count how many of the last 30 days have weight entries
      const daysWithWeight = dates.filter(date => weightDates.has(date)).length;
      return Math.round((daysWithWeight / 30) * 100);
    }

    return 0;
  };

  if (loading) {
    return (
      <div className="h-[200px] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {habits.map((habit, index) => (
        <motion.div
          key={habit.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gray-50 rounded-xl p-4 flex items-center gap-4"
        >
          <div className={`p-3 rounded-xl bg-${habit.color}-50`}>
            <habit.icon className={`w-6 h-6 text-${habit.color}-500`} />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-700">{habit.name}</h4>
            <div className="flex items-center gap-4 mt-1">
              <div>
                <p className="text-sm text-gray-500">Current Streak</p>
                <p className="text-lg font-semibold text-gray-900">{habit.streak} days</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">30-day Completion</p>
                <p className="text-lg font-semibold text-gray-900">{habit.completion}%</p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default HabitStreaks; 