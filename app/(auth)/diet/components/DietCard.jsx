import React from 'react';
import { FaCheck, FaEdit, FaTrash } from 'react-icons/fa';
import { IoFastFood, IoNutrition } from 'react-icons/io5';
import { GiMeal } from 'react-icons/gi';

const DietCard = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 w-full max-w-sm border border-blue-100">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <GiMeal className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex flex-col gap-0.5">
              <h2 className="text-lg font-semibold text-gray-800 font-poppins">
                Meal 1: Breakfast
              </h2>
              <span className="text-sm text-blue-600 font-medium">8:00 AM</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-3 py-1 rounded-full shadow-sm">
            <span className="text-sm font-medium text-white">Morning</span>
          </div>
        </div>

        <ul className="space-y-2">
          {[
            { name: 'Oats', amount: '80g', calories: 320, protein: 12 },
            { name: 'Milk (skimmed)', amount: '250g', calories: 88, protein: 8 },
            { name: 'Boiled eggs', amount: '3g', calories: 240, protein: 18 },
            { name: 'Banana', amount: '100g', calories: 89, protein: 1 }
          ].map((item, index) => (
            <li 
              key={index} 
              className="flex items-center justify-between py-3 px-4 bg-white rounded-xl hover:bg-gray-50 transition-colors duration-200 shadow-sm hover:shadow-md border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"></div>
                <div className="flex flex-col">
                  <span className="text-gray-800 font-medium">{item.name}</span>
                  <span className="text-xs text-gray-500">{item.amount}</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-gray-800 font-medium">{item.calories} kcal</span>
                <span className="text-xs text-gray-500">{item.protein}g protein</span>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl">
              <IoNutrition className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="text-xs font-medium text-gray-500">Total Nutrients</p>
              <div className="flex gap-2">
                <p className="text-base font-semibold text-blue-600">737 kcal</p>
                <span className="text-gray-400">•</span>
                <p className="text-base font-semibold text-purple-600">39g protein</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-2">
          <button 
            className="p-2 rounded-xl bg-green-50 hover:bg-green-100 text-green-600 transition-all duration-200 hover:scale-105"
            title="Complete"
          >
            <FaCheck className="w-4 h-4" />
          </button>
          <button 
            className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 transition-all duration-200 hover:scale-105"
            title="Edit"
          >
            <FaEdit className="w-4 h-4" />
          </button>
          <button 
            className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-all duration-200 hover:scale-105"
            title="Delete"
          >
            <FaTrash className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DietCard;
