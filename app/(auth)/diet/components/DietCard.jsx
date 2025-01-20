import React from 'react';
import { FaCheck, FaEdit, FaTrash } from 'react-icons/fa';

const DietCard = () => {
  return (
    <div className="bg-green-100 p-6 rounded-3xl shadow-md w-full max-w-sm">
      <h2 className="text-lg font-bold text-black mb-2">Meal 1: Breakfast (8:00 AM)</h2>
      <ul className="text-black text-sm space-y-1">
        <li>Oats - 80g (320 kcal, 12g protein)</li>
        <li>Milk (skimmed) - 250g (88 kcal, 8g protein)</li>
        <li>Boiled eggs - 3g (240 kcal, 18g protein)</li>
        <li>Banana - 100g (89 kcal, 1g protein)</li>
      </ul>
      <div className="mt-4 text-lg">
        <p className="text-black text-xl">Total Calories: <span className="font-semibold">737 kcal</span></p>
        <p className="text-black text-xl">Total Protein: <span className="font-semibold">39g</span></p>
      </div>
      <div className="flex items-end justify-end gap-2 mt-4">
        <button className="bg-green-200 p-2 rounded-full hover:bg-green-300">
          <FaCheck className="text-green-700" />
        </button>
        <button className="bg-yellow-200 p-2 rounded-full hover:bg-yellow-300">
          <FaEdit className="text-yellow-700" />
        </button>
        <button className="bg-red-200 p-2 rounded-full hover:bg-red-300">
          <FaTrash className="text-red-700" />
        </button>
      </div>
    </div>
  );
};

export default DietCard;
