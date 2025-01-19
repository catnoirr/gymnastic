"use client";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase"; // Import Firebase Auth
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth"; // Import necessary Firebase functions
import { useRouter } from "next/navigation"; // Next.js routing
import { FaGoogle } from "react-icons/fa";

export const PageOne = ({handleLogin,email,password,error,setPassword,setEmail,loading}) => {
  return (
    <div>
      <h2 className="text-3xl font-semibold text-black text-center">
        Login to Gymiee
      </h2>
      
      <form className="mt-6 space-y-6" onSubmit={handleLogin}>
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
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
                className="block text-sm font-medium text-gray-700"
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
    </div>
  );
};

export default function FancyLoginPanel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Redirect to Dashboard if user is already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/dashboard"); // Redirect to Dashboard if user is authenticated
      }
    });
    return () => unsubscribe(); // Cleanup when component unmounts
  }, [router]);

  // Handle Login Form Submit
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard"); // Redirect to dashboard after successful login
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  const Login = () =>{
    return(
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
    )
  }

  return (
    <div
  className="flex justify-center items-center min-h-screen p-4"
  style={{
    backgroundImage: 'url(/p.jpg)',  // Replace with the correct image path
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }}
>
  <div className="md:flex flex-col md:flex-row items-center  bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl shadow-lg max-w-4xl w-full hidden">
    {/* Left Illustration Section */}
    <div className="flex-shrink-0  rounded-t-lg md:rounded-l-lg md:rounded-tr-none w-full md:w-1/2 md:flex justify-center items-center h-[600px] hidden">
      <img
        src="/hero.png" // Replace with your illustration URL
        alt="Illustration"
        className="object-cover w-full h-full rounded-lg"
      />
    </div>

    {/* Right Login Form Section */}
    <div className="w-full md:w-1/2 p-8">
      <h2 className="text-3xl font-bold text-white text-center">
        Login
      </h2>
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
      {/* OR Continue With */}
      <div className="mt-6 flex items-center justify-between">
        <hr className="w-1/3 border-gray-300" />
        <span className="text-sm text-white">Or Continue With</span>
        <hr className="w-1/3 border-gray-300" />
      </div>
      {/* Social Buttons */}
      <div className="mt-4 flex justify-center space-x-4">
        <button className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full hover:bg-gray-200 transition duration-300">
          <FaGoogle />
        </button>
      </div>
      {/* Sign Up Link */}
      <p className="mt-6 text-sm text-center text-white">
        Don’t have an account?{" "}
        <a
          href="/signup"
          className="text-orange-500 font-medium hover:underline"
        >
          Sign Up here
        </a>
      </p>
    </div>
  </div>

  <div className="md:hidden">
    <PageOne
      submit={Login}
      email={email}
      password={password}
      setPassword={setPassword}
      error={error}
      setEmail={setEmail}
      loading={loading}
    />
  </div>
</div>


  );
}
