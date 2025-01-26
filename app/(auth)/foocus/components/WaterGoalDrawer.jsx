import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import { FiMinus, FiPlus } from 'react-icons/fi';

const WaterGoalDrawer = ({ isOpen, onClose, currentGoal, onUpdateGoal }) => {
  const [goal, setGoal] = useState(currentGoal);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setGoal(currentGoal);
  }, [currentGoal]);

  const handleIncrement = () => {
    setGoal(prev => Math.min(prev + 1, 20)); // Max 20 glasses
  };

  const handleDecrement = () => {
    setGoal(prev => Math.max(prev - 1, 1)); // Min 1 glass
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdateGoal(goal);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] shadow-xl z-50 overflow-hidden"
          >
            <div className="max-w-md mx-auto p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Set Daily Goal</h3>
                  <p className="text-sm text-gray-500">Choose your daily water intake target</p>
                </div>
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full hover:bg-gray-100"
                  disabled={isSaving}
                >
                  <IoClose className="w-5 h-5 text-gray-500" />
                </motion.button>
              </div>

              {/* Goal Selector */}
              <div className="flex items-center justify-center gap-8">
                <motion.button
                  onClick={handleDecrement}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 rounded-xl bg-blue-50 text-blue-500 disabled:opacity-50"
                  disabled={goal <= 1 || isSaving}
                >
                  <FiMinus className="w-5 h-5" />
                </motion.button>

                <div className="text-center">
                  <span className="text-5xl font-light text-gray-900">{goal}</span>
                  <p className="text-sm text-gray-500 mt-1">glasses per day</p>
                </div>

                <motion.button
                  onClick={handleIncrement}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 rounded-xl bg-blue-50 text-blue-500 disabled:opacity-50"
                  disabled={goal >= 20 || isSaving}
                >
                  <FiPlus className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Save Button */}
              <div className="pt-2">
                <motion.button
                  onClick={handleSave}
                  whileHover={{ scale: isSaving ? 1 : 1.02 }}
                  whileTap={{ scale: isSaving ? 1 : 0.98 }}
                  disabled={isSaving}
                  className={`w-full p-4 rounded-2xl font-medium transition-all duration-200
                    ${isSaving 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                    }
                  `}
                >
                  {isSaving ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </div>
                  ) : (
                    'Save Goal'
                  )}
                </motion.button>
              </div>
            </div>

            {/* Bottom Safe Area for Mobile */}
            <div className="h-6 bg-white" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WaterGoalDrawer; 