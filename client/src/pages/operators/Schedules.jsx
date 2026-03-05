import React, { useState, useEffect } from 'react';
import {
    FaPlus, FaSearch, FaTimes, FaChevronLeft, FaChevronRight,
    FaCalendarAlt, FaClock, FaEllipsisV, FaEdit, FaTrash,
    FaUserTie, FaArrowRight, FaMapMarkerAlt, FaMinus,
    FaPause, FaPlay,
} from 'react-icons/fa';
import { MdDirectionsBus } from 'react-icons/md';
import toast, { Toaster } from 'react-hot-toast';
import {
    getAllBus, getAllStaff,
    getAllSchedules, addScheduleApi, updateScheduleApi,
    deleteScheduleApi, toggleScheduleApi,
} from '../../services/api';

const nepalCities = [
    'Kathmandu', 'Pokhara', 'Chitwan', 'Lumbini', 'Biratnagar',
    'Birgunj', 'Dharan', 'Janakpur', 'Butwal', 'Nepalgunj',
    'Dhangadhi', 'Hetauda', 'Narayanghat', 'Bhairahawa', 'Itahari',
    'Mugling', 'Dumre', 'Damauli', 'Gorkha', 'Baglung',
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const freqBadge = {
    'Daily':    { bg: '#DCFCE7', text: '#16A34A' },
    'Weekly':   { bg: '#DBEAFE', text: '#2563EB' },
    'One-time': { bg: '#F3E8FF', text: '#7C3AED' },
};

const classBadge = {
    'Luxury':      'bg-purple-100 text-purple-700',
    'Semi-Luxury': 'bg-blue-100 text-blue-700',
    'Standard':    'bg-gray-100 text-gray-600',
};

const emptyForm = {
    busId: '', origin: '', destination: '',
    stops: [], departureTime: '', arrivalTime: '',
    frequency: '', days: [], date: '',
    driverId: '', conductorId: '', price: '',
};

const STEPS = ['Route', 'Timing', 'Staff & Price'];

// ── Schedule Modal (Add + Edit) ───────────────────────────────────────────────
function ScheduleModal({ onClose, onSaved, buses, staff, editSchedule }) {
    const isEdit = Boolean(editSchedule);

    const [step,    setStep]    = useState(0);
    const [form,    setForm]    = useState(isEdit ? {
        busId:         String(editSchedule.bus_id       ?? ''),
        origin:        editSchedule.origin              ?? '',
        destination:   editSchedule.destination         ?? '',
        stops:         editSchedule.stops               ?? [],
        departureTime: editSchedule.departure_time      ?? '',
        arrivalTime:   editSchedule.arrival_time        ?? '',
        frequency:     editSchedule.frequency           ?? '',
        days:          editSchedule.days                ?? [],
        date:          editSchedule.date                ?? '',
        driverId:      String(editSchedule.driver_id    ?? ''),
        conductorId:   String(editSchedule.conductor_id ?? ''),
        price:         String(editSchedule.price        ?? ''),
    } : emptyForm);
    const [errors,  setErrors]  = useState({});
    const [loading, setLoading] = useState(false);

    const set        = (key, val) => setForm(p => ({ ...p, [key]: val }));
    const addStop    = () => setForm(p => ({ ...p, stops: [...p.stops, { city: '', time: '' }] }));
    const removeStop = (i) => setForm(p => ({ ...p, stops: p.stops.filter((_, idx) => idx !== i) }));
    const updateStop = (i, field, val) => setForm(p => ({
        ...p,
        stops: p.stops.map((s, idx) => idx === i ? { ...s, [field]: val } : s),
    }));
    const toggleDay = (day) => setForm(p => ({
        ...p,
        days: p.days.includes(day) ? p.days.filter(d => d !== day) : [...p.days, day],
    }));

    const validate = () => {
        const e = {};
        if (step === 0) {
            if (!form.busId)                                         e.busId       = true;
            if (!form.origin.trim())                                 e.origin      = true;
            if (!form.destination.trim())                            e.destination = true;
            if (form.origin && form.origin === form.destination)     e.destination = true;
        }
        if (step === 1) {
            if (!form.departureTime)                                      e.departureTime = true;
            if (!form.arrivalTime)                                        e.arrivalTime   = true;
            if (!form.frequency)                                          e.frequency     = true;
            if (form.frequency === 'Weekly'   && form.days.length === 0) e.days          = true;
            if (form.frequency === 'One-time' && !form.date)              e.date          = true;
        }
        if (step === 2) {
            if (!form.driverId) e.driverId = true;
            if (!form.price)    e.price    = true;
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const next = () => { if (validate()) setStep(p => p + 1); };
    const back = () => setStep(p => p - 1);

    const handleSubmit = async () => {
        if (!validate()) return;
        setLoading(true);
        try {
            const payload = {
                bus_id:         Number(form.busId),
                driver_id:      Number(form.driverId),
                conductor_id:   form.conductorId ? Number(form.conductorId) : null,
                origin:         form.origin,
                destination:    form.destination,
                stops:          form.stops.filter(s => s.city),
                departure_time: form.departureTime,
                arrival_time:   form.arrivalTime,
                frequency:      form.frequency,
                days:           form.frequency === 'Weekly'   ? form.days : [],
                date:           form.frequency === 'One-time' ? form.date : null,
                price:          Number(form.price),
            };

            if (isEdit) {
                await updateScheduleApi(editSchedule.schedule_id, payload);
                toast.success(`${form.origin} → ${form.destination} updated.`);
            } else {
                await addScheduleApi(payload);
                toast.success(`${form.origin} → ${form.destination} added.`);
            }

            onSaved();
            onClose();
        } catch (err) {
            toast.error(err?.response?.data?.message ?? 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const inputCls  = (err) =>
        `w-full px-4 py-2.5 border-2 rounded-xl text-sm text-gray-800 placeholder-gray-400 bg-white focus:outline-none transition-all
        ${err ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-orange-400'}`;
    const selectCls = (err) =>
        `w-full px-4 py-2.5 border-2 rounded-xl text-sm text-gray-700 bg-white focus:outline-none transition-all cursor-pointer
        ${err ? 'border-red-400' : 'border-gray-200 focus:border-orange-400'}`;
    const optBtn = (val, current, key) => (
        <button key={val} type="button" onClick={() => set(key, val)}
            className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all
                ${current === val ? 'border-orange-400 bg-orange-50 text-orange-600' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
            {val}
        </button>
    );

    const drivers     = staff.filter(s => s.role === 'Driver'    && s.is_active);
    const conductors  = staff.filter(s => s.role === 'Conductor' && s.is_active);
    const selectedBus = buses.find(b => b.bus_id === Number(form.busId));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">

                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
                    <div>
                        <h2 className="text-lg font-black text-gray-900">{isEdit ? 'Edit Schedule' : 'Add Schedule'}</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Step {step + 1} of {STEPS.length} — {STEPS[step]}</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-300 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"><FaTimes /></button>
                </div>

                <div className="flex px-6 pt-4 gap-2 flex-shrink-0">
                    {STEPS.map((s, i) => (
                        <div key={i} className="flex-1">
                            <div className={`h-1 rounded-full transition-all duration-300 ${i <= step ? 'bg-orange-400' : 'bg-gray-100'}`} />
                            <span className={`text-[10px] font-semibold mt-1 block ${i === step ? 'text-orange-500' : 'text-gray-300'}`}>{s}</span>
                        </div>
                    ))}
                </div>

                <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1">

                    {/* ── Step 0: Route ── */}
                    {step === 0 && (
                        <>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Assign Bus</label>
                                <select value={form.busId} onChange={e => set('busId', e.target.value)} className={selectCls(errors.busId)}>
                                    <option value="">Select a bus</option>
                                    {buses.filter(b => b.is_active || String(b.bus_id) === form.busId).map(b => (
                                        <option key={b.bus_id} value={b.bus_id}>
                                            {b.plate} — {b.model} ({b.seats} seats, {b.class})
                                        </option>
                                    ))}
                                </select>
                                {errors.busId && <p className="text-xs text-red-400 mt-1">Select a bus</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">From</label>
                                    <select value={form.origin} onChange={e => set('origin', e.target.value)} className={selectCls(errors.origin)}>
                                        <option value="">Origin</option>
                                        {nepalCities.map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">To</label>
                                    <select value={form.destination} onChange={e => set('destination', e.target.value)} className={selectCls(errors.destination)}>
                                        <option value="">Destination</option>
                                        {nepalCities.map(c => <option key={c}>{c}</option>)}
                                    </select>
                                    {errors.destination && <p className="text-xs text-red-400 mt-1">Must differ from origin</p>}
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Stops (optional)</label>
                                    <button type="button" onClick={addStop} className="text-xs font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1">
                                        <FaPlus className="text-[10px]" /> Add Stop
                                    </button>
                                </div>
                                {form.stops.length === 0 && <p className="text-xs text-gray-300 py-2">No stops added.</p>}
                                {form.stops.map((stop, i) => (
                                    <div key={i} className="flex items-center gap-2 mb-2">
                                        <select value={stop.city} onChange={e => updateStop(i, 'city', e.target.value)} className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-xl text-sm text-gray-700 bg-white focus:outline-none focus:border-orange-400">
                                            <option value="">City</option>
                                            {nepalCities.map(c => <option key={c}>{c}</option>)}
                                        </select>
                                        <input type="time" value={stop.time} onChange={e => updateStop(i, 'time', e.target.value)} className="w-28 px-3 py-2 border-2 border-gray-200 rounded-xl text-sm text-gray-700 bg-white focus:outline-none focus:border-orange-400" />
                                        <button type="button" onClick={() => removeStop(i)} className="p-2 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                                            <FaMinus className="text-xs" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* ── Step 1: Timing ── */}
                    {step === 1 && (
                        <>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Departure</label>
                                    <input type="time" value={form.departureTime} onChange={e => set('departureTime', e.target.value)} className={inputCls(errors.departureTime)} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Arrival</label>
                                    <input type="time" value={form.arrivalTime} onChange={e => set('arrivalTime', e.target.value)} className={inputCls(errors.arrivalTime)} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Frequency</label>
                                <div className="flex gap-2 flex-wrap">{['Daily', 'Weekly', 'One-time'].map(v => optBtn(v, form.frequency, 'frequency'))}</div>
                                {errors.frequency && <p className="text-xs text-red-400 mt-1">Select frequency</p>}
                            </div>
                            {form.frequency === 'Weekly' && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Runs on</label>
                                    <div className="flex gap-2 flex-wrap">
                                        {DAYS.map(day => (
                                            <button key={day} type="button" onClick={() => toggleDay(day)}
                                                className={`w-10 h-10 rounded-xl border-2 text-xs font-bold transition-all
                                                    ${form.days.includes(day) ? 'border-orange-400 bg-orange-50 text-orange-600' : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}>
                                                {day}
                                            </button>
                                        ))}
                                    </div>
                                    {errors.days && <p className="text-xs text-red-400 mt-1">Select at least one day</p>}
                                </div>
                            )}
                            {form.frequency === 'One-time' && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Trip Date</label>
                                    <input type="date" value={form.date} onChange={e => set('date', e.target.value)} min={new Date().toISOString().split('T')[0]} className={inputCls(errors.date)} />
                                </div>
                            )}
                        </>
                    )}

                    {/* ── Step 2: Staff & Price ── */}
                    {step === 2 && (
                        <>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Driver</label>
                                {drivers.length === 0
                                    ? <p className="text-xs text-amber-500 font-semibold py-2">No active drivers found. Add a driver in Staff first.</p>
                                    : (
                                        <select value={form.driverId} onChange={e => set('driverId', e.target.value)} className={selectCls(errors.driverId)}>
                                            <option value="">Assign a driver</option>
                                            {drivers.map(d => <option key={d.staff_id} value={d.staff_id}>{d.name}</option>)}
                                        </select>
                                    )
                                }
                                {errors.driverId && <p className="text-xs text-red-400 mt-1">Assign a driver</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Conductor (optional)</label>
                                <select value={form.conductorId} onChange={e => set('conductorId', e.target.value)} className={selectCls(false)}>
                                    <option value="">No conductor</option>
                                    {conductors.map(c => <option key={c.staff_id} value={c.staff_id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Ticket Price (Rs.)</label>
                                <input type="number" placeholder="e.g. 1200" value={form.price} onChange={e => set('price', e.target.value)} className={inputCls(errors.price)} min="0" />
                                {errors.price && <p className="text-xs text-red-400 mt-1">Enter a price</p>}
                            </div>
                            {form.busId && form.origin && form.destination && (
                                <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                                    <p className="font-bold text-orange-700 text-xs uppercase tracking-wider mb-2">Summary</p>
                                    <p className="text-sm font-bold text-gray-800">{form.origin} → {form.destination}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {selectedBus?.plate} · {form.departureTime} – {form.arrivalTime} · {form.frequency}
                                        {form.frequency === 'Weekly'   && form.days.length > 0 && ` (${form.days.join(', ')})`}
                                        {form.frequency === 'One-time' && form.date            && ` on ${form.date}`}
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 flex-shrink-0">
                    <button type="button" onClick={step === 0 ? onClose : back} className="flex items-center gap-1.5 text-sm font-semibold text-gray-400 hover:text-gray-700 transition-colors">
                        <FaChevronLeft className="text-[10px]" /> {step === 0 ? 'Cancel' : 'Back'}
                    </button>
                    {step < STEPS.length - 1 ? (
                        <button type="button" onClick={next} className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors active:scale-95">
                            Next <FaChevronRight className="text-[10px]" />
                        </button>
                    ) : (
                        <button type="button" onClick={handleSubmit} disabled={loading}
                            className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors active:scale-95 flex items-center gap-2">
                            {loading && <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>}
                            {isEdit ? 'Save Changes' : 'Add Schedule'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Schedule Card ─────────────────────────────────────────────────────────────
function ScheduleCard({ schedule, onEdit, onToggle, onDelete }) {
    const [menuOpen,       setMenuOpen]       = useState(false);
    const [togglingLoad,   setTogglingLoad]   = useState(false);
    const freq = freqBadge[schedule.frequency] ?? freqBadge['Daily'];

    const handleToggle = async () => {
        setTogglingLoad(true);
        await onToggle(schedule);
        setTogglingLoad(false);
    };

    return (
        <div className={`bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-200 ${!schedule.is_active ? 'opacity-60' : ''}`}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2 min-w-0">
                    <span className="font-black text-gray-900 text-sm truncate">{schedule.origin}</span>
                    <FaArrowRight className="text-orange-400 text-xs flex-shrink-0" />
                    <span className="font-black text-gray-900 text-sm truncate">{schedule.destination}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full" style={{ background: freq.bg, color: freq.text }}>
                        {schedule.frequency === 'Weekly'   && schedule.days?.length > 0 ? schedule.days.join(' · ')
                        : schedule.frequency === 'One-time' && schedule.date             ? schedule.date
                        : schedule.frequency}
                    </span>
                    <div className="relative">
                        <button onClick={() => setMenuOpen(p => !p)} className="p-1.5 text-gray-300 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                            <FaEllipsisV className="text-xs" />
                        </button>
                        {menuOpen && (
                            <div className="absolute right-0 top-8 w-36 bg-white border border-gray-100 rounded-xl shadow-xl z-20 py-1">
                                <button
                                    onClick={() => { onEdit(schedule); setMenuOpen(false); }}
                                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                                >
                                    <FaEdit className="text-xs text-gray-300" /> Edit
                                </button>
                                <button
                                    onClick={() => { onDelete(schedule); setMenuOpen(false); }}
                                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                                >
                                    <FaTrash className="text-xs" /> Remove
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="px-5 py-4 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                    <FaClock className="text-gray-200 flex-shrink-0" />
                    <span className="font-black text-gray-900">{schedule.departure_time}</span>
                    <span className="text-gray-300 text-xs">to</span>
                    <span className="font-black text-gray-900">{schedule.arrival_time}</span>
                    <span className="flex-1" />
                    <span className="font-black text-orange-500 text-base">Rs. {Number(schedule.price).toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <MdDirectionsBus className="text-gray-300 text-sm flex-shrink-0" />
                    <span>{schedule.bus?.plate ?? '—'}</span>
                    {schedule.bus?.class && (
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${classBadge[schedule.bus.class]}`}>
                            {schedule.bus.class}
                        </span>
                    )}
                    <span className="text-gray-300">·</span>
                    <span>{schedule.bus?.seats} seats</span>
                </div>

                {schedule.stops?.length > 0 && (
                    <div className="flex items-start gap-2 text-xs text-gray-400">
                        <FaMapMarkerAlt className="text-gray-200 mt-0.5 flex-shrink-0" />
                        <span>Stops: {schedule.stops.map(s => `${s.city}${s.time ? ` (${s.time})` : ''}`).join(' · ')}</span>
                    </div>
                )}

                <div className="flex items-center gap-3 text-xs text-gray-400">
                    <FaUserTie className="text-gray-200 flex-shrink-0" />
                    <span>{schedule.driver?.name ?? <span className="text-red-400 font-semibold">No driver</span>}</span>
                    {schedule.conductor && (
                        <><span className="text-gray-200">·</span><span>{schedule.conductor.name}</span></>
                    )}
                </div>
            </div>

            {/* Status footer with toggle button */}
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <span className={`text-xs font-bold flex items-center gap-1.5 ${schedule.is_active ? 'text-green-600' : 'text-amber-500'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${schedule.is_active ? 'bg-green-400' : 'bg-amber-400'}`} />
                    {schedule.is_active ? 'Active' : 'Paused'}
                </span>
                <button
                    onClick={handleToggle}
                    disabled={togglingLoad}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-lg border transition-colors disabled:opacity-50
                        ${schedule.is_active
                            ? 'border-amber-200 text-amber-600 hover:bg-amber-50'
                            : 'border-green-200 text-green-600 hover:bg-green-50'}`}
                >
                    {togglingLoad
                        ? <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                        : schedule.is_active
                            ? <><FaPause className="text-[9px]" /> Pause</>
                            : <><FaPlay  className="text-[9px]" /> Resume</>
                    }
                </button>
            </div>
        </div>
    );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function OperatorSchedules() {
    const [schedules,     setSchedules]     = useState([]);
    const [buses,         setBuses]         = useState([]);
    const [staff,         setStaff]         = useState([]);
    const [loading,       setLoading]       = useState(true);
    const [error,         setError]         = useState(null);
    const [showModal,     setShowModal]     = useState(false);
    const [editSchedule,  setEditSchedule]  = useState(null);
    const [search,        setSearch]        = useState('');
    const [filterFreq,    setFilterFreq]    = useState('All');

    useEffect(() => { fetchAll(); }, []);

    const fetchAll = async () => {
        setLoading(true);
        setError(null);
        try {
            const [busRes, staffRes, schedRes] = await Promise.all([
                getAllBus(),
                getAllStaff(),
                getAllSchedules(),
            ]);
            setBuses(    busRes.data.data   ?? []);
            setStaff(    staffRes.data.data ?? []);
            setSchedules(schedRes.data.data ?? []);
        } catch (err) {
            setError(err?.response?.data?.message ?? 'Failed to load schedules.');
        } finally {
            setLoading(false);
        }
    };

    const openAdd  = ()  => { setEditSchedule(null); setShowModal(true); };
    const openEdit = (s) => { setEditSchedule(s);    setShowModal(true); };

    const handleToggle = async (schedule) => {
        try {
            const res = await toggleScheduleApi(schedule.schedule_id);
            const updated = res.data.data;
            setSchedules(prev => prev.map(s =>
                s.schedule_id === schedule.schedule_id ? { ...s, is_active: updated.is_active } : s
            ));
            toast.success(`${schedule.origin} → ${schedule.destination} ${updated.is_active ? 'resumed' : 'paused'}.`);
        } catch (err) {
            toast.error(err?.response?.data?.message ?? 'Failed to update status.');
        }
    };

    const handleDelete = (schedule) => {
        toast.custom((t) => (
            <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} bg-white border border-red-100 shadow-lg rounded-xl max-w-sm w-full p-4`}>
                <p className="text-sm font-bold text-gray-900">Remove {schedule.origin} → {schedule.destination}?</p>
                <p className="text-xs text-gray-400 mt-1">This cannot be undone.</p>
                <div className="flex gap-2 mt-3">
                    <button
                        onClick={async () => {
                            try {
                                await deleteScheduleApi(schedule.schedule_id);
                                toast.dismiss(t.id);
                                toast.success('Schedule removed.');
                                fetchAll();
                            } catch (err) {
                                toast.dismiss(t.id);
                                toast.error(err?.response?.data?.message ?? 'Failed to delete.');
                            }
                        }}
                        className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600"
                    >
                        Remove
                    </button>
                    <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-200">
                        Cancel
                    </button>
                </div>
            </div>
        ), { duration: 8000, position: 'top-center' });
    };

    const filtered = schedules
        .filter(s => {
            const q = search.toLowerCase();
            return (
                s.origin?.toLowerCase().includes(q) ||
                s.destination?.toLowerCase().includes(q) ||
                s.bus?.plate?.toLowerCase().includes(q)
            );
        })
        .filter(s => filterFreq === 'All' || s.frequency === filterFreq);

    return (
        <div className="min-h-screen bg-gray-50">
            <Toaster />

            {showModal && (
                <ScheduleModal
                    onClose={() => { setShowModal(false); setEditSchedule(null); }}
                    onSaved={fetchAll}
                    buses={buses}
                    staff={staff}
                    editSchedule={editSchedule}
                />
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900" style={{ letterSpacing: '-0.02em' }}>Schedules</h1>
                        <p className="text-sm text-gray-400 mt-0.5">{schedules.length} scheduled routes</p>
                    </div>
                    <button onClick={openAdd} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors active:scale-95">
                        <FaPlus className="text-xs" /> Add Schedule
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
                        <input type="text" placeholder="Search by route or bus plate..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-8 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-orange-300" />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {['All', 'Daily', 'Weekly', 'One-time'].map(f => (
                            <button key={f} onClick={() => setFilterFreq(f)} className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all whitespace-nowrap ${filterFreq === f ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {loading && (
                    <div className="flex flex-col items-center justify-center py-24 gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center">
                            <FaCalendarAlt className="text-orange-400 text-2xl animate-bounce" />
                        </div>
                        <p className="text-gray-400 text-xs font-bold tracking-widest uppercase">Loading schedules...</p>
                    </div>
                )}

                {!loading && error && (
                    <div className="bg-red-50 border border-red-100 text-red-500 rounded-2xl px-6 py-4 text-sm font-semibold flex items-center justify-between">
                        <span>{error}</span>
                        <button onClick={fetchAll} className="text-xs font-bold underline">Retry</button>
                    </div>
                )}

                {!loading && !error && filtered.length === 0 && (
                    <div className="text-center py-24">
                        <FaCalendarAlt className="text-gray-200 text-5xl mx-auto mb-4" />
                        <p className="text-gray-400 font-semibold text-sm">
                            {search || filterFreq !== 'All' ? 'No schedules match your filters.' : 'No schedules added yet.'}
                        </p>
                        {!search && filterFreq === 'All' && (
                            <button onClick={openAdd} className="mt-3 text-orange-500 text-sm font-bold hover:text-orange-600">
                                Add your first schedule
                            </button>
                        )}
                    </div>
                )}

                {!loading && !error && filtered.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filtered.map(s => (
                            <ScheduleCard
                                key={s.schedule_id}
                                schedule={s}
                                onEdit={openEdit}
                                onToggle={handleToggle}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}