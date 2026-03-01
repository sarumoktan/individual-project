import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaBus, FaMapMarkerAlt, FaClock, FaArrowLeft } from 'react-icons/fa';
import { GoArrowRight } from 'react-icons/go';
import { BookingActions } from '../redux/Booking-slice.jsx';

// ─── Seat type styles ────────────────────────────────────────────────────────
const seatTypeStyle = {
    available:  'bg-white border-2 border-gray-300 text-gray-700 hover:border-orange-400 hover:bg-orange-50 cursor-pointer',
    booked:     'bg-red-500 border-2 border-red-600 text-white cursor-not-allowed opacity-80',
    counter:    'bg-orange-500 border-2 border-orange-600 text-white cursor-not-allowed',
    processing: 'bg-blue-500 border-2 border-blue-600 text-white cursor-not-allowed',
    selected:   'bg-orange-400 border-2 border-orange-600 text-white cursor-pointer',
};

const legend = [
    { label: 'Available',  style: 'bg-white border-2 border-gray-300' },
    { label: 'Selected',   style: 'bg-orange-400 border-2 border-orange-600' },
    { label: 'Booked',     style: 'bg-red-500' },
    { label: 'Counter',    style: 'bg-orange-500' },
    { label: 'Processing', style: 'bg-blue-500' },
];

// ─── BusSummaryHeader ────────────────────────────────────────────────────────
function BusSummaryHeader({ bus }) {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <FaBus className="text-orange-500" />
                    <span className="font-bold text-gray-800">{bus.operator}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full uppercase">
                        {bus.busType}
                    </span>
                </div>
                <span className="text-xs text-gray-400">Route {bus.routeNo}</span>
            </div>
            <div className="flex items-center gap-4">
                <div>
                    <p className="text-xl font-black text-gray-900">{bus.departure.time}</p>
                    <p className="text-xs text-gray-600 font-semibold">{bus.departure.city}</p>
                    <p className="text-[10px] text-gray-400">{bus.departure.station}</p>
                </div>
                <div className="flex-1 flex flex-col items-center">
                    <div className="flex items-center gap-1 w-full">
                        <div className="h-px flex-1 bg-gray-200" />
                        <FaClock className="text-gray-400 text-xs" />
                        <div className="h-px flex-1 bg-gray-200" />
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1">{bus.duration} hrs</span>
                </div>
                <div className="text-right">
                    <p className="text-xl font-black text-gray-900">{bus.arrival.time}</p>
                    <p className="text-xs text-gray-600 font-semibold">{bus.arrival.city}</p>
                    <p className="text-[10px] text-gray-400">{bus.arrival.station}</p>
                </div>
            </div>
        </div>
    );
}

