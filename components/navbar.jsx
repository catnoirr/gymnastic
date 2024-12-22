"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        < h1 className="text-2xl font-bold text-orange-500 hover:scale-105 transition-transform duration-300 cursor-pointer " onClick={() => router.push('/')}>
          Gymnastic
        </h1>

        {/* Hamburger Icon */}
        <button
          onClick={toggleMenu}
          className="lg:hidden block text-gray-700 hover:text-orange-500 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
            />
          </svg>
        </button>

        {/* Links for Desktop */}
        <div className="hidden lg:flex space-x-4">
          <a
            href="#features"
            className="text-gray-700 hover:text-orange-500 transition-colors duration-300"
          >
            Features
          </a>
          <a
            href="#how-it-helps"
            className="text-gray-700 hover:text-orange-500 transition-colors duration-300"
          >
            How It Helps
          </a>
          <a
            href="#track-progress"
            className="text-gray-700 hover:text-orange-500 transition-colors duration-300"
          >
            Track Progress
          </a>
        </div>

        {/* Login Button */}
        <a
          href="/login"
          className="hidden lg:block bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-orange-600 hover:shadow-xl transition-all duration-300"
        >
          Login
        </a>
      </div>

      {/* Dropdown Menu for Mobile */}
        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
        <div className="lg:hidden bg-white/80 backdrop-blur-md shadow-md">
          <div className="flex flex-col space-y-4 py-6 px-6">
            <a
              href="#features"
              className="text-gray-800 text-lg font-semibold hover:text-orange-500 hover:scale-105 transition-transform duration-300"
              onClick={toggleMenu}
            >
              Features
            </a>
            <a
              href="#about"
              className="text-gray-800 text-lg font-semibold hover:text-orange-500 hover:scale-105 transition-transform duration-300"
              onClick={toggleMenu}
            >
              About Us
            </a>
            <a
              href="#pricing"
              className="text-gray-800 text-lg font-semibold hover:text-orange-500 hover:scale-105 transition-transform duration-300"
              onClick={toggleMenu}
            >
              Pricing
            </a>
            <a
              href="#contact"
              className="text-gray-800 text-lg font-semibold hover:text-orange-500 hover:scale-105 transition-transform duration-300"
              onClick={toggleMenu}
            >
              Contact
            </a>
            <a
              href="/login"
              className="px-6 py-2 rounded-full bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-all duration-300 shadow-lg"
              onClick={toggleMenu}
            >
              Login
            </a>
            <a
              href="/login"
              className="px-6 py-2 rounded-full bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-all duration-300 shadow-lg"
              onClick={toggleMenu}
            >
              Sign Up
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
