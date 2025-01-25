import React from "react";
import Hero from "./components/hero";
import Main from "./components/main";
import Progress from "./components/progress";
import { StatsGrid } from "../foocus/components/StatsCards";

export default function page() {
  return (
    <div className="md:bg-white/20 md:backdrop-blur-md md:rounded-3xl md:shadow-lg md:border md:border-white/20 rounded-3xl min-h-screen md:p-6 space-y-5 pb-20">
      <Hero />
      <Main />
      <div className="hidden md:block">
        
        <StatsGrid />
      </div>
    </div>
  );
}
