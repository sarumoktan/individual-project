import React, { useState, useEffect, useRef } from 'react';
import {
    FaPlus, FaSearch, FaTimes, FaWifi, FaBolt,
    FaSnowflake, FaVideo, FaTint, FaChevronLeft, FaChevronRight,
    FaBus, FaEllipsisV, FaEdit, FaTrash,
} from 'react-icons/fa';
import { MdDirectionsBus, MdEventSeat, MdAirlineSeatReclineExtra } from 'react-icons/md';
import toast from 'react-hot-toast';
import { getAllBus, updateBusApi, addBusApi, deleteBusApi, toggleBusApi } from '../../services/api';

const amenityMeta = {
    wifi:     { icon: FaWifi,      label: 'WiFi'     },
    charging: { icon: FaBolt,      label: 'Charging'  },
    water:    { icon: FaTint,      label: 'Water'    },
    movies:   { icon: FaVideo,     label: 'Movies'   },
    blankets: { icon: FaSnowflake, label: 'Blankets'  },
};

const classBadge = {
    'Luxury':      'bg-purple-100 text-purple-700',
    'Semi-Luxury': 'bg-blue-100 text-blue-700',
    'Standard':    'bg-gray-100 text-gray-600',
};

const STEPS = ['Identity', 'Type & Layout', 'Amenities'];

const emptyForm = {
    plate: '', model: '', year: '',
    class: '', comfort: '', layout: '', seats: '',
    amenities: [],
    image: null,
};


