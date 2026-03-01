import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import {
    FaBus, FaCalendarAlt, FaUsers, FaPlus,
    FaChevronRight, FaUserTie, FaRoute,
    FaExclamationTriangle, FaClock, FaTimesCircle,
    FaCheckCircle
} from 'react-icons/fa';
import { MdDirectionsBus, MdEventSeat } from 'react-icons/md';
import { IoTrendingUp } from 'react-icons/io5';

// ── Mock data — replace with API calls ───────────────────────────────────────
const operatorName = 'Ram Prasad';

const stats = [
    { label: 'Revenue',      value: 'Rs. 2,48,500', change: '+12.4% this month', up: true,  icon: '₨' },
    { label: 'Bookings',     value: '1,284',         change: '+8.1% this month',  up: true,  icon: '🎟' },
    { label: 'Active Buses', value: '6 / 7',         change: '1 inactive',        up: null,  icon: '🚌' },
    { label: 'Staff',        value: '18',             change: '2 on leave',        up: null,  icon: '👥' },
];

const todaysTrips = [
    { id: 1, route: 'Kathmandu → Pokhara', bus: 'Ba 1 Cha 2234', departs: '06:00 AM', driver: 'Hari Bahadur',   booked: 28, seats: 32, status: 'on-time' },
    { id: 2, route: 'Pokhara → Butwal',    bus: 'Ga 2 Ja 7891',  departs: '07:30 AM', driver: 'Sanjay Tamang',  booked: 40, seats: 40, status: 'full'    },
    { id: 3, route: 'Kathmandu → Chitwan', bus: 'Ba 1 Cha 5512', departs: '09:00 AM', driver: 'Rajesh Shrestha',booked: 15, seats: 40, status: 'on-time' },
    { id: 4, route: 'Birgunj → Kathmandu', bus: 'Ga 3 Ka 1120',  departs: '11:00 AM', driver: null,             booked: 31, seats: 56, status: 'warning' },
    { id: 5, route: 'Nepalgunj → Pokhara', bus: 'Ja 1 Ga 3309',  departs: '02:00 PM', driver: 'Dipak Gurung',   booked: 20, seats: 32, status: 'on-time' },
];

const recentBookings = [
    { id: '#BK8821', passenger: 'Anita Sharma',    route: 'KTM → PKR', amount: 1200, time: '2 min ago',  status: 'confirmed' },
    { id: '#BK8820', passenger: 'Bikash Thapa',    route: 'PKR → BTL', amount: 950,  time: '18 min ago', status: 'confirmed' },
    { id: '#BK8819', passenger: 'Sita Rai',        route: 'KTM → CHT', amount: 800,  time: '34 min ago', status: 'confirmed' },
    { id: '#BK8818', passenger: 'Pradeep Koirala', route: 'BJR → KTM', amount: 1100, time: '1 hr ago',   status: 'cancelled' },
    { id: '#BK8817', passenger: 'Manisha Ghimire', route: 'KTM → PKR', amount: 1200, time: '2 hr ago',   status: 'confirmed' },
];

const fleet = [
    { plate: 'Ba 1 Cha 2234', model: 'Tata Starbus',  type: 'Luxury AC',    seats: 32, active: true,  occupancy: 87 },
    { plate: 'Ga 2 Ja 7891',  model: 'Ashok Leyland', type: 'Semi-Luxury',  seats: 40, active: true,  occupancy: 100 },
    { plate: 'Ba 1 Cha 5512', model: 'Tata Starbus',  type: 'Standard',     seats: 40, active: true,  occupancy: 37 },
    { plate: 'Ga 3 Ka 1120',  model: 'Hino Bus',      type: 'Luxury AC',    seats: 56, active: true,  occupancy: 55 },
    { plate: 'Ja 1 Ga 3309',  model: 'Tata Starbus',  type: 'Standard',     seats: 32, active: true,  occupancy: 62 },
    { plate: 'Ba 2 Ja 0041',  model: 'Ashok Leyland', type: 'Semi-Luxury',  seats: 40, active: false, occupancy: 0  },
];

