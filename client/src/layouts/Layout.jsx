import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home , Navbar, Booking, Dashboard, Login, SearchBuses, Register, BookingProceed, BookingPayment, Failed } from '../utils/index.js';
import Footer from '../components/footer/Footer.jsx';
import ScrollToTop from '../utils/ScrollToTop.js';

export default function Layout() {
  return (
      <Router>
        <ScrollToTop />
        <Navbar/>
        <Routes >
            <Route path="/" element={<Home />} />
            <Route path="/bus-booking/booking" element={<Booking />} />
            <Route path="/bus-booking/login" element={<Login />} />
            <Route path="/bus-booking/register" element={<Register />} />
            <Route path="/bus-booking/dashboard" element={<Dashboard />} />
            <Route path="/bus-booking/search-buses" element={<SearchBuses />} />
            <Route path="/bus-booking/booking-process" element={<BookingProceed />} />
            <Route path="/bus-booking/BookingPayment" element={<BookingPayment />} />
            <Route path="/bus-booking/BookingPayment/Failed" element={<Failed />} />
        </Routes>
        <Footer />
      </Router>
      
  )
}
