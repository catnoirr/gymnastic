export default function Hero() {
    return (
      <header className="relative bg-gradient-to-r from-orange-100 to-pink-50 overflow-hidden h-screen ">
        <div className="container mx-auto px-6 py-16 text-center lg:text-left lg:flex lg:items-center">
          <div className="lg:w-1/2 animate-fade-in">
            <h2 className="text-4xl font-extrabold text-gray-800 leading-tight">
              Welcome to <span className="text-orange-500">Gymnastic</span>
            </h2>
            <p className="mt-4 text-gray-600">
              A platform to achieve your fitness goals effortlessly. Join us to
              transform your health and well-being with personalized plans and
              tracking features.
            </p>
            <div className="mt-6 space-x-4">
              <a
                href="/signup"
                className="bg-orange-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-orange-600 hover:scale-105 transition-all duration-300"
              >
                Get Started
              </a>
              <a
                href="#features"
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg shadow-lg hover:bg-gray-300 hover:shadow-xl transition-all duration-300"
              >
                Learn More
              </a>
            </div>
          </div>
          <div className="mt-8 lg:mt-0 lg:w-1/2">
            <img
              src="/illus.png"
              alt="Hero"
              className="w-full transform hover:scale-110 transition-transform duration-500"
            />
          </div>
        </div>
      </header>
    );
  }
  