import React, { useState, useEffect } from 'react';
import {
    FaUser, FaPhone, FaEnvelope, FaCheckCircle,
    FaSpinner, FaPen, FaSignOutAlt, FaShieldAlt,
    FaTicketAlt, FaChevronRight
} from 'react-icons/fa';
import { MdDirectionsBus } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { getUser, updateUserApi } from '../../services/api';
import toast from 'react-hot-toast';

function Avatar({ name, size = 'lg' }) {
    console.log(name)
    const initials = (name ?? '??')
        .trim()
        .split(' ')
        .slice(0, 2)
        .map(w => w[0]?.toUpperCase() ?? '')
        .join('');

    const sizecls = size === 'lg'
        ? 'w-20 h-20 text-4xl text-[#f99b22]'
        : 'w-10 h-10 text-sm text-black';

    return (
        <div className={`${sizecls} rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-white font-black flex items-center justify-center shadow-lg shadow-orange-200 select-none flex-shrink-0`}>
            user
        </div>
    );
}

export default function Account() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ username: '', email: '', phone_no: '' });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getUser();
                const data = res.data;
                setUser(data);
                setForm({
                    username: data.username ?? '',
                    email: data.email ?? '',
                    phone_no: data.phone_no ?? '',
                });
            } catch {
                toast.error('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

    const validate = () => {
        const e = {};
        if (!form.username.trim()) e.username = 'Name is required';
        if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
        if (!form.phone_no.trim() || !/^\d{10}$/.test(form.phone_no)) e.phone_no = 'Valid 10-digit number required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;
        setSaving(true);
        try {
            const res = await updateUserApi(form);
            setUser(prev => ({ ...prev, ...form }));
            toast.success('Profile updated successfully');
            setEditing(false);
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Update failed');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setForm({
            username: user.username ?? '',
            email: user.email ?? '',
            phone_no: user.phone_no ?? '',
        });
        setErrors({});
        setEditing(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const inputCls = (err) =>
        `w-full px-4 py-2.5 border-2 rounded-xl text-sm text-gray-800 placeholder-gray-400 bg-white focus:outline-none transition-all
        ${err ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-orange-400'}`;

    const readonlyCls = `w-full px-4 py-2.5 border-2 border-gray-100 rounded-xl text-sm text-gray-600 bg-gray-50 select-none cursor-default`;

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <FaSpinner className="animate-spin text-orange-400 text-2xl" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">

            {/* Header banner */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-2xl mx-auto px-4 py-6">

                    {/* Profile hero */}
                    <div className="flex items-center gap-5">
                        <Avatar name={user?.username} size="lg" />
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-xl font-black text-gray-900 truncate">{user?.username ?? '—'}</h1>
                                {user?.role && (
                                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border
                                        ${user.role === 'admin'
                                            ? 'bg-purple-50 text-purple-600 border-purple-100'
                                            : 'bg-orange-50 text-orange-500 border-orange-100'}`}>
                                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-400 mt-0.5 truncate">{user?.email ?? '—'}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{user?.phone_no ?? '—'}</p>
                        </div>
                        {!editing && (
                            <button
                                onClick={() => setEditing(true)}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-orange-200 text-orange-500 bg-orange-50 hover:bg-orange-100 font-bold text-xs transition-all flex-shrink-0"
                            >
                                <FaPen className="text-[10px]" /> Edit
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

                {/* Edit / View profile card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                            {editing ? 'Edit Profile' : 'Profile Info'}
                        </p>
                        {editing && (
                            <span className="text-[10px] font-bold text-orange-400 bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-full">
                                Editing mode
                            </span>
                        )}
                    </div>

                    <div className="space-y-4">

                        {/* Name */}
                        <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1.5 flex items-center gap-1.5">
                                <FaUser className="text-orange-400 text-[10px]" /> Full Name {editing && '*'}
                            </label>
                            {editing ? (
                                <>
                                    <input
                                        className={inputCls(errors.username)}
                                        value={form.username}
                                        onChange={e => set('username', e.target.value)}
                                        placeholder="Your full name"
                                    />
                                    {errors.username && <p className="text-xs text-red-400 mt-1">{errors.username}</p>}
                                </>
                            ) : (
                                <p className={readonlyCls}>{user?.username || '—'}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1.5 flex items-center gap-1.5">
                                <FaEnvelope className="text-orange-400 text-[10px]" /> Email {editing && '*'}
                            </label>
                            {editing ? (
                                <>
                                    <input
                                        className={inputCls(errors.email)}
                                        value={form.email}
                                        onChange={e => set('email', e.target.value)}
                                        placeholder="you@example.com"
                                    />
                                    {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                                </>
                            ) : (
                                <p className={readonlyCls}>{user?.email || '—'}</p>
                            )}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1.5 flex items-center gap-1.5">
                                <FaPhone className="text-orange-400 text-[10px]" /> Phone Number {editing && '*'}
                            </label>
                            {editing ? (
                                <>
                                    <input
                                        className={inputCls(errors.phone_no)}
                                        value={form.phone_no}
                                        onChange={e => set('phone_no', e.target.value)}
                                        placeholder="10-digit number"
                                        maxLength={10}
                                    />
                                    {errors.phone_no && <p className="text-xs text-red-400 mt-1">{errors.phone_no}</p>}
                                </>
                            ) : (
                                <p className={readonlyCls}>{user?.phone_no || '—'}</p>
                            )}
                        </div>
                    </div>

                    {/* Edit action buttons */}
                    {editing && (
                        <div className="flex gap-3 mt-5">
                            <button
                                onClick={handleCancel}
                                className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-gray-500 font-bold text-sm hover:bg-gray-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 disabled:opacity-60 text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
                            >
                                {saving
                                    ? <><FaSpinner className="animate-spin text-xs" /> Saving...</>
                                    : <><FaCheckCircle className="text-xs" /> Save Changes</>
                                }
                            </button>
                        </div>
                    )}
                </div>

                {/* Quick links */}
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-5 pt-5 pb-3">Quick Links</p>
                    {[
                        { icon: FaTicketAlt, label: 'My Bookings', sub: 'View all your trips', path: '/bookings', color: 'text-orange-400 bg-orange-50' },
                        { icon: MdDirectionsBus, label: 'Book a Ticket', sub: 'Search & book a new bus', path: '/bus-booking', color: 'text-blue-400 bg-blue-50' },
                    ].map((item, i, arr) => (
                        <button
                            key={item.label}
                            onClick={() => navigate(item.path)}
                            className={`w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors text-left
                                ${i < arr.length - 1 ? 'border-b border-gray-100' : ''}`}
                        >
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                                <item.icon className="text-sm" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-800">{item.label}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
                            </div>
                            <FaChevronRight className="text-gray-300 text-xs flex-shrink-0" />
                        </button>
                    ))}
                </div>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-red-200 text-red-400 hover:bg-red-50 hover:border-red-300 font-bold text-sm transition-all shadow-sm"
                >
                    <FaSignOutAlt /> Sign Out
                </button>

                <p className="text-center text-[10px] text-gray-300 pb-4">
                    YatraYog Bus Booking · v1.0.0
                </p>
            </div>
        </div>
    );
}