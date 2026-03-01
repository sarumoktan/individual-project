import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { GoArrowRight } from 'react-icons/go';
import { IoIosInformationCircle } from 'react-icons/io';
import { FaBus, FaMapMarkerAlt, FaChair, FaClock, FaCalendarAlt, FaRoute } from 'react-icons/fa';
import { MdOutlineAltRoute } from 'react-icons/md';

// ─── Replace with real API call ───────────────────────────────────────────────
const mockFetchBuses = async ({ departure, arrival, date }) => {
    return [
        {
            id: 'BUS-001',
            routeNo: 'NP-37',
            stopName: 'Kalanki Bus Park',
            operator: 'Sajha Yatayat',
            busType: 'Deluxe AC',
            model: 'Tata Starbus',
            scheduleId: 'NP37-0700-KP',
            depotName: 'Kalanki Depot',
            departure: { city: departure || 'Kathmandu', date: date || '2025-03-01', time: '07:00' },
            arrival:   { city: arrival  || 'Pokhara',   date: date || '2025-03-01', time: '13:00' },
            duration: '6:00',
            price: 800,
            availableSeats: 32,
            bookingClosingDate: '2025-03-01',
            bookingClosingTime: '06:30',
        },
        {
            id: 'BUS-002',
            routeNo: 'NP-12',
            stopName: 'Gongabu Bus Park',
            operator: 'Buddha Air Transport',
            busType: 'Tourist',
            model: 'Ashok Leyland',
            scheduleId: 'NP12-0830-KP',
            depotName: 'Gongabu Depot',
            departure: { city: departure || 'Kathmandu', date: date || '2025-03-01', time: '08:30' },
            arrival:   { city: arrival  || 'Pokhara',   date: date || '2025-03-01', time: '15:00' },
            duration: '6:30',
            price: 650,
            availableSeats: 18,
            bookingClosingDate: '2025-03-01',
            bookingClosingTime: '08:00',
        },
        {
            id: 'BUS-003',
            routeNo: 'NP-55',
            stopName: 'Ratna Park',
            operator: 'Himalayan Express',
            busType: 'Normal',
            model: 'Volvo B7R',
            scheduleId: 'NP55-1400-KP',
            depotName: 'Ratna Park Depot',
            departure: { city: departure || 'Kathmandu', date: date || '2025-03-01', time: '14:00' },
            arrival:   { city: arrival  || 'Pokhara',   date: date || '2025-03-01', time: '20:30' },
            duration: '6:30',
            price: 500,
            availableSeats: 45,
            bookingClosingDate: '2025-03-01',
            bookingClosingTime: '13:30',
        },
    ];
};

const SORT_OPTIONS = [
    { key: 'default',        label: 'Sort'           },
    { key: 'departureTime',  label: 'Departure Time' },
    { key: 'arrivalTime',    label: 'Arrival Time'   },
    { key: 'availableSeats', label: 'Available Seats'},
    { key: 'price',          label: 'Rate'           },
];

function sortBuses(buses, key) {
    const sorted = [...buses];
    switch (key) {
        case 'departureTime':  return sorted.sort((a, b) => a.departure.time.localeCompare(b.departure.time));
        case 'arrivalTime':    return sorted.sort((a, b) => a.arrival.time.localeCompare(b.arrival.time));
        case 'availableSeats': return sorted.sort((a, b) => b.availableSeats - a.availableSeats);
        case 'price':          return sorted.sort((a, b) => a.price - b.price);
        default:               return sorted;
    }
}

// ─── TopHeader ────────────────────────────────────────────────────────────────
function TopHeader({ departure, arrival, date }) {
    return (
        <div className="w-full bg-white border-b border-gray-100 shadow-sm">
            <div className="max-w-5xl mx-auto flex justify-between sm:flex-row flex-col items-center gap-3 px-6 py-4">
                <ul className="flex items-center gap-3 font-bold text-gray-800">
                    <li className="text-sm tracking-wide">{departure || 'Select departure'}</li>
                    <li>
                        <GoArrowRight className="text-orange-400 scale-125" />
                    </li>
                    <li className="text-sm tracking-wide">{arrival || 'Select arrival'}</li>
                </ul>
                <div className="flex items-center gap-1.5 text-gray-400">
                    <FaCalendarAlt className="text-orange-400 text-xs" />
                    <span className="text-sm font-semibold text-gray-600">{date}</span>
                </div>
                <Link
                    to="/"
                    className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs font-bold px-5 py-2 rounded-xl tracking-wider transition-all duration-150"
                >
                    Modify Search
                </Link>
            </div>
        </div>
    );
}

