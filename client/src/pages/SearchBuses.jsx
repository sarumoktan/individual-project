import React from 'react'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux';
import BusBookingCard from '../components/booking/BusBookingCard';
import TopHeader from '../components/header/TopHeader';
import TopHeaderSort from '../components/header/TopHeaderSort';

export default function SearchBuses() {
  const location = useLocation()
  const mobileOpen = useSelector(state => state.theme.isMobileOpen);
  const bookingList = useSelector(state => state.booking.bookingList);
  console.log(bookingList);

  return ( 
    <div className={`flex justify-start items-start flex-col min-w-full pt-16`}>
      <TopHeader 
        departureStation={bookingList[0].journeySummary.departure}
        arrivalStation={bookingList[0].journeySummary.arrival}
        journeyDate={bookingList[0].journeySummary.arrival}
      />
      <TopHeaderSort />
      <div className={`max-w-screen mx-auto px-4 sm:px-6 lg:px-8 py-12 ${mobileOpen && 'hidden'} space-y-16`}>
        <BusBookingCard />
        <BusBookingCard />
        <BusBookingCard />
        <BusBookingCard />
      </div>
    </div>
  )
}
