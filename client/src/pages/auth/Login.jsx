import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBus, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { loginApi } from '../../services/api';
import toast from 'react-hot-toast';
import getUserRole from '../../protected/getRole';

export default function Login() {
    const navigate = useNavigate();
    const [form,     setForm]     = useState({ email: '', password: '' });
    const [errors,   setErrors]   = useState({});
    const [loading,  setLoading]  = useState(false);
    const [apiError, setApiError] = useState('');
    const [showPass, setShowPass] = useState(false);

    const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

    const validate = () => {
        const e = {};
        if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email    = 'Enter a valid email';
        if (!form.password || form.password.length < 6)              e.password = 'Min 6 characters';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        setApiError('');
        try {
            const res = await loginApi(form);
            if(res?.data?.success){
                toast.success("redirecting to dashboard..")
            }

            // Store token however your app manages auth
            localStorage.setItem('token',res.data.token)

            const role = await getUserRole()
            
            if(role === "operator"){
                navigate('/admin/dashboard')
            }else{
                navigate('/');
            }
        } catch (err) {
            setApiError(err?.response?.data?.message ?? 'Invalid email or password.');

        } finally {
            setLoading(false);
        }
    };

    const inputBase = (err) =>
        `w-full pl-9 pr-3 py-2.5 rounded-xl text-sm text-white placeholder-white/25 bg-white/10 border focus:outline-none transition-all
        ${err ? 'border-red-400/60 bg-red-400/10' : 'border-white/15 focus:border-orange-400/70 focus:bg-white/15'}`;

    return (
        <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden">

            {/* Background */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1600&q=80')" }}
            />
            <div className="absolute inset-0 backdrop-blur-sm bg-gray-950/60" />

            {/* Card */}
            <div className="relative z-10 w-full max-w-sm">

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

                    <div className="px-6 pt-6 pb-2">
                        <h1 className="text-xl font-black text-white" style={{ letterSpacing: '-0.02em' }}>Sign in</h1>
                        <p className="text-white/40 text-xs mt-1">
                            No account?{' '}
                            <Link to="/register" className="text-orange-400 font-bold hover:text-orange-300 transition-colors">Create one</Link>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="px-6 pb-6 pt-4 space-y-4">

                        {apiError && (
                            <div className="bg-red-500/20 border border-red-400/30 rounded-xl px-3 py-2.5 text-xs text-red-300 font-semibold">
                                {apiError}
                            </div>
                        )}

                        {/* Email */}
                        <div className="space-y-1">
                            <label className="block text-[11px] font-bold text-white/50 uppercase tracking-widest">Email</label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-xs pointer-events-none" />
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={form.email}
                                    onChange={e => set('email', e.target.value)}
                                    className={inputBase(errors.email)}
                                />
                            </div>
                            {errors.email && <p className="text-[11px] text-red-400 font-semibold">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <label className="block text-[11px] font-bold text-white/50 uppercase tracking-widest">Password</label>
                                <a href="#" className="text-[11px] text-orange-400/80 font-semibold hover:text-orange-400 transition-colors">
                                    Forgot?
                                </a>
                            </div>
                            <div className="relative">
                                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-xs pointer-events-none" />
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    placeholder="Your password"
                                    value={form.password}
                                    onChange={e => set('password', e.target.value)}
                                    className={`${inputBase(errors.password)} pr-9`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(p => !p)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                                >
                                    {showPass ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-[11px] text-red-400 font-semibold">{errors.password}</p>}
                        </div>

                        {/* Remember me */}
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input type="checkbox" className="w-3.5 h-3.5 rounded accent-orange-500 cursor-pointer" />
                            <span className="text-xs text-white/40 font-medium">Keep me signed in</span>
                        </label>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.98] disabled:opacity-60 text-white font-black py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
                        >
                            {loading
                                ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Signing in...</>
                                : 'Sign In'
                            }
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-px bg-white/10" />
                            <span className="text-[10px] text-white/25 font-semibold uppercase tracking-wider">or</span>
                            <div className="flex-1 h-px bg-white/10" />
                        </div>

                        {/* Guest */}
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/50 hover:text-white/80 font-semibold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2"
                        >
                            <FaBus className="text-[10px]" />
                            Browse buses without signing in
                        </button>
                    </form>
                </div>

                <p className="text-center text-white/25 text-[11px] mt-4">
                    By signing in you agree to our{' '}
                    <a href="#" className="text-white/40 hover:text-orange-400 transition-colors">Terms</a>
                    {' '}and{' '}
                    <a href="#" className="text-white/40 hover:text-orange-400 transition-colors">Privacy Policy</a>.
                </p>
            </div>
        </div>
    );
}