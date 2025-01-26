"use client"
import React, { useState, useEffect } from "react";
import BottomDrawer from "./BottomDrawer";
import { FiCalendar, FiClock, FiTrash2 } from "react-icons/fi";
import { IoFitnessOutline, IoBarbell, IoAddOutline, IoRemoveOutline } from "react-icons/io5";
import { GiWeightScale } from "react-icons/gi";
import { LuRuler } from "react-icons/lu";
import { db, auth } from "@/lib/firebase";
import { collection, doc, getDoc, setDoc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { toast } from "react-hot-toast";

// Skeleton component for workout cards
const WorkoutSkeleton = () => (
  <div className="flex items-center gap-4 bg-white rounded-2xl p-6 w-full animate-pulse">
    <div className="p-3 bg-gray-200 rounded-xl w-12 h-12" />
    <div className="flex-1">
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
    </div>
  </div>
);

// Skeleton for workout types
const WorkoutTypeSkeleton = () => (
  <div className="flex gap-2 mt-2 animate-pulse">
    {[1, 2].map((i) => (
      <div key={i} className="px-8 md:px-6 py-1 bg-gray-200 rounded-full h-8 w-32" />
    ))}
  </div>
);

// Full page loading skeleton
const PageSkeleton = () => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-col sm:flex-row justify-between md:items-center gap-4">
      <WorkoutTypeSkeleton />
    </div>
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <WorkoutSkeleton key={i} />
      ))}
    </div>
  </div>
);

