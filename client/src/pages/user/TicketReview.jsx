import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import {
    FaChevronLeft, FaArrowRight, FaMapMarkerAlt,
    FaUserTie, FaCalendarAlt, FaUser,
    FaPhone, FaEnvelope, FaCheckCircle,
    FaMinus, FaPlus, FaLock, FaSpinner
} from 'react-icons/fa';
import { MdDirectionsBus } from 'react-icons/md';
import { getUser, fetchOccupancyApi, bookTicketApi, addStripeApi } from '../../services/api';
import { StripeModal } from '../../components/payment/StripeModal';

const classBadge = {
    'Luxury': { bg: '#F3E8FF', text: '#7C3AED' },
    'Semi-Luxury': { bg: '#DBEAFE', text: '#2563EB' },
    'Standard': { bg: '#F3F4F6', text: '#4B5563' },
};

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

function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
}

export default function BookingReview() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { schedule, journeyDate } = state ?? {};

    const [passengerCount, setPassengerCount] = useState(1);
    const [clientSecret, setClientSecret] = useState("");
    const [travellerType, setTravellerType] = useState('self');
    const [loggedInUser, setLoggedInUser] = useState({ name: '', phone: '', email: '' });
    const [form, setForm] = useState({ name: '', phone: '', email: '' });
    const [errors, setErrors] = useState({});
    const [occupancy, setOccupancy] = useState({ total_seats: 0, booked_seats: 0, remaining: 0 });
    const [loadingOccupancy, setLoadingOccupancy] = useState(true);
    const [loadingUser, setLoadingUser] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingError, setBookingError] = useState('');

    // Fetch logged-in user
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getUser();
                // { username, email, phone_no }
                const mapped = {
                    name: res.data.username ?? '',
                    phone: res.data.phone_no ?? '',
                    email: res.data.email ?? '',
                };
                setLoggedInUser(mapped);
                setForm(mapped);
            } catch (err) {
                console.error('Failed to fetch user:', err);
            } finally {
                setLoadingUser(false);
            }
        };
        fetchUser();
    }, []);

    // Fetch occupancy
    useEffect(() => {
        const scheduleId = schedule?.schedule_id ?? schedule?.id;
        if (!scheduleId) {
            setLoadingOccupancy(false);
            return;
        }
        const fetchOccupancy = async () => {
            try {
                setLoadingOccupancy(true);
                const res = await fetchOccupancyApi(scheduleId);
                // { total_seats, booked_seats, remaining }
                setOccupancy({
                    total_seats: Number(res.data.total_seats) || 0,
                    booked_seats: Number(res.data.booked_seats) || 0,
                    remaining: Number(res.data.remaining) || 0,
                });
            } catch (err) {
                console.error('Failed to fetch occupancy:', err);
            } finally {
                setLoadingOccupancy(false);
            }
        };
        fetchOccupancy();
    }, [schedule?.schedule_id, schedule?.id]);

    if (!schedule) {
        navigate('/');
        return null;
    }

    const { total_seats, booked_seats, remaining } = occupancy;
    const maxPerBooking = Math.min(6, remaining > 0 ? remaining : 6);
    const ticketPrice = Number(schedule.price) || 0;
    const totalPrice = ticketPrice * passengerCount;
    const cls = classBadge[schedule.bus?.class] ?? classBadge['Standard'];
    const isSelf = travellerType === 'self';

    const handleTravellerChange = (type) => {
        setTravellerType(type);
        setErrors({});
        setForm(type === 'self' ? loggedInUser : { name: '', phone: '', email: '' });
    };

    const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

    const readonlyInputCls = `w-full px-4 py-2.5 border-2 border-gray-100 rounded-xl text-sm text-gray-500 bg-gray-50 cursor-not-allowed select-none`;
    const editableInputCls = (err) =>
        `w-full px-4 py-2.5 border-2 rounded-xl text-sm text-gray-800 placeholder-gray-400 bg-white focus:outline-none transition-all
        ${err ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-orange-400'}`;

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = true;
        if (!form.phone.trim() || !/^\d{10}$/.test(form.phone)) e.phone = true;
        if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = true;
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handlePayClick = async () => {

        if (!validate()) return;

        setBookingLoading(true);
        setBookingError('');
        try {
            const response = await addStripeApi({ totalPrice })
            setClientSecret(response.data.clientSecret);

        } catch (err) {
            toast.error(err?.response?.data?.message || err.message || "Payment failed to initialize. Check your server connection.");

        } finally {
            setBookingLoading(false);
        }
    };

    const confirmBooking = async () => {
        setClientSecret("")
        try {
            const scheduleId = schedule?.schedule_id ?? schedule?.id;
            const response = await bookTicketApi({
                schedule_id: scheduleId,
                num_seats: passengerCount,
                traveller_name: form.name,
                traveller_email: form.email || null,
                traveller_phone: form.phone,
            });

            if (response?.data?.success) {
                toast.success("booking done")
            }
            // On success navigate to payment with booking info
            navigate('/bookings', {
                state: {
                    schedule,
                    journeyDate,
                    passengerCount,
                    passenger: { ...form, travellerType },
                    totalPrice,
                    booking: response.booking,
                },
            });
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to create booking. Please try again.')
        } finally {
            setBookingLoading(false);
        }
    };

    const occupancyPct = total_seats > 0 ? Math.round((booked_seats / total_seats) * 100) : 0;
    const occupancyColor = occupancyPct >= 85 ? 'bg-red-400' : occupancyPct >= 60 ? 'bg-orange-400' : 'bg-green-400';
    const occupancyLabel = occupancyPct >= 85 ? 'Almost Full' : occupancyPct >= 60 ? 'Filling Fast' : 'Available';
    const occupancyTextColor = occupancyPct >= 85 ? 'text-red-500' : occupancyPct >= 60 ? 'text-orange-500' : 'text-green-600';

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
                        <FaChevronLeft />
                    </button>
                    <div className="flex-1">
                        <p className="font-black text-gray-900 text-base">Review Booking</p>
                        <p className="text-xs text-gray-400">Step 1 of 2 — Details</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center">1</div>
                            <span className="text-xs font-semibold text-orange-500 hidden sm:block">Review</span>
                        </div>
                        <div className="w-8 h-px bg-gray-200" />
                        <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-400 text-xs font-bold flex items-center justify-center">2</div>
                            <span className="text-xs font-semibold text-gray-400 hidden sm:block">Payment</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-5">

                        {/* Journey Summary */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-5">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Journey</p>
                            <div className="flex items-center gap-4">
                                <div className="text-center flex-shrink-0">
                                    <p className="text-xl font-black text-gray-900">{schedule.departure_time}</p>
                                    <p className="text-xs text-orange-500 font-bold mt-0.5">{schedule.origin}</p>
                                </div>
                                <div className="flex-1 flex flex-col items-center gap-1">
                                    <span className="text-[10px] text-gray-400">{duration(schedule.departure_time, schedule.arrival_time)}</span>
                                    <div className="w-full flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full border-2 border-orange-400" />
                                        <div className="flex-1 h-px bg-gray-200" />
                                        <FaArrowRight className="text-orange-400 text-xs" />
                                    </div>
                                </div>
                                <div className="text-center flex-shrink-0">
                                    <p className="text-xl font-black text-gray-900">{schedule.arrival_time}</p>
                                    <p className="text-xs text-blue-500 font-bold mt-0.5">{schedule.destination}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 mt-4 flex-wrap">
                                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                    <FaCalendarAlt className="text-orange-400 text-xs" />
                                    <span>{formatDate(journeyDate)}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                    <MdDirectionsBus className="text-gray-300" />
                                    <span>{schedule.bus?.plate}</span>
                                </div>
                                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: cls.bg, color: cls.text }}>
                                    {schedule.bus?.class}
                                </span>
                                {schedule.stops?.length > 0 && (
                                    <div className="flex items-center gap-1 text-xs text-gray-400">
                                        <FaMapMarkerAlt className="text-gray-300 text-xs" />
                                        <span>Stops: {schedule.stops.map(s => s.city).join(', ')}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Availability + Passenger Count */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-5">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Seat Availability</p>

                            {loadingOccupancy ? (
                                <div className="space-y-3 animate-pulse mb-5">
                                    <div className="flex justify-between">
                                        <div className="h-3 bg-gray-100 rounded-full w-36" />
                                        <div className="h-3 bg-gray-100 rounded-full w-20" />
                                    </div>
                                    <div className="h-2.5 bg-gray-100 rounded-full w-full" />
                                    <div className="h-3 bg-gray-100 rounded-full w-32 ml-auto" />
                                </div>
                            ) : (
                                <div className="mb-5">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-xs text-gray-400">{booked_seats} passengers booked</span>
                                        <span className={`text-xs font-bold ${occupancyTextColor}`}>{occupancyLabel}</span>
                                    </div>
                                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${occupancyColor}`}
                                            style={{ width: `${occupancyPct}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between mt-1.5">
                                        <span className="text-[11px] text-gray-300">0</span>
                                        <span className="text-[11px] text-gray-400 font-semibold">{remaining} seats left of {total_seats}</span>
                                    </div>
                                </div>
                            )}

                            {/* Passenger counter — disabled while occupancy loads */}
                            <div className={`flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 transition-opacity ${loadingOccupancy ? 'opacity-40 pointer-events-none' : ''}`}>
                                <div>
                                    <p className="text-sm font-bold text-gray-800">Number of Passengers</p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {loadingOccupancy ? 'Loading availability...' : `Max ${maxPerBooking} per booking`}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setPassengerCount(c => Math.max(1, c - 1))}
                                        disabled={loadingOccupancy || passengerCount <= 1}
                                        className="w-9 h-9 rounded-xl border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-orange-400 hover:text-orange-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    >
                                        <FaMinus className="text-xs" />
                                    </button>
                                    <span className="text-xl font-black text-gray-900 w-6 text-center">{passengerCount}</span>
                                    <button
                                        type="button"
                                        onClick={() => setPassengerCount(c => Math.min(maxPerBooking, c + 1))}
                                        disabled={loadingOccupancy || passengerCount >= maxPerBooking}
                                        className="w-9 h-9 rounded-xl border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-orange-400 hover:text-orange-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    >
                                        <FaPlus className="text-xs" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Contact Details with traveller toggle */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-5">
                            <div className="flex items-center justify-between mb-5">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contact Details</p>
                                <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                                    <button
                                        type="button"
                                        onClick={() => handleTravellerChange('self')}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all
                                            ${isSelf ? 'bg-white text-orange-500 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${isSelf ? 'border-orange-400' : 'border-gray-300'}`}>
                                            {isSelf && <span className="w-1.5 h-1.5 rounded-full bg-orange-400 block" />}
                                        </span>
                                        It's me
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleTravellerChange('other')}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all
                                            ${!isSelf ? 'bg-white text-orange-500 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${!isSelf ? 'border-orange-400' : 'border-gray-300'}`}>
                                            {!isSelf && <span className="w-1.5 h-1.5 rounded-full bg-orange-400 block" />}
                                        </span>
                                        Someone else
                                    </button>
                                </div>
                            </div>

                            {isSelf && (
                                <div className="flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-xl px-4 py-2.5 mb-4">
                                    <FaLock className="text-orange-300 text-xs flex-shrink-0" />
                                    <p className="text-xs text-orange-600 font-medium">Details are filled from your account and cannot be changed.</p>
                                </div>
                            )}

                            {loadingUser ? (
                                <div className="space-y-4 animate-pulse">
                                    {[1, 2, 3].map(i => <div key={i} className="h-11 bg-gray-100 rounded-xl" />)}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 mb-1.5 flex items-center gap-1.5">
                                            <FaUser className="text-orange-400 text-[10px]" />
                                            {isSelf ? 'Full Name' : "Traveller's Full Name *"}
                                        </label>
                                        {isSelf ? (
                                            <div className="relative">
                                                <input readOnly value={form.name} className={readonlyInputCls} />
                                                <FaLock className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
                                            </div>
                                        ) : (
                                            <>
                                                <input className={editableInputCls(errors.name)} placeholder="e.g. Ram Bahadur Thapa" value={form.name} onChange={e => set('name', e.target.value)} />
                                                {errors.name && <p className="text-xs text-red-400 mt-1">Full name is required.</p>}
                                            </>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 mb-1.5 flex items-center gap-1.5">
                                            <FaPhone className="text-orange-400 text-[10px]" />
                                            {isSelf ? 'Phone Number' : 'Phone Number *'}
                                        </label>
                                        {isSelf ? (
                                            <div className="relative">
                                                <input readOnly value={form.phone} className={readonlyInputCls} />
                                                <FaLock className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
                                            </div>
                                        ) : (
                                            <>
                                                <input className={editableInputCls(errors.phone)} placeholder="10-digit mobile number" value={form.phone} onChange={e => set('phone', e.target.value)} maxLength={10} />
                                                {errors.phone && <p className="text-xs text-red-400 mt-1">Enter a valid 10-digit number.</p>}
                                            </>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 mb-1.5 flex items-center gap-1.5">
                                            <FaEnvelope className="text-orange-400 text-[10px]" />
                                            {isSelf ? 'Email' : 'Email (optional)'}
                                        </label>
                                        {isSelf ? (
                                            <div className="relative">
                                                <input readOnly value={form.email} className={readonlyInputCls} />
                                                <FaLock className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
                                            </div>
                                        ) : (
                                            <>
                                                <input className={editableInputCls(errors.email)} placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
                                                {errors.email && <p className="text-xs text-red-400 mt-1">Enter a valid email address.</p>}
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Right: price summary */}
                    <div className="space-y-4">
                        <div className="bg-white border border-gray-200 rounded-2xl p-5 sticky top-24">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Price Summary</p>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-gray-500">
                                    <span>Ticket price</span>
                                    <span className="font-semibold text-gray-800">Rs. {ticketPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                    <span>Passengers</span>
                                    <span className="font-semibold text-gray-800">{passengerCount} × Rs. {ticketPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                    <span>Service fee</span>
                                    <span className="font-semibold text-green-600">Free</span>
                                </div>
                                <div className="border-t border-gray-100 pt-3 flex justify-between">
                                    <span className="font-black text-gray-900">Total</span>
                                    <span className="font-black text-orange-500 text-lg">Rs. {totalPrice.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="mt-4 bg-orange-50 border border-orange-100 rounded-xl px-4 py-3">
                                <div className="flex items-center gap-2 text-xs text-orange-700">
                                    <FaUser className="text-orange-400 flex-shrink-0" />
                                    <span className="font-semibold">
                                        {passengerCount} passenger{passengerCount > 1 ? 's' : ''}
                                        {!loadingOccupancy && ` · ${remaining} seats left`}
                                    </span>
                                </div>
                                {!isSelf && form.name && (
                                    <div className="flex items-center gap-2 text-xs text-orange-600 mt-1.5">
                                        <span className="font-medium">Travelling: {form.name}</span>
                                    </div>
                                )}
                            </div>

                            {schedule.driver && (
                                <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                                    <FaUserTie className="text-gray-300 flex-shrink-0" />
                                    <span>Driver: {schedule.driver.name}</span>
                                </div>
                            )}

                            {/* Booking error */}
                            {bookingError && (
                                <div className="mt-4 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                                    <p className="text-xs text-red-500 font-semibold">{bookingError}</p>
                                </div>
                            )}

                            <button
                                onClick={handlePayClick}
                                disabled={bookingLoading || loadingOccupancy}
                                className="mt-4 w-full bg-orange-500 hover:bg-orange-600 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 px-5 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                            >
                                {bookingLoading
                                    ? <><FaSpinner className="animate-spin text-sm" /> Processing...</>
                                    : <><FaCheckCircle className="text-sm" /> Proceed to Payment</>
                                }
                            </button>
                            <p className="text-[10px] text-gray-300 text-center mt-3">Booking is confirmed only after payment.</p>
                        </div>
                    </div>
                </div>
            </div>

            {clientSecret && (
                <StripeModal
                    key={clientSecret}
                    clientSecret={clientSecret}
                    onSuccess={confirmBooking}
                />
            )}
        </div>
    );
}