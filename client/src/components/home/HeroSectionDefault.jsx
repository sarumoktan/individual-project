import React, { useState, useEffect } from 'react';
import {  FaMapMarkerAlt, FaBus, FaQuestionCircle, FaExchangeAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import {  useDispatch, useSelector } from 'react-redux';
import DateInput from '../input/DateInput';
import { backgroundSource1, backgroundSource2 } from '../../utils/index.js';
import { locations} from '../../utils/UserDataBase.js'
import { BookingActions } from '../../redux/Booking-slice.jsx';

export default function HeroSectionDefault() {
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
    const [backgroundImage, setBackgroundImage] = useState(backgroundSource1);
    const dispatch = useDispatch();

    useEffect(() => {
        const interval = setInterval(() => {
            setBackgroundImage(prevImage => prevImage === backgroundSource1 ? backgroundSource2 : backgroundSource1);
        }, 5000); 

        return () => clearInterval(interval); 
    }, []);

    useEffect(() => {
        const fetchStations = async () => {
            const mockStations = locations.map(location => location.place);
            setStations(mockStations);
        };
        fetchStations();
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
        if (!journeyDate) {
            formErrors.journeyDate = true;
        }
        if (!arrivalStation) {
            formErrors.arrivalStation = true;
        }
        if (!departureStation) {
            formErrors.departureStation = true;
        }

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }
        dispatch(
            BookingActions.findBus({ departureStation, arrivalStation, journeyDate })
        )
        console.log({ departureStation, arrivalStation, journeyDate });
        navigation(`/bus-booking/search-buses`);
    };

    const swapStations = () => {
        setDepartureStation(arrivalStation);
        setArrivalStation(departureStation);
    };

    return (
        <div className={`min-h-screen `}>
            <div className={`relative h-[60vh] flex items-center justify-center px-2 ${Theme ? 'text-white' : 'text-primary'} `}>
                <div 
                    className="absolute inset-0 bg-cover bg-center z-0 "
                    style={{
                        backgroundImage: `url(${backgroundImage})`,
                        backgroundBlendMode: 'overlay'
                    }}
                >
                    <div className={`absolute inset-0 ${Theme ? 'bg-black/50 ' : 'bg-white/50 '}`}></div>
                </div>
                
                <div className="z-10 text-center cursor-pointer">
                    <h1 className="text-5xl md:text-7xl font-bold mb-4">Explore Sri Lanka</h1>
                    <p className="text-xl md:text-2xl">Discover the beauty of the island with our bus services</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8 -mt-24 relative z-20  ">
                <div className={` ${Theme ? 'bg-white' : 'bg-gray-800'} rounded-md shadow-lg p-6 md:p-8   cursor-pointer border-2 border-gray-200`}>
                    <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center text-primary">
                        Book Your Bus Tickets in Sri Lanka
                    </h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-6 md:space-y-0 md:grid md:grid-cols-4 md:gap-4">
                    <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 uppercase">FROM</label>
                            <div className="relative">
                                <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Enter arrival station"
                                    className={` ${arrivalStation !== '' && 'bg-blue-100'} w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 hover:outline-none focus:outline-none ${errors.arrivalStation &&  "ring-red-500 ring-2"}`}
                                    value={arrivalStation}
                                    onChange={(e) => {
                                        setArrivalStation(e.target.value);
                                        handleStationFilter(e.target.value, 'arrival');
                                    }}
                                    
                                />
                                {filteredArrivalStations.length > 0 && (
                                    <ul className={`absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-52 overflow-hidden overflow-y-scroll `}>
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

                        <div className="space-y-2">
                            <label className={`block text-sm font-medium  ${Theme ? 'text-gray-700' : 'text-white'} uppercase`}>TO</label>
                            <div className="relative">
                                <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Enter departure station"
                                    className={`${errors.departureStation &&  "ring-red-500 ring-2"} w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 hover:outline-none focus:outline-none ${departureStation !== '' && 'bg-blue-100'} `}
                                    value={departureStation}
                                    onChange={(e) => {
                                        setDepartureStation(e.target.value);
                                        handleStationFilter(e.target.value, 'departure');
                                    }}  
                                    
                                />
                                {filteredDepartureStations.length > 0 && (
                                    <ul className={ ` absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-52 overflow-hidden overflow-y-scroll `}>
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
           
                        <DateInput 
                            value={journeyDate}
                            onChange={(e) => setJourneyDate(e.target.value)}
                            error={errors.journeyDate}
                        />

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Action</label>
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