import React, { useState } from 'react';
import TopHeader from '../components/payment/TopHeader'; 
import PaymentForm from '../components/form/PaymentForm';

export default function BookingPayment() {


  return (
    <div className={`flex flex-col min-h-[80vh] md:px-8 pt-24 2xl:mx-32`}>
      <TopHeader />
      <div className={`flex  xl:flex-row flex-col  justify-start items-start pt-8 sm:mx-8 px-6 2xl:gap-16 gap-8 pb-16`}>
        <div className={`flex-grow min-h-32 sm:border-2 rounded-xl sm:py-4 sm:px-8 border-gray-200`}>
          <div className={`border-b-2 border-gray-200`}>
            <h2 className={`text-xl pb-2 font-bold tracking-wider align-text-top cursor-pointer`}>Payment Details</h2>
          </div>
          <PaymentForm />
        </div>
        <div className={`min-h-32 xl:min-w-72 sm:border-2 rounded-xl sm:px-4 sm:py-4 border-gray-200 sm:min-w-[85%] min-w-full sm:translate-y-0 -translate-y-20 `} >
          <div className={`border-b-2 border-gray-200`}>
            <h2 className={`sm:text-xl text-lg pb-2 font-bold  tracking-wider align-text-top cursor-pointer capitalize`}>your Order</h2>
          </div>
          <div className={`flex sm:flex-col  flex-row justify-between items-center bg-green-200 sm:min-h-20 mt-4 sm:p-4 px-4 py-2  sm:space-y-4 rounded-md cursor-pointer text-gray-900 min-w-full`}>
            <p className='text-sm font-semibold cursor-pointer tracking-wide'>Total amount</p>
            <h2 className='sm:text-xl text-lg font-semibold cursor-pointer tracking-wide sm:text-right'>Rs 2,833.44</h2>
          </div>
        </div>
      </div>
    </div>
  );
}