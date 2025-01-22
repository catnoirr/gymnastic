import React from 'react'
import Reminder from './Reminder'
import Savings from './Savings'
import Calories from './Calories'
import Weight from './Weight'
import Habits from './Habbits'

export default function main() {
  return (
    <div className='flex flex-col   gap-4'>
        <div className='flex flex-col md:flex-row gap-4'> 
        <Reminder />
        <Savings />
        </div>
      <div className='flex flex-col md:flex-row gap-4'>
      <div className="w-full flex flex-col  gap-4">
        <Calories />
        <Weight />
      </div>
      <Habits />
      </div>
      
    </div>
  );
}
