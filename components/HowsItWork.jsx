import React from "react";
import { motion } from "framer-motion";
import { FaUserPlus, FaUtensils, FaDumbbell, FaChartLine } from "react-icons/fa";

const StepCard = ({ icon: Icon, step, title, description, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="flex items-start gap-4 group"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
        <div className="relative w-12 h-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300">
          <Icon className="w-5 h-5 text-blue-400" />
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-blue-400">Step {step}</span>
          <div className="h-px flex-1 bg-gradient-to-r from-blue-500/50 to-transparent"></div>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};

export default function HowItWorks() {
  const steps = [
    {
      icon: FaUserPlus,
      title: "Create Your Account",
      description: "Sign up for Gymiee and set up your personalized fitness profile with your goals and preferences.",
      delay: 0.1
    },
    {
      icon: FaUtensils,
      title: "Plan Your Diet",
      description: "Create customized meal plans, track calories, and get nutritional insights to fuel your fitness journey.",
      delay: 0.2
    },
    {
      icon: FaDumbbell,
      title: "Set Workout Routine",
      description: "Access expert-designed workout plans or create your own. Track exercises, sets, and reps with ease.",
      delay: 0.3
    },
    {
      icon: FaChartLine,
      title: "Track Progress",
      description: "Monitor your achievements, view detailed analytics, and celebrate milestones on your fitness journey.",
      delay: 0.4
    }
  ];

  return (
    <section className="relative py-12 bg-black/95 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]"></div>
      <div className="absolute inset-0">
        <div className="absolute top-0 -right-40 w-80 h-80 bg-blue-500/30 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 -left-40 w-80 h-80 bg-purple-500/30 rounded-full blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-6 relative">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Content Side */}
          <div className="lg:w-1/2 space-y-8">
            <div className="space-y-4">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500"
              >
                How Gymiee Works
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-400"
              >
                Transform your fitness journey in four simple steps
              </motion.p>
            </div>

            <div className="space-y-8">
              {steps.map((step, index) => (
                <StepCard
                  key={index}
                  icon={step.icon}
                  step={index + 1}
                  title={step.title}
                  description={step.description}
                  delay={step.delay}
                />
              ))}
            </div>
          </div>

          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:w-1/2 relative"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-pink-500/30 rounded-[40px] blur-2xl"></div>
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] p-8">
                <img
                  src="/hero.png"
                  alt="Gymiee App Interface"
                  className="w-full h-auto rounded-2xl"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
