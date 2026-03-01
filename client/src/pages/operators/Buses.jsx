import React, { useState, useRef } from 'react';
import {
    FaPlus, FaSearch, FaTimes, FaWifi, FaBolt,
    FaSnowflake, FaVideo, FaTint, FaChevronLeft, FaChevronRight,
    FaBus, FaEllipsisV, FaEdit, FaTrash
} from 'react-icons/fa';
import { MdDirectionsBus, MdEventSeat, MdAirlineSeatReclineExtra } from 'react-icons/md';
import toast, { Toaster } from 'react-hot-toast';

// ── Mock data ─────────────────────────────────────────────────────────────────
const initialFleet = [
    {
        id: 1,
        plate: 'Ba 1 Cha 2234',
        model: 'Tata Starbus Ultra',
        year: '2021',
        class: 'Luxury',
        comfort: 'AC',
        layout: 'Seater',
        seats: '32',
        amenities: ['wifi', 'charging', 'water', 'movies'],
        image: null,
    },
    {
        id: 2,
        plate: 'Ga 2 Ja 7891',
        model: 'Ashok Leyland Viking',
        year: '2019',
        class: 'Semi-Luxury',
        comfort: 'Non-AC',
        layout: 'Seater',
        seats: '40',
        amenities: ['water', 'charging'],
        image: null,
    },
    {
        id: 3,
        plate: 'Ba 1 Cha 5512',
        model: 'Tata Starbus',
        year: '2020',
        class: 'Standard',
        comfort: 'Non-AC',
        layout: 'Seater',
        seats: '40',
        amenities: ['water'],
        image: null,
    },
    {
        id: 4,
        plate: 'Ga 3 Ka 1120',
        model: 'Hino AK1J',
        year: '2022',
        class: 'Luxury',
        comfort: 'AC',
        layout: 'Sleeper',
        seats: '56',
        amenities: ['wifi', 'charging', 'blankets', 'water', 'movies'],
        image: null,
    },
];

const amenityMeta = {
    wifi:     { icon: FaWifi,      label: 'WiFi'     },
    charging: { icon: FaBolt,      label: 'Charging'  },
    water:    { icon: FaTint,      label: 'Water'     },
    movies:   { icon: FaVideo,     label: 'Movies'    },
    blankets: { icon: FaSnowflake, label: 'Blankets'  },
};

const classBadge = {
    'Luxury':      'bg-purple-100 text-purple-700',
    'Semi-Luxury': 'bg-blue-100 text-blue-700',
    'Standard':    'bg-gray-100 text-gray-600',
};

// ── Wizard steps ──────────────────────────────────────────────────────────────
const STEPS = ['Identity', 'Type & Layout', 'Amenities'];

const emptyForm = {
    plate: '', model: '', year: '',
    class: '', comfort: '', layout: '', seats: '',
    amenities: [],
    image: null,
};

