import React from "react";
import Reminder from "./Reminder";
import Savings from "./Savings";
import Calories from "./Calories";
import Weight from "./Weight";
import Habbits from "./Habbits";
import Calender from "./Calender";
import Name from "./name";
import WaterLevelIndicator from "./WaterLevelIndicator";

export default function Main() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Reminder />
          <Savings />
          <Calender />
        </div>  
        <Name />
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full flex flex-col gap-4">
          <Calories />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Weight />
            <WaterLevelIndicator />
          </div>
        </div>
        <Habbits />
      </div>
    </div>
  );
}
