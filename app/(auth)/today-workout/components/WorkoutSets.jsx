import React, { useState, useEffect } from 'react';
import { 
  IoAddOutline, 
  IoRemoveOutline, 
  IoBarbell, 
  IoRepeat 
} from "react-icons/io5";
import { toast } from "react-hot-toast";

export default function WorkoutSets({ exercise, onSave, onClose }) {
  const [sets, setSets] = useState([{ weight: '', reps: '' }]);

  // Load existing sets when the drawer opens
  useEffect(() => {
    if (exercise.sets && exercise.sets.length > 0) {
      setSets(exercise.sets);
    }
  }, [exercise]);

  const addSet = () => {
    // Add new empty set instead of copying last set's values
    setSets([...sets, { weight: '', reps: '' }]);
  };

  const removeSet = (index) => {
    setSets(sets.filter((_, i) => i !== index));
  };

  const updateSet = (index, field, value) => {
    const newSets = [...sets];
    newSets[index][field] = value;
    setSets(newSets);
  };

  const handleSave = () => {
    const validSets = sets.filter(set => set.weight && set.reps);
    if (validSets.length === 0) {
      toast.error('Please add at least one set with weight and reps');
      return;
    }
    onSave(exercise, validSets);
    onClose(); // Close the drawer after saving
  };

  return (
    <div className="space-y-6">
      {/* Previous Sets Summary if any */}
      {exercise.history && exercise.history.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-xl">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Last Workout</h3>
          <div className="text-sm text-gray-500">
            {exercise.history[exercise.history.length - 1].sets.map((set, idx) => (
              <span key={idx} className="inline-block mr-3">
                {set.weight}kg × {set.reps}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Previous Best */}
      {exercise.history && exercise.history.length > 1 && (
        <div className="bg-gray-50 p-4 rounded-xl">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Previous Best</h3>
          <div className="space-y-1">
            {exercise.history.slice().reverse().find(entry => 
              entry.sets.some(set => set.weight > 0 || set.reps > 0)
            )?.sets.map((set, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Set {idx + 1}</span>
                <span className="text-gray-600 font-medium">
                  {set.weight}kg × {set.reps}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Sets */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm font-medium text-gray-600 px-2">
          <span className="w-16">Set</span>
          <span className="flex-1 text-center">Weight (kg)</span>
          <span className="flex-1 text-center">Reps</span>
          <span className="w-12"></span>
        </div>

        {sets.map((set, index) => (
          <div 
            key={index} 
            className="flex items-center gap-4 p-3 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <span className="text-sm font-semibold w-16 text-blue-600">
              Set {index + 1}
            </span>
            <div className="flex-1 relative">
              <IoBarbell className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                placeholder="Weight"
                value={set.weight}
                onChange={(e) => updateSet(index, 'weight', e.target.value)}
                className="w-full p-2 pl-10 text-center border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex-1 relative">
              <IoRepeat className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                placeholder="Reps"
                value={set.reps}
                onChange={(e) => updateSet(index, 'reps', e.target.value)}
                className="w-full p-2 pl-10 text-center border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="button"
              onClick={() => removeSet(index)}
              className="w-12 h-10 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <IoRemoveOutline className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
      
      {/* Actions */}
      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={addSet}
          className="flex items-center justify-center gap-2 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl border-2 border-blue-100 flex-1 font-medium transition-colors"
        >
          <IoAddOutline className="w-5 h-5" />
          Add Set
        </button>
        
        <button
          type="button"
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl flex-1 font-medium hover:bg-blue-700 transition-colors"
        >
          Save Progress
        </button>
      </div>
    </div>
  );
} 