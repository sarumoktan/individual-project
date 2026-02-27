import React from 'react'
import { BankBOC, BankPeople, BankCommercial } from '../../utils/index.js'

export default function TopHeader() {
    const BankInfo = [
        {
            name: 'People Bank',
            icon: BankPeople,
        },
        {
            name: ' Commercial Bank',
            icon: BankBOC,
        },
        {
            name: 'Commercial Bank',
            icon: BankCommercial,
        },
    ]
  return (
    <div className={`space-y-4 sm:px-8  sm:pt-4`}>
        <ul className={`flex gap-4 sm:justify-start justify-center items-center sm:bg-white bg-primary sm:p-0 p-4`}>
            {
                BankInfo.map((bank, index) => (
                    <li  
                        className={`shadow shadow-blue-500 rounded-md overflow-hidden hover:scale-105 transition-all duration-500 ease-linear`}
                        key={`bank-${index}`}
                    >
                        <img 
                            src={bank.icon}
                            alt={`The ${bank.name}`}
                            className='sm:h-10 sm:w-20 h-8 w-16  cursor-pointer  rounded-md'
                        />
                    </li>
                ))
            }
        </ul>
    </div>
  )
}
