"use client";
import React, { useState, useMemo } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

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

    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="aspect-square text-center p-1" />
      );
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = isCurrentMonth && today.getDate() === day;

      days.push(
        <div
          key={day}
          className={`
            aspect-square text-center p-0.5 relative group cursor-pointer
            hover:bg-gray-700 transition-colors duration-200
            ${isToday ? "text-white" : "text-gray-300"}
          `}
        >
          <span
            className={`
            w-6 h-6 text-sm flex items-center justify-center mx-auto
            ${isToday ? "bg-blue-500 rounded-full" : ""}
          `}
          >
            {day}
          </span>
        </div>
      );
    }

    return days;
  }, [currentDate, daysInMonth, firstDay]);

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
      <div className="grid grid-cols-7 gap-1">{generateCalendarDays}</div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3 text-xs justify-center sm:justify-start">
        {[
          { color: "bg-red-400", label: "Absent" },
          { color: "bg-orange-400", label: "Incomplete Calories" },
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
