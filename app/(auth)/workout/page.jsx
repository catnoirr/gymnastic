import React from "react";
import Hero from "./components/hero";
// import DietCard from "./components/DietCard";
import Dropdown from "./components/Dropdown";
import WorkoutCard from "./components/main";


export default function page() {
  return (
    <div className="md:bg-[#F7F5F1] rounded-3xl min-h-screen md:p-6 space-y-5">
      <Hero />
      <div className="grid sm:grid-cols-2 grid-cols-1 md:grid-cols-3 gap-4"></div>
      {/* <Dropdown/> */}
      <WorkoutCard/>
    </div>
  );
}
