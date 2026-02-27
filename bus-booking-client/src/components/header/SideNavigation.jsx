import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { MdHome, MdDashboard , MdManageAccounts, MdOutlineArrowDropDown, MdOutlineArrowDropUp, MdFeedback,MdWorkHistory  } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import {  Calendar,  History, LogOut, User} from 'lucide-react';
import { AiFillSchedule } from "react-icons/ai";
import MobileHeader from './MobileHeader';
import Logo from '../logo/Logo'
import { dashboardAction } from '../../redux/dashboard-slice';

export default function SideNavigation() {
  const Theme = useSelector(state => state.theme.lightTheme);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);  
  const [dropdownPages, setDropdownPages] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleDropdownPages = () => setDropdownPages(!dropdownPages);
  const dispatch = useDispatch();
  const handleClick = (tap) => {
    dispatch(dashboardAction.tapChange(tap));
  }


  return (
    <>
      <div 
        className='shadow-md fixed top-0 left-0 min-w-full '
        style={{ zIndex: 100 }}
      >
        <MobileHeader
          onClick={toggleSidebar}
        />
      </div>
      <aside
          id="default-sidebar"
          className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } sm:translate-x-0 ${Theme ? 'bg-white border-r border-gray-200' : 'bg-gray-600 border-gray-700'} shadow-md`}
          aria-label="Sidenav"
          style={{ zIndex: 150 }}
      >
        <div className={` px-8 py-4 z-30`}>
          <Logo />
        </div>
        <div className="overflow-y-auto py-5 px-3 h-full z-30">
          <ul className="space-y-4">
            <li>
              <Link
                to="/"
                className={`flex items-center px-2 py-1 text-base font-normal ${Theme ? 'text-gray-900 rounded-lg  hover:bg-gray-100' : 'hover:bg-gray-700 text-white'}   group`}
              >
                <span 
                  aria-hidden="true"
                  className={`flex justify-items-center scale-125 ${Theme ? 'text-gray-400 group-hover:text-gray-900 ' : ' group-hover:text-white'}  `}
                >
                  <MdHome  />
                </span>
                <span className="ml-3">Home</span>
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className={`flex items-center px-2 py-1 text-base font-normal ${Theme ? 'text-gray-900 rounded-lg  hover:bg-gray-100' : 'hover:bg-gray-700 text-white'}   group`}
              >
                <span 
                  aria-hidden="true"
                  className={`flex justify-items-center scale-125 ${Theme ? 'text-gray-400 group-hover:text-gray-900 ' : ' group-hover:text-white'}  `}
                >
                  <MdDashboard  />
                </span>
                <span className="ml-3">Dashboard</span>
              </Link>
            </li>
            <li>
              <button
                onClick={()=> {handleClick('upcoming')}}
                className={`flex items-center px-2 py-1 text-base font-normal ${Theme ? 'text-gray-900 rounded-lg  hover:bg-gray-100' : 'hover:bg-gray-700 text-white'}   group`}
              >
                <span 
                  aria-hidden="true"
                  className={`flex justify-items-center scale-125 ${Theme ? 'text-gray-400 group-hover:text-gray-900 ' : ' group-hover:text-white'}  `}
                >
                  <FaCalendarAlt  />
                </span>
                <span className="ml-3">Upcoming Trips</span>
              </button>
            </li>
            <li>
              <button
                onClick={()=> {handleClick('history')}}
                className={`flex items-center px-2 py-1 text-base font-normal ${Theme ? 'text-gray-900 rounded-lg  hover:bg-gray-100' : 'hover:bg-gray-700 text-white'}   group`}
              >
                <span 
                  aria-hidden="true"
                  className={`flex justify-items-center scale-125  ${Theme ? 'text-gray-400 group-hover:text-gray-900 ' : ' group-hover:text-white'}  `}
                >
                  <MdWorkHistory   />
                </span>
                <span className="ml-3">Booking History</span>
              </button>
            </li>
            <li>
              <Link
                to="/"
                className={`flex items-center px-2 py-1 text-base font-normal ${Theme ? 'text-gray-900 rounded-lg  hover:bg-gray-100' : 'hover:bg-gray-700 text-white'}   group`}
              >
                <span 
                  aria-hidden="true"
                  className={`flex justify-items-center scale-125 ${Theme ? 'text-red-500 group-hover:text-gray-900 ' : ' group-hover:text-white'}  `}
                >
                  <IoLogOut  />
                </span>
                <span className="ml-3">Logout</span>
              </Link>
            </li>
            <li className={'hidden'}>
              <button
                onClick={toggleDropdownPages}
                type="button"
                className="flex items-center p-2 w-full text-base font-normal text-gray-900 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                aria-controls="dropdown-pages"
              >
                <span 
                  aria-hidden="true"
                  className={`flex justify-items-center scale-125 ${Theme ? 'text-gray-400 group-hover:text-gray-900 ' : ' group-hover:text-black text-white'}  `}
                >
                  <MdManageAccounts  />
                </span>
                <span className={`flex-1 ml-3 text-left ${Theme ? 'text-gray-900' : 'text-white group-hover:text-black'} `} >Manager</span>
                <span 
                  aria-hidden="true"
                  className={`flex justify-items-center scale-[1.7] ${Theme ? 'text-gray-400 group-hover:text-gray-900 ' : ' group-hover:text-black  text-white'}  `}
                >
                  {
                    !dropdownPages ? <MdOutlineArrowDropDown  /> : <MdOutlineArrowDropUp  /> 
                  }
                </span>
              </button>
              {dropdownPages && (
                <ul className="">
                  <li>
                    <Link
                      to="#"
                      className={`flex items-center p-2 pl-8 text-base font-normal ${Theme ? ' text-gray-900 rounded-lg hover:bg-gray-100 ' : 'text-white hover:bg-gray-700'}`}
                    >
                      <span 
                      aria-hidden="true"
                      className={`flex justify-items-center scale-125 ${Theme ? 'text-gray-400 group-hover:text-gray-900 ' : ' group-hover:text-black text-white'}  `}
                    >
                      <AiFillSchedule  />
                    </span>
                    <span className={`pl-4`}>
                      Manage Trip
                    </span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="#"
                      className={`flex items-center p-2 pl-8 text-base font-normal ${Theme ? ' text-gray-900 rounded-lg hover:bg-gray-100 ' : 'text-white hover:bg-gray-700'}`}
                    >
                      <span 
                      aria-hidden="true"
                      className={`flex justify-items-center scale-125 ${Theme ? 'text-gray-400 group-hover:text-gray-900 ' : ' group-hover:text-black text-white'}  `}
                    >
                      <MdFeedback  />
                    </span>
                    <span className={`pl-4`}>
                      Manage Feeds
                    </span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </div>
      </aside>
    </>
  )
}


