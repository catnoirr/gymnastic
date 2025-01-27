import React from "react";
import { motion } from "framer-motion";
import { FaGithub, FaTwitter, FaInstagram, FaLinkedin, FaHeart } from "react-icons/fa";
import Link from "next/link";

const FooterLink = ({ href, children }) => (
  <Link 
    href={href}
    className="text-gray-400 hover:text-white transition-colors duration-300"
  >
    {children}
  </Link>
);

const SocialLink = ({ href, icon: Icon }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-white/20"
  >
    <Icon className="w-5 h-5 text-gray-400 hover:text-white transition-colors duration-300" />
  </a>
);

export default function Footer() {
  return (
    <footer className="relative bg-black/95 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]"></div>
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/30 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-500/30 rounded-full blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-6 relative">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16">
          {/* Brand Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
              Gymiee
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Transform your fitness journey with our intelligent workout companion.
            </p>
            <div className="flex items-center gap-4">
              <SocialLink href="https://github.com" icon={FaGithub} />
              <SocialLink href="https://twitter.com" icon={FaTwitter} />
              <SocialLink href="https://instagram.com" icon={FaInstagram} />
              <SocialLink href="https://linkedin.com" icon={FaLinkedin} />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li><FooterLink href="/about">About Us</FooterLink></li>
              <li><FooterLink href="/features">Features</FooterLink></li>
              <li><FooterLink href="/pricing">Pricing</FooterLink></li>
              <li><FooterLink href="/blog">Blog</FooterLink></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Support</h3>
            <ul className="space-y-2">
              <li><FooterLink href="/help">Help Center</FooterLink></li>
              <li><FooterLink href="/privacy">Privacy Policy</FooterLink></li>
              <li><FooterLink href="/terms">Terms of Service</FooterLink></li>
              <li><FooterLink href="/contact">Contact Us</FooterLink></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Stay Updated</h3>
            <p className="text-gray-400">Subscribe to our newsletter for tips and updates.</p>
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-white/20"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm hover:from-purple-700 hover:to-blue-700 transition-all duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="relative py-6 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-white/10">
          <div className="text-gray-400 text-sm">
            © 2024 Gymiee. All rights reserved.
          </div>
          <div className="flex items-center gap-1 text-gray-400 text-sm">
            Made with <FaHeart className="w-4 h-4 text-red-500" /> by Gymiee Team
          </div>
        </div>
      </div>
    </footer>
  );
} 