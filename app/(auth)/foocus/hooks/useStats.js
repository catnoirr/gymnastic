"use client";
import { useState, useEffect } from 'react';
import { db, auth } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export const useStats = () => {
  const [stats, setStats] = useState({
    calories: 0,
    weight: 0,
    height: 0,
    loading: true
  });
  const [userId, setUserId] = useState(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user?.uid);
    });

    return () => unsubscribe();
  }, []);

  // Fetch stats data
  useEffect(() => {
    const fetchStats = async () => {
      if (!userId) return;

      try {
        // Fetch weight data
        const weightDoc = await getDoc(doc(db, "users", userId, "progress", "weight"));
        const weightData = weightDoc.exists() ? weightDoc.data() : { currentWeight: 0 };

        // Fetch user profile for height
        const profileDoc = await getDoc(doc(db, "users", userId, "profile", "details"));
        const profileData = profileDoc.exists() ? profileDoc.data() : { height: 0 };

        // Fetch calories data
        const caloriesDoc = await getDoc(doc(db, "users", userId, "progress", "calories"));
        const caloriesData = caloriesDoc.exists() ? caloriesDoc.data() : { dailyCalories: 0 };

        setStats({
          calories: caloriesData.dailyCalories || 0,
          weight: weightData.currentWeight || 0,
          height: profileData.height || 0,
          loading: false
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    if (userId) {
      fetchStats();
    }
  }, [userId]);

  return stats;
}; 