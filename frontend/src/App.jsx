import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./protected/Protected";

import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import HomePage from "./pages/HomePage";
import BusBooking from "./pages/BusBooking";
import Register from "./pages/Registration";
import { Toaster } from "react-hot-toast";

import Headers from "./pages/components/headers";
import Footers from "./pages/components/footers";

import Admindashboard from "./pages/Admindashboard";
import Userdashboard from "./pages/Userdashboard";
import Edituser from "./pages/Edituser";



function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Headers />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/busbooking" element={<BusBooking />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute
              allowedRoles={["admin"]}
              element={<Admindashboard />}
            />
          }
        />

        <Route
          path="/edituser"
          element={
            <ProtectedRoute
              allowedRoles={["admin"]}
              element={<Edituser />}
            />
          }
        />

        <Route path="/edituser/:id" element={<Edituser />} />
        <Route path="/user" element={<Userdashboard />} />
      </Routes>

      <Footers />
    </BrowserRouter>
  );
}

export default App;
