"use client";
import React, { useState } from "react";
import { db, auth } from "@/lib/firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { FiClock, FiPlusCircle, FiSave, FiTrash2 } from "react-icons/fi";
import { GiMeal, GiWeightScale } from "react-icons/gi";
import { BiCalendar } from "react-icons/bi";
import { FaFire, FaDumbbell } from "react-icons/fa";
import toast, { Toaster } from 'react-hot-toast';

const AddDiet = () => {
  const [meal, setMeal] = useState({
    name: "",
    time: "",
    items: [{ name: "", quantity: "", calories: "", protein: "" }],
    totalCalories: "",
    totalProtein: "",
  });

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
    <div className="w-full">
      <Toaster />
      <div className="pb-20">
        <div className="grid grid-cols-2 gap-8">
          <div className="mb-6">
            <label className="flex items-center gap-2 text-lg font-medium text-black mb-3">
              <GiMeal className="text-2xl text-black" />
              Meal Name
            </label>
            <input
              type="text"
              name="name"
              value={meal.name}
              onChange={handleMealChange}
              className="w-full p-2 border shadow-md rounded-full focus:outline-none focus:ring-2 focus:ring-black bg-gray-100"
              placeholder="e.g., Breakfast"
            />
          </div>

          <div className="mb-6">
            <label className="flex items-center gap-2 text-lg font-medium text-black mb-3">
              <FiClock className="text-2xl text-black" />
              Time
            </label>
            <input
              type="time"
              name="time"
              value={meal.time}
              onChange={handleMealChange}
              placeholder="e.g., 8:00 AM"
              className="w-full p-2 border shadow-md rounded-full focus:outline-none focus:ring-2 focus:ring-black bg-gray-100"
            />
          </div>

          <div className="col-span-2">
            <div className="flex justify-between items-center mb-8">
              <h3 className="flex items-center gap-2 text-2xl font-semibold text-black">
                <BiCalendar className="text-2xl" />
                Items
              </h3>
              <button
                onClick={addItem}
                className="flex items-center gap-2 bg-black text-white py-3 px-6 rounded-3xl  focus:outline-none focus:ring-2  transition-all"
              >
                <FiPlusCircle />
                Add Another Item
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {meal.items.map((item, index) => (
                <div
                  key={index}
                  className="p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50  border rounded-3xl shadow-md hover:shadow-md transition-all"
                >
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-black mb-2">
                        <GiMeal className="text-black" />
                        Item Name
                      </label>
                      <button
                        onClick={() => removeItem(index)}
                        className=" text-red-500 hover:text-red-700 transition-colors"
                      >
                        <FiTrash2 size={20} />
                      </button>
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
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="flex items-center gap-2 text-lg font-medium text-black mb-3">
              <FaFire className="text-2xl text-black" />
              Total Calories
            </label>
            <input
              type="text"
              name="totalCalories"
              value={meal.totalCalories}
              onChange={handleMealChange}
              className="w-full p-4 border shadow-md rounded-full focus:outline-none focus:ring-2 focus:ring-black bg-gray-100"
              placeholder="e.g., 737"
            />
          </div>

          <div className="mb-6">
            <label className="flex items-center gap-2 text-lg font-medium text-black mb-3">
              <FaDumbbell className="text-2xl text-black" />
              Total Protein
            </label>
            <input
              type="text"
              name="totalProtein"
              value={meal.totalProtein}
              onChange={handleMealChange}
              className="w-full p-4 border shadow-md rounded-full focus:outline-none focus:ring-2 focus:ring-black bg-gray-100"
              placeholder="e.g., 39"
            />
          </div>
        </div>

        <button
          onClick={saveMeal}
          className="w-full mt-8 bg-gradient-to-r from-black to-black text-white py-4 rounded-full text-lg font-bold  focus:outline-none focus:ring-2  transition-all flex items-center justify-center gap-2"
        >
          <FiSave className="text-xl" />
          Save Meal
        </button>
      </div>
    </div>
  );
};

export default AddDiet;
