import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import {
  UserDashboard, UserNavbar, Booking, Login,
  SearchBuses, Register,
  AdminNavbar, OperatorDashboard, OperatorBuses, OperatorSchedules, OperatorStaffs, Footer, TicketReview, Profile
} from './utils/index.js';
import ScrollToTop from './utils/ScrollToTop.js';
import getUserRole from './protected/getRole.js';

// ── Layouts ──────────────────────────────────────────────────────────────────

const UserLayout = () => (
  <>
    <UserNavbar />
    <main className="min-h-screen">
      <Outlet />
    </main>
    <Footer />
  </>
);

const AdminLayout = () => (
  <>
    <AdminNavbar />
    <main className="min-h-screen">
      <Outlet />
    </main>
  </>
);

// ── Guards ────────────────────────────────────────────────────────────────────

// Redirect logged-in users away from login/register
const GuestOnly = () => {
  const role = getUserRole();
  if (role === 'passenger') return <Navigate to="/" replace />;
  if (role === 'operator') return <Navigate to="/admin/dashboard" replace />;
  return <Outlet />;
};

// Block operators from the entire user area (including "/")
// Guests and passengers pass through
const UserAreaOnly = () => {
  const role = getUserRole();
  if (role === 'operator') return <Navigate to="/admin/dashboard" replace />;
  return <Outlet />;
};

// Requires any login
const RequireAuth = () => {
  const role = getUserRole();
  const location = useLocation();
  if (!role) return <Navigate to="/login" state={{ from: location }} replace />;
  return <Outlet />;
};

// Requires a specific role
// Operators hitting passenger routes go to /admin/dashboard
// Passengers hitting operator routes go to /
const RequireRole = ({ role: required }) => {
  const role = getUserRole();
  if (role !== required) {
    return <Navigate to={role === 'operator' ? '/admin/dashboard' : '/'} replace />;
  }
  return <Outlet />;
};

// ── App ───────────────────────────────────────────────────────────────────────

function AppWrapper() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>

        {/* ── Guest only (login / register) ── */}
        <Route element={<GuestOnly />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* ── User area: guests + passengers only, operators blocked ── */}
        <Route element={<UserAreaOnly />}>
          <Route element={<UserLayout />}>

            {/* Publicly browsable */}
            <Route path="/" element={<UserDashboard />} />

            {/* Passenger-only routes */}
            <Route element={<RequireAuth />}>
              <Route element={<RequireRole role="passenger" />}>
                <Route path="/available-trips" element={<SearchBuses />} />
                <Route path="/available-trips/:ticketId" element={<TicketReview />} />
                <Route path="/bookings" element={<Booking />} />
                <Route path="/account" element={<Profile />} />
              </Route>
            </Route>

          </Route>
        </Route>

        {/* ── Operator routes: login + role required ── */}
        <Route element={<RequireAuth />}>
          <Route element={<RequireRole role="operator" />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<OperatorDashboard />} />
              <Route path="/admin/buses" element={<OperatorBuses />} />
              <Route path="/admin/schedules" element={<OperatorSchedules />} />
              <Route path="/admin/staffs" element={<OperatorStaffs />} />
              <Route path="/admin/account" element={<Profile />} />
            </Route>
          </Route>
        </Route>

        {/* ── Fallback ── */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="bg-white min-h-screen text-gray-900">
        <AppWrapper />
      </div>
    </Router>
  );
}