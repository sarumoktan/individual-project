import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaBus, FaQuestionCircle, FaExchangeAlt, FaBolt, FaShieldAlt, FaTicketAlt, FaHeadset, FaMobileAlt, FaRoute, FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { BookingActions } from '../redux/Booking-slice.jsx';

const nepalLocations = [
    { place: 'Kathmandu' }, { place: 'Pokhara' }, { place: 'Chitwan' },
    { place: 'Lumbini' }, { place: 'Biratnagar' }, { place: 'Birgunj' },
    { place: 'Dharan' }, { place: 'Janakpur' }, { place: 'Butwal' },
    { place: 'Nepalgunj' }, { place: 'Dhangadhi' }, { place: 'Hetauda' },
    { place: 'Itahari' }, { place: 'Bhairahawa' }, { place: 'Narayanghat' },
    { place: 'Gorkha' }, { place: 'Tansen' }, { place: 'Baglung' },
    { place: 'Syangja' }, { place: 'Waling' }, { place: 'Damauli' },
    { place: 'Mugling' }, { place: 'Dumre' }, { place: 'Bharatpur' },
    { place: 'Mahendranagar' }, { place: 'Bhadrapur' }, { place: 'Ilam' },
    { place: 'Taplejung' }, { place: 'Jaleshwor' }, { place: 'Rajbiraj' },
];

const bgImage1 = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1600&q=80';
const bgImage2 = 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=1600&q=80';

const features = [
    { icon: FaBolt,      title: 'Instant Booking',  desc: 'Seat confirmed in under 60 seconds.',          color: '#FFF3CD', iconColor: '#D97706' },
    { icon: FaShieldAlt, title: 'Secure Payments',  desc: 'Encrypted transactions on every booking.',     color: '#DCFCE7', iconColor: '#16A34A' },
    { icon: FaTicketAlt, title: 'Digital Tickets',  desc: 'Your ticket lives on your phone.',             color: '#DBEAFE', iconColor: '#2563EB' },
    { icon: FaRoute,     title: '200+ Routes',       desc: 'Highways and remote towns, all provinces.',   color: '#F3E8FF', iconColor: '#7C3AED' },
    { icon: FaMobileAlt, title: 'Mobile First',      desc: 'Full experience on any device, any screen.',  color: '#FFE4E6', iconColor: '#E11D48' },
    { icon: FaHeadset,   title: '24/7 Support',      desc: 'Reachable any time something goes wrong.',    color: '#FEF9C3', iconColor: '#CA8A04' },
];

const paymentMethods = [
    { name: 'eSewa',             bg: '#60BB46', text: '#fff',    initial: 'eS', desc: 'Most used digital wallet in Nepal',   tag: 'Most Popular' },
    { name: 'Khalti',            bg: '#5C2D91', text: '#fff',    initial: 'Kh', desc: 'Fast and secure digital payments',    tag: 'Recommended'  },
    { name: 'IME Pay',           bg: '#E31E24', text: '#fff',    initial: 'IM', desc: 'Remittance-linked wallet',            tag: null           },
    { name: 'ConnectIPS',        bg: '#003087', text: '#fff',    initial: 'CI', desc: 'Direct transfer, all Nepal banks',    tag: null           },
    { name: 'Cash',              bg: '#E8F5E9', text: '#2E7D32', initial: '₨',  desc: 'Pay at the counter before departure', tag: null           },
    { name: 'Visa / Mastercard', bg: '#1A1A2E', text: '#fff',    initial: '💳', desc: 'All major international cards',       tag: null           },
];

