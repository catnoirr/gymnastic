'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  IoWaterOutline, 
  IoFitnessOutline, 
  IoNutritionOutline,
  IoNotificationsOutline,
  IoSettingsOutline,
  IoPersonOutline,
  IoLogOutOutline
} from 'react-icons/io5'

const menuItems = [
  { icon: IoWaterOutline, label: 'Water', href: '/water' },
  { icon: IoNutritionOutline, label: 'Diet', href: '/diet' },
  { icon: IoFitnessOutline, label: 'Workout', href: '/workout' },
  { icon: IoNotificationsOutline, label: 'Reminder', href: '/reminder' },
  { icon: IoSettingsOutline, label: 'Habits', href: '/habits' },
  { icon: IoPersonOutline, label: 'About Developer', href: '/about' },
  { icon: IoLogOutOutline, label: 'Logout', href: '/logout' },
]

const ProfileMenu = () => {
  return (
    <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-3 lg:grid-cols-4">
      {menuItems.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href={item.href}>
            <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <item.icon className="w-8 h-8 mb-2 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">{item.label}</span>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}

export default ProfileMenu
