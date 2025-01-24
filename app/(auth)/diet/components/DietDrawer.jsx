"use client"
import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { doc, updateDoc, deleteDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import toast from 'react-hot-toast';

const DietDrawer = ({ isOpen, onClose, meal, userId, onUpdate }) => {
  const [editedMeal, setEditedMeal] = useState(meal);

  const handleSave = async () => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        diet: arrayRemove(meal)
      });
      await updateDoc(userRef, {
        diet: arrayUnion(editedMeal)
      });
      onUpdate();
      onClose();
      toast.success('Meal updated successfully');
    } catch (error) {
      console.error('Error updating meal:', error);
      toast.error('Failed to update meal');
    }
  };

  const formatTimeToAMPM = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 space-y-4 animate-slide-up">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Edit Meal</h2>
          <button onClick={onClose} className="p-2">
            <IoClose className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meal Name</label>
            <input
              type="text"
              value={editedMeal?.name || ''}
              onChange={(e) => setEditedMeal({ ...editedMeal, name: e.target.value })}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <input
              type="time"
              value={editedMeal?.time || ''}
              onChange={(e) => setEditedMeal({ ...editedMeal, time: e.target.value })}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* Add more fields for items, calories, etc. */}

          <div className="flex gap-4 pt-4">
            <button
              onClick={handleSave}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DietDrawer; 