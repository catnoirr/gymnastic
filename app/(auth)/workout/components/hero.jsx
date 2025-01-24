"use client"
import React from "react";
import { useState } from "react";
import BottomDrawer from "./BottomDrawer";
import { IoBarbell, IoFitnessOutline, IoAddOutline, IoRemoveOutline } from "react-icons/io5";
import { db, auth } from "@/lib/firebase";
import { collection, doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";

export default function page() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [workoutNames, setWorkoutNames] = useState(['']);
  const [workoutType, setWorkoutType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleAddWorkoutName = () => {
    setWorkoutNames([...workoutNames, '']);
  };

  const handleWorkoutNameChange = (index, value) => {
    const newWorkoutNames = [...workoutNames];
    newWorkoutNames[index] = value;
    setWorkoutNames(newWorkoutNames);
  };

  const handleRemoveWorkoutName = (indexToRemove) => {
    if (workoutNames.length > 1) {
      setWorkoutNames(workoutNames.filter((_, index) => index !== indexToRemove));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (workoutNames.some(name => !name.trim())) {
      toast.error("Please fill all workout names");
      return;
    }

    if (!workoutType.trim()) {
      toast.error("Please enter a workout type");
      return;
    }

    setIsLoading(true);
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        toast.error("Please login first");
        return;
      }

      const userWeekRef = doc(collection(doc(db, 'users', userId), 'week'), selectedDay.toLowerCase());
      
      // First get the existing data
      const docSnap = await getDoc(userWeekRef);
      const existingData = docSnap.exists() ? docSnap.data() : { workouts: {} };
      
      // Find if workout type exists (case insensitive)
      const existingWorkoutKey = Object.keys(existingData.workouts || {}).find(
        key => key.toLowerCase() === workoutType.toLowerCase()
      );
      
      // Check if workout type already exists
      if (existingWorkoutKey) {
        const confirmMerge = window.confirm(
          `A workout type "${existingWorkoutKey}" already exists for ${selectedDay}. Would you like to add these exercises to it?`
        );
        
        if (!confirmMerge) {
          setIsLoading(false);
          return;
        }
        
        // Merge new exercises with existing ones
        const existingExercises = existingData.workouts[existingWorkoutKey].exercises || {};
        const newExercises = workoutNames.reduce((acc, name) => {
          // Case insensitive check for existing exercise names
          const nameExists = Object.values(existingExercises).some(
            ex => ex.name.toLowerCase() === name.toLowerCase()
          );
          
          if (nameExists) {
            toast.error(`Exercise "${name}" already exists in this workout type`);
            return acc;
          }
          
          acc[name] = {
            name: name,
            workoutType: existingWorkoutKey, // Use existing case for consistency
            createdAt: serverTimestamp(),
          };
          return acc;
        }, {});

        // Update with merged exercises
        await setDoc(userWeekRef, {
          workouts: {
            [existingWorkoutKey]: {
              type: existingWorkoutKey, // Use existing case for consistency
              exercises: { ...existingExercises, ...newExercises },
              updatedAt: serverTimestamp(),
            }
          }
        }, { merge: true });
        
      } else {
        // Create new workout type with exercises
        const workoutsObject = workoutNames.reduce((acc, name) => {
          acc[name] = {
            name: name,
            workoutType: workoutType,
            createdAt: serverTimestamp(),
          };
          return acc;
        }, {});

        await setDoc(userWeekRef, {
          workouts: {
            [workoutType]: {
              type: workoutType,
              exercises: workoutsObject,
              createdAt: serverTimestamp(),
            }
          }
        }, { merge: true });
      }

      toast.success("Workouts added successfully!");
      setWorkoutNames(['']);
      setWorkoutType('');
      setIsDrawerOpen(false);
    } catch (error) {
      console.error("Error adding workouts:", error);
      toast.error("Failed to add workouts");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex ">
      <div className="flex justify-between w-full md:pb-12 pt-3">
        <div className="">
          <h1 className="text-5xl md:text-4xl font-poppins font-semibold bg-gradient-to-r from-blue-600/60 to-purple-600/60 bg-clip-text text-transparent animate-gradient">
            Workout
          </h1>
          <p className="text-sm">Fuel your body, not your cravings.</p>
        </div>
        <div className="hidden md:block">
          <h1 className="text-4xl font-poppins font-semibold ">
            {new Date().toLocaleDateString('en-US', {weekday: 'long'})}
          </h1>
          <p className="text-center text-sm">
            {new Date().toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short', 
              year: 'numeric'
            })}
          </p>
        </div>
        <div>
          <button 
            onClick={() => setIsDrawerOpen(true)} 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-2.5 rounded-full text-center font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New
          </button>
        </div>
      </div>
      <BottomDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-xl">
                <IoBarbell className="w-6 h-6 text-blue-500" />
              </div>
              <h1 className="text-xl md:text-2xl font-poppins font-semibold">Add New Workout</h1>
            </div>
          </div>

          <div>
            <p className="text-sm font-poppins font-medium text-gray-700 mb-2">Select Day</p>
            <select 
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="text-sm font-poppins font-medium text-gray-700 mb-2">Workout Type</p>
            <div className="relative">
              <input 
                type="text" 
                value={workoutType}
                onChange={(e) => setWorkoutType(e.target.value)}
                placeholder="eg: Chest Day, Leg Day" 
                className="w-full p-3 pl-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
              <IoBarbell className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-poppins font-medium text-gray-700">Workout Names</p>
              <button
                type="button"
                onClick={handleAddWorkoutName}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <IoAddOutline className="w-5 h-5 text-blue-500" />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {workoutNames.map((name, index) => (
                <div key={index} className="relative flex items-center gap-2">
                  <div className="relative flex-1">
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => handleWorkoutNameChange(index, e.target.value)}
                      placeholder="eg: Bench Press" 
                      className="w-full p-3 pl-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                    <IoFitnessOutline className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                  {workoutNames.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveWorkoutName(index)}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <IoRemoveOutline className="w-5 h-5 text-red-500" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-3 rounded-full font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Adding..." : "Add Workout"}
          </button>
        </form>
      </BottomDrawer>
    </div>
  );
}
