import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaBus, FaQuestionCircle, FaExchangeAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DateInput from '../input/DateInput';
import { BookingActions } from '../../redux/Booking-slice.jsx';

// Nepal locations - major bus stations and cities
const nepalLocations = [
    { place: 'Kathmandu' },
    { place: 'Pokhara' },
    { place: 'Chitwan' },
    { place: 'Lumbini' },
    { place: 'Biratnagar' },
    { place: 'Birgunj' },
    { place: 'Dharan' },
    { place: 'Janakpur' },
    { place: 'Butwal' },
    { place: 'Nepalgunj' },
    { place: 'Dhangadhi' },
    { place: 'Hetauda' },
    { place: 'Itahari' },
    { place: 'Bhairahawa' },
    { place: 'Narayanghat' },
    { place: 'Gorkha' },
    { place: 'Tansen' },
    { place: 'Baglung' },
    { place: 'Syangja' },
    { place: 'Waling' },
    { place: 'Damauli' },
    { place: 'Mugling' },
    { place: 'Dumre' },
    { place: 'Bharatpur' },
    { place: 'Mahendranagar' },
    { place: 'Bhadrapur' },
    { place: 'Ilam' },
    { place: 'Taplejung' },
    { place: 'Jaleshwor' },
    { place: 'Rajbiraj' },
];

// Background images - replace with actual Nepal mountain/travel images
const bgImage1 = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1600&q=80';
const bgImage2 = 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=1600&q=80';

export default function HeroSectionNepal() {
    const current = new Date();
    const [departureStation, setDepartureStation] = useState('');
    const [arrivalStation, setArrivalStation] = useState('');
    const [journeyDate, setJourneyDate] = useState(current.toISOString().split('T')[0]);
    const [stations, setStations] = useState([]);
    const [filteredDepartureStations, setFilteredDepartureStations] = useState([]);
    const [filteredArrivalStations, setFilteredArrivalStations] = useState([]);
    const navigation = useNavigate();
    const Theme = useSelector(state => state.theme.lightTheme);
    const [errors, setErrors] = useState({});
    const [backgroundImage, setBackgroundImage] = useState(bgImage1);
    const dispatch = useDispatch();

    useEffect(() => {
        const interval = setInterval(() => {
            setBackgroundImage(prev => prev === bgImage1 ? bgImage2 : bgImage1);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const mockStations = nepalLocations.map(location => location.place);
        setStations(mockStations);
    }, []);

    const handleStationFilter = (input, type) => {
        const filtered = stations.filter(station =>
            station.toLowerCase().includes(input.toLowerCase())
        );
        if (type === 'departure') {
            setFilteredDepartureStations(filtered);
        } else {
            setFilteredArrivalStations(filtered);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        let formErrors = {};
        if (!journeyDate) formErrors.journeyDate = true;
        if (!arrivalStation) formErrors.arrivalStation = true;
        if (!departureStation) formErrors.departureStation = true;

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        dispatch(
            BookingActions.findBus({ departureStation, arrivalStation, journeyDate })
        );
        navigation(`/bus-booking/search-buses`);
    };

    const swapStations = () => {
        setDepartureStation(arrivalStation);
        setArrivalStation(departureStation);
    };

    return (
        <div className="min-h-screen">
            {/* Hero Banner */}
            <div
                className={`relative h-[60vh] flex items-center justify-center px-2 ${Theme ? 'text-white' : 'text-gray-900'}`}
            >
                <div
                    className="absolute inset-0 bg-cover bg-center z-0 transition-all duration-1000"
                    style={{
                        backgroundImage: `url(${backgroundImage})`,
                        backgroundBlendMode: 'overlay',
                    }}
                >
                    <div className={`absolute inset-0 ${Theme ? 'bg-black/55' : 'bg-white/50'}`}></div>
                </div>

                <div className="z-10 text-center">
                    <h1 className="text-5xl md:text-7xl font-bold mb-4">
                        Travel Nepal
                    </h1>
                    <p className="text-xl md:text-2xl">
                        Book bus tickets across Nepal's cities and towns
                    </p>
                </div>
            </div>

            {/* Booking Form */}
            <div className="max-w-6xl mx-auto px-4 py-8 -mt-24 relative z-20">
                <div
                    className={`${Theme ? 'bg-white' : 'bg-gray-800'} rounded-md shadow-lg p-6 md:p-8 border-2 border-gray-200`}
                >
                    <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center text-primary">
                        Book Your Bus Tickets in Nepal
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6 md:space-y-0 md:grid md:grid-cols-4 md:gap-4"
                    >
                        {/* FROM */}
                        <div className="space-y-2">
                            <label className={`block text-sm font-medium uppercase ${Theme ? 'text-gray-700' : 'text-white'}`}>
                                FROM
                            </label>
                            <div className="relative">
                                <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Departure city"
                                    className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 hover:outline-none focus:outline-none
                                        ${departureStation !== '' && 'bg-blue-100'}
                                        ${errors.departureStation && 'ring-red-500 ring-2'}`}
                                    value={departureStation}
                                    onChange={(e) => {
                                        setDepartureStation(e.target.value);
                                        handleStationFilter(e.target.value, 'departure');
                                    }}
                                />
                                {filteredDepartureStations.length > 0 && (
                                    <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-52 overflow-y-scroll">
                                        {filteredDepartureStations.map((station, index) => (
                                            <li
                                                key={index}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => {
                                                    setDepartureStation(station);
                                                    setFilteredDepartureStations([]);
                                                }}
                                            >
                                                {station}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        {/* TO */}
                        <div className="space-y-2">
                            <label className={`block text-sm font-medium uppercase ${Theme ? 'text-gray-700' : 'text-white'}`}>
                                TO
                            </label>
                            <div className="relative">
                                <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Arrival city"
                                    className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 hover:outline-none focus:outline-none
                                        ${arrivalStation !== '' && 'bg-blue-100'}
                                        ${errors.arrivalStation && 'ring-red-500 ring-2'}`}
                                    value={arrivalStation}
                                    onChange={(e) => {
                                        setArrivalStation(e.target.value);
                                        handleStationFilter(e.target.value, 'arrival');
                                    }}
                                />
                                {filteredArrivalStations.length > 0 && (
                                    <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-52 overflow-y-scroll">
                                        {filteredArrivalStations.map((station, index) => (
                                            <li
                                                key={index}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => {
                                                    setArrivalStation(station);
                                                    setFilteredArrivalStations([]);
                                                }}
                                            >
                                                {station}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        {/* Date */}
                        <DateInput
                            value={journeyDate}
                            onChange={(e) => setJourneyDate(e.target.value)}
                            error={errors.journeyDate}
                        />

                        {/* Submit */}
                        <div className="space-y-2">
                            <label className={`block text-sm font-medium ${Theme ? 'text-gray-700' : 'text-white'}`}>
                                Action
                            </label>
                            <button
                                type="submit"
                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                            >
                                <FaBus className="h-5 w-5" />
                                Find Buses
                            </button>
                        </div>
                    </form>

                    <div className="mt-4 flex justify-between items-center">
                        <button
                            onClick={swapStations}
                            className="text-sky-500 hover:text-sky-600 flex items-center gap-1"
                        >
                            <FaExchangeAlt className="h-4 w-4" />
                            Swap Stations
                        </button>
                        <a href="#" className="text-emerald-500 hover:text-emerald-600 flex items-center gap-1">
                            <FaQuestionCircle className="h-4 w-4" />
                            Need help?
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}