// ── Add Bus Modal ─────────────────────────────────────────────────────────────
function AddBusModal({ onClose, onAdd }) {
    const [step, setStep] = useState(0);
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});
    const fileRef = useRef();

    const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

    const toggleAmenity = (key) => {
        setForm(p => ({
            ...p,
            amenities: p.amenities.includes(key)
                ? p.amenities.filter(a => a !== key)
                : [...p.amenities, key],
        }));
    };

    const validateStep = () => {
        const e = {};
        if (step === 0) {
            if (!form.plate.trim()) e.plate = true;
            if (!form.model.trim()) e.model = true;
            if (!form.year.trim()) e.year = true;
        }
        if (step === 1) {
            if (!form.class) e.class = true;
            if (!form.comfort) e.comfort = true;
            if (!form.layout) e.layout = true;
            if (!form.seats) e.seats = true;
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const next = () => { if (validateStep()) setStep(p => p + 1); };
    const back = () => setStep(p => p - 1);

    const handleSubmit = () => {
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => {
            if (k === 'amenities') fd.append(k, JSON.stringify(v));
            else if (k === 'image' && v) fd.append(k, v);
            else fd.append(k, v ?? '');
        });

        // Replace this with your actual API call:
        // await fetch('/api/operator/buses', { method: 'POST', body: fd });

        const newBus = {
            id: Date.now(),
            ...form,
            image: form.image ? URL.createObjectURL(form.image) : null,
        };
        onAdd(newBus);
        toast.success(`${form.plate} added to your fleet.`);
        onClose();
    };

    const inputCls = (err) =>
        `w-full px-4 py-2.5 border-2 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none transition-all ${err ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-orange-400'}`;

    const optionBtn = (val, current, key) => (
        <button
            type="button"
            onClick={() => set(key, val)}
            className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all
                ${current === val
                    ? 'border-orange-400 bg-orange-50 text-orange-600'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
        >
            {val}
        </button>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">

                {/* Modal header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <div>
                        <h2 className="text-lg font-black text-gray-900">Add New Bus</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Step {step + 1} of {STEPS.length} — {STEPS[step]}</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-300 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                        <FaTimes />
                    </button>
                </div>

                {/* Step indicator */}
                <div className="flex px-6 pt-5 gap-2">
                    {STEPS.map((s, i) => (
                        <div key={i} className="flex-1 flex flex-col gap-1">
                            <div className={`h-1 rounded-full transition-all duration-300 ${i <= step ? 'bg-orange-400' : 'bg-gray-100'}`} />
                            <span className={`text-[10px] font-semibold ${i === step ? 'text-orange-500' : 'text-gray-300'}`}>{s}</span>
                        </div>
                    ))}
                </div>

                {/* Step body */}
                <div className="px-6 py-6 space-y-4 min-h-[280px]">

                    {/* Step 0: Identity */}
                    {step === 0 && (
                        <>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Bus Number Plate</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Ba 1 Cha 2234"
                                    value={form.plate}
                                    onChange={e => set('plate', e.target.value)}
                                    className={inputCls(errors.plate)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Model Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Tata Starbus Ultra"
                                    value={form.model}
                                    onChange={e => set('model', e.target.value)}
                                    className={inputCls(errors.model)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Year</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 2022"
                                    value={form.year}
                                    onChange={e => set('year', e.target.value)}
                                    min="1990"
                                    max="2026"
                                    className={inputCls(errors.year)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Bus Photo (optional)</label>
                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={e => set('image', e.target.files[0] || null)}
                                />
                                <button
                                    type="button"
                                    onClick={() => fileRef.current.click()}
                                    className="w-full py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-orange-300 hover:text-orange-400 transition-colors font-medium"
                                >
                                    {form.image ? form.image.name : '+ Upload photo'}
                                </button>
                            </div>
                        </>
                    )}

                    {/* Step 1: Type & Layout */}
                    {step === 1 && (
                        <>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Class</label>
                                <div className="flex flex-wrap gap-2">
                                    {['Luxury', 'Semi-Luxury', 'Standard'].map(v => optionBtn(v, form.class, 'class'))}
                                </div>
                                {errors.class && <p className="text-xs text-red-400 mt-1">Select a class</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Comfort</label>
                                <div className="flex gap-2">
                                    {['AC', 'Non-AC'].map(v => optionBtn(v, form.comfort, 'comfort'))}
                                </div>
                                {errors.comfort && <p className="text-xs text-red-400 mt-1">Select comfort type</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Layout</label>
                                <div className="flex flex-wrap gap-2">
                                    {['Seater', 'Sleeper', 'Semi-Sleeper'].map(v => optionBtn(v, form.layout, 'layout'))}
                                </div>
                                {errors.layout && <p className="text-xs text-red-400 mt-1">Select layout</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Total Seats</label>
                                <div className="flex flex-wrap gap-2">
                                    {['28', '32', '40', '44', '56'].map(v => optionBtn(v, form.seats, 'seats'))}
                                </div>
                                {errors.seats && <p className="text-xs text-red-400 mt-1">Select seat count</p>}
                            </div>
                        </>
                    )}

                    {/* Step 2: Amenities */}
                    {step === 2 && (
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Available Onboard</label>
                            <div className="grid grid-cols-2 gap-3">
                                {Object.entries(amenityMeta).map(([key, meta]) => {
                                    const selected = form.amenities.includes(key);
                                    return (
                                        <button
                                            key={key}
                                            type="button"
                                            onClick={() => toggleAmenity(key)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all text-left
                                                ${selected
                                                    ? 'border-orange-400 bg-orange-50 text-orange-700'
                                                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                                }`}
                                        >
                                            <meta.icon className={selected ? 'text-orange-500' : 'text-gray-300'} />
                                            {meta.label}
                                        </button>
                                    );
                                })}
                            </div>
                            <p className="text-xs text-gray-400 mt-4">Select all that apply. You can update this later.</p>
                        </div>
                    )}
                </div>

                {/* Modal footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={step === 0 ? onClose : back}
                        className="flex items-center gap-1.5 text-sm font-semibold text-gray-400 hover:text-gray-700 transition-colors"
                    >
                        <FaChevronLeft className="text-[10px]" />
                        {step === 0 ? 'Cancel' : 'Back'}
                    </button>
                    {step < STEPS.length - 1 ? (
                        <button
                            type="button"
                            onClick={next}
                            className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors active:scale-95"
                        >
                            Next <FaChevronRight className="text-[10px]" />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors active:scale-95"
                        >
                            Add Bus
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Bus Card ──────────────────────────────────────────────────────────────────
function BusCard({ bus, onDelete }) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">

            {/* Image or placeholder */}
            <div className="h-36 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center relative overflow-hidden">
                {bus.image
                    ? <img src={bus.image} alt={bus.plate} className="w-full h-full object-cover" />
                    : <MdDirectionsBus className="text-gray-300 text-6xl" />
                }
                <div className="absolute top-3 left-3">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${classBadge[bus.class]}`}>
                        {bus.class}
                    </span>
                </div>
                <div className="absolute top-3 right-3">
                    <div className="relative">
                        <button
                            onClick={() => setMenuOpen(p => !p)}
                            className="w-7 h-7 bg-white rounded-lg shadow flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors"
                        >
                            <FaEllipsisV className="text-xs" />
                        </button>
                        {menuOpen && (
                            <div className="absolute right-0 top-8 w-36 bg-white border border-gray-100 rounded-xl shadow-xl z-20 py-1">
                                <button className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                                    <FaEdit className="text-xs text-gray-300" /> Edit
                                </button>
                                <button
                                    onClick={() => { onDelete(bus.id); setMenuOpen(false); }}
                                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                                >
                                    <FaTrash className="text-xs" /> Remove
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Card body */}
            <div className="px-4 py-4">
                <p className="font-black text-gray-900 text-base tracking-wide">{bus.plate}</p>
                <p className="text-xs text-gray-400 mt-0.5">{bus.model} · {bus.year}</p>

                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                        <MdEventSeat className="text-gray-300" />
                        {bus.seats} seats
                    </span>
                    <span className="flex items-center gap-1">
                        <MdAirlineSeatReclineExtra className="text-gray-300" />
                        {bus.layout}
                    </span>
                    <span className={`font-semibold ${bus.comfort === 'AC' ? 'text-blue-500' : 'text-gray-400'}`}>
                        {bus.comfort}
                    </span>
                </div>

                {bus.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                        {bus.amenities.map(a => {
                            const m = amenityMeta[a];
                            if (!m) return null;
                            return (
                                <span key={a} className="flex items-center gap-1 text-[11px] px-2 py-0.5 bg-gray-50 border border-gray-100 rounded-full text-gray-500 font-medium">
                                    <m.icon className="text-[10px] text-gray-400" /> {m.label}
                                </span>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function OperatorBuses() {
    const [fleet, setFleet] = useState(initialFleet);
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState('');
    const [filterClass, setFilterClass] = useState('All');

    const handleAdd = (bus) => setFleet(p => [bus, ...p]);

    const handleDelete = (id) => {
        const bus = fleet.find(b => b.id === id);
        toast.custom((t) => (
            <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} bg-white border border-red-100 shadow-lg rounded-xl max-w-sm w-full p-4`}>
                <p className="text-sm font-bold text-gray-900">Remove {bus.plate}?</p>
                <p className="text-xs text-gray-400 mt-1">This cannot be undone.</p>
                <div className="flex gap-2 mt-3">
                    <button
                        onClick={() => {
                            setFleet(p => p.filter(b => b.id !== id));
                            toast.dismiss(t.id);
                            toast.success(`${bus.plate} removed.`);
                        }}
                        className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600"
                    >
                        Remove
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ), { duration: 8000, position: 'top-center' });
    };

    const filtered = fleet
        .filter(b => {
            const q = search.toLowerCase();
            return b.plate.toLowerCase().includes(q) || b.model.toLowerCase().includes(q);
        })
        .filter(b => filterClass === 'All' || b.class === filterClass);

    return (
        <div className="min-h-screen bg-gray-50">
            <Toaster />
            {showModal && <AddBusModal onClose={() => setShowModal(false)} onAdd={handleAdd} />}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900" style={{ letterSpacing: '-0.02em' }}>My Buses</h1>
                        <p className="text-sm text-gray-400 mt-0.5">{fleet.length} buses in your fleet</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors active:scale-95"
                    >
                        <FaPlus className="text-xs" /> Add New Bus
                    </button>
                </div>

                {/* Search + filter */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
                        <input
                            type="text"
                            placeholder="Search by plate or model..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-8 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-100"
                        />
                    </div>
                    <div className="flex gap-2">
                        {['All', 'Luxury', 'Semi-Luxury', 'Standard'].map(c => (
                            <button
                                key={c}
                                onClick={() => setFilterClass(c)}
                                className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all whitespace-nowrap
                                    ${filterClass === c
                                        ? 'bg-orange-500 text-white border-orange-500'
                                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                {filtered.length === 0 ? (
                    <div className="text-center py-24">
                        <FaBus className="text-gray-200 text-5xl mx-auto mb-4" />
                        <p className="text-gray-400 font-semibold text-sm">No buses found.</p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="mt-3 text-orange-500 text-sm font-bold hover:text-orange-600"
                        >
                            Add your first bus
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filtered.map(bus => (
                            <BusCard key={bus.id} bus={bus} onDelete={handleDelete} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}