import React, { useState, useRef } from 'react';
import {
    FaPlus, FaSearch, FaTimes, FaChevronLeft, FaChevronRight,
    FaEllipsisV, FaEdit, FaTrash, FaUserTie, FaPhone,
    FaMapMarkerAlt, FaIdCard, FaToggleOn, FaToggleOff,
    FaUpload, FaUser
} from 'react-icons/fa';
import { MdBadge } from 'react-icons/md';
import toast, { Toaster } from 'react-hot-toast';

// ── Mock data ─────────────────────────────────────────────────────────────────
const initialStaff = [
    {
        id: 1,
        name: 'Hari Bahadur Thapa',
        phone: '9841234567',
        address: 'Lalitpur, Bagmati',
        role: 'Driver',
        license: 'DL-098-076',
        licenseExpiry: '2027-05-10',
        active: true,
        photo: null,
        idDoc: null,
        licenseDoc: null,
    },
    {
        id: 2,
        name: 'Sanjay Tamang',
        phone: '9852345678',
        address: 'Pokhara, Gandaki',
        role: 'Driver',
        license: 'DL-045-074',
        licenseExpiry: '2026-02-18',
        active: true,
        photo: null,
        idDoc: null,
        licenseDoc: null,
    },
    {
        id: 3,
        name: 'Rajesh Shrestha',
        phone: '9863456789',
        address: 'Kathmandu, Bagmati',
        role: 'Driver',
        license: 'DL-112-075',
        licenseExpiry: '2025-11-30',
        active: false,
        photo: null,
        idDoc: null,
        licenseDoc: null,
    },
    {
        id: 4,
        name: 'Raju Maharjan',
        phone: '9874567890',
        address: 'Bhaktapur, Bagmati',
        role: 'Conductor',
        license: '',
        licenseExpiry: '',
        active: true,
        photo: null,
        idDoc: null,
        licenseDoc: null,
    },
    {
        id: 5,
        name: 'Suresh Yadav',
        phone: '9812345670',
        address: 'Birgunj, Madhesh',
        role: 'Conductor',
        license: '',
        licenseExpiry: '',
        active: true,
        photo: null,
        idDoc: null,
        licenseDoc: null,
    },
    {
        id: 6,
        name: 'Manita Gurung',
        phone: '9823456701',
        address: 'Pokhara, Gandaki',
        role: 'Counter Staff',
        license: '',
        licenseExpiry: '',
        active: true,
        photo: null,
        idDoc: null,
        licenseDoc: null,
    },
];

const ROLES = ['Driver', 'Conductor', 'Counter Staff'];
const STEPS = ['Profile', 'Role & Docs'];

const roleBadge = {
    'Driver':        { bg: '#DCFCE7', text: '#16A34A' },
    'Conductor':     { bg: '#DBEAFE', text: '#2563EB' },
    'Counter Staff': { bg: '#F3E8FF', text: '#7C3AED' },
};

const emptyForm = {
    name: '', phone: '', address: '',
    role: '',
    license: '', licenseExpiry: '',
    photo: null, idDoc: null, licenseDoc: null,
};

const today = new Date();
const isExpiringSoon = (d) => {
    if (!d) return false;
    const diff = (new Date(d) - today) / (1000 * 60 * 60 * 24);
    return diff <= 60 && diff > 0;
};
const isExpired = (d) => d && new Date(d) < today;

// ── File upload button ────────────────────────────────────────────────────────
function FileBtn({ label, value, onChange, accept = 'image/*,.pdf' }) {
    const ref = useRef();
    return (
        <>
            <input ref={ref} type="file" accept={accept} className="hidden" onChange={e => onChange(e.target.files[0] || null)} />
            <button
                type="button"
                onClick={() => ref.current.click()}
                className={`w-full flex items-center gap-2 px-4 py-2.5 border-2 border-dashed rounded-xl text-sm font-medium transition-colors
                    ${value ? 'border-orange-300 text-orange-500 bg-orange-50' : 'border-gray-200 text-gray-400 hover:border-orange-300 hover:text-orange-400'}`}
            >
                <FaUpload className="text-xs flex-shrink-0" />
                <span className="truncate">{value ? value.name : label}</span>
            </button>
        </>
    );
}

