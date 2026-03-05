import React, { useState, useEffect, useRef } from 'react';
import {
    FaPlus, FaSearch, FaTimes, FaChevronLeft, FaChevronRight,
    FaEllipsisV, FaEdit, FaTrash, FaUserTie, FaPhone,
    FaMapMarkerAlt, FaToggleOn, FaToggleOff,
    FaUpload, FaUser,
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { getAllStaff, addStaffApi, updateStaffApi, toggleStaffApi, deleteStaffApi } from '../../services/api';

const ROLES = ['Driver', 'Conductor', 'Counter Staff'];
const STEPS = ['Profile', 'Role Selection'];

const roleBadge = {
    'Driver':        { bg: '#DCFCE7', text: '#16A34A' },
    'Conductor':     { bg: '#DBEAFE', text: '#2563EB' },
    'Counter Staff': { bg: '#F3E8FF', text: '#7C3AED' },
};

const emptyForm = {
    name: '', phone: '', address: '',
    role: '',
    photo: null
};

function StaffModal({ onClose, onSave, editStaff }) {
    const isEdit = Boolean(editStaff);
    const [step,    setStep]    = useState(0);
    const [form,    setForm]    = useState(isEdit ? {
        name:          editStaff.name           ?? '',
        phone:         editStaff.phone          ?? '',
        address:       editStaff.address        ?? '',
        role:          editStaff.role           ?? '',
        photo: null
    } : emptyForm);
    const [errors,  setErrors]  = useState({});
    const [loading, setLoading] = useState(false);
    const photoRef              = useRef();

    const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

    const validate = () => {
        const e = {};
        if (step === 0) {
            if (!form.name.trim())                            e.name    = true;
            if (!form.phone.trim() || form.phone.length < 10) e.phone   = true;
            if (!form.address.trim())                         e.address = true;
        }
        if (step === 1) {
            if (!form.role) e.role = true;
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
            const fd = new FormData();
            fd.append('name',           form.name);
            fd.append('phone',          form.phone);
            fd.append('address',        form.address);
            fd.append('role',           form.role);
            if (form.photo)  fd.append('image',      form.photo);

            let saved;
            if (isEdit) {
                const res = await updateStaffApi(editStaff.staff_id, fd);
                saved = res.data.data;
                toast.success(`${form.name} updated.`);
            } else {
                const res = await addStaffApi(fd);
                saved = res.data.data;
                toast.success(`${form.name} added to staff.`);
            }
            onSave(saved, isEdit);
            onClose();
        } catch (err) {
            toast.error(err?.response?.data?.message ?? 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const inputCls = (err) =>
        `w-full px-4 py-2.5 border-2 rounded-xl text-sm text-gray-800 placeholder-gray-400 bg-white focus:outline-none transition-all
        ${err ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-orange-400'}`;

    const optBtn = (val) => (
        <button key={val} type="button"
            onClick={() => set('role', val)}
            className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all
                ${form.role === val ? 'border-orange-400 bg-orange-50 text-orange-600' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
            {val}
        </button>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
                    <div>
                        <h2 className="text-lg font-black text-gray-900">{isEdit ? 'Edit Staff' : 'Add Staff'}</h2>
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
                    {step === 0 && (
                        <>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-200 hover:border-orange-300 transition-colors overflow-hidden flex-shrink-0"
                                    onClick={() => photoRef.current.click()}>
                                    {form.photo
                                        ? <img src={URL.createObjectURL(form.photo)} className="w-full h-full object-cover" alt="photo" />
                                        : isEdit && editStaff.profile_url
                                            ? <img src={`${import.meta.env.VITE_API_BASE_URL}${editStaff.profile_url}`} className="w-full h-full object-cover" alt="current" />
                                            : <FaUser className="text-gray-300 text-xl" />}
                                </div>
                                <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={e => set('photo', e.target.files[0] || null)} />
                                <div>
                                    <p className="text-sm font-bold text-gray-700">Profile Photo</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{isEdit ? 'Upload to replace current.' : 'Optional.'}</p>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
                                <input type="text" placeholder="e.g. Hari Bahadur Thapa" value={form.name} onChange={e => set('name', e.target.value)} className={inputCls(errors.name)} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Phone Number</label>
                                <input type="tel" placeholder="98XXXXXXXX" value={form.phone} onChange={e => set('phone', e.target.value)} maxLength={10} className={inputCls(errors.phone)} />
                                {errors.phone && <p className="text-xs text-red-400 mt-1">Enter a valid 10-digit number</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Address</label>
                                <input type="text" placeholder="e.g. Lalitpur, Bagmati" value={form.address} onChange={e => set('address', e.target.value)} className={inputCls(errors.address)} />
                            </div>
                        </>
                    )}

                    {step === 1 && (
                        <>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Role</label>
                                <div className="flex flex-wrap gap-2">{ROLES.map(r => optBtn(r))}</div>
                                {errors.role && <p className="text-xs text-red-400 mt-1">Select a role</p>}
                            </div>
                            {form.name && form.role && (
                                <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                                    <p className="font-bold text-orange-700 text-xs uppercase tracking-wider mb-2">Summary</p>
                                    <p className="text-sm font-bold text-gray-800">{form.name}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{form.role} · {form.phone} · {form.address}</p>
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
                            {loading && <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>}
                            {isEdit ? 'Save Changes' : 'Add Staff'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

function StaffCard({ staff, onEdit, onToggle, onDelete }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const badge      = roleBadge[staff.role];

    return (
        <div className={`bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-200 ${!staff.is_active ? 'opacity-55' : ''}`}>
            <div className="flex items-start justify-between px-5 pt-5 pb-3">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {staff.profile_url ? <img src={`${import.meta.env.VITE_API_BASE_URL}${staff.profile_url}`} className="w-full h-full object-cover" alt={staff.name} /> : <FaUser className="text-gray-300 text-lg" />}
                    </div>
                    <div>
                        <p className="text-sm font-black text-gray-900">{staff.name}</p>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: badge.bg, color: badge.text }}>{staff.role}</span>
                    </div>
                </div>
                <div className="relative">
                    <button onClick={() => setMenuOpen(p => !p)} className="p-1.5 text-gray-300 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        <FaEllipsisV className="text-xs" />
                    </button>
                    {menuOpen && (
                        <div className="absolute right-0 top-8 w-40 bg-white border border-gray-100 rounded-xl shadow-xl z-20 py-1">
                            <button onClick={() => { onEdit(staff); setMenuOpen(false); }} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                                <FaEdit className="text-xs text-gray-300" /> Edit
                            </button>
                            <button onClick={() => { onToggle(staff); setMenuOpen(false); }} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                                {staff.is_active ? <><FaToggleOff className="text-xs text-gray-300" /> Set Inactive</> : <><FaToggleOn className="text-xs text-green-500" /> Set Active</>}
                            </button>
                            <button onClick={() => { onDelete(staff); setMenuOpen(false); }} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50">
                                <FaTrash className="text-xs" /> Remove
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="px-5 pb-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-400"><FaPhone className="text-gray-200 flex-shrink-0" /> {staff.phone}</div>
                <div className="flex items-center gap-2 text-xs text-gray-400"><FaMapMarkerAlt className="text-gray-200 flex-shrink-0" /> {staff.address}</div>
            </div>

            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <span className={`text-xs font-bold flex items-center gap-1.5 ${staff.is_active ? 'text-green-600' : 'text-gray-400'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${staff.is_active ? 'bg-green-400' : 'bg-gray-300'}`} />
                    {staff.is_active ? 'Active' : 'Inactive'}
                </span>
                <button onClick={() => onToggle(staff)}
                    className={`text-xs font-semibold px-3 py-1 rounded-lg border transition-colors
                        ${staff.is_active ? 'border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-500 hover:bg-red-50' : 'border-green-200 text-green-600 hover:bg-green-50'}`}>
                    {staff.is_active ? 'Deactivate' : 'Activate'}
                </button>
            </div>
        </div>
    );
}

export default function OperatorStaff() {
    const [staff,      setStaff]      = useState([]);
    const [loading,    setLoading]    = useState(true);
    const [error,      setError]      = useState(null);
    const [showModal,  setShowModal]  = useState(false);
    const [editStaff,  setEditStaff]  = useState(null);
    const [search,     setSearch]     = useState('');
    const [filterRole, setFilterRole] = useState('All');

    useEffect(() => { fetchStaff(); }, []);

    const fetchStaff = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getAllStaff();
            setStaff(res.data.data ?? []);
        } catch (err) {
            setError(err?.response?.data?.message ?? 'Failed to load staff.');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = (saved, isEdit) => {
        if (isEdit) {
            setStaff(prev => prev.map(s => s.staff_id === saved.staff_id ? saved : s));
        } else {
            setStaff(prev => [saved, ...prev]);
        }
    };

    const openAdd  = ()  => { setEditStaff(null); setShowModal(true); };
    const openEdit = (s) => { setEditStaff(s);    setShowModal(true); };

    const handleToggle = async (member) => {
        try {
            const res = await toggleStaffApi(member.staff_id);
            const updated = res.data.data;
            setStaff(prev => prev.map(s => s.staff_id === member.staff_id ? { ...s, is_active: updated.is_active } : s));
            toast.success(`${member.name} set to ${updated.is_active ? 'Active' : 'Inactive'}.`);
        } catch (err) {
            toast.error(err?.response?.data?.message ?? 'Failed to update status.');
        }
    };

    const handleDelete = (member) => {
        toast.custom((t) => (
            <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} bg-white border border-red-100 shadow-lg rounded-xl max-w-sm w-full p-4`}>
                <p className="text-sm font-bold text-gray-900">Remove {member.name}?</p>
                <p className="text-xs text-gray-400 mt-1">They will be removed from all schedules.</p>
                <div className="flex gap-2 mt-3">
                    <button onClick={async () => {
                        try {
                            await deleteStaffApi(member.staff_id);
                            setStaff(prev => prev.filter(s => s.staff_id !== member.staff_id));
                            toast.dismiss(t.id);
                            toast.success(`${member.name} removed.`);
                        } catch (err) {
                            toast.dismiss(t.id);
                            toast.error(err?.response?.data?.message ?? 'Failed to delete.');
                        }
                    }} className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600">Remove</button>
                    <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-200">Cancel</button>
                </div>
            </div>
        ), { duration: 8000, position: 'top-center' });
    };

    const filtered = staff
        .filter(s => { const q = search.toLowerCase(); return s.name.toLowerCase().includes(q) || s.phone.includes(q) || s.address.toLowerCase().includes(q); })
        .filter(s => filterRole === 'All' || s.role === filterRole);

    const counts = {
        drivers:    staff.filter(s => s.role === 'Driver').length,
        conductors: staff.filter(s => s.role === 'Conductor').length,
        counter:    staff.filter(s => s.role === 'Counter Staff').length,
        inactive:   staff.filter(s => !s.is_active).length,
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {showModal && <StaffModal onClose={() => { setShowModal(false); setEditStaff(null); }} onSave={handleSave} editStaff={editStaff} />}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900" style={{ letterSpacing: '-0.02em' }}>Staff</h1>
                        <p className="text-sm text-gray-400 mt-0.5">
                            {counts.drivers} drivers · {counts.conductors} conductors · {counts.counter} counter staff
                            {counts.inactive > 0 && <span className="ml-2 text-amber-500 font-semibold">· {counts.inactive} inactive</span>}
                        </p>
                    </div>
                    <button onClick={openAdd} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors active:scale-95">
                        <FaPlus className="text-xs" /> Add Staff
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
                        <input type="text" placeholder="Search by name, phone, or address..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-8 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-orange-300" />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {['All', 'Driver', 'Conductor', 'Counter Staff'].map(r => (
                            <button key={r} onClick={() => setFilterRole(r)} className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all whitespace-nowrap ${filterRole === r ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>{r}</button>
                        ))}
                    </div>
                </div>

                {loading && (
                    <div className="flex flex-col items-center justify-center py-24 gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center">
                            <FaUserTie className="text-orange-400 text-2xl animate-bounce" />
                        </div>
                        <p className="text-gray-400 text-xs font-bold tracking-widest uppercase">Loading staff...</p>
                    </div>
                )}

                {!loading && error && (
                    <div className="bg-red-50 border border-red-100 text-red-500 rounded-2xl px-6 py-4 text-sm font-semibold flex items-center justify-between">
                        <span>{error}</span>
                        <button onClick={fetchStaff} className="text-xs font-bold underline">Retry</button>
                    </div>
                )}

                {!loading && !error && filtered.length === 0 && (
                    <div className="text-center py-24">
                        <FaUserTie className="text-gray-200 text-5xl mx-auto mb-4" />
                        <p className="text-gray-400 font-semibold text-sm">
                            {search || filterRole !== 'All' ? 'No staff match your filters.' : 'No staff added yet.'}
                        </p>
                        {!search && filterRole === 'All' && (
                            <button onClick={openAdd} className="mt-3 text-orange-500 text-sm font-bold hover:text-orange-600">Add your first staff member</button>
                        )}
                    </div>
                )}

                {!loading && !error && filtered.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filtered.map(s => <StaffCard key={s.staff_id} staff={s} onEdit={openEdit} onToggle={handleToggle} onDelete={handleDelete} />)}
                    </div>
                )}
            </div>
        </div>
    );
}