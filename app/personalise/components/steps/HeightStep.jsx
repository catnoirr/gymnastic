import { motion } from 'framer-motion'
import Image from 'next/image'

export default function HeightStep({ value, onChange, onSubmit, onBack }) {
  return (
    <div className="relative min-h-[600px] max-w-4xl mx-auto px-4">
      {/* Background decorative elements */}
      <div className="absolute left-0 top-0 -z-10 opacity-10">
        <Image
          src="/images/height-bg-left.svg"
          alt=""
          width={300}
          height={300}
          className="w-auto h-auto"
        />
      </div>
      <div className="absolute right-0 bottom-0 -z-10 opacity-10">
        <Image
          src="/images/ruler-bg.svg"
          alt=""
          width={250}
          height={250}
          className="w-auto h-auto"
        />
      </div>

      <div className="space-y-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            Step 3 of 3
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
            How tall are you?
          </h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Your height helps us calculate your BMI accurately
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-10 max-w-xl mx-auto relative overflow-hidden"
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-transparent" />

          <div className="relative space-y-8">
            <div className="flex items-center justify-center gap-6">
              <motion.input
                type="number"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="0"
                whileFocus={{ scale: 1.02 }}
                className="w-40 text-center text-7xl font-light bg-transparent border-b-2 
                  focus:border-blue-500 focus:ring-0 placeholder-gray-300 transition-all"
              />
              <div className="flex flex-col items-start">
                <span className="text-4xl text-gray-400 font-light">cm</span>
                <span className="text-sm text-gray-400">centimeters</span>
              </div>
            </div>

            {/* Height visualization */}
            {value && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex justify-center items-end gap-4 h-24"
              >
                <div className="w-3 bg-blue-100 rounded-full h-full relative">
                  <motion.div 
                    initial={{ height: '0%' }}
                    animate={{ height: `${Math.min((value / 200) * 100, 100)}%` }}
                    className="absolute bottom-0 w-full bg-blue-500 rounded-full"
                    transition={{ type: "spring", stiffness: 100 }}
                  />
                </div>
                <div className="text-sm font-medium text-gray-500 mb-2">
                  {value}cm
                </div>
              </motion.div>
            )}

            <div className="flex gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onBack}
                className="flex-1 py-4 rounded-xl border-2 border-gray-200 text-gray-700 font-medium 
                  hover:border-gray-300 hover:bg-gray-50 transition-all"
              >
                Back
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onSubmit}
                disabled={!value}
                className="flex-1 py-4 rounded-xl bg-blue-600 text-white font-medium 
                  disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 
                  transition-all shadow-lg shadow-blue-200"
              >
                Continue
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Reference values */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm text-gray-500"
        >
          Average heights: Women 162cm | Men 176cm
        </motion.div>
      </div>
    </div>
  )
} 