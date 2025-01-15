// import React from "react";
// import { FaChartBar } from "react-icons/fa";

// export default function ProgressTracking() {
//   return (
//     <div className="bg-white rounded-3xl p-6 px-8">
//       <h1 className="font-bold text-4xl text-center">Progress Tracking</h1>
//       <p className="text-center text-sm pb-4">
//       Visualize your fitness journey with detailed progress reports.      </p>
     
//       <div className="flex justify-center items-center">
//         <FaChartBar className="text-[150px] "/>
//       </div>
//     </div>
//   );

// }



import React from "react";
import { FaChartBar } from "react-icons/fa";
export default function CalorisCard() {
  return (
    <div className="relative  rounded-3xl overflow-hidden p-6 px-8 border">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: 'url(/p.jpg)' }}
      ></div>

      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-black opacity-20"></div>

      {/* Content */}
      <div className="relative z-10 text-white">
        <h1 className="font-bold text-4xl text-center">Workout Tracking</h1>
        <p className="text-center text-sm pb-4">Record and analyze your workouts to maximize results.</p>
        
        <div className="flex justify-center items-center">
//         <FaChartBar className="text-[150px] "/>
//       </div>
      </div>
    </div>
  );
}


