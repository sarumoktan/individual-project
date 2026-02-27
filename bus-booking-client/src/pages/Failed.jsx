import React, { useState } from 'react'
import Logo from '../components/logo/Logo';
import { useNavigate } from 'react-router-dom';

export default function Failed() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/');
  }

  return (
    <div 
      className={`flex justify-center items-center min-h-[70vh] md:px-8 pt-28 pb-16`}
    >
      <div className={`flex justify-start items-center flex-col sm:border-2 shadow shadow-blue-400 min-h-96 sm:min-w-96 min-w-64  rounded-xl p-8 space-y-4 cursor-pointer`}>
        <h1 className={`text-2xl sm:text-xl font-semibold text-red-500 capitalize tracking-wide`}>Payment unsuccessful.</h1>
        <ul className={`text-center space-y-0.5 text-blue-800 font-semibold tracking-wide capitalize`}>
          {
            ['Seat No: 28', 'Jaffna - colombo', '2015-01-18 @ 08:00'].map((item, index) => (
              <li key={index}>{item}</li>
            ))
          }
        </ul>
        <h2 className='text-sm font-semibold text-black capitalize tracking-wide'>Your reservation has been cancelled</h2>
        <h2 className='text-sm font-semibold text-red-500 capitalize tracking-wide'>AnyHelp call Hot Line: 0001</h2>
        <button  
          className={`capitalize text-sm  rounded-lg sm:px-6 sm:py-2 px-4 py-1 bg-tertiary text-white shadow-lg`}
          onClick={handleClick}
        >
          try again
        </button>
        <ul className={`text-center space-y-0.5 text-black font-normal tracking-wide capitalize`}>
          {
            ['Thank you','Full Stack Developer Trainee', 'Task Assignment'].map((item, index) => (
              <li key={index} className='text-sm cursor-pointer'>{item}</li>
            ))
          }
        </ul>
        <h2 className='text-sm font-semibold text-blue-800 lowercase tracking-wide'>Krishanth.cse@gmail.com</h2>
        <div className='flex justify-center items-center min-w-full translate-x-6'>
           <Logo />
        </div>
      </div>
    </div>
  )
}