// ── Add Staff Modal ───────────────────────────────────────────────────────────
function AddStaffModal({ onClose, onAdd }) {
    const [step, setStep] = useState(0);
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});
    const photoRef = useRef();

    const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

    const validate = () => {
        const e = {};
        if (step === 0) {
            if (!form.name.trim()) e.name = true;
            if (!form.phone.trim() || form.phone.length < 10) e.phone = true;
            if (!form.address.trim()) e.address = true;
        }
        if (step === 1) {
            if (!form.role) e.role = true;
            if (form.role === 'Driver') {
                if (!form.license.trim()) e.license = true;
                if (!form.licenseExpiry) e.licenseExpiry = true;
            }
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const next = () => { if (validate()) setStep(p => p + 1); };
    const back = () => setStep(p => p - 1);

    const handleSubmit = () => {
        if (!validate()) return;

        const fd = new FormData();
        fd.append('name', form.name);
        fd.append('phone', form.phone);
        fd.append('address', form.address);
        fd.append('role', form.role);
        fd.append('license', form.license);
        fd.append('licenseExpiry', form.licenseExpiry);
        if (form.photo) fd.append('photo', form.photo);
        if (form.idDoc) fd.append('idDoc', form.idDoc);
        if (form.licenseDoc) fd.append('licenseDoc', form.licenseDoc);

        // Replace with: await fetch('/api/operator/staff', { method: 'POST', body: fd });

        onAdd({
            id: Date.now(),
            ...form,
            active: true,
            photo: form.photo ? URL.createObjectURL(form.photo) : null,
        });

        toast.success(`${form.name} added to staff.`);
        onClose();
    };

    const inputCls = (err) =>
        `w-full px-4 py-2.5 border-2 rounded-xl text-sm text-gray-800 placeholder-gray-400 bg-white focus:outline-none transition-all
        ${err ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-orange-400'}`;

    const optBtn = (val) => (
        <button
            key={val}
            type="button"
            onClick={() => { set('role', val); set('license', ''); set('licenseExpiry', ''); }}
            className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all
                ${form.role === val
                    ? 'border-orange-400 bg-orange-50 text-orange-600'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
        >
            {val}
        </button>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
                    <div>
                        <h2 className="text-lg font-black text-gray-900">Add Staff</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Step {step + 1} of {STEPS.length} — {STEPS[step]}</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-300 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                        <FaTimes />
                    </button>
                </div>

                {/* Step bar */}
                <div className="flex px-6 pt-4 gap-2 flex-shrink-0">
                    {STEPS.map((s, i) => (
                        <div key={i} className="flex-1">
                            <div className={`h-1 rounded-full transition-all duration-300 ${i <= step ? 'bg-orange-400' : 'bg-gray-100'}`} />
                            <span className={`text-[10px] font-semibold mt-1 block ${i === step ? 'text-orange-500' : 'text-gray-300'}`}>{s}</span>
                        </div>
                    ))}
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1">

                    {/* ── Step 0: Profile ── */}
                    {step === 0 && (
                        <>
                            {/* Photo */}
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-200 hover:border-orange-300 transition-colors overflow-hidden flex-shrink-0"
                                    onClick={() => photoRef.current.click()}
                                >
                                    {form.photo
                                        ? <img src={URL.createObjectURL(form.photo)} className="w-full h-full object-cover" alt="photo" />
                                        : <FaUser className="text-gray-300 text-xl" />
                                    }
                                </div>
                                <input
                                    ref={photoRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={e => set('photo', e.target.files[0] || null)}
                                />
                                <div>
                                    <p className="text-sm font-bold text-gray-700">Profile Photo</p>
                                    <p className="text-xs text-gray-400 mt-0.5">Tap the box to upload. Optional.</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Hari Bahadur Thapa"
                                    value={form.name}
                                    onChange={e => set('name', e.target.value)}
                                    className={inputCls(errors.name)}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Phone Number</label>
                                <input
                                    type="tel"
                                    placeholder="98XXXXXXXX"
                                    value={form.phone}
                                    onChange={e => set('phone', e.target.value)}
                                    maxLength={10}
                                    className={inputCls(errors.phone)}
                                />
                                {errors.phone && <p className="text-xs text-red-400 mt-1">Enter a valid 10-digit number</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Address</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Lalitpur, Bagmati"
                                    value={form.address}
                                    onChange={e => set('address', e.target.value)}
                                    className={inputCls(errors.address)}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Citizenship / ID (optional)</label>
                                <FileBtn
                                    label="Upload ID card"
                                    value={form.idDoc}
                                    onChange={v => set('idDoc', v)}
                                />
                            </div>
                        </>
                    )}

                    {/* ── Step 1: Role & Docs ── */}
                    {step === 1 && (
                        <>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Role</label>
                                <div className="flex flex-wrap gap-2">
                                    {ROLES.map(r => optBtn(r))}
                                </div>
                                {errors.role && <p className="text-xs text-red-400 mt-1">Select a role</p>}
                            </div>

                            {form.role === 'Driver' && (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">License Number</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. DL-098-076"
                                            value={form.license}
                                            onChange={e => set('license', e.target.value)}
                                            className={inputCls(errors.license)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">License Expiry Date</label>
                                        <input
                                            type="date"
                                            value={form.licenseExpiry}
                                            onChange={e => set('licenseExpiry', e.target.value)}
                                            min={today.toISOString().split('T')[0]}
                                            className={inputCls(errors.licenseExpiry)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Driving License Copy (optional)</label>
                                        <FileBtn
                                            label="Upload license document"
                                            value={form.licenseDoc}
                                            onChange={v => set('licenseDoc', v)}
                                        />
                                    </div>
                                </>
                            )}

                            {/* Summary */}
                            {form.name && form.role && (
                                <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                                    <p className="font-bold text-orange-700 text-xs uppercase tracking-wider mb-2">Summary</p>
                                    <p className="text-sm font-bold text-gray-800">{form.name}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{form.role} · {form.phone} · {form.address}</p>
                                    {form.role === 'Driver' && form.license && (
                                        <p className="text-xs text-gray-500 mt-0.5">License: {form.license} · Expires: {form.licenseExpiry}</p>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 flex-shrink-0">
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
                            Add Staff
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Staff Card ─────────────────────────────────────────────────────────────────
function StaffCard({ staff, onToggle, onDelete }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const badge = roleBadge[staff.role];
    const licExpiring = isExpiringSoon(staff.licenseExpiry);
    const licExpired  = isExpired(staff.licenseExpiry);

    return (
        <div className={`bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-200 ${!staff.active ? 'opacity-55' : ''}`}>

            {/* Top */}
            <div className="flex items-start justify-between px-5 pt-5 pb-3">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {staff.photo
                            ? <img src={staff.photo} className="w-full h-full object-cover" alt={staff.name} />
                            : <FaUser className="text-gray-300 text-lg" />
                        }
                    </div>
                    <div>
                        <p className="text-sm font-black text-gray-900">{staff.name}</p>
                        <span
                            className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                            style={{ background: badge.bg, color: badge.text }}
                        >
                            {staff.role}
                        </span>
                    </div>
                </div>
                <div className="relative">
                    <button
                        onClick={() => setMenuOpen(p => !p)}
                        className="p-1.5 text-gray-300 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                        <FaEllipsisV className="text-xs" />
                    </button>
                    {menuOpen && (
                        <div className="absolute right-0 top-8 w-40 bg-white border border-gray-100 rounded-xl shadow-xl z-20 py-1">
                            <button className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                                <FaEdit className="text-xs text-gray-300" /> Edit
                            </button>
                            <button
                                onClick={() => { onToggle(staff.id); setMenuOpen(false); }}
                                className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                            >
                                {staff.active
                                    ? <><FaToggleOff className="text-xs text-gray-300" /> Set Inactive</>
                                    : <><FaToggleOn className="text-xs text-green-500" /> Set Active</>
                                }
                            </button>
                            <button
                                onClick={() => { onDelete(staff.id); setMenuOpen(false); }}
                                className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                            >
                                <FaTrash className="text-xs" /> Remove
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Details */}
            <div className="px-5 pb-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <FaPhone className="text-gray-200 flex-shrink-0" />
                    {staff.phone}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <FaMapMarkerAlt className="text-gray-200 flex-shrink-0" />
                    {staff.address}
                </div>
                {staff.role === 'Driver' && staff.license && (
                    <div className="flex items-center gap-2 text-xs">
                        <FaIdCard className="text-gray-200 flex-shrink-0" />
                        <span className="text-gray-400">{staff.license}</span>
                        {staff.licenseExpiry && (
                            <span className={`font-semibold ${licExpired ? 'text-red-500' : licExpiring ? 'text-amber-500' : 'text-gray-400'}`}>
                                · {licExpired ? 'Expired' : licExpiring ? 'Expiring soon' : `Exp. ${staff.licenseExpiry}`}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <span className={`text-xs font-bold flex items-center gap-1.5 ${staff.active ? 'text-green-600' : 'text-gray-400'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${staff.active ? 'bg-green-400' : 'bg-gray-300'}`} />
                    {staff.active ? 'Active' : 'Inactive'}
                </span>
                <button
                    onClick={() => onToggle(staff.id)}
                    className={`text-xs font-semibold px-3 py-1 rounded-lg border transition-colors
                        ${staff.active
                            ? 'border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-500 hover:bg-red-50'
                            : 'border-green-200 text-green-600 hover:bg-green-50'
                        }`}
                >
                    {staff.active ? 'Deactivate' : 'Activate'}
                </button>
            </div>
        </div>
    );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function OperatorStaff() {
    const [staff, setStaff] = useState(initialStaff);
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState('');
    const [filterRole, setFilterRole] = useState('All');

    const handleAdd = (s) => setStaff(p => [s, ...p]);

    const handleToggle = (id) => {
        setStaff(prev => prev.map(s => {
            if (s.id !== id) return s;
            const next = { ...s, active: !s.active };
            toast.success(`${next.name} set to ${next.active ? 'Active' : 'Inactive'}.`);
            return next;
        }));
    };

    const handleDelete = (id) => {
        const s = staff.find(x => x.id === id);
        toast.custom((t) => (
            <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} bg-white border border-red-100 shadow-lg rounded-xl max-w-sm w-full p-4`}>
                <p className="text-sm font-bold text-gray-900">Remove {s.name}?</p>
                <p className="text-xs text-gray-400 mt-1">They will be removed from all schedules.</p>
                <div className="flex gap-2 mt-3">
                    <button
                        onClick={() => {
                            setStaff(p => p.filter(x => x.id !== id));
                            toast.dismiss(t.id);
                            toast.success(`${s.name} removed.`);
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

    const filtered = staff
        .filter(s => {
            const q = search.toLowerCase();
            return s.name.toLowerCase().includes(q) || s.phone.includes(q) || s.address.toLowerCase().includes(q);
        })
        .filter(s => filterRole === 'All' || s.role === filterRole);

    const counts = {
        drivers:   staff.filter(s => s.role === 'Driver').length,
        conductors: staff.filter(s => s.role === 'Conductor').length,
        counter:   staff.filter(s => s.role === 'Counter Staff').length,
        inactive:  staff.filter(s => !s.active).length,
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Toaster />
            {showModal && <AddStaffModal onClose={() => setShowModal(false)} onAdd={handleAdd} />}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900" style={{ letterSpacing: '-0.02em' }}>Staff</h1>
                        <p className="text-sm text-gray-400 mt-0.5">
                            {counts.drivers} drivers · {counts.conductors} conductors · {counts.counter} counter staff
                            {counts.inactive > 0 && <span className="ml-2 text-amber-500 font-semibold">· {counts.inactive} inactive</span>}
                        </p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors active:scale-95"
                    >
                        <FaPlus className="text-xs" /> Add Staff
                    </button>
                </div>

                {/* Search + filter */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
                        <input
                            type="text"
                            placeholder="Search by name, phone, or address..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-8 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-orange-300"
                        />
                    </div>
                    <div className="flex gap-2">
                        {['All', 'Driver', 'Conductor', 'Counter Staff'].map(r => (
                            <button
                                key={r}
                                onClick={() => setFilterRole(r)}
                                className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all whitespace-nowrap
                                    ${filterRole === r
                                        ? 'bg-orange-500 text-white border-orange-500'
                                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                {filtered.length === 0 ? (
                    <div className="text-center py-24">
                        <FaUserTie className="text-gray-200 text-5xl mx-auto mb-4" />
                        <p className="text-gray-400 font-semibold text-sm">No staff found.</p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="mt-3 text-orange-500 text-sm font-bold hover:text-orange-600"
                        >
                            Add your first staff member
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filtered.map(s => (
                            <StaffCard
                                key={s.id}
                                staff={s}
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