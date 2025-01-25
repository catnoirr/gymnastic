"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { auth } from "@/lib/firebase";
import { updateProfile } from "firebase/auth";
import { FaUser } from "react-icons/fa";

export default function ProfileEditDrawer({ isOpen, onClose, onUpdate }) {
  const [displayName, setDisplayName] = useState(auth.currentUser?.displayName || '');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      window.scrollTo({
        top: window.innerHeight / 2,
        behavior: 'smooth'
      });
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await updateProfile(auth.currentUser, {
        displayName: displayName
      });
      onUpdate({ displayName }); // Update local state in parent
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-[1000]"
          />

          {/* Drawer - Mobile Bottom Sheet / Desktop Modal */}
          <motion.div
            initial={{ 
              opacity: 0,
              y: window.innerWidth < 640 ? "100%" : 0,
              scale: window.innerWidth < 640 ? 1 : 0.95,
            }}
            animate={{ 
              opacity: 1,
              y: 0,
              scale: 1
            }}
            exit={{ 
              opacity: 0,
              y: window.innerWidth < 640 ? "100%" : 0,
              scale: window.innerWidth < 640 ? 1 : 0.95,
            }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`
              fixed bg-white z-[1001] p-6 overflow-y-auto
              ${window.innerWidth < 640 
                ? 'bottom-0 left-0 right-0 rounded-t-3xl max-h-[90vh]' 
                : 'top-[50vh] left-[30vw]  -translate-x-1/2 -translate-y-1/2 rounded-3xl w-[500px]'
              }
            `}
            style={{
              maxHeight: window.innerWidth < 640 ? '90vh' : 'min(90vh, 600px)',
            }}
          >
            {/* Handle/Pill for mobile */}
            <div className="sm:hidden w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />

            {/* Close button */}
            <div className="absolute right-6 top-6">
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <IoClose className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3.5 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200">
                  <FaUser className="text-blue-600" size={22} />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Edit Profile</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                    Display Name
                  </label>
                  <input
                    type="text"
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your name"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-70"
                >
                  {isLoading ? 'Updating...' : 'Save Changes'}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}