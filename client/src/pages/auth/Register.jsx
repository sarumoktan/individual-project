import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
    FaBus, FaUser, FaEnvelope, FaLock, FaPhone,
    FaEye, FaEyeSlash, FaBuilding, FaIdCard, FaMapMarkerAlt,
} from 'react-icons/fa';

import { registerApi } from '../../services/api';

// ── helpers ───────────────────────────────────────────────────────────────────
function Field({ label, error, children }) {
    return (
        <div className="space-y-1">
            <label className="block text-[11px] font-bold text-white/50 uppercase tracking-widest">{label}</label>
            {children}
            {error && <p className="text-[11px] text-red-400 font-semibold">{error}</p>}
        </div>
    );
}

function Input({ icon: Icon, type = 'text', placeholder, value, onChange, error }) {
    return (
        <div className="relative">
            {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-xs pointer-events-none" />}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`w-full ${Icon ? 'pl-9' : 'pl-3'} pr-3 py-2.5 rounded-xl text-sm text-white placeholder-white/25 bg-white/10 border focus:outline-none transition-all
                    ${error
                        ? 'border-red-400/60 bg-red-400/10'
                        : 'border-white/15 focus:border-orange-400/70 focus:bg-white/15'}`}
            />
        </div>
    );
}

function PasswordInput({ placeholder, value, onChange, error }) {
    const [show, setShow] = useState(false);
    return (
        <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-xs pointer-events-none" />
            <input
                type={show ? 'text' : 'password'}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`w-full pl-9 pr-9 py-2.5 rounded-xl text-sm text-white placeholder-white/25 bg-white/10 border focus:outline-none transition-all
                    ${error
                        ? 'border-red-400/60 bg-red-400/10'
                        : 'border-white/15 focus:border-orange-400/70 focus:bg-white/15'}`}
            />
            <button type="button" onClick={() => setShow(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors">
                {show ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
            </button>
        </div>
    );
}

// ── Passenger form ────────────────────────────────────────────────────────────
function PassengerForm({role}) {
    const navigate = useNavigate();
    const [form, setForm]     = useState({ fullName: '', email: '', phone: '', password: '', confirm: ''});
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
    console.log("this is role", role)

    const validate = () => {
        const e = {};
        if (!form.fullName.trim())                                   e.fullName = 'Required';
        if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email    = 'Valid email required';
        if (!form.phone.trim() || form.phone.length < 10)            e.phone    = 'Valid 10-digit number required';
        if (!form.password || form.password.length < 6)              e.password = 'Min 6 characters';
        if (form.password !== form.confirm)                          e.confirm  = 'Passwords do not match';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        setApiError('');
        try {
            const res = await registerApi({...form, role : role})
            if(res?.data?.success){
                toast.success("registration successfull")
                navigate('/login');
            }
        } catch (err) {
            setApiError(err?.response?.data?.message || 'Registration failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            {apiError && (
                <div className="bg-red-500/20 border border-red-400/30 rounded-xl px-3 py-2.5 text-xs text-red-300 font-semibold">
                    {apiError}
                </div>
            )}
            <Field label="Full Name" error={errors.fullName}>
                <Input icon={FaUser} placeholder="Hari Bahadur Thapa" value={form.fullName} onChange={e => set('fullName', e.target.value)} error={errors.fullName} />
            </Field>
            <Field label="Email" error={errors.email}>
                <Input icon={FaEnvelope} type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} error={errors.email} />
            </Field>
            <Field label="Phone" error={errors.phone}>
                <Input icon={FaPhone} type="tel" placeholder="98XXXXXXXX" value={form.phone} onChange={e => set('phone', e.target.value.slice(0, 10))} error={errors.phone} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
                <Field label="Password" error={errors.password}>
                    <PasswordInput placeholder="Min 6 chars" value={form.password} onChange={e => set('password', e.target.value)} error={errors.password} />
                </Field>
                <Field label="Confirm" error={errors.confirm}>
                    <PasswordInput placeholder="Repeat" value={form.confirm} onChange={e => set('confirm', e.target.value)} error={errors.confirm} />
                </Field>
            </div>
            <button type="submit" disabled={loading}
                className="w-full mt-1 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] disabled:opacity-60 text-white font-black py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
                {loading
                    ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Creating...</>
                    : 'Create Account'
                }
            </button>
        </form>
    );
}


// ── Page ──────────────────────────────────────────────────────────────────────
export default function SignUp() {
    const [activeTab, setActiveTab] = useState('');

    return (
        <div className="min-h-screen relative flex items-center justify-center px-4 py-10 overflow-hidden">

            {/* Background image */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1600&q=80')" }}
            />
            {/* Dark + blur overlay */}
            <div className="absolute inset-0 backdrop-blur-sm bg-gray-950/60" />

            {/* Card */}
            <div className="relative z-10 w-full max-w-md">

                {/* Logo */}
                <div className="flex items-center justify-center gap-2.5 mb-6">
                    <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                        <FaBus className="text-white text-sm" />
                    </div>
                    <span className="font-black text-white text-lg tracking-tight">
                        Yatra<span className="text-orange-400">Nepal</span>
                    </span>
                </div>

                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl shadow-2xl overflow-hidden">

                    {/* Header */}
                    <div className="px-6 pt-6 pb-4">
                        <h1 className="text-xl font-black text-white" style={{ letterSpacing: '-0.02em' }}>Create an account</h1>
                        <p className="text-white/40 text-xs mt-1">
                            Already have one?{' '}
                            <Link to="/login" className="text-orange-400 font-bold hover:text-orange-300 transition-colors">Sign in</Link>
                        </p>
                    </div>

                    {/* Tab switcher */}
                    <div className="px-6 mb-5">
                        <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
                            {[
                                { key: 'passenger', label: 'Passenger' },
                                { key: 'operator',  label: 'Bus Operator' },
                            ].map(t => (
                                <button
                                    key={t.key}
                                    onClick={() => setActiveTab(t.key)}
                                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all duration-200
                                        ${activeTab === t.key
                                            ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                                            : 'text-white/40 hover:text-white/70'}`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Form area */}
                    <div className="px-6 pb-6">
                        <PassengerForm role={activeTab} />
                    </div>
                </div>

                <p className="text-center text-white/25 text-[11px] mt-4">
                    By signing up you agree to our{' '}
                    <a href="#" className="text-white/40 hover:text-orange-400 transition-colors">Terms</a>
                    {' '}and{' '}
                    <a href="#" className="text-white/40 hover:text-orange-400 transition-colors">Privacy Policy</a>.
                </p>
            </div>
        </div>
    );
}