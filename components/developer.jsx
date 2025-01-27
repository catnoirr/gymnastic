import React from "react";
import { motion } from "framer-motion";
import { FaGithub, FaTwitter, FaLinkedin, FaInstagram, FaCode, FaLaptopCode, FaMobileAlt, FaServer } from "react-icons/fa";

const TechStack = ({ icon: Icon, name, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300"
  >
    <Icon className={`w-5 h-5 ${color}`} />
    <span className="text-gray-300">{name}</span>
  </motion.div>
);

const ProjectCard = ({ title, description, tech, link }) => (
  <motion.a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="group relative"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
    <div className="relative p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300">
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 mb-4">{description}</p>
      <div className="flex flex-wrap gap-2">
        {tech.map((t, i) => (
          <span key={i} className="text-sm text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full">
            {t}
          </span>
        ))}
      </div>
    </div>
  </motion.a>
);

export default function Developer() {
  const techStack = [
    { icon: FaLaptopCode, name: "Next.js", color: "text-blue-400" },
    { icon: FaCode, name: "React", color: "text-cyan-400" },
    { icon: FaMobileAlt, name: "React Native", color: "text-purple-400" },
    { icon: FaServer, name: "Node.js", color: "text-green-400" }
  ];

  const projects = [
    {
      title: "Gymiee",
      description: "A comprehensive fitness tracking application with AI-powered insights and personalized recommendations.",
      tech: ["Next.js", "Firebase", "TailwindCSS", "Framer Motion"],
      link: "https://github.com/yourusername/gymiee"
    },
    {
      title: "Project Name 2",
      description: "Brief description of another significant project you've worked on.",
      tech: ["React Native", "Node.js", "MongoDB"],
      link: "https://github.com/yourusername/project2"
    }
  ];

  return (
    <section className="relative py-12 bg-black/95 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]"></div>
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-purple-500/30 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 -right-40 w-80 h-80 bg-blue-500/30 rounded-full blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-6 relative">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Profile Section */}
          <div className="lg:w-1/2 space-y-8">
            <div className="space-y-4">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500"
              >
                About the Developer
              </motion.h2>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="relative w-32 h-32 mx-auto lg:mx-0"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full blur-xl opacity-50"></div>
                <img
                  src="/developer-image.jpg" // Add your image here
                  alt="Developer"
                  className="relative w-full h-full object-cover rounded-full border-2 border-white/20"
                />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <p className="text-xl text-gray-300">
                Hi, I'm <span className="text-purple-400 font-semibold">Your Name</span>
              </p>
              <p className="text-gray-400 leading-relaxed">
                A passionate full-stack developer with expertise in building modern web and mobile applications. 
                I specialize in creating seamless user experiences with cutting-edge technologies.
              </p>
              
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-white/20"
                >
                  <FaGithub className="w-5 h-5 text-gray-400 hover:text-white transition-colors duration-300" />
                </a>
                <a
                  href="https://linkedin.com/in/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-white/20"
                >
                  <FaLinkedin className="w-5 h-5 text-gray-400 hover:text-white transition-colors duration-300" />
                </a>
                <a
                  href="https://twitter.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-white/20"
                >
                  <FaTwitter className="w-5 h-5 text-gray-400 hover:text-white transition-colors duration-300" />
                </a>
                <a
                  href="https://instagram.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-white/20"
                >
                  <FaInstagram className="w-5 h-5 text-gray-400 hover:text-white transition-colors duration-300" />
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold text-white">Tech Stack</h3>
              <div className="flex flex-wrap gap-3">
                {techStack.map((tech, index) => (
                  <TechStack key={index} {...tech} />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Projects Section */}
          <div className="lg:w-1/2 space-y-8">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl font-semibold text-white"
            >
              Featured Projects
            </motion.h3>
            <div className="space-y-6">
              {projects.map((project, index) => (
                <ProjectCard key={index} {...project} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 