export default function Main() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [workoutTypes, setWorkoutTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState('');
  const [uniqueWorkoutTypes, setUniqueWorkoutTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [newWorkoutName, setNewWorkoutName] = useState('');
  const [authChecked, setAuthChecked] = useState(false);

  // Add auth state listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setAuthChecked(true);
      if (!user) {
        setLoading(false);
        window.location.href = '/login';
      }
    });

    return () => unsubscribe();
  }, []);

  const handleExerciseClick = (exercise) => {
    setSelectedExercise(exercise);
    setIsDrawerOpen(true);
  };

  const dayMap = {
    0: 'sunday',
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday'
  };

  const days = [
    { short: 'Su', full: 'sunday' },
    { short: 'M', full: 'monday' },
    { short: 'T', full: 'tuesday' },
    { short: 'W', full: 'wednesday' },
    { short: 'Th', full: 'thursday' },
    { short: 'F', full: 'friday' },
    { short: 'Sa', full: 'saturday' },
  ];

  useEffect(() => {
    if (!authChecked) return;
    
    const today = new Date().getDay();
    setSelectedDay(dayMap[today]);
  }, [authChecked]);

  useEffect(() => {
    if (!authChecked || !selectedDay) return;

    setLoading(true);
    const userId = auth.currentUser?.uid;
    if (!userId) {
      setLoading(false);
      return;
    }

    const userWeekRef = doc(collection(doc(db, 'users', userId), 'week'), selectedDay);
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(userWeekRef, 
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const workouts = data.workouts || {};
          
          const types = Object.values(workouts).map(workout => workout.type);
          setUniqueWorkoutTypes(Array.from(new Set(types)));
          
          const formattedWorkouts = Object.entries(workouts).flatMap(([type, workout]) => {
            const exercises = Object.values(workout.exercises || {});
            return exercises.map(exercise => ({
              name: exercise.name,
              type: workout.type,
              icon: exercise.name.toLowerCase().includes('bench') ? 
                <IoBarbell className="w-6 h-6" /> : 
                <IoFitnessOutline className="w-6 h-6" />
            }));
          });
          
          setWorkoutTypes(formattedWorkouts);
        } else {
          setWorkoutTypes([]);
          setUniqueWorkoutTypes([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching workouts:", error);
        toast.error("Failed to fetch workouts");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [selectedDay, authChecked]);

  const handleAddWorkout = async (type) => {
    setSelectedType(type);
    setIsDrawerOpen(true);
  };

  const handleSubmitNewWorkout = async (e) => {
    e.preventDefault();
    if (!newWorkoutName.trim()) {
      toast.error("Please enter a workout name");
      return;
    }

    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        toast.error("Please login first");
        return;
      }

      const userWeekRef = doc(collection(doc(db, 'users', userId), 'week'), selectedDay);
      const docSnap = await getDoc(userWeekRef);
      const existingData = docSnap.exists() ? docSnap.data() : { workouts: {} };

      // Check if exercise name already exists
      const workoutExists = Object.values(existingData.workouts || {}).some(workout => 
        Object.values(workout.exercises || {}).some(exercise => 
          exercise.name.toLowerCase() === newWorkoutName.toLowerCase()
        )
      );

      if (workoutExists) {
        toast.error("This exercise name already exists");
        return;
      }

      // Add new exercise to existing type
      await setDoc(userWeekRef, {
        workouts: {
          ...existingData.workouts,
          [selectedType]: {
            type: selectedType,
            exercises: {
              ...(existingData.workouts[selectedType]?.exercises || {}),
              [newWorkoutName]: {
                name: newWorkoutName,
                workoutType: selectedType,
                createdAt: serverTimestamp(),
              }
            }
          }
        }
      }, { merge: true });

      toast.success("Workout added successfully!");
      setNewWorkoutName('');
      setIsDrawerOpen(false);
    } catch (error) {
      console.error("Error adding workout:", error);
      toast.error("Failed to add workout");
    }
  };

  const handleDeleteExercise = async (exercise, e) => {
    e.stopPropagation();
    
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        toast.error("Please login first");
        return;
      }

      const userWeekRef = doc(collection(doc(db, 'users', userId), 'week'), selectedDay);
      const docSnap = await getDoc(userWeekRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        let workouts = { ...data.workouts };

        // Find the workout that contains this exercise
        Object.keys(workouts).forEach(workoutKey => {
          const workout = workouts[workoutKey];
          if (workout.type === exercise.type && workout.exercises) {
            // Find and remove the exercise
            Object.keys(workout.exercises).forEach(exerciseKey => {
              if (workout.exercises[exerciseKey].name === exercise.name) {
                delete workout.exercises[exerciseKey];
              }
            });

            // If no exercises left, remove the workout type
            if (Object.keys(workout.exercises).length === 0) {
              delete workouts[workoutKey];
            }
          }
        });

        // Update Firebase
        await setDoc(userWeekRef, { workouts });
        
        // Update local state
        setWorkoutTypes(prev => prev.filter(ex => ex.name !== exercise.name));
        toast.success("Exercise deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting exercise:", error);
      toast.error("Failed to delete exercise");
    }
  };

  if (!authChecked || loading) {
    return <PageSkeleton />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row justify-between md:items-center gap-4">
        <div>
          {/* <h1 className="text-xl md:text-2xl font-poppins font-semibold">
            Exercise
          </h1> */}
          {loading ? (
            <WorkoutTypeSkeleton />
          ) : uniqueWorkoutTypes.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {uniqueWorkoutTypes.map((type, index) => (
                <div key={index} className="flex items-center gap-2">
                <span
                  key={index}
                  className="px-8 md:px-6 py-1 bg-blue-50 text-blue-600 rounded-full text-xl font-medium flex items-center gap-2"
                >
                  {type}
                </span>   
                <button
                  onClick={() => handleAddWorkout(type)}
                  className="p-2 hover:bg-blue-50 rounded-full transition-colors"
                >
                  <IoAddOutline className="w-5 h-5 text-blue-500" />
                </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-wrap md:justify-center justify-between gap-2 sm:gap-4">
          {days.map((day, index) => (
            <div
              key={day.short}
              onClick={() => setSelectedDay(day.full)}
              className={`text-lg font-poppins font-semibold ${
                day.full === selectedDay ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
              } w-10 h-10 flex items-center justify-center rounded-full cursor-pointer hover:scale-105 transition-transform`}
            >
              {day.short}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-8 sm:py-16">
        {loading ? (
          // Show multiple skeleton cards while loading
          [...Array(6)].map((_, index) => (
            <WorkoutSkeleton key={index} />
          ))
        ) : workoutTypes.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 sm:col-span-2 lg:col-span-3">
            <IoFitnessOutline className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-lg text-gray-500 font-medium">No workouts found for today</p>
          </div>
        ) : (
          workoutTypes.map((exercise, index) => (
            <div
              key={index}
              onClick={() => handleExerciseClick(exercise)}
              className="flex items-center gap-4 bg-white rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] w-full group relative"
            >
              <div className="p-3 bg-blue-50 rounded-xl text-blue-500">
                {exercise.icon}
              </div>
              <div className="flex-1">
                <p className="text-base sm:text-lg font-poppins font-semibold text-gray-800">
                  {exercise.name}
                </p>
                <p className="text-sm text-gray-500">
                  {exercise.type}
                </p>
              </div>
              <button
                onClick={(e) => handleDeleteExercise(exercise, e)}
                className="absolute right-4 top-1/2 -translate-y-1/2 hover:bg-red-50 rounded-full p-2 transition-colors"
              >
                <FiTrash2 className="w-5 h-5 text-red-500" />
              </button>
            </div>
          ))
        )}
      </div>

      

      <BottomDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <form onSubmit={handleSubmitNewWorkout} className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-xl">
                <IoBarbell className="w-6 h-6 text-blue-500" />
              </div>
              <h1 className="text-xl md:text-2xl font-poppins font-semibold">Add New Exercise</h1>
            </div>
          </div>

          <div>
            <p className="text-sm font-poppins font-medium text-gray-700 mb-2">Exercise Name</p>
            <div className="relative">
              <input 
                type="text" 
                value={newWorkoutName}
                onChange={(e) => setNewWorkoutName(e.target.value)}
                placeholder="eg: Bench Press" 
                className="w-full p-3 pl-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
              <IoFitnessOutline className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-full font-semibold hover:bg-blue-600 transition-colors"
          >
            Add Exercise
          </button>
        </form>
      </BottomDrawer>
    </div>
  );
}
