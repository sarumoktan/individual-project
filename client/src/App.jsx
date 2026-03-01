import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import {Toaster} from 'react-hot-toast';
import { 
  Home, UserNavbar, Booking, Dashboard, Login, 
  SearchBuses, Register, BookingProceed, 
  BookingPayment, Failed, AdminNavbar, OperatorDashboard, OperatorBuses, OperatorSchedules, OperatorStaffs
} from './utils/index.js';

// Assuming you'll create these later based on our previous discussion
// import { AddBus, ScheduleManager, StaffManagement } from './pages/admin/index.js';

import Footer from './components/footer/Footer.jsx';
import ScrollToTop from './utils/ScrollToTop.js';

function App() {
  const role = "admin"; 

  return (
    <>
      <Toaster/>
      <Router>
        <ScrollToTop />
        
        {role === "admin" ? <AdminNavbar /> : <UserNavbar />}
        
        <main className="min-h-screen"> 
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {role === "user" && (
              <>
                <Route path="/bus-booking/search-buses" element={<SearchBuses />} />
                <Route path="/bus-booking/booking" element={<Booking />} />
                <Route path="/bus-booking/booking-process" element={<BookingProceed />} />
                <Route path="/bus-booking/BookingPayment" element={<BookingPayment />} />
                <Route path="/bus-booking/BookingPayment/Failed" element={<Failed />} />
                <Route path="/bus-booking/dashboard" element={<Dashboard />} />
              </>
            )}

            {role === "admin" && (
              <>
                <Route path="/admin/dashboard" element={<OperatorDashboard />} />
                <Route path="/admin/buses" element={<OperatorBuses />} />
                <Route path="/admin/schedules" element={<OperatorSchedules />} />
                <Route path="/admin/staffs" element={<OperatorStaffs />} />
              </>
            )}

            {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
          </Routes>
        </main>

        <Footer />
      </Router>
    </>
  );
}

export default App;