import React from "react";
import { motion } from "framer-motion";
import { FaHeart, FaUsers, FaRocket, FaLightbulb } from "react-icons/fa";

const FeaturePoint = ({ icon: Icon, title, description, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
      <div className="relative p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
            <Icon className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-lg font-bold text-white">{title}</h3>
        </div>
        <p className="text-gray-400 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};

export default function About() {
  const features = [
    {
      icon: FaHeart,
      title: "Personalized Experience",
      description: "Tailored workout and diet plans that adapt to your unique goals and preferences.",
      delay: 0.1
    },
    {
      icon: FaUsers,
      title: "Community Driven",
      description: "Join a supportive community of fitness enthusiasts and share your journey.",
      delay: 0.2
    },
    {
      icon: FaRocket,
      title: "Smart Progress",
      description: "Advanced tracking and analytics to help you achieve your fitness goals faster.",
      delay: 0.3
    },
    {
      icon: FaLightbulb,
      title: "Expert Guidance",
      description: "Access to professional workout tips and nutritional advice to optimize your routine.",
      delay: 0.4
    }
  ];

  return (
    <section className="relative py-10 bg-black/95 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]"></div>
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-purple-500/30 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 -right-40 w-80 h-80 bg-blue-500/30 rounded-full blur-[100px]"></div>
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
                About Gymiee
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-400"
              >
                Your Ultimate Fitness Companion
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="prose prose-lg prose-invert"
            >
              <div className="space-y-4 text-gray-300">
                <p>
                  At Gymiee, we're revolutionizing the way you approach fitness. Our platform combines cutting-edge technology with personalized guidance to make your fitness journey seamless and effective.
                </p>
                <p>
                  Whether you're just starting your fitness journey or you're a seasoned athlete, our intelligent system adapts to your needs, providing customized workout plans, nutrition tracking, and progress monitoring.
                </p>
                <p>
                  We believe in making fitness accessible, enjoyable, and sustainable. Our platform is designed to help you build lasting habits and achieve remarkable results.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Features Grid */}
          <div className="lg:w-1/2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <FeaturePoint key={index} {...feature} />
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { number: "10K+", label: "Active Users" },
            { number: "500+", label: "Workout Plans" },
            { number: "95%", label: "Success Rate" },
            { number: "24/7", label: "Support" }
          ].map((stat, index) => (
            <div key={index} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
              <div className="relative p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300 text-center">
                <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                  {stat.number}
                </div>
                <div className="text-gray-400 mt-1">{stat.label}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