// ─── TopHeaderSort ────────────────────────────────────────────────────────────
function TopHeaderSort({ activeSort, onSort }) {
    return (
        <div className="w-full bg-gray-50 border-b border-gray-100">
            <div className="max-w-5xl mx-auto flex items-center px-6 py-3 gap-2 flex-wrap">
                {SORT_OPTIONS.map(opt => (
                    <button
                        key={opt.key}
                        onClick={() => onSort(opt.key)}
                        className={`text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-lg transition-all duration-150
                            ${activeSort === opt.key
                                ? 'bg-orange-500 text-white'
                                : 'text-gray-400 hover:text-orange-500 hover:bg-orange-50'
                            }`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

// ─── InfoRow ──────────────────────────────────────────────────────────────────
function InfoRow({ label, value }) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">{label}</span>
            <span className="text-sm font-bold text-gray-700">{value}</span>
        </div>
    );
}

// ─── BusBookingCard ───────────────────────────────────────────────────────────
function BusBookingCard({ bus }) {
    const navigation   = useNavigate();
    const location     = useLocation();
    const isSearchPage = location.pathname === '/bus-booking/search-buses';
    const [expanded, setExpanded] = useState(false);

    const handleBook = () => {
        isSearchPage
            ? navigation('/bus-booking/booking', { state: { bus } })
            : navigation('/bus-booking/search-buses');
    };

    return (
        <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">

            {/* Top bar - light, matches card style from HomePage */}
            <div className="flex justify-between items-center bg-orange-50 border-b border-orange-100 px-5 py-2.5">
                <span className="text-xs font-bold text-orange-600 tracking-widest uppercase flex items-center gap-1.5">
                    <FaMapMarkerAlt className="text-orange-400 text-xs" />
                    {bus.stopName}
                </span>
                <span className="text-xs font-bold text-gray-400 tracking-widest uppercase flex items-center gap-1.5">
                    <MdOutlineAltRoute className="text-orange-300" />
                    Route {bus.routeNo}
                </span>
            </div>

            {/* Main body */}
            <div className="px-5 py-5">

                {/* Desktop */}
                <div className="hidden sm:flex gap-6 items-center">

                    {/* Operator block */}
                    <div className="flex flex-col items-center w-16 flex-shrink-0">
                        <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center">
                            <FaBus className="text-orange-500 text-xl" />
                        </div>
                        <span className="text-[10px] text-center text-gray-400 font-semibold mt-1.5 uppercase tracking-wide leading-tight">
                            {bus.operator}
                        </span>
                    </div>

                    {/* Journey */}
                    <div className="flex-1 flex flex-col gap-3">
                        <div className="flex items-center gap-6">
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Departure</span>
                                <span className="text-2xl font-black text-gray-900 tracking-tight">{bus.departure.time}</span>
                                <span className="text-sm font-bold text-orange-500">{bus.departure.city}</span>
                                <span className="text-xs text-gray-400">{bus.departure.date}</span>
                            </div>

                            <div className="flex-1 flex flex-col items-center gap-1 px-2">
                                <span className="text-[10px] text-gray-400 font-semibold">{bus.duration} hrs</span>
                                <div className="w-full flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
                                    <div className="flex-1 h-px bg-gradient-to-r from-orange-300 to-blue-300" />
                                    <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                                </div>
                                <span className="text-[9px] text-gray-300 tracking-widest uppercase">Direct</span>
                            </div>

                            <div className="flex flex-col items-end">
                                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Arrival</span>
                                <span className="text-2xl font-black text-gray-900 tracking-tight">{bus.arrival.time}</span>
                                <span className="text-sm font-bold text-blue-500">{bus.arrival.city}</span>
                                <span className="text-xs text-gray-400">{bus.arrival.date}</span>
                            </div>
                        </div>

                        {expanded && (
                            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
                                <InfoRow label="Bus Type"     value={bus.busType} />
                                <InfoRow label="Model"        value={bus.model} />
                                <InfoRow label="Schedule ID"  value={bus.scheduleId} />
                                <InfoRow label="Closing Date" value={bus.bookingClosingDate} />
                                <InfoRow label="Closing Time" value={bus.bookingClosingTime} />
                                <InfoRow label="Depot"        value={bus.depotName} />
                            </div>
                        )}
                    </div>

                    {/* Price + action */}
                    <div className="flex flex-col items-end gap-3 flex-shrink-0 min-w-[110px]">
                        <div className="text-right">
                            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Price</p>
                            <p className="text-2xl font-black text-gray-900">₨{bus.price.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-lg">
                            <FaChair className="text-orange-400 text-xs" />
                            <span className="text-xs font-bold text-orange-600">{bus.availableSeats} seats</span>
                        </div>
                        <button
                            onClick={handleBook}
                            className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold py-2 px-5 rounded-xl text-sm transition-all duration-150"
                        >
                            {isSearchPage ? 'Book Now' : 'Hide'}
                        </button>
                    </div>
                </div>

                {/* Mobile */}
                <div className="flex sm:hidden flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0">
                                <FaBus className="text-orange-500 text-sm" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-700">{bus.operator}</p>
                                <p className="text-[10px] text-gray-400">{bus.busType}</p>
                            </div>
                        </div>
                        <button onClick={() => setExpanded(!expanded)} className="text-gray-300 hover:text-orange-400 transition-colors">
                            <IoIosInformationCircle className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                            <span className="text-base font-black text-gray-900">{bus.departure.time}</span>
                            <span className="text-xs font-bold text-orange-500">{bus.departure.city}</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-0.5">
                            <span className="text-[9px] text-gray-400">{bus.duration} hrs</span>
                            <div className="w-full h-px bg-gradient-to-r from-orange-300 to-blue-300" />
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-base font-black text-gray-900">{bus.arrival.time}</span>
                            <span className="text-xs font-bold text-blue-500">{bus.arrival.city}</span>
                        </div>
                    </div>

                    {expanded && (
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                            <InfoRow label="Bus Type"     value={bus.busType} />
                            <InfoRow label="Schedule ID"  value={bus.scheduleId} />
                            <InfoRow label="Closing Date" value={bus.bookingClosingDate} />
                            <InfoRow label="Depot"        value={bus.depotName} />
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div>
                            <p className="text-xl font-black text-gray-900">₨{bus.price.toLocaleString()}</p>
                            <p className="text-xs text-gray-400">{bus.availableSeats} seats left</p>
                        </div>
                        <button
                            onClick={handleBook}
                            className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold py-2 px-5 rounded-xl text-sm transition-all duration-150"
                        >
                            {isSearchPage ? 'Book Now' : 'Hide'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom bar - light gray, not dark */}
            <div className="flex justify-between items-center bg-gray-50 border-t border-gray-100 px-5 py-2.5">
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-xs font-semibold text-gray-400 hover:text-orange-500 transition-colors flex items-center gap-1.5 tracking-wide"
                >
                    <FaClock className="text-[10px]" />
                    {expanded ? 'Hide Details' : 'Boarding / Dropping Points'}
                </button>
                <span className="text-[10px] text-gray-300 uppercase tracking-widest">{bus.scheduleId}</span>
            </div>
        </div>
    );
}

// ─── SearchBuses (main page) ──────────────────────────────────────────────────
export default function SearchBuses() {
    const bookingList = useSelector(state => state.booking.bookingList);
    const latest      = bookingList[bookingList.length - 1]?.journeySummary;

    const departure = latest?.departure  || '';
    const arrival   = latest?.arrival    || '';
    const date      = latest?.bookingDate?.[0]?.startSession || '';

    const [buses, setBuses]           = useState([]);
    const [loading, setLoading]       = useState(true);
    const [error, setError]           = useState(null);
    const [activeSort, setActiveSort] = useState('default');

    useEffect(() => {
        setLoading(true);
        setError(null);
        mockFetchBuses({ departure, arrival, date })
            .then(data => { setBuses(data); setLoading(false); })
            .catch(err  => { setError(err.message); setLoading(false); });
    }, [departure, arrival, date]);

    const sorted = sortBuses(buses, activeSort);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 pt-16">
            <TopHeader departure={departure} arrival={arrival} date={date} />
            <TopHeaderSort activeSort={activeSort} onSort={setActiveSort} />

            <div className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 flex flex-col gap-4">

                {loading && (
                    <div className="flex flex-col items-center justify-center py-24 gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center">
                            <FaBus className="text-orange-400 text-2xl animate-bounce" />
                        </div>
                        <p className="text-gray-400 text-xs font-bold tracking-widest uppercase">Finding buses...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-500 rounded-2xl px-6 py-4 text-sm font-semibold">
                        Failed to load buses: {error}
                    </div>
                )}

                {!loading && !error && sorted.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-gray-100 border border-gray-100 flex items-center justify-center">
                            <FaRoute className="text-gray-300 text-2xl" />
                        </div>
                        <p className="text-gray-400 text-xs font-bold tracking-widest uppercase">No buses found for this route</p>
                        <Link to="/" className="text-orange-500 text-sm font-bold hover:underline">Modify your search</Link>
                    </div>
                )}

                {!loading && !error && sorted.map(bus => (
                    <BusBookingCard key={bus.id} bus={bus} />
                ))}

                {!loading && !error && sorted.length > 0 && (
                    <p className="text-center text-gray-300 text-xs font-semibold tracking-widest uppercase pt-4">
                        {sorted.length} bus{sorted.length !== 1 ? 'es' : ''} found
                    </p>
                )}
            </div>
        </div>
    );
}