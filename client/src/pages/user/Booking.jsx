import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaBus, FaCalendarAlt, FaUser, FaPhone,
    FaEnvelope, FaTicketAlt, FaArrowRight,
    FaCheckCircle, FaTimesCircle, FaSpinner,
    FaChevronDown, FaChevronUp, FaTrash
} from 'react-icons/fa';
import { MdDirectionsBus, MdEventSeat } from 'react-icons/md';
import { getUserBookingsApi, cancelTicketApi } from '../../services/api';
import toast from 'react-hot-toast';

function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
    });
}

function formatTime(timeStr) {
    if (!timeStr) return '—';
    const [h, m] = timeStr.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
}

function duration(dep, arr) {
    if (!dep || !arr) return '—';
    const [dh, dm] = dep.split(':').map(Number);
    const [ah, am] = arr.split(':').map(Number);
    let mins = (ah * 60 + am) - (dh * 60 + dm);
    if (mins < 0) mins += 24 * 60;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h${m > 0 ? ` ${m}m` : ''}` : `${m}m`;
}

const statusConfig = {
    confirmed: {
        label: 'Confirmed',
        icon: FaCheckCircle,
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-600',
        dot: 'bg-green-400',
        barColor: 'from-green-400 to-emerald-500',
    },
    pending: {
        label: 'Pending',
        icon: FaSpinner,
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        text: 'text-orange-500',
        dot: 'bg-orange-400',
        barColor: 'from-orange-400 to-amber-500',
    },
    cancelled: {
        label: 'Cancelled',
        icon: FaTimesCircle,
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-500',
        dot: 'bg-red-400',
        barColor: 'from-red-400 to-rose-500',
    },
};

// Notched ticket divider
function TicketDivider({ color = 'bg-gray-100' }) {
    return (
        <div className="relative flex items-center my-0">
            <div className={`w-5 h-5 rounded-full ${color} absolute -left-[10px] z-10 border-r border-dashed border-gray-200`} />
            <div className="flex-1 border-t-2 border-dashed border-gray-200 mx-3" />
            <div className={`w-5 h-5 rounded-full ${color} absolute -right-[10px] z-10 border-l border-dashed border-gray-200`} />
        </div>
    );
}

function BookingTicket({ booking, onCancel }) {
    const [expanded, setExpanded] = useState(false);
    const [cancelling, setCancelling] = useState(false);

    const schedule = booking.schedule ?? {};
    const status = booking.status ?? 'confirmed';
    const cfg = statusConfig[status] ?? statusConfig.confirmed;
    const StatusIcon = cfg.icon;

    const handleCancel = async () => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        setCancelling(true);
        try {
            await cancelTicketApi(booking.booking_id);
            toast.success('Booking cancelled successfully');
            onCancel(booking.booking_id);
        } catch {
            toast.error('Failed to cancel booking');
        } finally {
            setCancelling(false);
        }
    };

    return (
        <div className={`bg-white rounded-2xl border ${cfg.border} overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200`}>

            {/* Gradient top bar */}
            <div className={`h-1 w-full bg-gradient-to-r ${cfg.barColor}`} />

            {/* Main ticket body */}
            <div className="p-5">

                {/* Top row: booking ID + status */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center">
                            <FaTicketAlt className="text-orange-400 text-xs" />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Booking ID</p>
                            <p className="text-xs font-black text-gray-700">#{String(booking.booking_id).padStart(6, '0')}</p>
                        </div>
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold ${cfg.bg} ${cfg.border} ${cfg.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                    </div>
                </div>

                {/* Route section */}
                <div className="flex items-center gap-3">
                    {/* Origin */}
                    <div className="text-center flex-shrink-0 min-w-[72px]">
                        <p className="text-2xl font-black text-gray-900 leading-tight">
                            {formatTime(schedule.departure_time)}
                        </p>
                        <p className="text-xs font-bold text-orange-500 mt-0.5 truncate max-w-[80px]">
                            {schedule.origin ?? '—'}
                        </p>
                    </div>

                    {/* Route line */}
                    <div className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-[10px] text-gray-400 font-medium">
                            {duration(schedule.departure_time, schedule.arrival_time)}
                        </span>
                        <div className="w-full flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                            <div className="flex-1 h-px bg-gray-200" />
                            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-orange-100 flex-shrink-0">
                                <MdDirectionsBus className="text-orange-400 text-xs" />
                            </div>
                            <div className="flex-1 h-px bg-gray-200" />
                            <FaArrowRight className="text-orange-400 text-[10px] flex-shrink-0" />
                        </div>
                        <span className="text-[10px] text-gray-300">
                            {schedule.bus?.plate ?? ''}
                        </span>
                    </div>

                    {/* Destination */}
                    <div className="text-center flex-shrink-0 min-w-[72px]">
                        <p className="text-2xl font-black text-gray-900 leading-tight">
                            {formatTime(schedule.arrival_time)}
                        </p>
                        <p className="text-xs font-bold text-blue-500 mt-0.5 truncate max-w-[80px]">
                            {schedule.destination ?? '—'}
                        </p>
                    </div>
                </div>

                {/* Quick meta row */}
                <div className="flex items-center gap-3 mt-4 flex-wrap">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <FaCalendarAlt className="text-orange-300 text-[10px]" />
                        <span>{formatDate(booking.booking_date)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <MdEventSeat className="text-orange-300 text-sm" />
                        <span>{booking.num_seats} seat{booking.num_seats > 1 ? 's' : ''}</span>
                    </div>
                    {schedule.bus?.class && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 border border-purple-100">
                            {schedule.bus.class}
                        </span>
                    )}
                </div>
            </div>

            {/* Notched divider */}
            <TicketDivider color="bg-gray-50" />

            {/* Bottom stub */}
            <div className="px-5 py-3 bg-gray-50/60">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Traveller</p>
                        <p className="text-sm font-bold text-gray-800 mt-0.5">{booking.traveller_name ?? '—'}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Total Paid</p>
                        <p className="text-lg font-black text-orange-500 mt-0.5">
                            Rs. {(Number(schedule.price ?? 0) * booking.num_seats).toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Expand toggle */}
                <button
                    onClick={() => setExpanded(v => !v)}
                    className="mt-3 w-full flex items-center justify-center gap-1.5 text-[11px] font-bold text-gray-400 hover:text-orange-500 transition-colors"
                >
                    {expanded ? 'Hide details' : 'View details'}
                    {expanded ? <FaChevronUp className="text-[10px]" /> : <FaChevronDown className="text-[10px]" />}
                </button>
            </div>

            {/* Expanded details */}
            {expanded && (
                <div className="px-5 pb-5 pt-2 border-t border-dashed border-gray-200 space-y-4 bg-white">

                    {/* Contact info */}
                    <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Contact Info</p>
                        <div className="space-y-2">
                            {booking.traveller_phone && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <div className="w-7 h-7 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                                        <FaPhone className="text-orange-400 text-[10px]" />
                                    </div>
                                    <span className="font-semibold">{booking.traveller_phone}</span>
                                </div>
                            )}
                            {booking.traveller_email && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <div className="w-7 h-7 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                                        <FaEnvelope className="text-orange-400 text-[10px]" />
                                    </div>
                                    <span className="font-semibold">{booking.traveller_email}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Driver / conductor */}
                    {(schedule.driver || schedule.conductor) && (
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Staff</p>
                            <div className="flex gap-3">
                                {schedule.driver && (
                                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
                                        <FaUser className="text-gray-300 text-xs" />
                                        <div>
                                            <p className="text-[10px] text-gray-400">Driver</p>
                                            <p className="text-xs font-bold text-gray-700">{schedule.driver.name}</p>
                                        </div>
                                    </div>
                                )}
                                {schedule.conductor && (
                                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
                                        <FaUser className="text-gray-300 text-xs" />
                                        <div>
                                            <p className="text-[10px] text-gray-400">Conductor</p>
                                            <p className="text-xs font-bold text-gray-700">{schedule.conductor.name}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Cancel button — only for non-cancelled */}
                    {status !== 'cancelled' && (
                        <button
                            onClick={handleCancel}
                            disabled={cancelling}
                            className="w-full flex items-center justify-center gap-2 border-2 border-red-200 text-red-400 hover:bg-red-50 hover:border-red-300 hover:text-red-500 font-bold text-xs py-2.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {cancelling
                                ? <><FaSpinner className="animate-spin text-xs" /> Cancelling...</>
                                : <><FaTrash className="text-xs" /> Cancel Booking</>
                            }
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

function EmptyState() {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-3xl bg-orange-50 border-2 border-orange-100 flex items-center justify-center mb-5">
                <FaTicketAlt className="text-orange-300 text-3xl" />
            </div>
            <p className="text-lg font-black text-gray-800 mb-1">No bookings yet</p>
            <p className="text-sm text-gray-400 mb-6 max-w-xs">You haven't booked any tickets. Start your journey by searching for a bus.</p>
            <button
                onClick={() => navigate('/bus-booking')}
                className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all flex items-center gap-2"
            >
                <FaBus className="text-sm" /> Book a Ticket
            </button>
        </div>
    );
}

const TABS = ['all', 'confirmed', 'pending', 'cancelled'];

export default function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getUserBookingsApi();
                // data = array of bookings with nested schedule
                setBookings(res.data.bookings);
            } catch {
                toast.error('Failed to load bookings');
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const handleCancel = (id) => {
        setBookings(prev =>
            prev.map(b => b.booking_id === id ? { ...b, status: 'cancelled' } : b)
        );
    };

    const filtered = activeTab === 'all'
        ? bookings
        : bookings.filter(b => (b.status ?? 'confirmed') === activeTab);

    const counts = TABS.reduce((acc, tab) => {
        acc[tab] = tab === 'all'
            ? bookings.length
            : bookings.filter(b => (b.status ?? 'confirmed') === tab).length;
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="font-black text-gray-900 text-lg">My Bookings</p>
                            <p className="text-xs text-gray-400 mt-0.5">{bookings.length} total ticket{bookings.length !== 1 ? 's' : ''}</p>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center">
                            <FaTicketAlt className="text-orange-400" />
                        </div>
                    </div>

                    {/* Tab bar */}
                    <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                        {TABS.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all capitalize
                                    ${activeTab === tab
                                        ? 'bg-white text-orange-500 shadow-sm'
                                        : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                {tab}
                                {counts[tab] > 0 && (
                                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full
                                        ${activeTab === tab ? 'bg-orange-100 text-orange-500' : 'bg-gray-200 text-gray-400'}`}>
                                        {counts[tab]}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-6">
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
                                <div className="h-1 bg-gray-100" />
                                <div className="p-5 space-y-4">
                                    <div className="flex justify-between">
                                        <div className="h-8 bg-gray-100 rounded-xl w-32" />
                                        <div className="h-7 bg-gray-100 rounded-xl w-24" />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 bg-gray-100 rounded-xl w-20" />
                                        <div className="flex-1 h-3 bg-gray-100 rounded-full" />
                                        <div className="h-10 bg-gray-100 rounded-xl w-20" />
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="h-4 bg-gray-100 rounded-full w-28" />
                                        <div className="h-4 bg-gray-100 rounded-full w-20" />
                                    </div>
                                </div>
                                <div className="px-5 py-4 bg-gray-50 flex justify-between">
                                    <div className="h-8 bg-gray-100 rounded-xl w-28" />
                                    <div className="h-8 bg-gray-100 rounded-xl w-24" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="space-y-4">
                        {filtered.map(booking => (
                            <BookingTicket
                                key={booking.booking_id}
                                booking={booking}
                                onCancel={handleCancel}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}