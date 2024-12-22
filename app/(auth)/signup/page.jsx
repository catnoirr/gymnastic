"use client";

import{ useState } from "react";
import { useRouter} from "next/navigation";

import { FaGoogle } from "react-icons/fa";
export default function FancySignupPanel() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');  // Name state added
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }), // Pass name in request
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        router.push('/dashboard');
      } else {
        setError(data.error || 'Something went wrong!');
      }
    } catch (err) {
      setError('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };


    return (
      <div className="flex justify-center items-center min-h-screen bg-pink-50 p-4">
        <div className="flex flex-col md:flex-row items-center bg-white rounded-lg shadow-lg max-w-5xl w-full">
          {/* Left Illustration Section */}
          <div className="flex-shrink-0 bg-pink-100 rounded-t-lg md:rounded-l-lg md:rounded-tr-none w-full md:w-1/2  md:flex justify-center items-center h-[710px] hidden">
            <img
              src="/illus.jpg" // Replace with your signup illustration URL
              alt="Illustration"
              className="object-cover w-full h-full rounded-lg "
            />
          </div>
  
          {/* Right Signup Form Section */}

          <div className="w-full md:w-1/2 p-8">
            <h2 className="text-3xl font-bold text-gray-800 text-center">Sign Up</h2>
            <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
              {/* Full Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="relative mt-1">
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" 
                  />
                </div>
              </div>
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
                </div>
              </div>
              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="relative mt-1">
                  <input
                    type="password"
                    id="confirm-password"
                    placeholder="Re-enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition duration-300"
                disabled={loading}
              >
               {loading ? 'Signing up...' : 'Sign Up'}
              </button>

            </form>
            {success && <p>Signup successful! Please check your email to verify your account.</p>}
            {error && <p>{error}</p>}
            {/* OR Continue With */}
            <div className="mt-6 flex items-center justify-between">
              <hr className="w-1/3 border-gray-300" />
              <span className="text-sm text-gray-500">Or Sign Up With</span>
              <hr className="w-1/3 border-gray-300" />
            </div>
            {/* Social Buttons */}
            <div className="mt-4 flex justify-center space-x-4">
              <button className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full hover:bg-gray-200 transition duration-300">
                <FaGoogle/>
              </button>
             
            </div>
            {/* Login Link */}
            <p className="mt-6 text-sm text-center text-gray-600">
              Already have an account?{" "}
              <a href="/login" className="text-orange-500 font-medium hover:underline">
                Log In here
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }
  