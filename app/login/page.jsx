"use client";
import { useState } from "react";
import { auth } from "@/lib/firebase"; // Import Firebase Auth
import { signInWithEmailAndPassword } from "firebase/auth"; // Import necessary Firebase functions
import { useRouter } from "next/navigation"; // Next.js routing
import { FaGoogle } from "react-icons/fa";
import { setCookie } from '@/lib/cookies';

export default function FancyLoginPanel({ activeForm, setActiveForm }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const token = await result.user.getIdToken();
      
      setCookie('token', token); // Set cookie without expiration
      router.push("/foocus");
    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const Login = () => {
    return (
      <form className="mt-6 space-y-6" onSubmit={handleLogin}>
        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-white"
          >
            Email
          </label>
          <div className="relative mt-1">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>
        {/* Password Field */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-white"
          >
            Password
          </label>
          <div className="relative mt-1">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            />
            {/* Error Message */}
            {error && <p className="text-red-500 text-center">{error}</p>}
          </div>
        </div>
        {/* Forgot Password */}
        <div className="flex justify-end">
          <a
            href="forgetpassword"
            className="text-sm text-orange-500 hover:underline"
          >
            Forgot Password?
          </a>
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition duration-300"
          disabled={loading}
        >
          {loading ? "Loging in..." : "Log In"}
        </button>
      </form>
    );
  };

  return (
    <div className="flex justify-center items-center  bg-image  md:min-h-screen md:p-4">
      <div className=" flex-col md:flex-row items-center  md:bg-white/20 md:backdrop-blur-md  md:border border-white/30 rounded-3xl md:shadow-lg max-w-4xl w-full flex ">
        {/* Left Illustration Section */}
        <div className="flex-shrink-0  rounded-t-lg md:rounded-l-lg md:rounded-tr-none w-full md:w-1/2 md:flex justify-center items-center h-[600px] hidden">
          <img
            src="/hero.png" // Replace with your illustration URL
            alt="Illustration"
            className="object-cover w-full h-full rounded-lg"
          />
        </div>

        {/* Right Login Form Section */}
        <div className="w-full md:w-1/2 md:p-8">
          <h2 className="text-3xl font-bold text-white md:text-center">Login to Gymiee</h2>
          <form className="mt-6 space-y-6" onSubmit={handleLogin}>
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white"
              >
                Email
              </label>
              <div className="relative mt-1">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 md:rounded-lg rounded-3xl shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 "
                />
              </div>
            </div>
            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white"
              >
                Password
              </label>
              <div className="relative mt-1">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full px-4 py-3 border border-gray-300 md:rounded-lg rounded-3xl shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                />
                {/* Error Message */}
                {error && <p className="text-red-500 text-center">{error}</p>}
              </div>
            </div>
            {/* Forgot Password */}
            <div className="flex justify-end">
              <a
                href="forgetpassword"
                className="text-sm text-orange-500 hover:underline"
              >
                Forgot Password?
              </a>
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-black text-white py-3 md:rounded-lg rounded-3xl font-medium hover:bg-orange-600 transition duration-300"
              disabled={loading}
            >
              {loading ? "Loging in..." : "Log In"}
            </button>
          </form>
          {/* OR Continue With */}
          <div className="mt-6 md:flex items-center justify-between hidden">
            <hr className="w-1/3 border-gray-300" />
            <span className="text-sm text-white">Or Continue With</span>
            <hr className="w-1/3 border-gray-300" />
          </div>
          {/* Social Buttons */}
          <div className="mt-4 md:flex hidden justify-center space-x-4">
            <button className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full hover:bg-gray-200 transition duration-300">
              <FaGoogle />
            </button>
          </div>
          {/* Sign Up Link */}
          <p className="mt-6 text-sm text-center text-white  md:block">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-orange-500 font-medium hover:underline hidden md:block"
            >
              Sign Up here
            </a>
            <span
                
                className="text-orange-500 font-medium hover:underline md:hidden"
                onClick={() => setActiveForm("signup")}
              >
                Sign Up here
              </span>
          </p>
        </div>
      </div>

      
    </div>
  );
}