// ── Add / Edit Modal ──────────────────────────────────────────────────────────
function BusModal({ onClose, onSave, editBus }) {
    const isEdit = Boolean(editBus);

    const [step, setStep]     = useState(0);
    const [form, setForm]     = useState(isEdit ? {
        plate:     editBus.plate     ?? '',
        model:     editBus.model     ?? '',
        year:      String(editBus.year ?? ''),
        class:     editBus.class     ?? '',
        comfort:   editBus.comfort   ?? '',
        layout:    editBus.layout    ?? '',
        seats:     String(editBus.seats ?? ''),
        amenities: editBus.amenities ?? [],
        image:     null,
    } : emptyForm);
    const [errors,  setErrors]  = useState({});
    const [loading, setLoading] = useState(false);
    const fileRef               = useRef();

    const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

    const toggleAmenity = (key) => setForm(p => ({
        ...p,
        amenities: p.amenities.includes(key)
            ? p.amenities.filter(a => a !== key)
            : [...p.amenities, key],
    }));

    const validateStep = () => {
        const e = {};
        if (step === 0) {
            if (!form.plate.trim()) e.plate  = true;
            if (!form.model.trim()) e.model  = true;
            if (!form.year.trim())  e.year   = true;
        }
        if (step === 1) {
            if (!form.class)   e.class   = true;
            if (!form.comfort) e.comfort = true;
            if (!form.layout)  e.layout  = true;
            if (!form.seats)   e.seats   = true;
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const next = () => { if (validateStep()) setStep(p => p + 1); };
    const back = () => setStep(p => p - 1);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const fd = new FormData();
            fd.append('plate',     form.plate);
            fd.append('model',     form.model);
            fd.append('year',      form.year);
            fd.append('class',     form.class);
            fd.append('comfort',   form.comfort);
            fd.append('layout',    form.layout);
            fd.append('seats',     form.seats);
            fd.append('amenities', JSON.stringify(form.amenities));
            if (form.image) fd.append('image', form.image);

            let saved;
            if (isEdit) {
                const res = await updateBusApi(editBus.bus_id, fd);
                saved = res.data.data;
                toast.success(`${form.plate} updated.`);
            } else {
                const res = await addBusApi(fd);
                saved = res.data.data;
                toast.success(`${form.plate} added to your fleet.`);
            }

            onSave(saved, isEdit);
            onClose();
        } catch (err) {
            toast.error(err?.response?.data?.message ?? 'Something went wrong.');
            console.log(err)
        } finally {
            setLoading(false);
        }
    };

    const inputCls = (err) =>
        `w-full px-4 py-2.5 border-2 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none transition-all
        ${err ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-orange-400'}`;

    const optionBtn = (val, current, key) => (
        <button
            key={val}
            type="button"
            onClick={() => set(key, val)}
            className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all
                ${current === val
                    ? 'border-orange-400 bg-orange-50 text-orange-600'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
        >
            {val}
        </button>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">

                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <div>
                        <h2 className="text-lg font-black text-gray-900">{isEdit ? 'Edit Bus' : 'Add New Bus'}</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Step {step + 1} of {STEPS.length} — {STEPS[step]}</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-300 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                        <FaTimes />
                    </button>
                </div>

                <div className="flex px-6 pt-5 gap-2">
                    {STEPS.map((s, i) => (
                        <div key={i} className="flex-1 flex flex-col gap-1">
                            <div className={`h-1 rounded-full transition-all duration-300 ${i <= step ? 'bg-orange-400' : 'bg-gray-100'}`} />
                            <span className={`text-[10px] font-semibold ${i === step ? 'text-orange-500' : 'text-gray-300'}`}>{s}</span>
                        </div>
                    ))}
                </div>

                <div className="px-6 py-6 space-y-4 min-h-[280px]">
                    {step === 0 && (
                        <>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Bus Number Plate</label>
                                <input type="text" placeholder="e.g. Ba 1 Cha 2234" value={form.plate} onChange={e => set('plate', e.target.value)} className={inputCls(errors.plate)} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Model Name</label>
                                <input type="text" placeholder="e.g. Tata Starbus Ultra" value={form.model} onChange={e => set('model', e.target.value)} className={inputCls(errors.model)} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Year</label>
                                <input type="number" placeholder="e.g. 2022" value={form.year} onChange={e => set('year', e.target.value)} min="1990" max="2030" className={inputCls(errors.year)} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Bus Photo (optional)</label>
                                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => set('image', e.target.files[0] || null)} />
                                <button
                                    type="button"
                                    onClick={() => fileRef.current.click()}
                                    className="w-full py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-orange-300 hover:text-orange-400 transition-colors font-medium"
                                >
                                    {form.image ? form.image.name : isEdit && editBus.image_url ? 'Replace photo' : '+ Upload photo'}
                                </button>
                                {isEdit && editBus.image_url && !form.image && (
                                    <p className="text-xs text-gray-400 mt-1">Current photo kept unless you upload a new one.</p>
                                )}
                            </div>
                        </>
                    )}

                    {step === 1 && (
                        <>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Class</label>
                                <div className="flex flex-wrap gap-2">{['Luxury', 'Semi-Luxury', 'Standard'].map(v => optionBtn(v, form.class, 'class'))}</div>
                                {errors.class && <p className="text-xs text-red-400 mt-1">Select a class</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Comfort</label>
                                <div className="flex gap-2">{['AC', 'Non-AC'].map(v => optionBtn(v, form.comfort, 'comfort'))}</div>
                                {errors.comfort && <p className="text-xs text-red-400 mt-1">Select comfort type</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Layout</label>
                                <div className="flex flex-wrap gap-2">{['Seater', 'Sleeper', 'Semi-Sleeper'].map(v => optionBtn(v, form.layout, 'layout'))}</div>
                                {errors.layout && <p className="text-xs text-red-400 mt-1">Select layout</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Total Seats</label>
                                <div className="flex flex-wrap gap-2">{['28', '32', '40', '44', '56'].map(v => optionBtn(v, form.seats, 'seats'))}</div>
                                {errors.seats && <p className="text-xs text-red-400 mt-1">Select seat count</p>}
                            </div>
                        </>
                    )}

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
                                                    : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
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
                            disabled={loading}
                            className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors active:scale-95 flex items-center gap-2"
                        >
                            {loading && (
                                <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                            )}
                            {isEdit ? 'Save Changes' : 'Add Bus'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Bus Card ──────────────────────────────────────────────────────────────────
// BusCard — add onToggle prop and the status footer
function BusCard({ bus, onEdit, onDelete, onToggle }) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className={`bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 ${!bus.is_active ? 'opacity-50 grayscale' : ''}`}>
            <div className="h-36 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center relative overflow-hidden">
                {bus.image_url
                    ? <img src={`${import.meta.env.VITE_API_BASE_URL}${bus.image_url}`} alt="bus" className="w-full h-full object-cover" />
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
                                <button
                                    onClick={() => { onEdit(bus); setMenuOpen(false); }}
                                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                                >
                                    <FaEdit className="text-xs text-gray-300" /> Edit
                                </button>
                                <button
                                    onClick={() => { onDelete(bus); setMenuOpen(false); }}
                                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                                >
                                    <FaTrash className="text-xs" /> Remove
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

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
                {bus.amenities?.length > 0 && (
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

            {/* Toggle footer */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <span className={`text-xs font-bold flex items-center gap-1.5 ${bus.is_active ? 'text-green-600' : 'text-gray-400'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${bus.is_active ? 'bg-green-400' : 'bg-gray-300'}`} />
                    {bus.is_active ? 'In Service' : 'Out of Service'}
                </span>
                <button
                    onClick={() => onToggle(bus)}
                    className={`text-xs font-semibold px-3 py-1 rounded-lg border transition-colors
                        ${bus.is_active
                            ? 'border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-500 hover:bg-red-50'
                            : 'border-green-200 text-green-600 hover:bg-green-50'}`}
                >
                    {bus.is_active ? 'Deactivate' : 'Activate'}
                </button>
            </div>
        </div>
    );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function OperatorBuses() {
    const [fleet,       setFleet]       = useState([]);
    const [loading,     setLoading]     = useState(true);
    const [error,       setError]       = useState(null);
    const [showModal,   setShowModal]   = useState(false);
    const [editBus,     setEditBus]     = useState(null);
    const [search,      setSearch]      = useState('');
    const [filterClass, setFilterClass] = useState('All');

    useEffect(() => { fetchFleet(); }, []);

    const fetchFleet = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getAllBus();
            setFleet(res.data.data ?? []);
        } catch (err) {
            setError(err?.response?.data?.message ?? 'No buses added yet');
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (bus) => {
        try {
            const res = await toggleBusApi(bus.bus_id);
            const isActive = res.data?.data?.is_active;
            console.log(isActive);
            toast.success(`${bus.plate} is now ${isActive ? 'in service' : 'out of service'}.`);
            await fetchFleet();
        } catch (err) {
            toast.error(err?.response?.data?.message ?? 'Failed to update status.');
        }
    };

    const handleSave = (savedBus, isEdit) => {
        if (isEdit) {
            fetchFleet();
        } else {
            fetchFleet();
        }
    };

    const openAdd  = ()    => { setEditBus(null); setShowModal(true); };
    const openEdit = (bus) => { setEditBus(bus);  setShowModal(true); };

    const handleDelete = (bus) => {
        toast.custom((t) => (
            <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} bg-white border border-red-100 shadow-lg rounded-xl max-w-sm w-full p-4`}>
                <p className="text-sm font-bold text-gray-900">Remove {bus.plate}?</p>
                <p className="text-xs text-gray-400 mt-1">This cannot be undone.</p>
                <div className="flex gap-2 mt-3">
                    <button
                        onClick={async () => {
                            try {
                                await deleteBusApi(bus.bus_id);
                                toast.dismiss(t.id);
                                toast.success(`${bus.plate} removed.`);
                                fetchFleet();
                            } catch (err) {
                                toast.dismiss(t.id);
                                toast.error(err?.response?.data?.message ?? 'Failed to delete.');
                            }
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
            {showModal && (
                <BusModal
                    onClose={() => { setShowModal(false); setEditBus(null); }}
                    onSave={handleSave}
                    editBus={editBus}
                />
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900" style={{ letterSpacing: '-0.02em' }}>My Buses</h1>
                        <p className="text-sm text-gray-400 mt-0.5">{fleet.length} buses in your fleet</p>
                    </div>
                    <button
                        onClick={openAdd}
                        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors active:scale-95"
                    >
                        <FaPlus className="text-xs" /> Add New Bus
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
                        <input
                            type="text"
                            placeholder="Search by plate or model..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-8 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-orange-300"
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {['All', 'Luxury', 'Semi-Luxury', 'Standard'].map(c => (
                            <button
                                key={c}
                                onClick={() => setFilterClass(c)}
                                className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all whitespace-nowrap
                                    ${filterClass === c
                                        ? 'bg-orange-500 text-white border-orange-500'
                                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>

                {loading && (
                    <div className="flex flex-col items-center justify-center py-24 gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center">
                            <FaBus className="text-orange-400 text-2xl animate-bounce" />
                        </div>
                        <p className="text-gray-400 text-xs font-bold tracking-widest uppercase">Loading fleet...</p>
                    </div>
                )}

                {!loading && error && (
                    <div className="bg-red-50 border border-red-100 text-red-500 rounded-2xl px-6 py-4 text-sm font-semibold flex items-center justify-between">
                        <span>{error}</span>
                        <button onClick={fetchFleet} className="text-xs font-bold underline">Trial</button>
                    </div>
                )}

                {!loading && !error && filtered.length === 0 && (
                    <div className="text-center py-24">
                        <FaBus className="text-gray-200 text-5xl mx-auto mb-4" />
                        <p className="text-gray-400 font-semibold text-sm">
                            {search || filterClass !== 'All' ? 'No buses match your filters.' : 'No buses in your fleet yet.'}
                        </p>
                        {!search && filterClass === 'All' && (
                            <button onClick={openAdd} className="mt-3 text-orange-500 text-sm font-bold hover:text-orange-600">
                                Add your first bus
                            </button>
                        )}
                    </div>
                )}

                {!loading && !error && filtered.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filtered.map(bus => (
                            <BusCard
                                key={bus.bus_id}
                                bus={bus}
                                onEdit={openEdit}
                                onDelete={handleDelete}
                                onToggle={handleToggle}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}