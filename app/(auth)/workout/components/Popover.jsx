"use client"
import React from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { IoChevronDownOutline } from "react-icons/io5";

export default function Popover({ 
  selectedDay, 
  setSelectedDay, 
  label = "Select Day",
  className = "" 
}) {
  const [open, setOpen] = React.useState(false);
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <PopoverPrimitive.Trigger asChild>
          <button className="flex items-center justify-between w-full px-4 py-3 text-left border border-gray-300 rounded-3xl hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all duration-200">
            <span className="font-medium text-gray-900 ">{selectedDay}</span>
            <IoChevronDownOutline className="w-5 h-5 text-gray-500" />
          </button>
        </PopoverPrimitive.Trigger>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content 
            className="bg-white rounded-lg shadow-lg p-1 w-[200px] z-50 border border-gray-200 animate-slideDownAndFade" 
            sideOffset={5}
            align="start"
          >
            <div className="py-1">
              {days.map((day) => (
                <button
                  key={day}
                  className={`block w-full px-4 py-2.5 text-left rounded-3xl transition-colors duration-150
                    ${selectedDay === day 
                      ? 'bg-black text-white font-medium ' 
                      : 'text-gray-700 hover:bg-gray-50 '
                    }`}
                  onClick={() => {
                    setSelectedDay(day);
                    setOpen(false);
                  }}
                >
                  {day}
                </button>
              ))}
            </div>
            <PopoverPrimitive.Arrow className="fill-white" />
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    </div>
  )
}
