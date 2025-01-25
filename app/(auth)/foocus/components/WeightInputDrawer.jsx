"use client";
import { useState, useEffect, useRef } from "react";

const WeightInputDrawer = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    startWeight: initialData.startWeight || "",
    currentWeight: initialData.currentWeight || "",
    targetWeight: initialData.targetWeight || ""
  });
  
  const drawerRef = useRef(null);

  // Reset form data when drawer opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        startWeight: initialData.startWeight || "",
        currentWeight: initialData.currentWeight || "",
        targetWeight: initialData.targetWeight || ""
      });
    }
  }, [isOpen, initialData]);

  // Scroll to drawer when it opens
  useEffect(() => {
    if (isOpen && drawerRef.current) {
      drawerRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Drawer/Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto" onClick={onClose}>
        <div className="flex min-h-full items-end justify-center sm:items-center p-0">
          <div 
            ref={drawerRef}
            className="w-full sm:w-[28rem] bg-white rounded-t-3xl sm:rounded-3xl transform transition-all shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Handle for mobile */}
            <div className="sm:hidden w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-4" />
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-gray-900">Update Weight</h3>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-5">
                  <div className="bg-gray-50 p-5 rounded-2xl">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Starting Weight
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        required
                        placeholder="0.0"
                        className="w-full text-3xl font-semibold bg-transparent border-none focus:ring-0 p-0 text-gray-900"
                        value={formData.startWeight}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          startWeight: parseFloat(e.target.value)
                        }))}
                      />
                      <span className="absolute right-0 top-1/2 -translate-y-1/2 text-xl text-gray-400">kg</span>
                    </div>
                  </div>

                  <div className="bg-blue-500 p-5 rounded-2xl">
                    <label className="block text-sm font-medium text-blue-100 mb-2">
                      Current Weight
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        required
                        placeholder="0.0"
                        className="w-full text-3xl font-semibold bg-transparent border-none focus:ring-0 p-0 text-white placeholder-blue-300"
                        value={formData.currentWeight}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          currentWeight: parseFloat(e.target.value)
                        }))}
                      />
                      <span className="absolute right-0 top-1/2 -translate-y-1/2 text-xl text-blue-200">kg</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-5 rounded-2xl">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Target Weight
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        required
                        placeholder="0.0"
                        className="w-full text-3xl font-semibold bg-transparent border-none focus:ring-0 p-0 text-gray-900"
                        value={formData.targetWeight}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          targetWeight: parseFloat(e.target.value)
                        }))}
                      />
                      <span className="absolute right-0 top-1/2 -translate-y-1/2 text-xl text-gray-400">kg</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-4 border border-gray-200 rounded-2xl text-gray-600 hover:bg-gray-50 font-medium transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-4 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 font-medium transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WeightInputDrawer; 