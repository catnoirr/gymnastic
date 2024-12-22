export default function ForgotPasswordPanel() {
    return (
      <div className="flex justify-center items-center min-h-screen bg-pink-50">
        <div className="flex flex-col md:flex-row items-center bg-white rounded-lg shadow-lg max-w-4xl w-full">
          {/* Left Illustration Section */}
          <div className="flex-shrink-0 bg-pink-100 rounded-t-lg md:rounded-l-lg md:rounded-tr-none w-full md:w-1/2  flex justify-center items-center h-[600px]">
            <img
              src="/illus.jpg" // Replace with your forgot-password illustration URL
              alt="Illustration"
              className="object-cover w-full h-full rounded-lg"
            />
          </div>
  
          {/* Right Forgot Password Form Section */}
          <div className="w-full md:w-1/2 p-8">
            <h2 className="text-3xl font-bold text-gray-800 text-center">Forgot Password</h2>
            <p className="mt-2 text-sm text-gray-600 text-center">
              Enter your registered email, and we'll send you a link to reset your password.
            </p>
            <form className="mt-6 space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="relative mt-1">
                  <input
                    type="email"
                    id="email"
                    placeholder="yourname@email.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition duration-300"
              >
                Send Reset Link
              </button>
            </form>
            {/* Back to Login */}
            <p className="mt-6 text-sm text-center text-gray-600">
              Remember your password?{" "}
              <a href="/login" className="text-orange-500 font-medium hover:underline">
                Log In here
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }
  