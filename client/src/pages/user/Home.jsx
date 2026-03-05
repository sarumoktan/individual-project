import React, { useState, useEffect } from 'react';
import {
    FaMapMarkerAlt, FaBus, FaQuestionCircle, FaExchangeAlt,
    FaBolt, FaShieldAlt, FaTicketAlt, FaHeadset, FaMobileAlt,
    FaRoute, FaCalendarAlt,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import nepalCities from "../../utils/cities"


const bgImage1 = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1600&q=80';
const bgImage2 = 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=1600&q=80';

const features = [
    { icon: FaBolt,      title: 'Instant Booking',  desc: 'Seat confirmed in under 60 seconds.',         color: '#FFF3CD', iconColor: '#D97706' },
    { icon: FaShieldAlt, title: 'Secure Payments',  desc: 'Encrypted transactions on every booking.',    color: '#DCFCE7', iconColor: '#16A34A' },
    { icon: FaTicketAlt, title: 'Digital Tickets',  desc: 'Your ticket lives on your phone.',            color: '#DBEAFE', iconColor: '#2563EB' },
    { icon: FaRoute,     title: '200+ Routes',       desc: 'Highways and remote towns, all provinces.',  color: '#F3E8FF', iconColor: '#7C3AED' },
    { icon: FaMobileAlt, title: 'Mobile First',      desc: 'Full experience on any device, any screen.', color: '#FFE4E6', iconColor: '#E11D48' },
    { icon: FaHeadset,   title: '24/7 Support',      desc: 'Reachable any time something goes wrong.',   color: '#FEF9C3', iconColor: '#CA8A04' },
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
                    className={`w-full pl-9 pr-3 py-3 bg-white border-2 rounded-xl text-gray-800 placeholder-gray-400 text-sm font-medium focus:outline-none transition-all
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
    const navigate = useNavigate();

    const [departureStation, setDepartureStation] = useState('');
    const [arrivalStation,   setArrivalStation]   = useState('');
    const [journeyDate,      setJourneyDate]       = useState(current.toISOString().split('T')[0]);
    const [stations,         setStations]          = useState(nepalCities);
    const [filteredDep,      setFilteredDep]       = useState([]);
    const [filteredArr,      setFilteredArr]       = useState([]);
    const [errors,           setErrors]            = useState({});
    const [bgIndex,          setBgIndex]           = useState(0);

    useEffect(() => {
        const interval = setInterval(() => setBgIndex(p => (p === 0 ? 1 : 0)), 6000);
        return () => clearInterval(interval);
    }, []);

    const filter = (input, type) => {
        const result = stations.filter(s => s.toLowerCase().includes(input.toLowerCase()));
        type === 'dep' ? setFilteredDep(result) : setFilteredArr(result);
    };

    useEffect(() => {
        const handler = () => {
            setFilteredDep([]);
            setFilteredArr([]);
        };
        document.addEventListener('click', handler);
        return () => document.removeEventListener('click', handler);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formErrors = {};
        if (!departureStation) formErrors.departureStation = true;
        if (!arrivalStation)   formErrors.arrivalStation   = true;
        if (!journeyDate)      formErrors.journeyDate      = true;

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        navigate('available-trips', {
            state: { departureStation, arrivalStation, journeyDate },
        });
    };

    const swapStations = () => {
        setDepartureStation(arrivalStation);
        setArrivalStation(departureStation);
    };

    const bgImages = [bgImage1, bgImage2];

    return (
        <div className="min-h-screen bg-gray-50">
 
            <div className="relative overflow-hidden" style={{ minHeight: '1vh' }}>
                <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
                    style={{ backgroundImage: `url(${bgImages[bgIndex]})` }}
                />
                <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(160deg, rgba(20,10,5,0.72) 0%, rgba(120,50,10,0.45) 60%, rgba(255,140,0,0.18) 100%)' }}
                />
                <div className="relative z-10 pt-40 pb-40 px-4 text-center">
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

            {/* Booking card */}
            <div className="relative z-20 max-w-5xl mx-auto px-4 -mt-32">
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 md:p-8">
                    <div className="flex items-center gap-2 mb-6">
                        <FaBus className="text-orange-500 text-lg" />
                        <h2 className="text-gray-800 font-bold text-lg">Book your ticket</h2>
                    </div>
                    <form onSubmit={handleSubmit}>
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
                                        className={`w-full pl-9 pr-3 py-3 bg-white border-2 rounded-xl text-gray-800 text-sm font-medium focus:outline-none transition-all
                                            ${journeyDate ? 'border-orange-400' : 'border-gray-200'}
                                            ${errors.journeyDate ? 'border-red-400 bg-red-50' : 'hover:border-gray-300'}`}
                                    />
                                </div>
                            </div>
                        </div>
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
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-orange-500 flex items-center gap-1.5 text-xs font-semibold transition-colors"
                                >
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

            {/* Features */}
            <section className="bg-gray-50 pt-16 pb-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-12">
                        <p className="text-orange-500 text-xs font-bold tracking-widest uppercase mb-2">Why us</p>
                        <h2 className="text-gray-900 font-black text-3xl md:text-4xl">Built for Nepal travelers</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {features.map((f, i) => (
                            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow duration-200">
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
        </div>
    );
}