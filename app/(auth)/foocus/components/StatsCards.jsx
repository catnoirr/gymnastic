"use client";

import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const useStatsData = () => {
  const [stats, setStats] = useState({
    calories: {
      consumed: 0,
      target: 3000,
      loading: true
    },
    weight: 0,
    height: 0,
    loading: true
  });
  const [userId, setUserId] = useState(null);

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user?.uid);
    });
    return () => unsubscribe();
  }, []);

  // Stats listener
  useEffect(() => {
    if (!userId) return;

    // Set up multiple listeners
    const unsubscribers = [];

    // Main user data listener (for calories)
    const userDocRef = doc(db, 'users', userId);
    unsubscribers.push(
      onSnapshot(userDocRef, (snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.data();
          const today = new Date().toISOString().split('T')[0];
          
          // Calculate total calories from completed meals today
          const completedMeals = (userData.diet || []).filter(meal => 
            meal.completed && meal.completedDate === today
          );
          const totalConsumed = completedMeals.reduce((sum, meal) => {
            return sum + (parseInt(meal.totalCalories) || 0);
          }, 0);

          // Get target calories from dailyStats
          const targetCalories = userData.dailyStats?.targetCalories || 3000;

          setStats(prev => ({
            ...prev,
            calories: {
              consumed: totalConsumed,
              target: targetCalories,
              loading: false
            }
          }));
        }
      })
    );

    // Weight listener
    const weightDocRef = doc(db, "users", userId, "progress", "weight");
    unsubscribers.push(
      onSnapshot(weightDocRef, (snapshot) => {
        if (snapshot.exists()) {
          setStats(prev => ({
            ...prev,
            weight: snapshot.data().currentWeight || 0,
            loading: false
          }));
        }
      })
    );

    // Height listener
    const profileDocRef = doc(db, "users", userId, "profile", "details");
    unsubscribers.push(
      onSnapshot(profileDocRef, (snapshot) => {
        if (snapshot.exists()) {
          setStats(prev => ({
            ...prev,
            height: snapshot.data().height || 0,
            loading: false
          }));
        }
      })
    );

    // Cleanup function to unsubscribe from all listeners
    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [userId]);

  return stats;
};

const CaloriesCard = ({ calories = { consumed: 0, target: 0 } }) => {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500">Daily Calories</h3>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-orange-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
        </svg>
      </div>
      <div className="space-y-1">
        <p className="text-lg sm:text-2xl font-bold text-gray-900">
          {calories.consumed} <span className="text-sm sm:text-base font-medium text-gray-500">/ {calories.target} kcal</span>
        </p>
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div 
            className="bg-orange-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${Math.min((calories.consumed / calories.target) * 100, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

const WeightCard = ({ weight = 0 }) => {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500">Current Weight</h3>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.97zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.97z" />
        </svg>
      </div>
      <p className="text-lg sm:text-2xl font-bold text-gray-900">{weight} <span className="text-sm sm:text-base font-medium text-gray-500">kg</span></p>
    </div>
  );
};

const HeightCard = ({ height = 0 }) => {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500">Height</h3>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
        </svg>
      </div>
      <p className="text-lg sm:text-2xl font-bold text-gray-900">{height} <span className="text-sm sm:text-base font-medium text-gray-500">cm</span></p>
    </div>
  );
};

const StatsSkeleton = () => (
  <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-sm animate-pulse">
    <div className="flex items-center justify-between mb-2">
      <div className="h-4 bg-gray-200 rounded w-20 sm:w-24"></div>
      <div className="h-5 w-5 bg-gray-200 rounded"></div>
    </div>
    <div className="h-7 sm:h-8 bg-gray-200 rounded w-24 sm:w-28"></div>
  </div>
);

const StatsGrid = () => {
  const { calories, weight, height, loading } = useStatsData();

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsSkeleton />
        <StatsSkeleton />
        <StatsSkeleton />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <CaloriesCard calories={calories} />
      <WeightCard weight={weight} />
      <HeightCard height={height} />
    </div>
  );
};

export { CaloriesCard, WeightCard, HeightCard, StatsGrid }; 