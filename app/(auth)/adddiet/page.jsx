"use client";
import React, { useState } from 'react';
import { db, auth } from '@/lib/firebase'; // Assuming you export `db` and `auth` from firebase.js
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';

const AddDiet = () => {
  const [meal, setMeal] = useState({
    name: "",
    time: "",
    items: [{ name: "", quantity: "", calories: "", protein: "" }],
    totalCalories: "",
    totalProtein: "",
  });

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
      items: [...meal.items, { name: "", quantity: "", calories: "", protein: "" }],
    });
  };

  const saveMeal = async () => {
    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        alert("User not authenticated");
        return;
      }

      const userRef = doc(db, "users", currentUser.uid);

      await updateDoc(userRef, {
        diet: arrayUnion(meal),
      });

      alert("Meal saved successfully!");
      setMeal({
        name: "",
        time: "",
        items: [{ name: "", quantity: "", calories: "", protein: "" }],
        totalCalories: "",
        totalProtein: "",
      });
    } catch (error) {
      console.error("Error saving meal: ", error);
      alert("Failed to save meal. Please try again.");
    }
  };

  return (
    <div className='w-full'>
    <div className=" max-w-6xl mx-auto p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg border border-green-200 mt-4">
      <h2 className="text-2xl font-extrabold text-green-700 mb-6 text-center">Add Your Meal</h2>

      <div className="grid grid-cols-2 gap-6">
        <div className="mb-6">
          <label className="block text-lg font-medium text-green-800 mb-2">Meal Name</label>
          <input
            type="text"
            name="name"
            value={meal.name}
            onChange={handleMealChange}
            className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="e.g., Breakfast"
          />
        </div>

        <div className="mb-6">
          <label className="block text-lg font-medium text-green-800 mb-2">Time</label>
          <input
            type="time"
            name="time"
            value={meal.time}
            onChange={handleMealChange}
            className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div className="col-span-2">
          <div className='flex justify-between items-center mb-6'>
          <h3 className="text-xl font-semibold text-green-700 mb-4">Items</h3>
          <button
            onClick={addItem}
            className=" bg-green-600 text-white py-3 px-4 rounded-lg  hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            + Add Another Item
          </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {meal.items.map((item, index) => (
              <div key={index} className="p-4 bg-white border border-green-200 rounded-lg shadow-sm">
                <div className="mb-3">
                  <label className="block text-sm font-medium text-green-800 mb-1">Item Name</label>
                  <input
                    type="text"
                    name="name"
                    value={item.name}
                    onChange={(e) => handleInputChange(e, index)}
                    className="w-full p-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="e.g., Oats"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-green-800 mb-1">Quantity (g)</label>
                  <input
                    type="text"
                    name="quantity"
                    value={item.quantity}
                    onChange={(e) => handleInputChange(e, index)}
                    className="w-full p-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="e.g., 80"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-green-800 mb-1">Calories (kcal)</label>
                  <input
                    type="text"
                    name="calories"
                    value={item.calories}
                    onChange={(e) => handleInputChange(e, index)}
                    className="w-full p-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="e.g., 320"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-green-800 mb-1">Protein (g)</label>
                  <input
                    type="text"
                    name="protein"
                    value={item.protein}
                    onChange={(e) => handleInputChange(e, index)}
                    className="w-full p-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="e.g., 12"
                  />
                </div>
              </div>
            ))}
          </div>
        
        </div>

        <div className="mb-6">
          <label className="block text-lg font-medium text-green-800 mb-2">Total Calories</label>
          <input
            type="text"
            name="totalCalories"
            value={meal.totalCalories}
            onChange={handleMealChange}
            className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="e.g., 737"
          />
        </div>

        <div className="mb-6">
          <label className="block text-lg font-medium text-green-800 mb-2">Total Protein</label>
          <input
            type="text"
            name="totalProtein"
            value={meal.totalProtein}
            onChange={handleMealChange}
            className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="e.g., 39"
          />
        </div>
      </div>

      <button
        onClick={saveMeal}
        className="w-full bg-green-500 text-white py-3 rounded-lg text-lg font-bold hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
      >
        Save Meal
      </button>
    </div>
    </div>
  );
};

export default AddDiet;

