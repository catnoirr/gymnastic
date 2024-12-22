import { FaDumbbell, FaChartLine, FaClipboardList } from 'react-icons/fa';

export default function Features() {
    return (
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-bold text-center text-gray-800">
            Why Choose Us?
          </h3>
          <p className="mt-2 text-center text-gray-600">
            Discover the benefits of joining our platform.
          </p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-orange-100 p-4 rounded-full">
                <FaDumbbell className="w-12 h-12" />
              </div>
              <h4 className="mt-4 text-xl font-bold text-gray-800">
                Personalized Plans
              </h4>
              <p className="mt-2 text-gray-600">
                Get workout and diet plans tailored to your needs.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-orange-100 p-4 rounded-full">
               <FaChartLine className="w-12 h-12" />
              </div>
              <h4 className="mt-4 text-xl font-bold text-gray-800">
                Progress Tracking
              </h4>
              <p className="mt-2 text-gray-600">
                Monitor your progress and achieve your goals.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-orange-100 p-4 rounded-full">
                <FaClipboardList className="w-12 h-12" />
              </div>
              <h4 className="mt-4 text-xl font-bold text-gray-800">
                Community Support
              </h4>
              <p className="mt-2 text-gray-600">
                Connect with others and stay motivated.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }
  