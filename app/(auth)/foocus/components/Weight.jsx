"use client";
import { useState, useEffect, useRef } from "react";
import { db, auth } from "@/lib/firebase";
import { doc, updateDoc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import WeightInputDrawer from "./WeightInputDrawer";

const ResetConfirmDrawer = ({ isOpen, onClose, onConfirm }) => {
  const [timer, setTimer] = useState(5);
  const [isResetting, setIsResetting] = useState(false);
  const [startedReset, setStartedReset] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isOpen && startedReset && timer > 0) {
      timerRef.current = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timerRef.current);
    } else if (timer === 0) {
      handleReset();
    }
  }, [isOpen, timer, startedReset]);

  useEffect(() => {
    if (isOpen) {
      setTimer(5);
      setIsResetting(false);
      setStartedReset(false);
    }
  }, [isOpen]);

  const handleReset = async () => {
    setIsResetting(true);
    await onConfirm();
    onClose();
    setTimer(5);
    setStartedReset(false);
  };

  const handleStartReset = () => {
    setStartedReset(true);
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      <div className="fixed inset-x-0 bottom-0 z-50 transform transition-all">
        <div className="bg-white rounded-t-3xl p-6 mx-auto max-w-lg">
          {/* Handle for mobile */}
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />
          
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Reset Progress?</h3>
              <p className="text-gray-500">This will delete all your weight history. This action cannot be undone.</p>
              <div className="mt-4 text-sm text-gray-400">
                {isResetting ? 'Resetting...' : startedReset ? `Resetting in ${timer} seconds` : 'Are you sure?'}
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 font-medium disabled:opacity-50"
                disabled={isResetting}
              >
                Cancel
              </button>
              {!startedReset ? (
                <button
                  onClick={handleStartReset}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 font-medium"
                >
                  Reset
                </button>
              ) : (
                <button
                  disabled
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-full font-medium flex items-center justify-center gap-2"
                >
                  {isResetting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Resetting...
                    </>
                  ) : (
                    `Resetting in ${timer}s`
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Weight = () => {
  const [currentWeight, setCurrentWeight] = useState(0);
  const [startWeight, setStartWeight] = useState(0);
  const [targetWeight, setTargetWeight] = useState(0);
  const [weightHistory, setWeightHistory] = useState([]);
  const [monthlyGain, setMonthlyGain] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user?.uid);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch weight data when component mounts
  useEffect(() => {
    const fetchWeight = async () => {
      if (!userId) return;
      
      try {
        // First check the weight progress document
        const weightDoc = await getDoc(doc(db, "users", userId, "progress", "weight"));
        
        if (weightDoc.exists()) {
          const data = weightDoc.data();
          setCurrentWeight(data.currentWeight);
          setStartWeight(data.startWeight);
          setTargetWeight(data.targetWeight);
          setWeightHistory(data.history || []);
          
          // Calculate monthly gain
          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();
          const sortedHistory = [...(data.history || [])].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
          const monthEntries = sortedHistory.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate.getMonth() === currentMonth && 
                   entryDate.getFullYear() === currentYear;
          });
          
          if (monthEntries.length >= 2) {
            const firstEntry = monthEntries[monthEntries.length - 1];
            const lastEntry = monthEntries[0];
            setMonthlyGain(lastEntry.weight - firstEntry.weight);
          }
        } else {
          // If no weight progress document exists, check user profile for initial weight
          const userDoc = await getDoc(doc(db, "users", userId));
          if (userDoc.exists() && userDoc.data().weight) {
            const initialWeight = userDoc.data().weight;
            // Create initial weight progress document
            await setDoc(doc(db, "users", userId, "progress", "weight"), {
              currentWeight: initialWeight,
              startWeight: initialWeight,
              targetWeight: initialWeight,
              history: [{
                weight: initialWeight,
                date: new Date().toISOString()
              }],
              updatedAt: new Date().toISOString()
            });
            
            setCurrentWeight(initialWeight);
            setStartWeight(initialWeight);
            setTargetWeight(initialWeight);
            setWeightHistory([{
              weight: initialWeight,
              date: new Date().toISOString()
            }]);
          }
        }
      } catch (error) {
        console.error("Error fetching weight:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) fetchWeight();
  }, [userId]);

  const handleWeightUpdate = async (weightData) => {
    if (!userId) return;

    try {
      // Add new entry to history
      const newEntry = {
        weight: weightData.currentWeight,
        date: new Date().toISOString(),
      };

      const updatedHistory = [...weightHistory, newEntry].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      // Update both the weight document and the main progress document
      await Promise.all([
        // Update the weight progress document
        setDoc(doc(db, "users", userId, "progress", "weight"), {
          currentWeight: weightData.currentWeight,  // This is what StatsCards reads
          startWeight: weightData.startWeight,
          targetWeight: weightData.targetWeight,
          history: updatedHistory,
          updatedAt: new Date().toISOString()
        }),
        
        // Update the main user document for consistency
        updateDoc(doc(db, "users", userId), {
          'weight.current': weightData.currentWeight,
          'weight.start': weightData.startWeight,
          'weight.target': weightData.targetWeight,
          'weight.updatedAt': new Date().toISOString()
        })
      ]);
      
      setStartWeight(weightData.startWeight);
      setCurrentWeight(weightData.currentWeight);
      setTargetWeight(weightData.targetWeight);
      setWeightHistory(updatedHistory);

      // Recalculate monthly gain
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthEntries = updatedHistory.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate.getMonth() === currentMonth && 
               entryDate.getFullYear() === currentYear;
      });
      
      if (monthEntries.length >= 2) {
        const firstEntry = monthEntries[0];
        const lastEntry = monthEntries[monthEntries.length - 1];
        setMonthlyGain(lastEntry.weight - firstEntry.weight);
      }
    } catch (error) {
      console.error("Error updating weight:", error);
    }
  };

  const handleReset = async () => {
    if (!userId) return;

    try {
      await setDoc(doc(db, "users", userId, "progress", "weight"), {
        currentWeight: 0,
        startWeight: 0,
        targetWeight: 0,
        history: [],
        updatedAt: new Date().toISOString()
      });
      
      // Reset local state
      setCurrentWeight(0);
      setStartWeight(0);
      setTargetWeight(0);
      setWeightHistory([]);
      setMonthlyGain(0);
      setShowResetConfirm(false);
    } catch (error) {
      console.error("Error resetting weight:", error);
    }
  };

  // Calculate completion percentage
  const progress = startWeight && targetWeight
    ? ((currentWeight - startWeight) / (targetWeight - startWeight)) * 100
    : 0;
  const completedPercentage = Math.min(Math.max(progress, 0), 100);

  if (isLoading) {
    return (
      <div className="bg-white p-5 rounded-3xl shadow-sm animate-pulse">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center mb-6">
          <div className="h-7 bg-gray-200 rounded-lg w-32"></div>
          <div className="h-9 w-9 bg-gray-200 rounded-xl"></div>
        </div>

        {/* Main Stats Skeleton */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-28"></div>
          </div>
          <div className="text-right">
            <div className="h-4 bg-gray-200 rounded w-24 mb-2 ml-auto"></div>
            <div className="h-7 bg-gray-200 rounded w-20 ml-auto"></div>
          </div>
        </div>

        {/* Progress Section Skeleton */}
        <div className="space-y-2">
          <div className="flex justify-between mb-2">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-8"></div>
          </div>
          
          {/* Progress Bar Skeleton */}
          <div className="h-3 bg-gray-200 rounded-full mb-4"></div>

          {/* Bottom Stats Skeleton */}
          <div className="flex justify-between items-center mt-4">
            <div>
              <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white p-5 rounded-3xl shadow-sm">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Weight Progress</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="bg-red-50 text-red-600 p-2 rounded-xl hover:bg-red-100 transition-colors"
              title="Reset Progress"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </button>
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="bg-black text-white p-2 rounded-xl hover:bg-gray-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          </div>
        </div>

        {/* Main Stats */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-sm text-gray-500">Current Weight</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{currentWeight} kg</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Monthly Change</p>
            <p className={`text-lg font-semibold mt-1 ${monthlyGain > 0 ? 'text-green-600' : monthlyGain < 0 ? 'text-red-600' : 'text-gray-700'}`}>
              {monthlyGain > 0 ? '+' : ''}{monthlyGain.toFixed(1)} kg
            </p>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Progress</span>
            <span>{Math.round(completedPercentage)}%</span>
          </div>
          
          <div className="relative pt-8 pb-4">
            {/* Bubble Indicator */}
            <div
              className="absolute top-0 transition-all duration-300 z-10"
              style={{
                left: `${completedPercentage}%`,
                transform: "translateX(-50%)",
              }}
            >
              <div className="relative">
                <div className="bg-black text-white text-xs px-3 py-1.5 rounded-lg font-medium whitespace-nowrap">
                  {currentWeight} kg
                </div>
                <div className="absolute left-1/2 bottom-[-4px] transform -translate-x-1/2 w-2 h-2 bg-black rotate-45" />
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="absolute h-full bg-black transition-all duration-300 rounded-full"
                style={{ width: `${completedPercentage}%` }}
              />
              <div className="absolute inset-0 flex justify-between px-0.5">
                {[...Array(20)].map((_, index) => (
                  <div key={index} className="h-full w-[1px] bg-white/30" />
                ))}
              </div>
            </div>
          </div>

          {/* Progress Stats */}
          <div className="flex justify-between items-center mt-4">
            <div>
              <p className="text-sm text-gray-500">Starting</p>
              <p className="text-lg font-semibold mt-0.5">{startWeight} kg</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Target</p>
              <p className="text-lg font-semibold mt-0.5">{targetWeight} kg</p>
            </div>
          </div>
        </div>
      </div>

      <WeightInputDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSubmit={handleWeightUpdate}
        initialData={{
          startWeight,
          currentWeight,
          targetWeight
        }}
      />

      <ResetConfirmDrawer 
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={handleReset}
      />
    </>
  );
};

export default Weight;
