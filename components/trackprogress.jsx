export default function TrackProgress() {
    return (
      <section id="track-progress" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-bold text-center text-gray-800">
            Track Your Progress
          </h3>
          <p className="mt-4 text-center text-gray-600">
            Stay on top of your fitness goals with real-time tracking.
          </p>
          <div className=" grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex justify-center">
              <img
                src="/gym.png"
                alt="Progress"
                className="w-3/4 hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex justify-center flex-col items-center">
              <p className="text-gray-700">
                Keep an eye on your workouts, calories burned, and milestones.
                Progress tracking is made simple with visually appealing charts
                and graphs.
              </p>
              <a
                href="/signup"
                className="mt-6 inline-block bg-orange-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-orange-600 transition-all duration-300 "
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }
  