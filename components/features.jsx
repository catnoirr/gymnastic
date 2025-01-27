import { FaDumbbell, FaChartLine, FaClipboardList, FaFire, FaBolt, FaMedal } from "react-icons/fa";
import { motion } from "framer-motion";

const FeatureCard = ({ icon: Icon, title, description, color, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="relative group"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} rounded-[30px] blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100`}></div>
      <div className="relative p-8 rounded-[30px] bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300">
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-12 h-12 rounded-2xl ${color.replace('from-', 'bg-').split(' ')[0]}/20 flex items-center justify-center group-hover:scale-110 transition-all duration-300`}>
            <Icon className={`w-6 h-6 ${color.replace('from-', 'text-').split(' ')[0]}`} />
          </div>
          <h3 className="text-2xl font-bold text-white">{title}</h3>
        </div>
        <p className="text-gray-400 leading-relaxed">{description}</p>
        
        <div className="mt-6 flex items-center gap-2 text-gray-500 group-hover:text-white/70 transition-colors duration-300">
          <span className="text-sm font-medium">Learn more</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
};

export default function Features() {
  const features = [
    {
      icon: FaFire,
      title: "Smart Calorie Tracking",
      description: "Track your daily calories with AI-powered insights. Get personalized recommendations and detailed nutrition breakdowns.",
      color: "from-orange-600/20 to-transparent",
      delay: 0.1
    },
    {
      icon: FaDumbbell,
      title: "Workout Analytics",
      description: "Monitor your workout performance with detailed analytics. Track sets, reps, and progress over time.",
      color: "from-blue-600/20 to-transparent",
      delay: 0.2
    },
    {
      icon: FaBolt,
      title: "Progress Tracking",
      description: "Visualize your fitness journey with interactive charts and progress photos. Set goals and celebrate milestones.",
      color: "from-purple-600/20 to-transparent",
      delay: 0.3
    },
    {
      icon: FaChartLine,
      title: "Smart Insights",
      description: "Get AI-powered insights about your fitness journey. Understand trends and optimize your routine.",
      color: "from-green-600/20 to-transparent",
      delay: 0.4
    },
    {
      icon: FaClipboardList,
      title: "Workout Plans",
      description: "Access personalized workout plans that adapt to your progress. Never plateau with smart exercise selection.",
      color: "from-pink-600/20 to-transparent",
      delay: 0.5
    },
    {
      icon: FaMedal,
      title: "Achievement System",
      description: "Stay motivated with our gamified achievement system. Earn badges and compete with friends.",
      color: "from-yellow-600/20 to-transparent",
      delay: 0.6
    }
  ];

  return (
    <section id="features" className="py-32 relative bg-black/95 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]"></div>
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-purple-500/30 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 -right-40 w-80 h-80 bg-blue-500/30 rounded-full blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-6 relative">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500"
          >
            Why Choose Gymiee?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-xl text-gray-400"
          >
            Transform your fitness journey with our comprehensive suite of intelligent features
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
