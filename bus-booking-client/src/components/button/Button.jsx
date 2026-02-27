import React from 'react';
import { CiCreditCard2 } from "react-icons/ci";

export default function Button({ label = "Button", onClick, className = "", type = "button", Icon}) {
  return (
    <button
        type={type}
        onClick={onClick}
        className={`px-4 py-2   text-white font-medium rounded  transition duration-300 ${className ? `${className}` : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'} sm:text-sm  text-xs`}
    >
      {label}
      { !Icon &&  <CiCreditCard2 className={`inline-block ml-2 h-5 w-5 sm:scale-125 sm:-translate-y-0.5`} /> }  
    </button>
  );
}
