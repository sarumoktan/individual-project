import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import {
    FaPlus, FaChevronRight,
    FaExclamationTriangle, FaClock, FaTimesCircle,
    FaCheckCircle,
} from 'react-icons/fa';
import { MdDirectionsBus } from 'react-icons/md';
import { IoTrendingUp } from 'react-icons/io5';

// Adjust this path to match your project structure
import {
    getUser,
    getAllBus,
    getAllStaff,
    getAllSchedules,
    getUserBookingsApi,
    fetchOccupancyApi,
} from '../../services/api';

// ─── Helpers ────────────────────────────────────────────────────────────────

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'morning';
    if (h < 17) return 'afternoon';
    return 'evening';
}

function formatTime(time) {
    if (!time) return 'N/A';
    if (time.includes('T')) {
        return new Date(time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
    const [h, m] = time.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
}

function getTimeAgo(dateStr) {
    if (!dateStr) return '';
    const min = Math.floor((Date.now() - new Date(dateStr)) / 60000);
    if (min < 1) return 'just now';
    if (min < 60) return `${min} min ago`;
    const h = Math.floor(min / 60);
    if (h < 24) return `${h} hr ago`;
    return `${Math.floor(h / 24)} days ago`;
}

function toDateStr(dateVal) {
    if (!dateVal) return '';
    return new Date(dateVal).toISOString().split('T')[0];
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function OccupancyBar({ pct }) {
    const color = pct >= 90 ? '#E11D48' : pct >= 60 ? '#D97706' : '#16A34A';
    return (
        <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                <div
                    className="h-1.5 rounded-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: color }}
                />
            </div>
            <span className="text-[11px] font-semibold text-gray-500 w-8 text-right">{pct}%</span>
        </div>
    );
}

function SkeletonBox({ className }) {
    return <div className={`bg-gray-100 rounded animate-pulse ${className}`} />;
}

function StatsSkeleton() {
    return (
        <>
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white px-6 py-5">
                    <div className="flex items-center justify-between mb-3">
                        <SkeletonBox className="h-3 w-16" />
                        <SkeletonBox className="h-5 w-5" />
                    </div>
                    <SkeletonBox className="h-7 w-28 mb-2" />
                    <SkeletonBox className="h-3 w-20" />
                </div>
            ))}
        </>
    );
}