// ── Alerts shown as toasts ───────────────────────────────────────────────────
const alerts = [
    { type: 'warning', title: 'No Driver Assigned',      body: 'Ga 3 Ka 1120 has no driver for the 11:00 AM Birgunj trip.' },
    { type: 'info',    title: 'License Expiring Soon',   body: 'Hari Bahadur\'s license expires in 14 days. Renew before next trip.' },
    { type: 'error',   title: 'Schedule Conflict',       body: 'Ga 2 Ja 7891 is double-booked on Saturday. Fix in Schedule Manager.' },
];

const alertStyles = {
    warning: { icon: FaExclamationTriangle, iconColor: '#D97706', bg: '#FFFBEB', border: '#FDE68A', text: '#92400E' },
    info:    { icon: FaClock,               iconColor: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF' },
    error:   { icon: FaTimesCircle,         iconColor: '#E11D48', bg: '#FFF1F2', border: '#FECDD3', text: '#9F1239' },
};

function showAlerts() {
    alerts.forEach((a, i) => {
        const s = alertStyles[a.type];
        const Icon = s.icon;
        setTimeout(() => {
            toast.custom((t) => (
                <div
                    className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-sm w-full bg-white shadow-lg rounded-xl pointer-events-auto flex border`}
                    style={{ borderColor: s.border }}
                >
                    <div className="flex-1 p-4">
                        <div className="flex items-start gap-3">
                            <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: s.bg }}
                            >
                                <Icon style={{ color: s.iconColor }} className="text-sm" />
                            </div>
                            <div>
                                <p className="text-sm font-bold" style={{ color: s.text }}>{a.title}</p>
                                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{a.body}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex border-l" style={{ borderColor: s.border }}>
                        <button
                            onClick={() => toast.dismiss(t.id)}
                            className="px-4 text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            ), { duration: 6000, position: 'top-right' });
        }, i * 600);
    });
}

// ── Occupancy bar ─────────────────────────────────────────────────────────────
function OccupancyBar({ pct }) {
    const color = pct >= 90 ? '#E11D48' : pct >= 60 ? '#D97706' : '#16A34A';
    return (
        <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
            </div>
            <span className="text-[11px] font-semibold text-gray-500 w-8 text-right">{pct}%</span>
        </div>
    );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function OperatorDashboard() {
    const today = new Date().toLocaleDateString('en-NP', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    useEffect(() => {
        showAlerts();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <Toaster />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* ── Header ── */}
                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{today}</p>
                        <h1 className="text-3xl font-black text-gray-900" style={{ letterSpacing: '-0.03em' }}>
                            Good morning, {operatorName}
                        </h1>
                    </div>
                    <Link
                        to="/operator/schedules/add"
                        className="hidden sm:flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors active:scale-95"
                    >
                        <FaPlus className="text-xs" /> Add Schedule
                    </Link>
                </div>

                {/* ── Stats — horizontal strip, not cards ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-200 rounded-2xl overflow-hidden border border-gray-200">
                    {stats.map((s, i) => (
                        <div key={i} className="bg-white px-6 py-5">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{s.label}</p>
                                <span className="text-lg">{s.icon}</span>
                            </div>
                            <p className="text-2xl font-black text-gray-900" style={{ letterSpacing: '-0.02em' }}>{s.value}</p>
                            <p className={`text-xs font-semibold mt-1.5 ${s.up ? 'text-green-600' : 'text-gray-400'}`}>
                                {s.up && <IoTrendingUp className="inline mr-1" />}
                                {s.change}
                            </p>
                        </div>
                    ))}
                </div>

                {/* ── Today's trips + Recent bookings ── */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                    {/* Trips — takes 3 cols, plain list style */}
                    <div className="lg:col-span-3">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-black text-gray-900">Today's Trips</h2>
                            <Link to="/operator/schedules" className="text-orange-500 text-xs font-bold flex items-center gap-1 hover:text-orange-600">
                                View all <FaChevronRight className="text-[10px]" />
                            </Link>
                        </div>

                        <div className="space-y-2">
                            {todaysTrips.map((trip) => {
                                const pct = Math.round((trip.booked / trip.seats) * 100);
                                const statusMap = {
                                    'on-time': { label: 'On Time',   bg: '#DCFCE7', text: '#16A34A' },
                                    'full':    { label: 'Full',      bg: '#DBEAFE', text: '#2563EB' },
                                    'warning': { label: 'No Driver', bg: '#FEF9C3', text: '#92400E' },
                                };
                                const st = statusMap[trip.status];
                                return (
                                    <div key={trip.id} className="bg-white rounded-xl px-5 py-4 border border-gray-100 hover:border-gray-200 transition-all">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="text-sm font-bold text-gray-900">{trip.route}</p>
                                                    <span
                                                        className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                                                        style={{ background: st.bg, color: st.text }}
                                                    >
                                                        {st.label}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-gray-400 mb-2.5">
                                                    <span>{trip.bus}</span>
                                                    <span className="w-1 h-1 bg-gray-200 rounded-full" />
                                                    <span className={!trip.driver ? 'text-red-500 font-semibold' : ''}>
                                                        {trip.driver ?? 'No driver assigned'}
                                                    </span>
                                                </div>
                                                <OccupancyBar pct={pct} />
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="text-base font-black text-gray-900">{trip.departs}</p>
                                                <p className="text-[10px] text-gray-400 mt-0.5">{trip.booked}/{trip.seats} seats</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Recent bookings — 2 cols, plain list */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-black text-gray-900">Recent Bookings</h2>
                            <Link to="/operator/bookings" className="text-orange-500 text-xs font-bold flex items-center gap-1 hover:text-orange-600">
                                All <FaChevronRight className="text-[10px]" />
                            </Link>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-2xl divide-y divide-gray-50 overflow-hidden">
                            {recentBookings.map((b) => (
                                <div key={b.id} className="px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors">
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-gray-800 truncate">{b.passenger}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <p className="text-xs text-gray-400">{b.route}</p>
                                            <span className="w-1 h-1 bg-gray-200 rounded-full" />
                                            <p className="text-[11px] text-gray-300">{b.time}</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-sm font-black text-gray-900">Rs.{b.amount}</p>
                                        <span className={`text-[10px] font-bold ${b.status === 'confirmed' ? 'text-green-600' : 'text-red-500'}`}>
                                            {b.status === 'confirmed' ? '● Confirmed' : '● Cancelled'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Fleet — table without card wrapper overkill ── */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-black text-gray-900">Fleet</h2>
                        <Link to="/operator/buses" className="text-orange-500 text-xs font-bold flex items-center gap-1 hover:text-orange-600">
                            Manage <FaChevronRight className="text-[10px]" />
                        </Link>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Bus</th>
                                        <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Type</th>
                                        <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">Seats</th>
                                        <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Occupancy</th>
                                        <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {fleet.map((bus, i) => (
                                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <MdDirectionsBus className="text-orange-400 text-base" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-800">{bus.plate}</p>
                                                        <p className="text-xs text-gray-400">{bus.model}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 hidden sm:table-cell">
                                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full font-medium">{bus.type}</span>
                                            </td>
                                            <td className="px-4 py-4 hidden md:table-cell">
                                                <span className="text-sm font-semibold text-gray-600">{bus.seats}</span>
                                            </td>
                                            <td className="px-4 py-4">
                                                {bus.active
                                                    ? <div className="min-w-[100px]"><OccupancyBar pct={bus.occupancy} /></div>
                                                    : <span className="text-xs text-gray-300">N/A</span>
                                                }
                                            </td>
                                            <td className="px-4 py-4">
                                                {bus.active
                                                    ? <span className="text-xs font-bold text-green-600 flex items-center gap-1"><FaCheckCircle className="text-green-400" /> Active</span>
                                                    : <span className="text-xs font-bold text-gray-400 flex items-center gap-1"><FaTimesCircle className="text-gray-300" /> Inactive</span>
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}