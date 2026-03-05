import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    FaBus, FaCalendarAlt, FaUsers, FaBars,
    FaTimes, FaSignOutAlt, FaChevronDown
} from 'react-icons/fa';
import { MdDashboard, MdDirectionsBus } from 'react-icons/md';

// Import your helper and API
import getUserRole from '../protected/getRole';
import { getUser } from '../services/api';

const navLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: MdDashboard, path: '/admin/dashboard' },
    { id: 'buses', label: 'My Buses', icon: FaBus, path: '/admin/buses' },
    { id: 'schedules', label: 'Schedules', icon: FaCalendarAlt, path: '/admin/schedules' },
    { id: 'staff', label: 'Staff', icon: FaUsers, path: '/admin/staffs' },
];

function Avatar({ name, size = 'sm' }) {
    const initials = (name ?? '?').trim().split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('');
    const cls = size === 'sm' ? 'w-7 h-7 text-[11px]' : 'w-9 h-9 text-xs';
    return (
        <div className={`${cls} rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white font-black flex items-center justify-center flex-shrink-0 shadow-md shadow-orange-200/60 select-none`}>
            {initials}
        </div>
    );
}

export default function OperatorNavbar() {
    const location = useLocation();
    const navigate = useNavigate();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [userMenu, setUserMenu] = useState(false);
    const [user, setUser] = useState(null);
    const [authReady, setAuthReady] = useState(false);

    const menuRef = useRef(null);

    // ── Authentication & Data Fetching ──────────────────────────────────────
    useEffect(() => {
        const checkAuthAndFetch = async () => {
            const role = getUserRole(); // Use your helper
            if (!role==="operator") {
                navigate('/login');
                return;
            }

            try {
                const res = await getUser();
                setUser(res.data);
            } catch (err) {
                // If API fails, we assume session is dead
                localStorage.removeItem('token');
                navigate('/login');
            } finally {
                setAuthReady(true);
            }
        };

        checkAuthAndFetch();
    }, [location.pathname, navigate]);

    // ── Menu Control ────────────────────────────────────────────────────────
    useEffect(() => { setMobileOpen(false); setUserMenu(false); }, [location.pathname]);

    useEffect(() => {
        const fn = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setUserMenu(false); };
        document.addEventListener('mousedown', fn);
        return () => document.removeEventListener('mousedown', fn);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const isActive = (path) => location.pathname.startsWith(path);

    return (
        <nav className="bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-5 sm:px-8">
                <div className="flex items-center justify-between h-16 gap-8">

                    {/* Logo */}
                    <Link to="/admin/dashboard" className="flex items-center gap-3 flex-shrink-0 group">
                        <div className="relative">
                            <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-[10px] flex items-center justify-center shadow-lg shadow-orange-300/50 group-hover:scale-105 transition-all duration-300">
                                <MdDirectionsBus className="text-white text-lg" />
                            </div>
                        </div>
                        <div className="leading-none">
                            <span className="block text-[17px] font-black tracking-tight text-gray-900">
                                Yatra<span className="text-orange-500">Sathi</span>
                            </span>
                            <span className="block text-[9px] font-bold text-gray-400 tracking-[0.15em] uppercase mt-0.5">
                                {user?.role === 'admin' ? 'Admin Panel' : 'Operator Panel'}
                            </span>
                        </div>
                    </Link>

                    {/* Desktop nav links */}
                    <div className="hidden md:flex items-center gap-1 flex-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.id}
                                to={link.path}
                                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all duration-200
                                    ${isActive(link.path)
                                        ? 'text-orange-500 bg-orange-50'
                                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                            >
                                <link.icon className="text-base flex-shrink-0" />
                                {link.label}
                                {isActive(link.path) && (
                                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-orange-500 rounded-full" />
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* User Dropdown */}
                    <div className="flex items-center gap-2.5">
                        {!authReady ? (
                            <div className="hidden md:block w-28 h-9 bg-gray-100 rounded-xl animate-pulse" />
                        ) : (
                            <div className="relative hidden md:block" ref={menuRef}>
                                <button
                                    onClick={() => setUserMenu(p => !p)}
                                    className={`flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border-2 transition-all duration-200
                                        ${userMenu ? 'border-orange-300 bg-orange-50' : 'border-gray-200 hover:border-orange-200'}`}
                                >
                                    <Avatar name={user?.username} size="sm" />
                                    <div className="text-left leading-none">
                                        <p className="text-[13px] font-bold text-gray-700 max-w-[90px] truncate">
                                            {user?.username?.split(' ')[0]}
                                        </p>
                                        <p className="text-[10px] text-gray-400 capitalize mt-0.5">
                                            {user?.role ?? 'operator'}
                                        </p>
                                    </div>
                                    <FaChevronDown className={`text-[10px] text-gray-400 transition-transform ${userMenu ? 'rotate-180' : ''}`} />
                                </button>

                                {userMenu && (
                                    <div className="absolute right-0 top-[calc(100%+8px)] w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                                        <div className="px-4 py-4 bg-orange-50/50 border-b border-orange-100">
                                            <div className="flex items-center gap-3">
                                                <Avatar name={user?.username} size="md" />
                                                <div className="min-w-0">
                                                    <p className="text-sm font-black text-gray-900 truncate leading-tight">{user?.username}</p>
                                                    <p className="text-[10px] text-gray-400 truncate mt-0.5">{user?.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="py-1.5">
                                            <Link to="/" className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-gray-600 hover:bg-orange-50 hover:text-orange-600 font-semibold">
                                                <FaBus className="text-orange-400 text-[10px]" /> View Public Site
                                            </Link>
                                            <Link to="/admin/account" className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-gray-600 hover:bg-orange-50 hover:text-orange-600 font-semibold">
                                                <FaUsers className="text-orange-400 text-[10px]" /> My Profile
                                            </Link>
                                        </div>
                                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-red-500 hover:bg-red-50 font-semibold border-t">
                                            <FaSignOutAlt className="text-red-400 text-[10px]" /> Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Mobile Toggle */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl border-2 border-gray-200"
                        >
                            {mobileOpen ? <FaTimes /> : <FaBars />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <div className="md:hidden pt-1 pb-5 space-y-2">
                        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-2">
                            {navLinks.map((link) => (
                                <Link key={link.id} to={link.path} className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-bold ${isActive(link.path) ? 'bg-orange-500 text-white' : 'text-gray-600'}`}>
                                    <link.icon className="text-base" /> {link.label}
                                </Link>
                            ))}
                        </div>
                        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-2">
                            <Link to="/admin/account" className="flex items-center gap-2.5 px-4 py-3 text-sm font-bold text-gray-600"><FaUsers /> Profile</Link>
                            <Link to="/" className="flex items-center gap-2.5 px-4 py-3 text-sm font-bold text-gray-600"><FaBus /> Public Site</Link>
                            <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-bold text-red-500"><FaSignOutAlt /> Sign Out</button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}