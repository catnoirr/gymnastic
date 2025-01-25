"use client";
import React, { useState, useEffect } from "react";
import BottomDrawer from "@/app/(auth)/workout/components/BottomDrawer";
import { FiCalendar, FiClock, FiTrash2, FiEye } from "react-icons/fi";
import { IoFitnessOutline, IoBarbell, IoCheckmarkCircleOutline, IoCheckmarkCircle } from "react-icons/io5";
import { GiWeightScale } from "react-icons/gi";
import { LuRuler } from "react-icons/lu";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { toast } from "react-hot-toast";
import WorkoutSets from "@/app/(auth)/today-workout/components/WorkoutSets";

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
    {[1].map((i) => (
      <div
        key={i}
        className="px-8 md:px-6 py-1 bg-gray-200 rounded-full h-8 w-32"
      />
    ))}
  </div>
);

// Add this helper function at the top of the file
const compareWithPreviousWorkout = (currentSets, history) => {
  if (!history || history.length < 2) return null;

  const previousWorkout = history[history.length - 2]?.sets || [];
  const improvements = currentSets.map((currentSet, idx) => {
    const previousSet = previousWorkout[idx];
    if (!previousSet) return { isNew: true };

    const weightDiff = currentSet.weight - previousSet.weight;
    const repsDiff = currentSet.reps - previousSet.reps;

    return {
      weightDiff,
      repsDiff,
      improved: weightDiff > 0 || repsDiff > 0
    };
  });

  return improvements;
};

