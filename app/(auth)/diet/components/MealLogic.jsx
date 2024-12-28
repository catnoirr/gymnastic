"use client";
import React, { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase"; // Import your Firebase setup
import MealCard from "./MealCard";

const Diet = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUid, setCurrentUid] = useState("");

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUid(user.uid); // Set the current user's UID
        const userDoc = doc(db, "users", user.uid);

        const unsubscribeSnapshot = onSnapshot(userDoc, (userSnap) => {
          if (userSnap.exists()) {
            const diet = userSnap.data().diet || {}; // Default to empty object if diet doesn't exist
            const mealList = Object.keys(diet).map((key) => ({
              id: key,
              ...diet[key],
            }));
            setMeals(mealList);
          } else {
            setMeals([]); // No diet data
          }
          setLoading(false);
        });

        // Clean up the snapshot listener when auth state changes
        return () => unsubscribeSnapshot();
      } else {
        setCurrentUid("");
        setMeals([]);
        setLoading(false);
      }
    });

    // Clean up the auth listener
    return () => unsubscribeAuth();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="border  mt-5 rounded-3xl shadow-md bg-gradient-to-r from-orange-100 to-pink-50">
    <div className=" mx-auto mt-6 grid grid-cols-1 md:grid-cols-4  gap-6 p-10">
      {meals.length > 0 ? (
        meals.map((meal) => <MealCard key={meal.id} meal={meal} />)
      ) : (
        <p className="col-span-1 md:col-span-2 lg:col-span-3 text-center text-gray-500">No meals added yet.</p>
      )}
    </div>
    </div>
  );
};

export default Diet;
