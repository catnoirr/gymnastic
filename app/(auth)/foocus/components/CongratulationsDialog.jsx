'use client'
import { motion } from 'framer-motion'
import BottomDrawer from '../../workout/components/BottomDrawer'
import confetti from 'canvas-confetti'

const CongratulationsDialog = ({ isOpen, onClose, habit }) => {
  // Trigger confetti when dialog opens
  if (isOpen) {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
  }

  return (
    <BottomDrawer isOpen={isOpen} onClose={onClose}>
      <div className="p-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center"
        >
          <span className="text-4xl">🎉</span>
        </motion.div>
        
        <motion.h3 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-2xl font-bold text-gray-800 mb-2"
        >
          Congratulations!
        </motion.h3>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-gray-600 mb-6"
        >
          You've completed your habit:<br/>
          <span className="font-semibold text-gray-800">{habit?.title}</span>
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <button
            onClick={onClose}
            className="bg-black text-white px-8 py-2.5 rounded-xl font-medium"
          >
            Keep Going!
          </button>
        </motion.div>
      </div>
    </BottomDrawer>
  )
}

export default CongratulationsDialog 