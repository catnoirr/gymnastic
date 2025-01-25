"use client";

import Image from "next/image";
import { motion } from 'framer-motion';

export default function Profile({ user }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center"
    >
      <div className="relative w-24 h-24 mb-4">
        <Image
          src={user.image}
          alt={user.name}
          fill
          className="rounded-full object-cover border-4 border-blue-500"
        />
      </div>
      <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
      <p className="text-gray-600 mt-1 mb-4">{user.email}</p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
      >
        Edit Profile
      </motion.button>
    </motion.div>
  );
}
