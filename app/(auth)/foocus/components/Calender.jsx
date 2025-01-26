"use client";
import React, { useState, useMemo, useEffect } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { db, auth } from "@/lib/firebase";
import { doc, onSnapshot, collection, getDocs } from "firebase/firestore";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calorieHistory, setCalorieHistory] = useState([]);
  const [workoutHistory, setWorkoutHistory] = useState({});

  const getLocalDateString = (date) => {
    const d = new Date(date);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate())
      .toISOString()
      .split("T")[0];
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const fetchData = async () => {
      try {
        const userRef = doc(db, "users", user.uid);
        const unsubscribe = onSnapshot(userRef, (doc) => {
          if (doc.exists()) {
            const userData = doc.data();
            setCalorieHistory(userData.calorieHistory || []);
            setWorkoutHistory(userData.workoutHistory || {});
          }
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching calendar data:", error);
      }
    };

    fetchData();
  }, []);

  const { daysInMonth, firstDay } = useMemo(
    () => ({
      daysInMonth: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      ).getDate(),
      firstDay: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      ).getDay(),
    }),
    [currentDate]
  );

  const handleMonthChange = (increment) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + increment)
    );
  };

  const generateCalendarDays = useMemo(() => {
    const days = [];
    const today = new Date();
    const isCurrentMonth =
      today.getMonth() === currentDate.getMonth() &&
      today.getFullYear() === currentDate.getFullYear();

    const currentDayString = getLocalDateString(today);

    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="aspect-square text-center p-1" />
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = isCurrentMonth && today.getDate() === day;
      const currentDayDate = getLocalDateString(
        new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      );

      const historyEntry = calorieHistory.find(
        (entry) => getLocalDateString(new Date(entry.date)) === currentDayDate
      );

      const workoutEntry = workoutHistory[currentDayDate];
      const workoutIncomplete =
        workoutEntry &&
        !workoutEntry.isCompleted &&
        currentDayDate < currentDayString;

      const dateToCheck = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      const todayDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const shouldShowWorkoutStatus = dateToCheck < todayDate;

      days.push(
        <div
          key={day}
          className={`
            aspect-square text-center p-0.5 relative group cursor-pointer
            hover:bg-gray-700 hover:rounded-full transition-all duration-200
            ${isToday ? "text-white" : "text-gray-300"}
          `}
        >
          <span
            className={`
              w-6 h-6 text-sm flex items-center justify-center mx-auto
              ${isToday ? "bg-blue-500 rounded-full" : ""}
              ${
                shouldShowWorkoutStatus && workoutIncomplete
                  ? "bg-orange-500 rounded-full"
                  : ""
              }
              ${
                historyEntry && !historyEntry.isTargetReached
                  ? "bg-red-500 rounded-full"
                  : ""
              }
            `}
          >
            {day}
          </span>

          <div
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg 
            opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-10
            before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 
            before:border-4 before:border-transparent before:border-t-gray-900
            
            /* Hide on small screens */
            hidden md:block
            
            /* Add responsive positioning */
            md:mb-3 transform
            group-hover:scale-100 scale-0 transition-transform duration-200
            
            /* Handle overflow at screen edges */
            [.calendar-grid:first-child_&]:left-0 [.calendar-grid:first-child_&]:-translate-x-0
            [.calendar-grid:last-child_&]:left-auto [.calendar-grid:last-child_&]:right-0 [.calendar-grid:last-child_&]:translate-x-0
            
            /* Desktop optimization */
            md:text-xs md:px-3 md:py-1.5"
          >
            {shouldShowWorkoutStatus && workoutIncomplete
              ? "Workout Incomplete"
              : historyEntry
              ? historyEntry.isTargetReached
                ? "Target Reached ✓"
                : "Target Not Reached ✗"
              : isToday
              ? "Today"
              : "No Data"}
          </div>
        </div>
      );
    }

    return days;
  }, [currentDate, daysInMonth, firstDay, calorieHistory, workoutHistory]);

  return (
    <div
      className="calendar bg-gray-800 p-3 sm:p-4 rounded-3xl     
    "
    >
      {/* Header */}
      <div className="calendar-header flex justify-between items-center mb-4">
        <button
          onClick={() => handleMonthChange(-1)}
          className="text-gray-400 hover:text-white transition-colors p-1"
          aria-label="Previous month"
        >
          <MdChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-white font-medium text-base">
          {MONTH_NAMES[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button
          onClick={() => handleMonthChange(1)}
          className="text-gray-400 hover:text-white transition-colors p-1"
          aria-label="Next month"
        >
          <MdChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-gray-400 text-[10px] font-medium text-center"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="calendar-grid grid grid-cols-7 gap-1">
        {generateCalendarDays}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3 text-xs justify-center sm:justify-start">
        {[
          { color: "bg-red-500", label: "Calorie Target Not Met" },
          { color: "bg-orange-500", label: "Workout Incomplete" },
          { color: "bg-blue-500", label: "Current Day" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${color}`} />
            <span className="text-gray-400">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
