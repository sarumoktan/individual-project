import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    FaBus, FaMapMarkerAlt, FaArrowRight,
    FaUserTie, FaChevronLeft, FaCalendarAlt,
} from 'react-icons/fa';
import { MdDirectionsBus, MdEventSeat } from 'react-icons/md';
import { searchSchedulesApi } from '../../services/api';

const classBadge = {
    'Luxury': { bg: '#F3E8FF', text: '#7C3AED' },
    'Semi-Luxury': { bg: '#DBEAFE', text: '#2563EB' },
    'Standard': { bg: '#F3F4F6', text: '#4B5563' },
};

const comfortBadge = {
    'AC': { bg: '#DCFCE7', text: '#16A34A' },
    'Non-AC': { bg: '#FEF9C3', text: '#CA8A04' },
};

function duration(dep, arr) {
    const [dh, dm] = dep.split(':').map(Number);
    const [ah, am] = arr.split(':').map(Number);
    let mins = (ah * 60 + am) - (dh * 60 + dm);
    if (mins < 0) mins += 24 * 60;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h${m > 0 ? ` ${m}m` : ''}` : `${m}m`;
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
}

function ScheduleCard({ schedule, journeyDate }) {
    const navigate = useNavigate();
    const cls = classBadge[schedule.bus?.class] ?? classBadge['Standard'];
    const cmft = comfortBadge[schedule.bus?.comfort] ?? comfortBadge['Non-AC'];

    return (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-200">
            <div className="px-6 py-5">
                {/* Times + price row */}
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="text-center flex-shrink-0">
                            <p className="text-2xl font-black text-gray-900">{schedule.departure_time}</p>
                            <p className="text-xs text-gray-400 font-semibold mt-0.5">{schedule.origin}</p>
                        </div>

                        <div className="flex-1 flex flex-col items-center gap-1">
                            <span className="text-[11px] text-gray-400 font-semibold">
                                {duration(schedule.departure_time, schedule.arrival_time)}
                            </span>
                            <div className="w-full flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full border-2 border-orange-400 flex-shrink-0" />
                                <div className="flex-1 h-px bg-gray-200 relative">
                                    {schedule.stops?.length > 0 && (
                                        <div className="absolute inset-0 flex items-center justify-around px-1">
                                            {schedule.stops.map((_, i) => (
                                                <div key={i} className="w-1.5 h-1.5 rounded-full bg-orange-300" />
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
                            </div>
                            <span className="text-[10px] text-gray-400">
                                {schedule.stops?.length > 0
                                    ? `${schedule.stops.length} stop${schedule.stops.length > 1 ? 's' : ''}`
                                    : 'Non-stop'}
                            </span>
                        </div>

                        <div className="text-center flex-shrink-0">
                            <p className="text-2xl font-black text-gray-900">{schedule.arrival_time}</p>
                            <p className="text-xs text-gray-400 font-semibold mt-0.5">{schedule.destination}</p>
                        </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                        <p className="text-2xl font-black text-orange-500">
                            Rs. {Number(schedule.price).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400 font-semibold">per seat</p>
                    </div>
                </div>

                {/* Stops detail */}
                {schedule.stops?.length > 0 && (
                    <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                        <FaMapMarkerAlt className="text-gray-300 text-xs flex-shrink-0" />
                        {schedule.stops.map((s, i) => (
                            <React.Fragment key={i}>
                                <span className="text-xs text-gray-400">
                                    {s.city}{s.time ? ` (${s.time})` : ''}
                                </span>
                                {i < schedule.stops.length - 1 && <span className="text-gray-200 text-xs">·</span>}
                            </React.Fragment>
                        ))}
                    </div>
                )}
            </div>

            {/* Bottom bar */}
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <MdDirectionsBus className="text-gray-300 text-sm" />
                        <span className="font-semibold">{schedule.bus?.plate}</span>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: cls.bg, color: cls.text }}>
                        {schedule.bus?.class}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: cmft.bg, color: cmft.text }}>
                        {schedule.bus?.comfort}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                        <MdEventSeat className="text-gray-300" />
                        <span>{schedule.bus?.seats} seats</span>
                    </div>
                    {schedule.driver && (
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                            <FaUserTie className="text-gray-300" />
                            <span>{schedule.driver.name}</span>
                        </div>
                    )}
                </div>
                <button onClick={() => navigate(`/available-trips/${schedule.schedule_id}`,{ state: { schedule, journeyDate } })} className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-sm px-5 py-2 rounded-xl transition-all">
                    Book Seat
                </button>
            </div>
        </div>
    );
}

export default function SearchBuses() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const { departureStation, arrivalStation, journeyDate } = state ?? {};

    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!departureStation || !arrivalStation || !journeyDate) {
            navigate('/');
            return;
        }
        fetchSchedules();
    }, []);

    const fetchSchedules = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await searchSchedulesApi(departureStation, arrivalStation, journeyDate);
            setSchedules(res.data.data ?? []);
        } catch (err) {
            setError(err?.response?.data?.message ?? 'Failed to load schedules.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sticky header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        <FaChevronLeft />
                    </button>
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="font-black text-gray-900 text-base truncate">{departureStation}</span>
                        <FaArrowRight className="text-orange-400 text-xs flex-shrink-0" />
                        <span className="font-black text-gray-900 text-base truncate">{arrivalStation}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold flex-shrink-0">
                        <FaCalendarAlt className="text-orange-400" />
                        {new Date(journeyDate).toLocaleDateString('en-US', {
                            weekday: 'short', month: 'short', day: 'numeric',
                        })}
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">

                {loading && (
                    <div className="flex flex-col items-center justify-center py-32 gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center">
                            <FaBus className="text-orange-400 text-2xl animate-bounce" />
                        </div>
                        <p className="text-gray-400 text-xs font-bold tracking-widest uppercase">Searching buses...</p>
                    </div>
                )}

                {!loading && error && (
                    <div className="bg-red-50 border border-red-100 text-red-500 rounded-2xl px-6 py-4 text-sm font-semibold flex items-center justify-between">
                        <span>{error}</span>
                        <button onClick={fetchSchedules} className="text-xs font-bold underline">Retry</button>
                    </div>
                )}

                {!loading && !error && schedules.length === 0 && (
                    <div className="text-center py-32">
                        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                            <FaBus className="text-gray-300 text-2xl" />
                        </div>
                        <p className="text-gray-900 font-bold text-base">No buses found</p>
                        <p className="text-gray-400 text-sm mt-1">
                            No schedules for {departureStation} → {arrivalStation} on {formatDate(journeyDate)}.
                        </p>
                        <button onClick={() => navigate('/')} className="mt-4 text-orange-500 text-sm font-bold hover:text-orange-600">
                            Search another route
                        </button>
                    </div>
                )}

                {!loading && !error && schedules.length > 0 && (
                    <>
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-bold text-gray-900">
                                {schedules.length} bus{schedules.length > 1 ? 'es' : ''} available
                            </p>
                            <p className="text-xs text-gray-400">{formatDate(journeyDate)}</p>
                        </div>
                        {schedules.map(s => (
                            <ScheduleCard key={s.schedule_id} schedule={s} journeyDate= {journeyDate}/>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}