const ALERT_STYLES = {
    warning: { Icon: FaExclamationTriangle, iconColor: '#D97706', bg: '#FFFBEB', border: '#FDE68A', text: '#92400E' },
    info: { Icon: FaClock, iconColor: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF' },
    error: { Icon: FaTimesCircle, iconColor: '#E11D48', bg: '#FFF1F2', border: '#FECDD3', text: '#9F1239' },
};

function fireAlerts(alerts) {
    alerts.forEach((a, i) => {
        const s = ALERT_STYLES[a.type] ?? ALERT_STYLES.info;
        const { Icon } = s;
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

// ─── Main Component ──────────────────────────────────────────────────────────

export default function OperatorDashboard() {
    const [user, setUser] = useState(null);
    const [buses, setBuses] = useState([]);
    const [staff, setStaff] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [occupancyMap, setOccupancyMap] = useState({});
    const [loading, setLoading] = useState(true);

    const todayStr = toDateStr(new Date());
    const today = new Date();

    // ── Fetch all data in parallel ──
    useEffect(() => {
        async function fetchAll() {
            try {
                const [userRes, busRes, staffRes, scheduleRes, bookingRes] = await Promise.all([
                    getUser(),
                    getAllBus(),
                    getAllStaff(),
                    getAllSchedules(),
                    getUserBookingsApi(),
                ]);

                const userData = userRes?.data?.user ?? userRes?.data ?? null;
                const busData = busRes?.data?.data ?? busRes?.data ?? [];
                const staffData = staffRes?.data?.data ?? staffRes?.data ?? [];
                const scheduleData = scheduleRes?.data?.data ?? scheduleRes?.data ?? [];
                const bookingData = bookingRes?.data?.bookings ?? bookingRes?.data ?? [];

                setUser(userData);
                setBuses(busData);
                setStaff(staffData);
                setSchedules(scheduleData);
                setBookings(bookingData);

                // Fetch occupancy for today's schedules only
                const todaySchedules = scheduleData.filter(
                    (s) => toDateStr(s.date) === todayStr
                );

                const occResults = await Promise.allSettled(
                    todaySchedules.map((s) => fetchOccupancyApi(s._id))
                );

                const oMap = {};
                todaySchedules.forEach((s, idx) => {
                    const res = occResults[idx];
                    if (res.status === 'fulfilled') {
                        oMap[s._id] = res.value?.data ?? null;
                    }
                });
                setOccupancyMap(oMap);

                // Generate smart alerts from real data
                const alerts = [];

                todaySchedules.forEach((s) => {
                    const hasDriver = s.driver && (s.driver._id ?? s.driver);
                    if (!hasDriver) {
                        alerts.push({
                            type: 'warning',
                            title: 'No Driver Assigned',
                            body: `${s.bus?.plate ?? 'A bus'} has no driver for the ${formatTime(s.departure_time)} trip (${s.origin} to ${s.destination}).`,
                        });
                    }
                });

                staffData.forEach((s) => {
                    if (s.license_expiry) {
                        const daysLeft = Math.ceil(
                            (new Date(s.license_expiry) - today) / (1000 * 60 * 60 * 24)
                        );
                        if (daysLeft > 0 && daysLeft <= 30) {
                            alerts.push({
                                type: 'info',
                                title: 'License Expiring Soon',
                                body: `${s.name}'s license expires in ${daysLeft} day${daysLeft > 1 ? 's' : ''}.`,
                            });
                        }
                    }
                });

                const inactiveBusCount = busData.filter(
                    (b) => b.is_active === false || b.active === false
                ).length;
                if (inactiveBusCount > 0) {
                    alerts.push({
                        type: 'error',
                        title: `${inactiveBusCount} Bus${inactiveBusCount > 1 ? 'es' : ''} Inactive`,
                        body: `${inactiveBusCount} bus${inactiveBusCount > 1 ? 'es are' : ' is'} currently inactive and unavailable for scheduling.`,
                    });
                }

                if (alerts.length > 0) fireAlerts(alerts);

            } catch (err) {
                console.error('Dashboard fetch error:', err);
                toast.error('Failed to load dashboard data.');
            } finally {
                setLoading(false);
            }
        }

        fetchAll();
    }, []);

    // ── Derived values ──
    const todaySchedules = schedules.filter((s) => toDateStr(s.date) === todayStr);
    const activeBuses = buses.filter((b) => b.is_active !== false && b.active !== false);
    const onLeaveStaff = staff.filter((s) => s.status === 'on_leave' || s.on_leave === true).length;

    const confirmedBookings = bookings.filter(
        (b) => b.status === 'confirmed' || b.status === 'booked'
    );
    const revenue = confirmedBookings.reduce(
        (sum, b) => sum + (b.amount ?? b.total_fare ?? b.fare ?? 0), 0
    );

    const todayBookings = bookings.filter(
        (b) => toDateStr(b.createdAt) === todayStr
    );

    const recentBookings = [...bookings]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    const stats = [
        {
            label: 'Revenue',
            value: `Rs. ${revenue.toLocaleString('en-NP')}`,
            change: `${confirmedBookings.length} confirmed`,
            up: true,
            icon: '₨',
        },
        {
            label: 'Bookings',
            value: bookings.length.toLocaleString(),
            change: `${todayBookings.length} today`,
            up: todayBookings.length > 0,
            icon: '🎟',
        },
        {
            label: 'Active Buses',
            value: `${activeBuses.length} / ${buses.length}`,
            change: buses.length - activeBuses.length > 0
                ? `${buses.length - activeBuses.length} inactive`
                : 'All active',
            up: null,
            icon: '🚌',
        },
        {
            label: 'Staff',
            value: String(staff.length),
            change: onLeaveStaff > 0 ? `${onLeaveStaff} on leave` : 'All present',
            up: null,
            icon: '👥',
        },
    ];

    const todayLabel = today.toLocaleDateString('en-NP', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    // ── Render ──
    return (
        <div className="min-h-screen bg-gray-50">
            <Toaster />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* Header */}
                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                            {todayLabel}
                        </p>
                        <h1
                            className="text-3xl font-black text-gray-900"
                            style={{ letterSpacing: '-0.03em' }}
                        >
                            Good {getGreeting()},{' '}
                            {loading ? (
                                <span className="inline-block bg-gray-100 rounded w-32 h-8 animate-pulse align-middle" />
                            ) : (
                                user?.name ?? 'Operator'
                            )}
                        </h1>
                    </div>
                    <Link
                        to="/operator/schedules/add"
                        className="hidden sm:flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors active:scale-95"
                    >
                        <FaPlus className="text-xs" /> Add Schedule
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-200 rounded-2xl overflow-hidden border border-gray-200">
                    {loading ? (
                        <StatsSkeleton />
                    ) : (
                        stats.map((s, i) => (
                            <div key={i} className="bg-white px-6 py-5">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        {s.label}
                                    </p>
                                    <span className="text-lg">{s.icon}</span>
                                </div>
                                <p
                                    className="text-2xl font-black text-gray-900"
                                    style={{ letterSpacing: '-0.02em' }}
                                >
                                    {s.value}
                                </p>
                                <p className={`text-xs font-semibold mt-1.5 ${s.up ? 'text-green-600' : 'text-gray-400'}`}>
                                    {s.up && <IoTrendingUp className="inline mr-1" />}
                                    {s.change}
                                </p>
                            </div>
                        ))
                    )}
                </div>

                {/* Today's Trips + Recent Bookings */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                    {/* Today's Trips */}
                    <div className="lg:col-span-3">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-black text-gray-900">Today's Trips</h2>
                            <Link
                                to="/operator/schedules"
                                className="text-orange-500 text-xs font-bold flex items-center gap-1 hover:text-orange-600"
                            >
                                View all <FaChevronRight className="text-[10px]" />
                            </Link>
                        </div>
                        <div className="space-y-2">
                            {loading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="bg-white rounded-xl px-5 py-4 border border-gray-100 animate-pulse"
                                    >
                                        <SkeletonBox className="h-4 w-48 mb-2" />
                                        <SkeletonBox className="h-3 w-32 mb-3" />
                                        <SkeletonBox className="h-1.5 w-full" />
                                    </div>
                                ))
                            ) : todaySchedules.length === 0 ? (
                                <div className="bg-white rounded-xl px-5 py-8 border border-gray-100 text-center text-gray-400 text-sm">
                                    No trips scheduled for today.
                                </div>
                            ) : (
                                todaySchedules.map((trip) => {
                                    const occ = occupancyMap[trip._id];
                                    const booked = occ?.booked_seats ?? occ?.occupied ?? occ?.bookedSeats ?? 0;
                                    const total = trip.bus?.seats ?? trip.total_seats ?? trip.seats ?? 0;
                                    const pct = total > 0 ? Math.min(100, Math.round((booked / total) * 100)) : 0;

                                    const hasDriver = trip.driver && (trip.driver._id ?? trip.driver);
                                    const isFull = pct >= 100;
                                    const status = !hasDriver ? 'warning' : isFull ? 'full' : 'on-time';

                                    const STATUS_MAP = {
                                        'on-time': { label: 'On Time', bg: '#DCFCE7', text: '#16A34A' },
                                        'full': { label: 'Full', bg: '#DBEAFE', text: '#2563EB' },
                                        'warning': { label: 'No Driver', bg: '#FEF9C3', text: '#92400E' },
                                    };
                                    const st = STATUS_MAP[status];

                                    const driverName = trip.driver?.name
                                        ?? (typeof trip.driver === 'string' ? trip.driver : null);

                                    return (
                                        <div
                                            key={trip._id}
                                            className="bg-white rounded-xl px-5 py-4 border border-gray-100 hover:border-gray-200 transition-all"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <p className="text-sm font-bold text-gray-900">
                                                            {trip.origin} → {trip.destination}
                                                        </p>
                                                        <span
                                                            className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                                                            style={{ background: st.bg, color: st.text }}
                                                        >
                                                            {st.label}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-2.5">
                                                        <span>{trip.bus?.plate ?? trip.bus ?? 'N/A'}</span>
                                                        <span className="w-1 h-1 bg-gray-200 rounded-full" />
                                                        <span className={!hasDriver ? 'text-red-500 font-semibold' : ''}>
                                                            {hasDriver ? (driverName ?? 'Driver assigned') : 'No driver assigned'}
                                                        </span>
                                                    </div>
                                                    <OccupancyBar pct={pct} />
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <p className="text-base font-black text-gray-900">
                                                        {formatTime(trip.departure_time)}
                                                    </p>
                                                    <p className="text-[10px] text-gray-400 mt-0.5">
                                                        {booked}/{total} seats
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Recent Bookings */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-black text-gray-900">Recent Bookings</h2>
                            <Link
                                to="/operator/bookings"
                                className="text-orange-500 text-xs font-bold flex items-center gap-1 hover:text-orange-600"
                            >
                                All <FaChevronRight className="text-[10px]" />
                            </Link>
                        </div>
                        <div className="bg-white border border-gray-100 rounded-2xl divide-y divide-gray-50 overflow-hidden">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="px-5 py-3.5 flex items-center justify-between gap-3 animate-pulse">
                                        <div>
                                            <SkeletonBox className="h-3.5 w-28 mb-1.5" />
                                            <SkeletonBox className="h-3 w-20" />
                                        </div>
                                        <SkeletonBox className="h-4 w-16" />
                                    </div>
                                ))
                            ) : recentBookings.length === 0 ? (
                                <div className="px-5 py-8 text-center text-gray-400 text-sm">
                                    No bookings yet.
                                </div>
                            ) : (
                                recentBookings.map((b) => {
                                    const passengerName = b.user?.name
                                        ?? b.passenger?.name
                                        ?? b.passenger
                                        ?? 'Passenger';

                                    const origin = b.schedule?.origin ?? b.origin ?? '';
                                    const destination = b.schedule?.destination ?? b.destination ?? '';
                                    const route = origin && destination
                                        ? `${origin.slice(0, 3).toUpperCase()} → ${destination.slice(0, 3).toUpperCase()}`
                                        : b.route ?? 'N/A';

                                    const amount = b.amount ?? b.total_fare ?? b.fare ?? 0;
                                    const status = b.status ?? 'confirmed';
                                    const confirmed = status === 'confirmed' || status === 'booked';

                                    return (
                                        <div
                                            key={b._id}
                                            className="px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-gray-800 truncate">
                                                    {passengerName}
                                                </p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <p className="text-xs text-gray-400">{route}</p>
                                                    <span className="w-1 h-1 bg-gray-200 rounded-full" />
                                                    <p className="text-[11px] text-gray-300">{getTimeAgo(b.createdAt)}</p>
                                                </div>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="text-sm font-black text-gray-900">
                                                    Rs.{amount.toLocaleString()}
                                                </p>
                                                <span className={`text-[10px] font-bold ${confirmed ? 'text-green-600' : 'text-red-500'}`}>
                                                    {confirmed ? '● Confirmed' : '● Cancelled'}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* Fleet */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-black text-gray-900">Fleet</h2>
                        <Link
                            to="/operator/buses"
                            className="text-orange-500 text-xs font-bold flex items-center gap-1 hover:text-orange-600"
                        >
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
                                        <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Today's Occupancy</th>
                                        <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {loading ? (
                                        Array.from({ length: 4 }).map((_, i) => (
                                            <tr key={i} className="animate-pulse">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <SkeletonBox className="w-8 h-8" />
                                                        <div>
                                                            <SkeletonBox className="h-3.5 w-24 mb-1" />
                                                            <SkeletonBox className="h-3 w-16" />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 hidden sm:table-cell"><SkeletonBox className="h-5 w-20" /></td>
                                                <td className="px-4 py-4 hidden md:table-cell"><SkeletonBox className="h-4 w-8" /></td>
                                                <td className="px-4 py-4"><SkeletonBox className="h-1.5 w-24" /></td>
                                                <td className="px-4 py-4"><SkeletonBox className="h-4 w-16" /></td>
                                            </tr>
                                        ))
                                    ) : buses.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-gray-400 text-sm">
                                                No buses registered.
                                            </td>
                                        </tr>
                                    ) : (
                                        buses.map((bus, i) => {
                                            const isActive = bus.is_active !== false && bus.active !== false;

                                            // Find this bus's schedule today and its occupancy
                                            const busScheduleToday = todaySchedules.find(
                                                (s) => s.bus?._id === bus._id || s.bus === bus._id
                                            );
                                            const occ = busScheduleToday ? occupancyMap[busScheduleToday._id] : null;
                                            const booked = occ?.booked_seats ?? occ?.occupied ?? occ?.bookedSeats ?? 0;
                                            const total = bus.seats ?? bus.total_seats ?? 0;
                                            const pct = isActive && total > 0 && busScheduleToday
                                                ? Math.min(100, Math.round((booked / total) * 100))
                                                : 0;

                                            const plate = bus.plate ?? bus.license_plate ?? bus.bus_number ?? 'N/A';
                                            const model = bus.model ?? bus.bus_model ?? '';
                                            const type = bus.type ?? bus.bus_type ?? 'Standard';

                                            return (
                                                <tr key={bus._id ?? i} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                <MdDirectionsBus className="text-orange-400 text-base" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-gray-800">{plate}</p>
                                                                <p className="text-xs text-gray-400">{model}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 hidden sm:table-cell">
                                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                                                            {type}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 hidden md:table-cell">
                                                        <span className="text-sm font-semibold text-gray-600">{total}</span>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        {isActive && busScheduleToday ? (
                                                            <div className="min-w-[100px]">
                                                                <OccupancyBar pct={pct} />
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs text-gray-300">
                                                                {isActive ? 'No trip today' : 'N/A'}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        {isActive ? (
                                                            <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                                                                <FaCheckCircle className="text-green-400" /> Active
                                                            </span>
                                                        ) : (
                                                            <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                                                                <FaTimesCircle className="text-gray-300" /> Inactive
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}