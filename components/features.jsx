import { FaDumbbell, FaChartLine, FaClipboardList } from 'react-icons/fa';
import CalorisCard from './CalorisCard';
import Tracking from './Tracking';
import Progress from './Progress'

export default function Features() {
    return (
      <section id="features" className="py-20 min-h-screen">
        <div className="container mx-auto px-6">
          <h3 className="text-6xl font-semibold font-poppins  text-center text-gray-800">
            Why Choose Gymiee?
          </h3>
          <p className="mt-2 text-center text-gray-600">
          Track your calories, workouts, and progress all in one place.
          </p>
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <CalorisCard/>
            <Tracking/>
            <Progress />
           
           
          </div>
        </div>
      </section>
    );
  }
  