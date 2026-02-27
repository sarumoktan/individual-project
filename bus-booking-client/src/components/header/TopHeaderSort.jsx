import React from 'react'

export default function TopHeaderSort() {
  return (
    <div className={'flex justify-center items-center px-8 py-4 bg-gray-200 min-w-full'}>
       <ul className={'flex justify-start items-center flex-wrap gap-4  uppercase sm:text-sm text-sm  tracking-wider font-semibold'}>
            <li className={'text-black hover:scale-110 hover:text-primary transition-all duration-500 ease-linear  cursor-pointer'}>sort</li>
            <li className={'text-gray-500 hover:scale-110   hover:text-primary transition-all duration-500 ease-linear  cursor-pointer'}>Departure Time </li>
            <li className={' text-gray-500 hover:scale-110   hover:text-primary transition-all duration-500 ease-linear  cursor-pointer'}>Arrival time</li>
            <li className={' text-gray-500 hover:scale-110 sm:flex hidden  hover:text-primary transition-all duration-500 ease-linear  cursor-pointer'}>Available seats</li>
            <li className={' text-gray-500 hover:scale-110  sm:flex hidden hover:text-primary transition-all duration-500 ease-linear  cursor-pointer'}>Rate</li>
       </ul>
    </div>
  )
}
