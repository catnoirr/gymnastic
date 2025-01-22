import React from 'react'

const Progress = () => {
  return (
    <div className='flex justify-between w-full items-center gap-4 border p-4 bg-white rounded-3xl shadow-md hover:shadow-lg transition-shadow'>
        <div className='flex flex-col gap-2'>
            <p className='text-lg'>Todays Improvements %</p>
            <p className='text-xl font-semibold'>80%</p>
        </div>
        <div className='flex items-center justify-center'>
            <button className='bg-black text-white px-8 py-2 rounded-full text-center flex items-center'>
                Recent
            </button>
        </div>
    </div>
  )
}

export default Progress