"use client";
import React, { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { FiClock, FiPlusCircle, FiSave, FiTrash2 } from "react-icons/fi";
import { GiMeal, GiWeightScale } from "react-icons/gi";
import { BiCalendar } from "react-icons/bi";
import { FaFire, FaDumbbell } from "react-icons/fa";
import toast, { Toaster } from 'react-hot-toast';
import { FoodIllustration, HealthyFoodPattern } from './illustrations';

const AddDiet = () => {
  const [meal, setMeal] = useState({
    name: "",
    time: "",
    items: [{ name: "", quantity: "", calories: "", protein: "" }],
    totalCalories: "",
    totalProtein: "",
  });

  useEffect(() => {
    calculateTotals();
  }, [meal.items]);

  const calculateTotals = () => {
    const totals = meal.items.reduce((acc, item) => {
      const calories = parseFloat(item.calories) || 0;
      const protein = parseFloat(item.protein) || 0;
      
      return {
        calories: acc.calories + calories,
        protein: acc.protein + protein
      };
    }, { calories: 0, protein: 0 });

    setMeal(prev => ({
      ...prev,
      totalCalories: totals.calories.toString(),
      totalProtein: totals.protein.toString()
    }));
  };

  const removeItem = (index) => {
    const items = [...meal.items];
    const removedItem = items[index].name || 'Item';
    items.splice(index, 1);
    setMeal({ ...meal, items });

    toast.success(`${removedItem} removed`, {
      duration: 2000,
      position: 'top-center',
      style: {
        background: '#333',
        color: '#fff',
        borderRadius: '2rem',
      },
      icon: '🗑️',
    });
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const items = [...meal.items];
    items[index][name] = value;
    setMeal({ ...meal, items });
  };

  const handleMealChange = (e) => {
    const { name, value } = e.target;
    setMeal({ ...meal, [name]: value });
  };

  const addItem = () => {
    setMeal({
      ...meal,
      items: [
        ...meal.items,
        { name: "", quantity: "", calories: "", protein: "" },
      ],
    });

    // Show toast notification
    toast.success('New item added', {
      duration: 2000,
      position: 'top-center',
      style: {
        background: '#333',
        color: '#fff',
        borderRadius: '2rem',
      },
    });

    // Scroll to bottom after a short delay to ensure new item is rendered
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    }, 100);
  };

  const saveMeal = async () => {
    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        toast.error("User not authenticated", {
          duration: 2000,
          position: 'top-center',
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '2rem',
          },
        });
        return;
      }

      const userRef = doc(db, "users", currentUser.uid);

      await updateDoc(userRef, {
        diet: arrayUnion(meal),
      });

      toast.success('Meal saved successfully!', {
        duration: 2000,
        position: 'top-center',
        style: {
          background: '#333',
          color: '#fff',
          borderRadius: '2rem',
        },
        icon: '✅',
      });

      setMeal({
        name: "",
        time: "",
        items: [{ name: "", quantity: "", calories: "", protein: "" }],
        totalCalories: "",
        totalProtein: "",
      });
    } catch (error) {
      console.error("Error saving meal: ", error);
      toast.error("Failed to save meal. Please try again.", {
        duration: 2000,
        position: 'top-center',
        style: {
          background: '#333',
          color: '#fff',
          borderRadius: '2rem',
        },
      });
    }
  };

  return (
    <div className="relative w-full min-h-screen ">
      {/* <HealthyFoodPattern /> */}
      <Toaster />
      
      <div className=" md:px-4">
        {/* Header Section */}
        

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left Column - Form */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-lg font-medium text-gray-700">
                  <GiMeal className="text-2xl text-indigo-600" />
                  Meal Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={meal.name}
                  onChange={handleMealChange}
                  className="w-full p-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white transition-all duration-200"
                  placeholder="e.g., Breakfast"
                />
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-2 text-lg font-medium text-gray-700">
                  <FiClock className="text-2xl text-indigo-600" />
                  Time
                </label>
                <input
                  type="time"
                  name="time"
                  value={meal.time}
                  onChange={handleMealChange}
                  className="w-full p-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Illustration */}
          <div className="hidden md:flex justify-center items-center">
            <FoodIllustration />
          </div>
        </div>

        {/* Items Section */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-8">
            <h3 className="flex items-center gap-2 text-2xl font-semibold text-gray-800">
              <BiCalendar className="text-2xl text-indigo-600" />
              Food Items
            </h3>
            <button
              onClick={addItem}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-3xl shadow-md hover:shadow-lg transition-all duration-200"
            >
              <FiPlusCircle />
              Add Item
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {meal.items.map((item, index) => (
              <div
                key={index}
                className="bg-white border border-gray-100 rounded-3xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Item {index + 1}</span>
                    <button
                      onClick={() => removeItem(index)}
                      className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-full"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-black mb-2">
                        <GiMeal className="text-black" />
                        Item Name
                      </label>
                    </div>

                    <input
                      type="text"
                      name="name"
                      value={item.name}
                      onChange={(e) => handleInputChange(e, index)}
                      className="w-full p-3 border shadow-md rounded-full focus:outline-none focus:ring-2 focus:ring-black bg-white"
                      placeholder="e.g., Oats"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="flex items-center gap-2 text-sm font-medium text-black mb-2">
                      <GiWeightScale className="text-black" />
                      Quantity (g)
                    </label>
                    <input
                      type="text"
                      name="quantity"
                      value={item.quantity}
                      onChange={(e) => handleInputChange(e, index)}
                      className="w-full p-3 border shadow-md rounded-full focus:outline-none focus:ring-2 focus:ring-black bg-white"
                      placeholder="e.g., 80"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="flex items-center gap-2 text-sm font-medium text-black mb-2">
                      <FaFire className="text-black" />
                      Calories (kcal)
                    </label>
                    <input
                      type="text"
                      name="calories"
                      value={item.calories}
                      onChange={(e) => handleInputChange(e, index)}
                      className="w-full p-3 border shadow-md rounded-full focus:outline-none focus:ring-2 focus:ring-black bg-white"
                      placeholder="e.g., 320"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="flex items-center gap-2 text-sm font-medium text-black mb-2">
                      <FaDumbbell className="text-black" />
                      Protein (g)
                    </label>
                    <input
                      type="text"
                      name="protein"
                      value={item.protein}
                      onChange={(e) => handleInputChange(e, index)}
                        className="w-full p-3 border shadow-md rounded-full focus:outline-none focus:ring-2 focus:ring-black bg-white"
                      placeholder="e.g., 12"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals Section */}
        <div className="mt-12 bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-lg font-medium text-gray-700">
                <FaFire className="text-2xl text-indigo-600" />
                Total Calories
              </label>
              <input
                type="text"
                name="totalCalories"
                value={meal.totalCalories}
                readOnly
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-full cursor-not-allowed"
                placeholder="Auto-calculated"
              />
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2 text-lg font-medium text-gray-700">
                <FaDumbbell className="text-2xl text-indigo-600" />
                Total Protein
              </label>
              <input
                type="text"
                name="totalProtein"
                value={meal.totalProtein}
                readOnly
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-full cursor-not-allowed"
                placeholder="Auto-calculated"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={saveMeal}
          className="w-full mt-8 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-4 rounded-full text-lg font-bold shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <GiMeal className="text-2xl" />
          Save Meal
        </button>
      </div>
    </div>
  );
};

export default AddDiet;
