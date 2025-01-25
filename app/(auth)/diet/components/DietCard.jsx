"use client"
import React, { useEffect, useState } from 'react';
import { FaCheck, FaEdit, FaTrash } from 'react-icons/fa';
import { IoFastFood, IoNutrition } from 'react-icons/io5';
import { GiMeal } from 'react-icons/gi';
import { db, auth } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc, arrayRemove, arrayUnion, onSnapshot, collection, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import DietDrawer from './DietDrawer';
import toast from 'react-hot-toast';
import DietCardSkeleton from './DietCardSkeleton';

const DietCard = ({ meal, userId, onUpdate }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);
  const [isCompletingAnimation, setIsCompletingAnimation] = useState(false);

  const getTimeStatus = (time) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 5 && hour < 12) return 'Morning';
    if (hour >= 12 && hour < 17) return 'Afternoon';
    if (hour >= 17 && hour < 21) return 'Evening';
    return 'Night';
  };

  const formatTimeToAMPM = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const handleComplete = async () => {
    try {
      setIsCompletingAnimation(true);
      
      const userRef = doc(db, 'users', userId);
      const today = new Date().toISOString().split('T')[0];
      const updatedMeal = { 
        ...meal, 
        completed: true,
        completedDate: today 
      };
      
      await updateDoc(userRef, {
        diet: arrayRemove(meal)
      });
      await updateDoc(userRef, {
        diet: arrayUnion(updatedMeal)
      });
      
      onUpdate();
      toast.success('Meal marked as completed!');
      setShowCompleteConfirm(false);
      
      setTimeout(() => {
        setIsCompletingAnimation(false);
      }, 1000);
    } catch (error) {
      console.error('Error completing meal:', error);
      toast.error('Failed to complete meal');
      setIsCompletingAnimation(false);
    }
  };

  const handleDelete = async () => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        diet: arrayRemove(meal)
      });
      onUpdate();
      toast.success('Meal deleted successfully');
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting meal:', error);
      toast.error('Failed to delete meal');
    }
  };

  return (
    <div className="relative bg-white p-4 md:p-6 rounded-3xl md:rounded-3xl shadow-md hover:shadow-md transition-all duration-300 w-full overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -right-32 -top-32 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl"></div>
        <div className="absolute -left-32 -bottom-32 w-96 h-96 bg-purple-50/50 rounded-full blur-3xl"></div>
      </div>

      {/* Background SVG Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg className="absolute -right-16 -top-16 w-64 h-64 text-blue-600" viewBox="0 0 200 200" fill="none">
          {/* Fork pattern */}
          <path d="M80,20 L80,60 M70,20 L70,60 M90,20 L90,60 M80,60 C80,75 70,80 80,100" 
            stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
          {/* Plate circular pattern */}
          <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="4" strokeDasharray="4 6"/>
          {/* Spoon pattern */}
          <path d="M120,20 C160,20 160,60 120,60 L120,100" 
            stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
        </svg>
        
        <svg className="absolute -left-16 -bottom-16 w-64 h-64 text-purple-600" viewBox="0 0 200 200" fill="none">
          {/* Bowl pattern */}
          <path d="M60,80 C60,140 140,140 140,80 C140,60 100,40 100,40 C100,40 60,60 60,80Z" 
            stroke="currentColor" strokeWidth="4" fill="none"/>
          {/* Steam lines */}
          <path d="M85,30 C85,20 95,20 95,30 M100,25 C100,15 110,15 110,25 M115,30 C115,20 125,20 125,30" 
            stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Completion Overlay */}
      {(meal?.completed || isCompletingAnimation) && (
        <div className={`absolute inset-0 flex items-center justify-center rounded-3xl 
          ${isCompletingAnimation ? 'animate-overlay-fade' : ''}`}
        >
          <div className="absolute inset-0 bg-green-50/90 rounded-3xl" />
          <div className={`relative flex flex-col items-center gap-2 
            ${isCompletingAnimation ? 'animate-check-bounce' : ''}`}
          >
              <div className="bg-green-100 rounded-full p-3">
                <FaCheck className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-green-600 font-semibold text-lg">Completed!</span>
            </div>
          </div>
        )}
        
      <div className={`flex flex-col h-full relative z-10 ${meal?.completed ? 'opacity-50' : ''} 
        ${isCompletingAnimation ? 'animate-content-fade' : ''}`}
      >
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="text-blue-600">
                <IoFastFood className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-2xl md:text-lg font-medium">
                  {meal?.name}
                </h2>
                <span className="text-sm md:text-base text-blue-600">{formatTimeToAMPM(meal?.time)}</span>
              </div>
            </div>
            <div className="bg-blue-600 px-6 md:px-3 md:py-1 py-2 rounded-full">
              <span className="text-sm md:text-sm text-white">{getTimeStatus(meal?.time)}</span>
            </div>
          </div>

          <div className="flex-grow">
            <div className="space-y-3 md:space-y-4">
              {meal?.items?.map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-start justify-between"
                >
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
                    <div className="flex flex-col">
                      <span className="text-lg md:text-base font-medium">{item.name}</span>
                      <div className="text-sm md:text-sm text-gray-500">
                        <span>{item.quantity}g</span>
                        <span className="ml-1">{item.protein}g protein</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-lg md:text-base font-medium">{item.calories}kcal</span>
                </div>
              ))}
            </div>

            <div className="pt-3 md:pt-4 border-t mt-3">
              <div className="flex items-center gap-2">
                <IoNutrition className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                <span className="text-lg md:text-sm text-gray-500">Total Nutrients</span>
              </div>
              <div className="flex gap-2 mt-1">
                <span className="text-lg md:text-base text-blue-600 font-medium">{meal?.totalCalories} kcal</span>
                <span className="text-gray-300">•</span>
                <span className="text-lg md:text-base text-purple-600 font-medium">{meal?.totalProtein}g protein</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            {!meal?.completed && (
              <>
                <button 
                  onClick={() => setShowCompleteConfirm(true)}
                  className="p-4 md:p-2 rounded-full bg-green-50 hover:bg-green-100 text-green-600"
                >
                  <FaCheck className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </button>
                <button 
                  onClick={() => setIsDrawerOpen(true)}
                  className="p-4 md:p-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600"
                >
                  <FaEdit className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </button>
              </>
            )}
            <button 
              onClick={() => setShowDeleteConfirm(true)}
              className="p-4 md:p-2 rounded-full bg-red-50 hover:bg-red-100 text-red-600 z-10"
            >
              <FaTrash className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </button>
          </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl md:rounded-2xl p-6 md:p-6 max-w-sm w-full mx-4">
            <h3 className="text-2xl md:text-lg font-semibold mb-2">Delete Meal</h3>
            <p className="text-sm md:text-base text-gray-600 mb-4">Are you sure you want to delete this meal? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white py-2 rounded-3xl hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-3xl hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complete Confirmation Modal */}
      {showCompleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl md:rounded-2xl p-6 md:p-6 max-w-sm w-full mx-4">
            <h3 className="text-2xl md:text-lg font-semibold mb-2">Complete Meal</h3>
            <p className="text-sm md:text-base text-gray-600 mb-4">Are you sure you want to mark this meal as completed?</p>
            <div className="flex gap-3">
              <button
                onClick={handleComplete}
                className="flex-1 bg-green-600 text-white py-2 rounded-3xl hover:bg-green-700"
              >
                Complete
              </button>
              <button
                onClick={() => setShowCompleteConfirm(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-3xl hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <DietDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        meal={meal}
        userId={userId}
        onUpdate={onUpdate}
      />
    </div>
  );
};

const DietCardList = () => {
  const [dietData, setDietData] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dailyStats, setDailyStats] = useState({
    targetCalories: 3000,
    consumedCalories: 0,
    date: new Date().toISOString().split('T')[0], // Today's date
    isTargetReached: false
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
        setDietData([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Initialize or get daily stats
  useEffect(() => {
    if (!userId) return;

    const userRef = doc(db, 'users', userId);
    const today = new Date().toISOString().split('T')[0];

    const initializeDailyStats = async () => {
      try {
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          
          // When it's a new day, save the previous day's stats to history
          if (!userData.dailyStats || userData.dailyStats.date !== today) {
            // Save only date and target reached status to history
            await updateDoc(userRef, {
              'calorieHistory': arrayUnion({
                date: userData.dailyStats?.date || today,
                isTargetReached: userData.dailyStats?.isTargetReached || false
              })
            });

            // Reset for new day
            await updateDoc(userRef, {
              dailyStats: {
                targetCalories: 3000,
                consumedCalories: 0,
                date: today,
                isTargetReached: false
              }
            });
          }
          
          setDailyStats(userData.dailyStats || {
            targetCalories: 3000,
            consumedCalories: 0,
            date: today,
            isTargetReached: false
          });
        }
      } catch (error) {
        console.error('Error initializing daily stats:', error);
      }
    };

    initializeDailyStats();
  }, [userId]);

  // When updating the target reached status, also update history if newly reached
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const userRef = doc(db, 'users', userId);
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        setDietData(userData.diet || []);
        
        const today = new Date().toISOString().split('T')[0];
        const completedMeals = (userData.diet || []).filter(meal => 
          meal.completed && meal.completedDate === today
        );
        const totalConsumed = completedMeals.reduce((sum, meal) => {
          return sum + (parseInt(meal.totalCalories) || 0);
        }, 0);

        // Check if target is newly reached
        const targetReached = totalConsumed >= dailyStats.targetCalories;
        const wasTargetReached = userData.dailyStats?.isTargetReached || false;
        
        // Update Firebase with new consumed calories and target status
        updateDoc(userRef, {
          'dailyStats.consumedCalories': totalConsumed,
          'dailyStats.isTargetReached': targetReached,
          ...(targetReached && !wasTargetReached ? {
            'dailyStats.targetReachedAt': new Date().toISOString()
          } : {})
        });

        // If target is newly reached, show celebration
        if (targetReached && !wasTargetReached) {
          toast.success('Congratulations! You have reached your daily calorie target! 🎉', {
            duration: 5000,
            icon: '🎯'
          });
        }
        
        setDailyStats(prev => ({
          ...prev,
          consumedCalories: totalConsumed,
          isTargetReached: targetReached
        }));
      } else {
        setDietData([]);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching diet data:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId, dailyStats.targetCalories]);

  // Add this helper function to format numbers
  const formatNumber = (number) => {
    return Number(number).toLocaleString('en-US', {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    });
  };

  const sortMeals = (meals) => {
    const today = new Date().toISOString().split('T')[0];
    return [...meals].sort((a, b) => {
      // First sort by completion status (uncompleted first)
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      // Then sort by time
      return a.time.localeCompare(b.time);
    });
  };

  if (loading) {
    return (
      <>
        {[1, 2, 3].map((index) => (
          <DietCardSkeleton key={index} />
        ))}
      </>
    );
  }

  if (dietData.length === 0) {
    return (
      <div className="col-span-full  flex flex-col items-center justify-center p-8  bg-white rounded-3xl">
        <svg className="w-48 h-48 text-gray-300 mb-6" viewBox="0 0 200 200" fill="none">
          {/* Main plate */}
          <ellipse cx="100" cy="110" rx="70" ry="20" stroke="currentColor" strokeWidth="3"/>
          <path d="M30,110 C30,90 170,90 170,110" stroke="currentColor" strokeWidth="3" fill="none"/>
          
          {/* Decorative patterns on plate */}
          <circle cx="100" cy="110" r="50" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6"/>
          <circle cx="100" cy="110" r="35" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6"/>
          
          {/* Floating utensils */}
          <g transform="translate(-20,-20) rotate(-15 100 100)">
            {/* Fork */}
            <path d="M80,60 L80,90 M90,60 L90,90 M100,60 L100,90 M90,90 C90,110 80,120 90,140" 
              stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
          </g>
          
          <g transform="translate(20,-20) rotate(15 100 100)">
            {/* Spoon */}
            <path d="M120,60 C150,60 150,90 120,90 L120,140" 
              stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
            <ellipse cx="135" cy="60" rx="15" ry="10" 
              stroke="currentColor" strokeWidth="3" transform="rotate(-15 135 60)"/>
          </g>
          
          {/* Steam lines */}
          <path d="M70,45 C70,35 80,35 80,45 M90,40 C90,30 100,30 100,40 M110,35 C110,25 120,25 120,35" 
            stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0 0; 0 -5; 0 0"
              dur="3s"
              repeatCount="indefinite"/>
          </path>
        </svg>
        <div className="text-gray-500 text-center">
          <p className="text-lg font-medium mb-2">No meals added yet</p>
          <p className="text-sm">Start by adding your first meal!</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Daily Calories Progress Card */}
      <div className="relative col-span-full bg-white p-6 rounded-3xl shadow-md mb-4 overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Daily Calories</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-500">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-500">Pending</span>
            </div>
            <div className="text-sm text-gray-500">
              Target: {formatNumber(dailyStats.targetCalories)} kcal
            </div>
          </div>
        </div>

        {/* Progress bar with gradient effect when completed */}
        <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`absolute h-full transition-all duration-500 ${
              dailyStats.isTargetReached 
                ? 'bg-gradient-to-r from-green-500 via-green-400 to-green-500 animate-gradient'
                : 'bg-blue-600'
            }`}
            style={{ 
              width: `${Math.min((dailyStats.consumedCalories / dailyStats.targetCalories) * 100, 100)}%`,
              backgroundSize: '200% 100%'
            }}
          />
        </div>

        <div className="mt-2 flex justify-between text-sm">
          <span className={`font-medium flex items-center gap-2 ${
            dailyStats.isTargetReached ? 'text-green-600' : 'text-blue-600'
          }`}>
            {formatNumber(dailyStats.consumedCalories)} kcal consumed
            {dailyStats.isTargetReached && (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold animate-bounce">
                🎉 Goal Achieved!
              </span>
            )}
          </span>
          <span className="text-gray-500">
            {dailyStats.isTargetReached ? (
              <span className="text-green-600 font-medium">
                Excellent work! +{formatNumber(dailyStats.consumedCalories - dailyStats.targetCalories)} kcal
              </span>
            ) : (
              `${formatNumber(Math.max(dailyStats.targetCalories - dailyStats.consumedCalories, 0))} kcal remaining`
            )}
          </span>
        </div>

        {/* Confetti effect when target is reached */}
        {dailyStats.isTargetReached && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-1 h-1 bg-blue-500 animate-confetti-1"></div>
            <div className="absolute top-0 left-1/2 w-1 h-1 bg-green-500 animate-confetti-2"></div>
            <div className="absolute top-0 right-1/4 w-1 h-1 bg-yellow-500 animate-confetti-3"></div>
            <div className="absolute -top-2 left-1/3 w-1 h-1 bg-purple-500 animate-confetti-4"></div>
            <div className="absolute -top-2 right-1/3 w-1 h-1 bg-pink-500 animate-confetti-5"></div>
            <div className="absolute top-0 left-2/3 w-1 h-1 bg-red-500 animate-confetti-6"></div>
            
            {/* Shiny overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10 animate-shine"></div>
          </div>
        )}
      </div>

      {/* Status Summary */}
      <div className="col-span-full mb-4">
        <div className="flex justify-between items-center text-sm text-gray-500">
          <div>
            Total Meals: {dietData.length}
          </div>
          <div className="flex gap-4">
            <div>
              Completed: {dietData.filter(meal => meal.completed && meal.completedDate === new Date().toISOString().split('T')[0]).length}
            </div>
            <div>
              Pending: {dietData.filter(meal => !meal.completed).length}
            </div>
          </div>
        </div>
      </div>

      {/* Sorted meal cards */}
      {sortMeals(dietData).map((meal, index) => (
        <DietCard 
          key={index} 
          meal={meal} 
          userId={userId}
          onUpdate={() => {}}
        />
      ))}
    </>
  );
};

const CalorieHistory = ({ userId }) => {
  const [history, setHistory] = useState([]);
  
  useEffect(() => {
    if (!userId) return;
    
    const userRef = doc(db, 'users', userId);
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        setHistory(userData.calorieHistory || []);
      }
    });

    return () => unsubscribe();
  }, [userId]);

  return (
    <div className="col-span-full bg-white p-6 rounded-3xl shadow-md mt-4">
      <h2 className="text-xl font-semibold mb-4">Calorie History</h2>
      <div className="space-y-3">
        {history.slice(0, 7).map((day, index) => (
          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${day.isTargetReached ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-gray-600">{new Date(day.date).toLocaleDateString()}</span>
            </div>
            <div>
              {day.isTargetReached ? 
                <span className="text-green-600">Target Reached ✓</span> : 
                <span className="text-red-600">Not Reached</span>
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DietCardList;

<style jsx>{`
  @keyframes gradient {
    0% { background-position: 0% 50%; }
    100% { background-position: 100% 50%; }
  }

  @keyframes confetti {
    0% { transform: translateY(0) rotate(0deg); }
    100% { transform: translateY(100vh) rotate(360deg); }
  }

  @keyframes shine {
    from { transform: translateX(-100%); }
    to { transform: translateX(100%); }
  }

  .animate-gradient {
    animation: gradient 2s linear infinite;
  }

  .animate-confetti-1 {
    animation: confetti 2s ease-out infinite;
  }
  .animate-confetti-2 {
    animation: confetti 2.5s ease-out infinite 0.2s;
  }
  .animate-confetti-3 {
    animation: confetti 2.3s ease-out infinite 0.4s;
  }
  .animate-confetti-4 {
    animation: confetti 2.7s ease-out infinite 0.6s;
  }
  .animate-confetti-5 {
    animation: confetti 2.4s ease-out infinite 0.8s;
  }
  .animate-confetti-6 {
    animation: confetti 2.6s ease-out infinite 1s;
  }

  .animate-shine {
    animation: shine 2s linear infinite;
  }
`}</style>
