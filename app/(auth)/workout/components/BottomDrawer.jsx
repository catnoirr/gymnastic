import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";

export default function BottomDrawer({ isOpen, onClose, children }) {
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

          {/* Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 md:top-auto sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2  left-0 right-0 sm:left-96 sm:right-1 sm:-translate-x-1/2 bg-white rounded-t-3xl sm:rounded-3xl z-[1001] p-6 max-h-[90vh] sm:max-w-[600px] overflow-y-auto"
          >
            <div className="absolute right-6 top-6">
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <IoClose className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <div className="w-full flex justify-center mb-8 sm:hidden">
              <div className="w-16 h-1.5 bg-gray-200 rounded-full" />
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