// ─── SeatMap ─────────────────────────────────────────────────────────────────
function SeatMap({ seats, selectedSeats, onToggle }) {
    const columns = ['column1', 'column2', 'column3', 'column4', 'column5', 'column6'];

    return (
        <div className="overflow-x-auto">
            <div className="flex gap-1.5 min-w-max">
                {columns.map((col) => (
                    <div key={col} className="flex flex-col gap-1.5">
                        {(seats[col] ?? []).map((seat, i) => {
                            const isSelected = selectedSeats.some(s => s.seatNo === seat.seatNo);
                            const isSelectable = seat.type === 'available';
                            const style = isSelected
                                ? seatTypeStyle.selected
                                : (seatTypeStyle[seat.type] ?? seatTypeStyle.available);

                            return (
                                <React.Fragment key={`${col}-${i}`}>
                                    {seat.space && <div className="h-6" />}
                                    <button
                                        disabled={!isSelectable}
                                        onClick={() => isSelectable && onToggle(seat)}
                                        className={`w-9 h-9 rounded-md text-[10px] font-bold transition-all duration-150 flex items-center justify-center ${style}`}
                                        title={`Seat ${seat.seatNo} - ${seat.type}`}
                                    >
                                        {seat.seatNo}
                                    </button>
                                </React.Fragment>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Booking page ─────────────────────────────────────────────────────────────
export default function Booking() {
    const navigation = useNavigate();
    const dispatch = useDispatch();
    const mobileOpen = useSelector(state => state.theme.isMobileOpen);
    const { selectedBus, selectedSeats, totalPrice, convenienceFee, bankCharge } = useSelector(state => state.booking);

    const handleToggleSeat = (seat) => {
        dispatch(BookingActions.toggleSeat({ seatNo: seat.seatNo, type: seat.type }));
    };

    const grandTotal = totalPrice + (convenienceFee ?? 110) + (bankCharge ?? 14.72);

    if (!selectedBus) {
        return (
            <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-400 text-sm font-medium mb-3">No bus selected.</p>
                    <button
                        onClick={() => navigation('/bus-booking/search-buses')}
                        className="text-xs font-bold text-orange-500 hover:text-orange-600"
                    >
                        Go back to search
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen bg-gray-50 pt-16 ${mobileOpen ? 'hidden' : ''}`}>

            {/* Page header */}
            <div className="bg-gray-800 border-b border-gray-700">
                <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
                    <button
                        onClick={() => navigation('/bus-booking/search-buses')}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <FaArrowLeft className="h-4 w-4" />
                    </button>
                    <span className="text-white font-bold text-sm">{selectedBus.departure.city}</span>
                    <GoArrowRight className="text-orange-400" />
                    <span className="text-white font-bold text-sm">{selectedBus.arrival.city}</span>
                    <span className="text-gray-400 text-xs ml-auto">{selectedBus.departure.date}</span>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left: bus info + seat map */}
                    <div className="lg:col-span-2 space-y-5">
                        <BusSummaryHeader bus={selectedBus} />

                        {/* Seat picker */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-gray-800 text-sm">Pick your seats</h3>
                                <span className="text-xs text-gray-400">{selectedBus.availableSeats} available</span>
                            </div>

                            {/* Legend */}
                            <div className="flex flex-wrap gap-3 mb-5">
                                {legend.map(item => (
                                    <div key={item.label} className="flex items-center gap-1.5">
                                        <div className={`w-4 h-4 rounded-sm ${item.style}`} />
                                        <span className="text-[11px] text-gray-500">{item.label}</span>
                                    </div>
                                ))}
                            </div>

                            <SeatMap
                                seats={selectedBus.seats}
                                selectedSeats={selectedSeats}
                                onToggle={handleToggleSeat}
                            />
                        </div>
                    </div>

                    {/* Right: price summary */}
                    <div className="space-y-4">
                        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm sticky top-20">
                            <h3 className="font-bold text-gray-800 text-sm mb-4">Booking Summary</h3>

                            {selectedSeats.length === 0 ? (
                                <p className="text-gray-400 text-xs text-center py-6">Select seats to see price</p>
                            ) : (
                                <>
                                    {/* Selected seats */}
                                    <div className="mb-4">
                                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Seats</p>
                                        <div className="flex flex-wrap gap-1">
                                            {selectedSeats.map(s => (
                                                <span
                                                    key={s.seatNo}
                                                    onClick={() => handleToggleSeat(s)}
                                                    className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-md cursor-pointer hover:bg-orange-200"
                                                >
                                                    {s.seatNo} ×
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Price breakdown */}
                                    <div className="space-y-2 border-t border-gray-100 pt-3 mb-4">
                                        <div className="flex justify-between text-xs text-gray-600">
                                            <span>{selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''} × Rs. {selectedBus.price.toLocaleString()}</span>
                                            <span className="font-semibold">Rs. {totalPrice.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-400">
                                            <span>Convenience fee</span>
                                            <span>Rs. {convenienceFee?.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-400">
                                            <span>Bank charge</span>
                                            <span>Rs. {bankCharge?.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between font-black text-gray-900 text-sm border-t border-gray-100 pt-2">
                                            <span>Total</span>
                                            <span className="text-orange-500">Rs. {grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => navigation('/bus-booking/booking-payment')}
                                        className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold py-3 px-4 rounded-xl transition-all duration-150 text-sm"
                                    >
                                        Proceed to Payment
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}