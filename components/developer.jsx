import React from "react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaInstagram, FaCode, FaLaptopCode, FaMobileAlt, FaServer, FaBriefcase } from "react-icons/fa";

const TechStack = ({ icon: Icon, name, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300"
  >
    <Icon className={`w-4 h-4 ${color}`} />
    <span className="text-sm text-gray-300">{name}</span>
  </motion.div>
);

const SocialLink = ({ href, icon: Icon }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-white/20"
  >
    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-white transition-colors duration-300" />
  </a>
);

const PhotoCard = ({ src, alt }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="relative group overflow-hidden rounded-xl"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-transparent blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
    <img
      src={src}
      alt={alt}
      className="w-full h-48 object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
    />
  </motion.div>
);

export default function Developer() {
  const techStack = [
    { icon: FaLaptopCode, name: "Next.js", color: "text-blue-400" },
    { icon: FaCode, name: "React", color: "text-cyan-400" },
    { icon: FaMobileAlt, name: "React Native", color: "text-purple-400" },
    { icon: FaServer, name: "Node.js", color: "text-green-400" },
    { icon: FaCode, name: "Firebase", color: "text-yellow-400" },
    { icon: FaCode, name: "Tailwind", color: "text-cyan-400" },
    { icon: FaServer, name: "Express", color: "text-gray-400" },
    { icon: FaServer, name: "PostgreSQL", color: "text-blue-400" },
    { icon: FaMobileAlt, name: "React Native", color: "text-blue-400" }
  ];

  const socialLinks = [
    { icon: FaBriefcase, href: "https://offxsagr.vercel.app" },
    // { icon: FaGithub, href: "" },
    { icon: FaLinkedin, href: "https://www.linkedin.com/in/sagar-paswan-2a9924295/" },
    { icon: FaInstagram, href: "https://instagram.com/offxsagr" }
  ];

  const photos = [
    { src: "/p1.webp", alt: "Developer Photo 1" },
    { src: "/p2.webp", alt: "Developer Photo 2" },
    { src: "/p3.jpg", alt: "Developer Photo 3" },
    { src: "/developer-image.jpg", alt: "Developer Photo 4" },
  ];

  return (
    <section className="relative py-16 md:py-24 bg-black/95 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]"></div>
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-purple-500/30 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 -right-40 w-80 h-80 bg-blue-500/30 rounded-full blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-16">
          {/* Profile Section */}
          <div className="w-full lg:w-1/2 space-y-8">
            <div className="space-y-6">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500"
              >
                About the Developer
              </motion.h2>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="relative w-40 h-40 sm:w-32 sm:h-32 mx-0"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full blur-xl opacity-50"></div>
                <img
                  src="/developer-image.jpg"
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
              <p className="text-2xl sm:text-3xl text-gray-300">
                Hi, I'm <span className="text-purple-400 font-semibold">Sagar Paswan</span>
              </p>
              <p className="text-lg sm:text-base text-gray-400 leading-relaxed">
                A passionate full-stack developer with expertise in building modern web and mobile applications. 
                I specialize in creating seamless user experiences with cutting-edge technologies.
              </p>
              
              <div className="flex items-center gap-3">
                {socialLinks.map((link, index) => (
                  <SocialLink key={index} {...link} />
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <h3 className="text-lg sm:text-xl font-semibold text-white">Tech Stack</h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {techStack.map((tech, index) => (
                  <TechStack key={index} {...tech} />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Photos Section */}
          <div className="w-full lg:w-1/2 space-y-6">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xl sm:text-2xl font-semibold text-white"
            >
              Photo Gallery
            </motion.h3>
            <div className="grid grid-cols-2 gap-4">
              {photos.map((photo, index) => (
                <PhotoCard key={index} {...photo} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 