function StationInput({ label, value, onChange, filtered, onSelect, error, placeholder }) {
    return (
        <div className="space-y-1">
            <label className="block text-xs font-semibold tracking-widest text-gray-400 uppercase">
                {label}
            </label>
            <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400 text-sm z-10" />
                <input
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={`w-full pl-9 pr-3 py-3 bg-white border-2 rounded-xl text-gray-800 placeholder-gray-400 text-sm font-medium
                        focus:outline-none transition-all
                        ${value ? 'border-orange-400' : 'border-gray-200'}
                        ${error ? 'border-red-400 bg-red-50' : 'hover:border-gray-300'}`}
                />
                {filtered.length > 0 && (
                    <ul className="absolute z-30 w-full mt-1 bg-white border-2 border-gray-100 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                        {filtered.map((station, i) => (
                            <li
                                key={i}
                                onClick={() => onSelect(station)}
                                className="px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 cursor-pointer transition-colors font-medium"
                            >
                                {station}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default function HomePage() {
    const current = new Date();
    const [departureStation, setDepartureStation] = useState('');
    const [arrivalStation, setArrivalStation]     = useState('');
    const [journeyDate, setJourneyDate]           = useState(current.toISOString().split('T')[0]);
    const [stations, setStations]                 = useState([]);
    const [filteredDep, setFilteredDep]           = useState([]);
    const [filteredArr, setFilteredArr]           = useState([]);
    const [errors, setErrors]                     = useState({});
    const [bgIndex, setBgIndex]                   = useState(0);

    const navigation = useNavigate();
    const dispatch   = useDispatch();

    useEffect(() => {
        setStations(nepalLocations.map(l => l.place));
    }, []);

    useEffect(() => {
        const interval = setInterval(() => setBgIndex(p => p === 0 ? 1 : 0), 6000);
        return () => clearInterval(interval);
    }, []);

    const filter = (input, type) => {
        const filtered = stations.filter(s => s.toLowerCase().includes(input.toLowerCase()));
        type === 'dep' ? setFilteredDep(filtered) : setFilteredArr(filtered);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formErrors = {};
        if (!journeyDate)      formErrors.journeyDate = true;
        if (!arrivalStation)   formErrors.arrivalStation = true;
        if (!departureStation) formErrors.departureStation = true;
        if (Object.keys(formErrors).length > 0) { setErrors(formErrors); return; }
        dispatch(BookingActions.findBus({ departureStation, arrivalStation, journeyDate }));
        navigation('/bus-booking/search-buses');
    };

    const swapStations = () => {
        setDepartureStation(arrivalStation);
        setArrivalStation(departureStation);
    };

    const bgImages = [bgImage1, bgImage2];

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ── HERO ── */}
            <div className="relative overflow-hidden" style={{ minHeight: '72vh' }}>
                <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
                    style={{ backgroundImage: `url(${bgImages[bgIndex]})` }}
                />
                <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(160deg, rgba(20,10,5,0.72) 0%, rgba(120,50,10,0.45) 60%, rgba(255,140,0,0.18) 100%)' }}
                />

                <div className="relative z-10 pt-16 pb-44 px-4 text-center">
                    <span className="inline-block bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full tracking-wider uppercase mb-6">
                        Nepal Bus Ticketing
                    </span>
                    <h1
                        className="text-white font-black leading-none mb-4"
                        style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', letterSpacing: '-0.03em' }}
                    >
                        Travel Nepal,<br />
                        <span style={{ color: '#FDBA74' }}>your way.</span>
                    </h1>
                    <p className="text-orange-100 text-base md:text-lg max-w-md mx-auto opacity-90">
                        200+ routes. Instant confirmation. Kathmandu to anywhere.
                    </p>
                </div>

                <div className="absolute bottom-36 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {[0, 1].map(i => (
                        <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all duration-300 ${bgIndex === i ? 'w-6 bg-orange-400' : 'w-1.5 bg-white/40'}`}
                        />
                    ))}
                </div>
            </div>

            {/* ── BOOKING CARD ── */}
            <div className="relative z-20 max-w-5xl mx-auto px-4 -mt-32">
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 md:p-8">
                    <div className="flex items-center gap-2 mb-6">
                        <FaBus className="text-orange-500 text-lg" />
                        <h2 className="text-gray-800 font-bold text-lg">Book your ticket</h2>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* 3 columns: From, To, Date+Button */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <StationInput
                                label="From"
                                placeholder="Departure city"
                                value={departureStation}
                                onChange={(e) => { setDepartureStation(e.target.value); filter(e.target.value, 'dep'); }}
                                filtered={filteredDep}
                                onSelect={(s) => { setDepartureStation(s); setFilteredDep([]); }}
                                error={errors.departureStation}
                            />

                            <StationInput
                                label="To"
                                placeholder="Arrival city"
                                value={arrivalStation}
                                onChange={(e) => { setArrivalStation(e.target.value); filter(e.target.value, 'arr'); }}
                                filtered={filteredArr}
                                onSelect={(s) => { setArrivalStation(s); setFilteredArr([]); }}
                                error={errors.arrivalStation}
                            />

                            {/* Date inline */}
                            <div className="space-y-1">
                                <label className="block text-xs font-semibold tracking-widest text-gray-400 uppercase">
                                    Date
                                </label>
                                <div className="relative">
                                    <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400 text-sm z-10 pointer-events-none" />
                                    <input
                                        type="date"
                                        value={journeyDate}
                                        onChange={(e) => setJourneyDate(e.target.value)}
                                        min={current.toISOString().split('T')[0]}
                                        className={`w-full pl-9 pr-3 py-3 bg-white border-2 rounded-xl text-gray-800 text-sm font-medium
                                            focus:outline-none transition-all
                                            ${journeyDate ? 'border-orange-400' : 'border-gray-200'}
                                            ${errors.journeyDate ? 'border-red-400 bg-red-50' : 'hover:border-gray-300'}`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Actions row */}
                        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={swapStations}
                                    className="text-gray-400 hover:text-orange-500 flex items-center gap-1.5 text-xs font-semibold transition-colors"
                                >
                                    <FaExchangeAlt className="h-3 w-3" />
                                    Swap stations
                                </button>
                                <a href="#" className="text-gray-400 hover:text-orange-500 flex items-center gap-1.5 text-xs font-semibold transition-colors">
                                    <FaQuestionCircle className="h-3 w-3" />
                                    Need help?
                                </a>
                            </div>
                            <button
                                type="submit"
                                className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold py-2.5 px-6 rounded-xl transition-all duration-150 flex items-center gap-2 text-sm"
                            >
                                <FaBus className="h-4 w-4" />
                                Find Buses
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* ── FEATURES ── */}
            <section className="bg-gray-50 pt-16 pb-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-12">
                        <p className="text-orange-500 text-xs font-bold tracking-widest uppercase mb-2">Why us</p>
                        <h2
                            className="text-gray-900 font-black text-3xl md:text-4xl"
                            style={{ letterSpacing: '-0.02em' }}
                        >
                            Built for Nepal travelers
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {features.map((f, i) => (
                            <div
                                key={i}
                                className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow duration-200"
                            >
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                                    style={{ backgroundColor: f.color }}
                                >
                                    <f.icon style={{ color: f.iconColor }} className="text-base" />
                                </div>
                                <h3 className="text-gray-900 font-bold text-sm mb-1">{f.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── PAYMENT OPTIONS ── */}
            <section className="bg-white py-20 px-4 border-t border-gray-100">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-12">
                        <p className="text-orange-500 text-xs font-bold tracking-widest uppercase mb-2">Payments</p>
                        <h2
                            className="text-gray-900 font-black text-3xl md:text-4xl"
                            style={{ letterSpacing: '-0.02em' }}
                        >
                            Pay your way
                        </h2>
                        <p className="text-gray-400 mt-2 text-sm max-w-sm">
                            Every major payment method in Nepal. No extra fees on any of them.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {paymentMethods.map((p, i) => (
                            <div
                                key={i}
                                className="relative flex items-center gap-4 bg-gray-50 border border-gray-100 rounded-2xl p-5 hover:border-gray-200 hover:shadow-sm transition-all duration-200"
                            >
                                {p.tag && (
                                    <span
                                        className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full"
                                        style={{ background: '#FFF3CD', color: '#92400E' }}
                                    >
                                        {p.tag}
                                    </span>
                                )}
                                <div
                                    className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
                                    style={{ backgroundColor: p.bg, color: p.text }}
                                >
                                    {p.initial}
                                </div>
                                <div>
                                    <p className="text-gray-900 font-bold text-sm">{p.name}</p>
                                    <p className="text-gray-400 text-xs mt-0.5">{p.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="text-gray-300 text-xs mt-10 text-center">
                        Transactions are encrypted. Card details are never stored.
                    </p>
                </div>
            </section>
        </div>
    );
}