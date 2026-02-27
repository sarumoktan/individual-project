import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosConfig";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; 
import SideNavigation from "../components/header/SideNavigation";
import { Calendar, Clock, MapPin, } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate(); 
  const mobileOpen = useSelector((state) => state.theme.isMobileOpen);
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [error, setError] = useState(null);
  const Theme = useSelector((state) => state.theme.lightTheme);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); 
  const activeTab = useSelector((state) => state.dashboard.activeTab);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/bus-booking/login"); 
    }

    const fetchWelcomeMessage = async () => {
      try {
        const response = await axiosInstance.get("/");
        setWelcomeMessage(response.data.message);
      } catch (error) {
        console.error("Error fetching the welcome message:", error);
        setError("Failed to load welcome message. Please try again later.");
      }
    };

    if (isLoggedIn) {
      fetchWelcomeMessage();
    }
  }, [isLoggedIn, navigate]);

  const upcomingBookings = [
    {
      id: 1,
      from: 'Colombo',
      to: 'Jaffna',
      date: '2025-01-25',
      time: '09:00 AM',
      seat: '23/24',
      price: '1245.00'
    },
    {
      id: 2,
      from: 'Hatton',
      to: 'Kandy',
      date: '2025-01-30',
      time: '05:30 AM',
      seat: '15',
      price: '650.00'
    }
  ];

  const bookingHistory = [
    {
      id: 3,
      from: 'Jaffna',
      to: 'Colombo',
      date: '2025-01-17',
      time: '10:00 AM',
      seat: '24',
      price: 'Rs. 1250.47',
      status: 'Completed'
    },
    {
      id: 4,
      from: 'Hatton',
      to: 'Kandy',
      date: '2025-01-10',
      time: '08:30 AM',
      seat: '18/19/20',
      price: 'Rs. 1850.00',
      status: 'Completed'
    }
  ];

  return (
    <div className={`flex flex-col sm:flex-row ${Theme ? "bg-white" : "bg-gray-900"} min-h-screen`}>
      <SideNavigation />
      <main
        className={`flex-grow transition-all duration-300 ${mobileOpen ? "sm:ml-0" : "sm:ml-64"} sm:pt-4 pt-20 px-4`}
      >
        <div className="rounded-lg p-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-500">
            Welcome back, Krish
          </h1>
          {error ? (
            <p className="mt-2 text-lg text-red-500">{error}</p>
          ) : (
            <p className="mt-2 text-base">{welcomeMessage || "Loading..."}</p>
          )}
        </div>

        {activeTab === 'upcoming' && (
          <div className="space-y-6 pt-10 px-2 sm:px-8">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Upcoming Trips</h3>
            <div className="grid gap-6 sm:grid-cols-2">
              {upcomingBookings.map(booking => (
                <div key={booking.id} className="bg-white p-4 sm:p-6 rounded-lg shadow border border-gray-200">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin size={18} />
                      <span>{booking.from} → {booking.to}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={18} />
                      <span>{booking.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock size={18} />
                      <span>{booking.time}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center border-t pt-4">
                    <span className="text-sm text-gray-600">Seat: {booking.seat}</span>
                    <button className="px-3 py-1 text-sm text-red-600 bg-red-100 hover:bg-red-200 rounded transition">
                      Cancel Booking
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6 overflow-x-auto w-full px-4">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Booking History</h3>
            <div className="bg-white rounded-lg shadow overflow-x-auto border border-gray-200 w-full">
              <table className="w-full min-w-[500px] sm:min-w-[700px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-600">Route</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-600">Date</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-600">Time</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-600">Price</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bookingHistory.map(booking => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-3">{booking.from} → {booking.to}</td>
                      <td className="px-3 sm:px-6 py-3">{booking.date}</td>
                      <td className="px-3 sm:px-6 py-3">{booking.time}</td>
                      <td className="px-3 sm:px-6 py-3">{booking.price}</td>
                      <td className="px-3 sm:px-6 py-3">
                        <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-50 rounded">{booking.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
      </main>
    </div>
  );
}
