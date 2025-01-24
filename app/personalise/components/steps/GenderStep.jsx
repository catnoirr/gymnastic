import { motion } from 'framer-motion'
import Image from 'next/image'

export default function GenderStep({ value, onChange, onNext }) {
  const genderOptions = [
    {
      id: 'male',
      color: 'blue',
      icon: (
        <svg className="w-14 h-14 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
            d="M12 4a8 8 0 100 16 8 8 0 000-16zM12 14a2 2 0 100-4 2 2 0 000 4z M12 14v4 M12 6v2 M9 9h6"
          />
        </svg>
      )
    },
    {
      id: 'female',
      color: 'pink', 
      icon: (
        <svg className="w-14 h-14 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M12 4a6 6 0 100 12 6 6 0 000-12zM12 16v4 M9 18h6 M12 12a2 2 0 100-4 2 2 0 000 4z"
          />
        </svg>
      )
    }
  ]

  return (
    <div className="relative min-h-[600px] max-w-4xl mx-auto px-4">
      {/* Background decorative elements */}
      <div className="absolute left-0 top-0 -z-10 opacity-10">
        <Image
          src="/images/gender-bg-left.svg"
          alt=""
          width={300}
          height={300}
          className="w-auto h-auto"
        />
      </div>
      <div className="absolute right-0 bottom-0 -z-10 opacity-10">
        <Image
          src="/images/gender-bg-right.svg"
          alt=""
          width={250}
          height={250}
          className="w-auto h-auto"
        />
      </div>

      <div className="space-y-10 py-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            Step 1 of 3
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
            Welcome to <span className="text-blue-600">Gymiee</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Let's personalize your experience. Choose your gender to get started.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto"
        >
          {genderOptions.map((gender) => (
            <motion.button
              key={gender.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onChange(gender.id)
                onNext()
              }}
              className={`relative group p-8  rounded-full bg-white shadow-xl border-2 transition-all duration-200
                ${value === gender.id 
                  ? `border-${gender.color}-500 ring-4 ring-${gender.color}-50` 
                  : 'border-transparent hover:border-gray-200'}`}
            >
              <div className="flex flex-col items-center space-y-6">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className={`w-28 h-28 rounded-full flex items-center justify-center transition-colors
                    ${gender.id === 'male' 
                      ? 'bg-blue-50 group-hover:bg-blue-100' 
                      : 'bg-pink-50 group-hover:bg-pink-100'}`}
                >
                  {gender.icon}
                </motion.div>
                <span className="text-2xl font-semibold capitalize text-gray-900">
                  {gender.id}
                </span>
              </div>

              {/* Selected indicator */}
              {value === gender.id && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`absolute -top-2 -right-2 w-8 h-8 bg-${gender.color}-500 rounded-full 
                    flex items-center justify-center shadow-lg`}
                >
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}

              {/* Subtle gradient overlay */}
              <div className={`absolute inset-0 rounded-full bg-gradient-to-br 
                from-${gender.color}-50/30 to-transparent -z-10`} />
            </motion.button>
          ))}
        </motion.div>

        {/* Helper text */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm text-gray-500"
        >
          This helps us provide personalized recommendations
        </motion.div>
      </div>
    </div>
  )
}