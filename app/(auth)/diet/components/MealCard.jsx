import React from "react";

const MealCard = ({ meal }) => {
  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-2">
        {meal.name}: {meal.time}
      </h3>
      <ul className="mb-4">
        {meal.items.map((item, index) => (
          <li key={index} className="text-gray-700">
            {item.name} - {item.quantity}g ({item.calories} kcal, {item.protein}g protein)
          </li>
        ))}
      </ul>
      <p className="font-semibold text-gray-800">
        Total Calories: <span className="text-green-600">{meal.totalCalories} kcal</span>
      </p>
      <p className="font-semibold text-gray-800">
        Total Protein: <span className="text-green-600">{meal.totalProtein}g</span>
      </p>
    </div>
  );
};

export default MealCard;
