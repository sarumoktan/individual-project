import React from 'react'
import { useSelector } from 'react-redux';
import Logo from '../logo/Logo';
import { useLocation } from 'react-router-dom';

export default function Footer() {
    const Theme = useSelector(state => state.theme.lightTheme);
    const location = useLocation();
    const navItems = [
      { name: "Home", url: "/" },
      { name: "Login", url: "/bus-booking/login" },
      { name: "Github", url: "https://github.com/VinKrishanth/bus-ticket-booking-app", newTab: true },
      { name: "LinkedIn", url: "https://www.linkedin.com/in/vinyagamoorthi-krishanth", newTab: true }
    ];

  return (
    <footer className={`${false ? 'bg-white' : 'bg-gray-900 '} ${location.pathname === '/bus-booking/dashboard' && 'sm:pl-64'}`}>
      <div className="w-full max-w-screen mx-auto py-4 px-8">
        <div className="sm:flex sm:items-center sm:justify-between py-2">
          <div className=" items-center  space-x-3 rtl:space-x-reverse p-4 ">
            <Logo />
          </div>
          <ul className="flex flex-wrap justify-center items-center text-sm font-medium text-gray-400 px-4">
            {navItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.url}
                  className="hover:underline mx-4"
                  target={item.newTab ? "_blank" : "_self"} 
                  rel={item.newTab ? "noopener noreferrer" : undefined} 
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <hr className={`py-2  ${false ? 'border-gray-200' : 'border-gray-700'}  sm:mx-auto`} />
        <span className={`block text-sm ${false ? 'text-gray-500 ' : 'text-gray-400'} text-center `}>
          © {new Date().getFullYear()} {" "}QTechy Bus Booking System. All Rights Reserved.
        </span>
      </div>
    </footer>
  )
}



