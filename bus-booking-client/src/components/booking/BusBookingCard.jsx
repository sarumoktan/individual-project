import React, { useState } from 'react'
import { QTechyBusDemo } from '../../utils/index.js'
import { SearchBusDemo } from '../../utils/SearchBusDemo.js'
import TextCard from './TextCard.jsx';
import { IoIosInformationCircle } from "react-icons/io";
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../button/Button.jsx';

export default function BusBookingCard() {
    const location = useLocation ();
    const BookButton = (location.pathname === '/bus-booking/search-buses')
    const navigation = useNavigate();
    const [moreInfo, setMoreInfo] = useState(false) ; 

    const toggleMoreInfo = () => {
        setMoreInfo(!moreInfo)
    }

    const handleClick = () => {
        BookButton ? navigation('/bus-booking/booking') : navigation('/bus-booking/search-buses')
    }
  return (
    <div className={`flex flex-col min-w-screen justify-items-start  rounded-xl xl:px-44 `}>
        <div className={`flex flex-col shadow-md rounded-xl shadow-gray-300`}>
            <div className={`flex justify-between bg-blue-500 rounded-t-xl py-2 px-6 border-b-[6px] border-tertiary text-white `}>
                <h2 className={`capitalize cursor-pointer text-sm tracking-wider`}>stops@<span className='font-semibold'>Colombo</span></h2>
                <h2 className={`capitalize  cursor-pointer text-sm tracking-wider`}>Route No <span className='font-semibold'>87</span></h2>
            </div>
            <main className={`flex sm:flex-row  flex-col   py-4 sm:px-6 px-4 justify-start items-center xl:gap-8 gap-4 min-h-16 shadow-lg shadow-orange-400`}>
                <div className={`sm:flex hidden justify-start items-center`}>
                    <img 
                        src={QTechyBusDemo}
                        className={`sm:flex hidden object-cover object-center cursor-pointer transition-all duration-500 ease-linear delay-75 rounded-lg md:h-[150px] h-24  md:w-[150px] w-24 lg:mr-0 mr-4`}
                    />
                    <div className={`flex-grow flex flex-col justify-center`}>
                        <div className='flex sm:min-w-fit min-w-full sm:flex-row flex-col  2xl:space-x-16 lg:space-x-6 md:space-x-14 '>
                            <div className={`flex flex-row justify-items-start relative lg:space-x-16 space-x-10`}>
                                <TextCard 
                                    arr={SearchBusDemo[0].departureInfo}
                                />
                                <div className={`lg:min-w-20 lg:h-6 min-w-16 h-4 bg-tertiary clip-path-triangle rotate-90 absolute lg:translate-y-12 lg:translate-x-8 translate-y-16 translate-x-3 cursor-pointer`}></div>
                                <TextCard 
                                    arr={SearchBusDemo[0].arrivalInfo}
                                />
                            </div>
                            <div className={` min-w-full justify-end items-center sm:hidden flex `}>
                                <button  
                                    onClick={toggleMoreInfo}
                                    className='text-tertiary '>
                                    <span><IoIosInformationCircle className={'h-5 w-5'} /></span> 
                                </button>
                            </div>
                            <div className={`flex-row justify-items-start relative lg:gap-4 sm:pt-0 pt-8 ${moreInfo ? 'flex sm:flex' : 'hidden sm:flex'}`}>
                                <TextCard 
                                    arr={SearchBusDemo[0].busInfo}
                                />
                                <TextCard 
                                    arr={SearchBusDemo[0].schedule}
                                />
                            </div>
                            <div className={`flex flex-col justify-start items-start  space-y-2`}>
                                <h1 className={`sm:text-xl text-sm font-bold tracking-wider cursor-pointer leading-8 text-blue-800 sm:text-right text-center min-w-full`} >Rs. <span className={`sm:text-2xl text-base`}>1,378.00</span></h1>
                                <ul className={`flex  sm:text-xl cursor-pointer  sm:justify-end justify-center items-center min-w-full`} >
                                    <li className={`sm:max-w-[50%] max-w-[30%] sm:text-base text-sm leading-4 font-normal`}> Available Seats</li>
                                    <li className={`sm:text-3xl text-xl  text-tertiary border-l-2 border-tertiary pl-4 font-semibold tracking-wider`}>40</li>
                                </ul>
                            </div>
                        </div>

                        <div className={`flex justify-between min-w-full items-center sm:flex-row flex-col gap-4 sm:pl-4 sm:pt-0 pt-2`}>
                            <h1 className={`sm:text-sm text-xs tracking-wider font-normal cursor-pointer`}>Duration: <span className={`font-semibold sm:text-base text-sm`}>{SearchBusDemo[0].duration} Hours</span></h1>
                            <Button 
                                Icon={true}
                                label={BookButton ? `Book Now`: `Hide`}
                                onClick={handleClick}
                                className="bg-tertiary  bg-opacity-75 text-opacity-100 hover:bg-opacity-90 active:bg-opacity-100"
                            />
                        </div>
                    </div>
                </div>
                <div className={`sm:hidden flex justify-start items-start min-w-full gap-2`}>
                    <div  className={`flex flex-col justify-end space-y-1 `}>
                        <div className={`flex flex-row justify-items-start relative space-x-10 `}>
                            <TextCard 
                                arr={SearchBusDemo[0].departureInfo}
                            />
                            <div className={`min-w-24 h-3 bg-tertiary clip-path-triangle rotate-90 absolute translate-y-14  translate-x-2  cursor-pointer`}></div>
                            <TextCard 
                                arr={SearchBusDemo[0].arrivalInfo}
                            />
                        </div>
                        <h1 className={`text-sm tracking-wider font-normal cursor-pointer p-2 text-center`}>Duration: <span className={`font-semibold`}>{SearchBusDemo[0].duration} Hours</span></h1>
                    </div>
                    <div className={`flex flex-row justify-end flex-grow `}>
                        <div className='space-y-1 border-l-2 pl-4 border-black'>
                            <ul className={`flex flex-col  text-black space-y-2`}>
                                <li  className={`flex justify-start items-start flex-col   `}>
                                    <h2 className={`text-sm  font-bold uppercase cursor-pointer leading-6 tracking-widest`}>Rs.<span className={`text-lg`}>1,402.00</span></h2>
                                </li>
                                <li  className={`flex justify-start items-start flex-col   `}>
                                    <p className={`text-xs  tracking-wide cursor-pointer capitalize`}>Booking Closing Date</p>
                                    <h2 className={`text-sm  font-bold uppercase cursor-pointer leading-6 tracking-widest`}>2025-01-18</h2>
                                </li>
                                <li  className={`flex justify-start items-start flex-col  `}>
                                    <p className={`text-xs  tracking-wide cursor-pointer capitalize`}>Available Seats</p>
                                    <h2 className={`text-sm  font-bold uppercase cursor-pointer leading-6 tracking-widest`}>45</h2>
                                </li>
                            </ul>
                            <div className={`flex justify-between min-w-full items-center sm:flex-row flex-col gap-4`}>
                                <Button 
                                    Icon={true}
                                    label={BookButton ? `Book Now`: `Hide`}
                                    onClick={handleClick}
                                    className="bg-tertiary  bg-opacity-75 text-opacity-100 hover:bg-opacity-90 active:bg-opacity-100"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <div className={`flex justify-end items-end min-w-full py-2 px-6  bg-gray-800 text-white rounded-b-xl`}>
                <button className={`text-sm tracking-wider cursor-pointer`}>Boarding/Dropping Points</button>
            </div>
        </div>
    </div>
  );
};

