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
      const updatedMeal = { ...meal, completed: true };
      await updateDoc(userRef, {
        diet: arrayRemove(meal)
      });
      await updateDoc(userRef, {
        diet: arrayUnion(updatedMeal)
      });
      
      onUpdate();
      toast.success('Meal marked as completed!');
      setShowCompleteConfirm(false);
      
      // Remove animation after 1 second
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
    <div className="relative bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-md hover:shadow-md transition-all duration-300 w-full">
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
        
      <div className={`flex flex-col h-full ${meal?.completed ? 'opacity-50' : ''} 
        ${isCompletingAnimation ? 'animate-content-fade' : ''}`}
      >
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="text-blue-600">
                <IoFastFood className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-base md:text-lg font-medium">
                  {meal?.name}
                </h2>
                <span className="text-sm md:text-base text-blue-600">{formatTimeToAMPM(meal?.time)}</span>
              </div>
            </div>
            <div className="bg-blue-600 px-2 md:px-3 py-1 rounded-full">
              <span className="text-xs md:text-sm text-white">{getTimeStatus(meal?.time)}</span>
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
                      <span className="text-sm md:text-base font-medium">{item.name}</span>
                      <div className="text-xs md:text-sm text-gray-500">
                        <span>{item.quantity}g</span>
                        <span className="ml-1">{item.protein}g protein</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-sm md:text-base font-medium">{item.calories}kcal</span>
                </div>
              ))}
            </div>

            <div className="pt-3 md:pt-4 border-t mt-3">
              <div className="flex items-center gap-2">
                <IoNutrition className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                <span className="text-xs md:text-sm text-gray-500">Total Nutrients</span>
              </div>
              <div className="flex gap-2 mt-1">
                <span className="text-sm md:text-base text-blue-600 font-medium">{meal?.totalCalories} kcal</span>
                <span className="text-gray-300">•</span>
                <span className="text-sm md:text-base text-purple-600 font-medium">{meal?.totalProtein}g protein</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            {!meal?.completed && (
              <>
                <button 
                  onClick={() => setShowCompleteConfirm(true)}
                  className="p-1.5 md:p-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-600"
                >
                  <FaCheck className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </button>
                <button 
                  onClick={() => setIsDrawerOpen(true)}
                  className="p-1.5 md:p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600"
                >
                  <FaEdit className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </button>
              </>
            )}
            <button 
              onClick={() => setShowDeleteConfirm(true)}
              className="p-1.5 md:p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 z-10"
            >
              <FaTrash className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </button>
          </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 max-w-sm w-full mx-4">
            <h3 className="text-base md:text-lg font-semibold mb-2">Delete Meal</h3>
            <p className="text-sm md:text-base text-gray-600 mb-4">Are you sure you want to delete this meal? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200"
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
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 max-w-sm w-full mx-4">
            <h3 className="text-base md:text-lg font-semibold mb-2">Complete Meal</h3>
            <p className="text-sm md:text-base text-gray-600 mb-4">Are you sure you want to mark this meal as completed?</p>
            <div className="flex gap-3">
              <button
                onClick={handleComplete}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
              >
                Complete
              </button>
              <button
                onClick={() => setShowCompleteConfirm(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200"
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
      } else {
        setDietData([]);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching diet data:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

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
      <div className="col-span-full flex flex-col items-center justify-center p-8 bg-white rounded-3xl">
        <div className="text-gray-500 text-center">
          <p className="text-lg font-medium mb-2">No meals added yet</p>
          <p className="text-sm">Start by adding your first meal!</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {dietData.map((meal, index) => (
        <DietCard 
          key={index} 
          meal={meal} 
          userId={userId}
          onUpdate={() => {}} // Remove onUpdate as we're using real-time updates
        />
      ))}
    </>
  );
};

export default DietCardList;