export default function Main() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [workoutTypes, setWorkoutTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uniqueWorkoutTypes, setUniqueWorkoutTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [newWorkoutName, setNewWorkoutName] = useState("");
  const [authChecked, setAuthChecked] = useState(false);
  const [workoutHistory, setWorkoutHistory] = useState(null);
  const [drawerType, setDrawerType] = useState(null); // 'sets' or 'history'

  // Get current day
  const getCurrentDay = () => {
    const dayMap = {
      0: "sunday",
      1: "monday",
      2: "tuesday",
      3: "wednesday",
      4: "thursday",
      5: "friday",
      6: "saturday",
    };
    const today = new Date().getDay();
    return dayMap[today];
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setAuthChecked(true);
      if (!user) {
        toast.error("Please login first");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleExerciseClick = (exercise) => {
    setSelectedExercise(exercise);
    setDrawerType('sets');
    setIsDrawerOpen(true);
  };

  const handleHistoryClick = (exercise, e) => {
    e.stopPropagation();
    setSelectedExercise(exercise);
    setDrawerType('history');
    setIsDrawerOpen(true);
  };

  useEffect(() => {
    if (!authChecked) return;

    setLoading(true);
    const userId = auth.currentUser?.uid;
    if (!userId) {
      return;
    }

    const currentDay = getCurrentDay();
    const userWeekRef = doc(
      collection(doc(db, "users", userId), "week"),
      currentDay
    );

    // Set up real-time listener
    const unsubscribe = onSnapshot(
      userWeekRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const workouts = data.workouts || {};

          const types = Object.values(workouts).map((workout) => workout.type);
          setUniqueWorkoutTypes(Array.from(new Set(types)));

          const formattedWorkouts = Object.entries(workouts)
            .flatMap(([type, workout]) => {
              const exercises = Object.values(workout.exercises || {});
              return exercises.map((exercise) => ({
                name: exercise.name,
                type: workout.type,
                history: exercise.history || [],
                sets: exercise.sets || [],
                isCompleted: exercise.isCompleted || false,
                lastUpdated: exercise.sets?.length > 0 ? new Date() : 
                  (exercise.history?.length > 0 ? 
                    new Date(exercise.history[exercise.history.length - 1].date.seconds * 1000) : 
                    new Date(0)),
                icon: exercise.name.toLowerCase().includes("bench") ? (
                  <IoBarbell className="w-6 h-6" />
                ) : (
                  <IoFitnessOutline className="w-6 h-6" />
                ),
              }));
            })
            .sort((a, b) => {
              // Sort by completion status first
              if (!a.isCompleted && b.isCompleted) return -1;
              if (a.isCompleted && !b.isCompleted) return 1;
              
              // Then by sets
              const aHasSets = a.sets?.length > 0;
              const bHasSets = b.sets?.length > 0;
              if (aHasSets && !bHasSets) return -1;
              if (!aHasSets && bHasSets) return 1;
              
              return b.lastUpdated - a.lastUpdated;
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
  }, [authChecked]); // Only depend on authChecked now

  const handleSubmitNewWorkout = async (e) => {
    e.preventDefault();
    if (!newWorkoutName.trim()) {
      toast.error("Please enter a workout name");
      return;
    }

    try {
      const userId = auth.currentUser?.uid;
      if (!userId || !authChecked) {
        toast.error("Please login first");
        return;
      }

      const currentDay = getCurrentDay();
      const userWeekRef = doc(
        collection(doc(db, "users", userId), "week"),
        currentDay
      );
      const docSnap = await getDoc(userWeekRef);
      const existingData = docSnap.exists() ? docSnap.data() : { workouts: {} };

      // Check if exercise name already exists
      const workoutExists = Object.values(existingData.workouts || {}).some(
        (workout) =>
          Object.values(workout.exercises || {}).some(
            (exercise) =>
              exercise.name.toLowerCase() === newWorkoutName.toLowerCase()
          )
      );

      if (workoutExists) {
        toast.error("This exercise name already exists");
        return;
      }

      // Modified exercise structure
      await setDoc(
        userWeekRef,
        {
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
                  history: [],
                  sets: []
                },
              },
            },
          },
        },
        { merge: true }
      );

      toast.success("Workout added successfully!");
      setNewWorkoutName("");
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
        console.error("Please login first");
        return;
      }

      const currentDay = getCurrentDay();
      const userWeekRef = doc(
        collection(doc(db, "users", userId), "week"),
        currentDay
      );
      const docSnap = await getDoc(userWeekRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        let workouts = { ...data.workouts };

        // Find the workout that contains this exercise
        Object.keys(workouts).forEach((workoutKey) => {
          const workout = workouts[workoutKey];
          if (workout.type === exercise.type && workout.exercises) {
            // Find and remove the exercise
            Object.keys(workout.exercises).forEach((exerciseKey) => {
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
        setWorkoutTypes((prev) =>
          prev.filter((ex) => ex.name !== exercise.name)
        );
        toast.success("Exercise deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting exercise:", error);
      toast.error("Failed to delete exercise");
    }
  };

  const handleSaveWorkoutSet = async (exercise, sets) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId || !authChecked) {
        toast.error("Please login first");
        return;
      }

      const currentDay = getCurrentDay();
      const userWeekRef = doc(
        collection(doc(db, "users", userId), "week"),
        currentDay
      );

      // Modified to use Firestore Timestamp
      const historyEntry = {
        date: serverTimestamp(),
        sets: sets,
      };

      const docSnap = await getDoc(userWeekRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const workouts = { ...data.workouts };

        // Find and update the exercise
        Object.keys(workouts).forEach((workoutKey) => {
          const workout = workouts[workoutKey];
          if (workout.type === exercise.type) {
            Object.keys(workout.exercises).forEach((exerciseKey) => {
              if (workout.exercises[exerciseKey].name === exercise.name) {
                // Add new sets to history
                const history = workout.exercises[exerciseKey].history || [];
                history.push(historyEntry);
                
                // Keep only last 4 weeks of history
                const fourWeeksAgo = new Date();
                fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
                
                // Modified history filter to handle Firestore Timestamp
                workout.exercises[exerciseKey].history = history.filter(entry => {
                  const entryDate = entry.date instanceof Date 
                    ? entry.date 
                    : new Date(entry.date.seconds * 1000);
                  return entryDate > fourWeeksAgo;
                });
                
                // Update current sets
                workout.exercises[exerciseKey].sets = sets;
              }
            });
          }
        });

        await setDoc(userWeekRef, { workouts });
        toast.success("Workout progress saved!");
      }
    } catch (error) {
      console.error("Error saving workout progress:", error);
      toast.error("Failed to save workout progress");
    }
  };

  const handleToggleComplete = async (exercise, e) => {
    e.stopPropagation();
    try {
      const userId = auth.currentUser?.uid;
      if (!userId || !authChecked) {
        toast.error("Please login first");
        return;
      }

      const currentDay = getCurrentDay();
      const userWeekRef = doc(
        collection(doc(db, "users", userId), "week"),
        currentDay
      );

      const docSnap = await getDoc(userWeekRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const workouts = { ...data.workouts };

        // Find and update the exercise
        Object.keys(workouts).forEach((workoutKey) => {
          const workout = workouts[workoutKey];
          if (workout.type === exercise.type) {
            Object.keys(workout.exercises).forEach((exerciseKey) => {
              if (workout.exercises[exerciseKey].name === exercise.name) {
                workout.exercises[exerciseKey].isCompleted = !exercise.isCompleted;
              }
            });
          }
        });

        await setDoc(userWeekRef, { workouts });
        toast.success(exercise.isCompleted ? "Marked as incomplete" : "Marked as complete");
      }
    } catch (error) {
      console.error("Error toggling completion:", error);
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row justify-between md:items-center gap-4">
        <div>
          {/* <h1 className="text-xl md:text-2xl font-poppins font-semibold">
            Exercise
          </h1> */}
          {loading ? (
            <WorkoutTypeSkeleton />
          ) : (
            uniqueWorkoutTypes.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {uniqueWorkoutTypes.map((type, index) => (
                  <span
                    key={index}
                    className="text-lg md:text-xl bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 rounded-full px-6 md:px-8 py-2.5 font-poppins flex items-center gap-2 font-semibold shadow-sm hover:shadow-md transition-all duration-200 cursor-default"
                  >
                    {type}
                  </span>
                ))}
              </div>
            )
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-8 sm:py-16">
        {loading ? (
          // Show multiple skeleton cards while loading
          [...Array(6)].map((_, index) => <WorkoutSkeleton key={index} />)
        ) : workoutTypes.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 sm:col-span-2 lg:col-span-3">
            <IoFitnessOutline className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-lg text-gray-500 font-medium">
              No workouts found for today
            </p>
          </div>
        ) : (
          workoutTypes.map((exercise, index) => (
            <div
              key={index}
              className={`flex flex-col bg-white rounded-3xl p-6 hover:shadow-lg transition-all w-full group shadow-md relative ${
                exercise.isCompleted ? 'bg-gray-50 opacity-75' : 'hover:scale-[1.02] cursor-pointer'
              }`}
            >
              <div 
                onClick={() => !exercise.isCompleted && handleExerciseClick(exercise)}
                className="flex-1"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className={`p-3 rounded-xl ${
                    exercise.isCompleted ? 'bg-gray-100 text-gray-400' : 'bg-blue-50 text-blue-500'
                  }`}>
                    {exercise.icon}
                  </div>
                  <div className="flex-1">
                    <p className={`text-base sm:text-lg font-poppins font-semibold ${
                      exercise.isCompleted ? 'text-gray-500' : 'text-gray-800'
                    }`}>
                      {exercise.name}
                    </p>
                    <p className="text-sm text-gray-500">{exercise.type}</p>
                  </div>
                  <button
                    onClick={(e) => handleToggleComplete(exercise, e)}
                    className={`p-2 rounded-full transition-colors ${
                      exercise.isCompleted 
                        ? 'text-green-500 hover:bg-green-50' 
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    {exercise.isCompleted ? (
                      <IoCheckmarkCircle className="w-6 h-6" />
                    ) : (
                      <IoCheckmarkCircleOutline className="w-6 h-6" />
                    )}
                  </button>
                </div>

                {/* Show latest set data if available */}
                {exercise.sets && exercise.sets.length > 0 ? (
                  <div className={`mt-2 space-y-1 p-3 rounded-xl ${
                    exercise.isCompleted ? 'bg-gray-100' : 'bg-gray-50'
                  }`}>
                    {exercise.sets.map((set, idx) => {
                      const improvements = compareWithPreviousWorkout(exercise.sets, exercise.history);
                      const improvement = improvements?.[idx];
                      
                      return (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className={exercise.isCompleted ? 'text-gray-500' : 'text-gray-600'}>
                          Set {idx + 1}
                        </span>
                          <div className="flex items-center gap-2">
                        <span className={`font-medium ${
                          exercise.isCompleted ? 'text-gray-500' : 'text-blue-600'
                        }`}>
                          {set.weight}kg × {set.reps}
                        </span>
                            {improvement && !exercise.isCompleted && (
                              <div className="flex items-center text-xs">
                                {improvement.isNew ? (
                                  <span className="text-green-500">NEW</span>
                                ) : improvement.improved && (
                                  <div className="flex flex-col items-end text-green-500">
                                    {improvement.weightDiff > 0 && (
                                      <span>+{improvement.weightDiff}kg</span>
                                    )}
                                    {improvement.repsDiff > 0 && (
                                      <span>+{improvement.repsDiff} reps</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                      </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-2 text-sm text-gray-400 italic bg-gray-50 p-3 rounded-xl">
                    No sets recorded today
                  </div>
                )}
              </div>

              <div className="flex gap-2 justify-end mt-3 pt-3 border-t">
                <button
                  onClick={(e) => handleHistoryClick(exercise, e)}
                  className="p-2 hover:bg-blue-50 rounded-full text-blue-500"
                >
                  <FiEye className="w-5 h-5" />
                </button>
                {!exercise.isCompleted && (
                  <button
                    onClick={(e) => handleDeleteExercise(exercise, e)}
                    className="p-2 hover:bg-red-50 rounded-full text-red-500"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      

      <BottomDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedExercise(null);
          setDrawerType(null);
        }}
      >
        {selectedExercise && drawerType === 'sets' ? (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 rounded-xl">
                  {selectedExercise.icon}
                </div>
                <h1 className="text-xl md:text-2xl font-poppins font-semibold">
                  {selectedExercise.name}
                </h1>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Today's Sets</h2>
              <WorkoutSets
                exercise={selectedExercise}
                onSave={handleSaveWorkoutSet}
                onClose={() => {
                  setIsDrawerOpen(false);
                  setSelectedExercise(null);
                  setDrawerType(null);
                }}
              />
            </div>
          </div>
        ) : selectedExercise && drawerType === 'history' ? (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 rounded-xl">
                  {selectedExercise.icon}
                </div>
                <h1 className="text-xl md:text-2xl font-poppins font-semibold">
                  {selectedExercise.name} History
                </h1>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                {selectedExercise.history?.map((entry, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-sm text-gray-500 mb-2">
                      {entry.date instanceof Date 
                        ? entry.date.toLocaleDateString()
                        : new Date(entry.date.seconds * 1000).toLocaleDateString()}
                    </p>
                    <div className="space-y-1">
                      {entry.sets.map((set, idx) => (
                        <p key={idx} className="text-sm">
                          Set {idx + 1}: {set.weight}kg × {set.reps} reps
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
                {(!selectedExercise.history || selectedExercise.history.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    No workout history available
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
        <form onSubmit={handleSubmitNewWorkout} className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-xl">
                <IoBarbell className="w-6 h-6 text-blue-500" />
              </div>
              <h1 className="text-xl md:text-2xl font-poppins font-semibold">
                Add New Exercise
              </h1>
            </div>
          </div>

          <div>
            <p className="text-sm font-poppins font-medium text-gray-700 mb-2">
              Exercise Name
            </p>
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
        )}
      </BottomDrawer>
    </div>
  );
}
