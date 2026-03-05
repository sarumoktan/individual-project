import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    FaBus, FaBars, FaTimes, FaUser,
    FaSignOutAlt, FaTicketAlt, FaChevronDown
} from 'react-icons/fa';
import { MdDirectionsBus } from 'react-icons/md';

// Import your helper and API
import getUserRole from '../protected/getRole';
import { getUser } from '../services/api';

const NavigationLinks = [
    { ID: 1, Title: 'Home', URL: '/' },
    { ID: 2, Title: 'My Bookings', URL: '/bookings' },
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

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [userMenu, setUserMenu] = useState(false);

    // Auth State
    const [user, setUser] = useState(null);
    const [hasRole, setHasRole] = useState(false);

    const menuRef = useRef(null);

    // ── Logic: Update Auth State ───────────────────────────────────────────
    useEffect(() => {
        const role = getUserRole(); // Using your helper

        if (role=== "passenger") {
            setHasRole(true);
            // If we have a role, fetch the actual user details for the Avatar/Name
            getUser().then(res => setUser(res.data)).catch(() => setUser(null));
        } else {
            setHasRole(false);
            setUser(null);
        }
    }, [location.pathname]); // Re-check whenever route changes

    // ── UI Effects ────────────────────────────────────────────────────────
    useEffect(() => { setIsOpen(false); setUserMenu(false); }, [location.pathname]);

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 12);
        window.addEventListener('scroll', fn);
        return () => window.removeEventListener('scroll', fn);
    }, []);

    useEffect(() => {
        const fn = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setUserMenu(false); };
        document.addEventListener('mousedown', fn);
        return () => document.removeEventListener('mousedown', fn);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (location.pathname.startsWith('/admin')) return null;

    return (
        <header className={`sticky top-0 left-0 w-full z-50 transition-all duration-500
            ${scrolled ? 'bg-white/98 backdrop-blur-xl shadow-sm' : 'bg-white/90 backdrop-blur-xl border-b border-gray-100'}`}
        >
            <nav className="max-w-6xl mx-auto px-5 sm:px-8">
                <div className="flex items-center justify-between h-16 gap-8">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
                        <div className="w-9 h-9 bg-orange-500 rounded-[10px] flex items-center justify-center shadow-lg shadow-orange-300/50">
                            <FaBus className="text-white text-sm" />
                        </div>
                        <span className="block text-[17px] font-black text-gray-900">
                            Yatra<span className="text-orange-500">Nepal</span>
                        </span>
                    </Link>

                    {/* Desktop Links */}
                    <ul className="hidden md:flex items-center gap-1 flex-1">
                        {NavigationLinks.map((nav) => (
                            <li key={nav.ID}>
                                <Link to={nav.URL} className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all ${location.pathname === nav.URL ? 'text-orange-500 bg-orange-50' : 'text-gray-500 hover:text-gray-900'}`}>
                                    {nav.Title}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Right Side */}
                    <div className="flex items-center gap-2.5">
                        <Link to="/available-trips" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-orange-500 text-white text-[13px] font-bold rounded-xl shadow-md">
                            <MdDirectionsBus /> Book Now
                        </Link>

                        {hasRole ? (
                            <div className="relative" ref={menuRef}>
                                <button onClick={() => setUserMenu(!userMenu)} className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border-2 border-gray-200">
                                    <Avatar name={user?.username} size="sm" />
                                    <FaChevronDown className={`text-[10px] transition-transform ${userMenu ? 'rotate-180' : ''}`} />
                                </button>

                                {userMenu && (
                                    <div className="absolute right-0 top-[calc(100%+8px)] w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                                        <div className="px-4 py-4 bg-orange-50/50 border-b border-orange-100">
                                            <p className="text-sm font-black text-gray-900 truncate">{user?.username || 'User'}</p>
                                            <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
                                        </div>
                                        <div className="py-1.5">
                                            <Link to="/account" className="flex items-center gap-3 px-4 py-2.5 text-[13px] hover:bg-orange-50 hover:text-orange-600 font-semibold"><FaUser /> My Account</Link>
                                            <Link to="/bookings" className="flex items-center gap-3 px-4 py-2.5 text-[13px] hover:bg-orange-50 hover:text-orange-600 font-semibold"><FaTicketAlt /> My Bookings</Link>
                                        </div>
                                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-red-500 hover:bg-red-50 font-semibold border-t"><FaSignOutAlt /> Sign Out</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="px-4 py-2 text-[13px] font-bold text-gray-600 hover:text-orange-500">Sign In</Link>
                        )}

                        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden w-9 h-9 flex items-center justify-center border-2 border-gray-200 rounded-xl">
                            {isOpen ? <FaTimes /> : <FaBars />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden pt-1 pb-5 space-y-2">
                        <div className="bg-gray-50 rounded-2xl p-2">
                            {NavigationLinks.map((nav) => (
                                <Link key={nav.ID} to={nav.URL} className="flex items-center px-4 py-3 rounded-xl text-sm font-bold text-gray-600">{nav.Title}</Link>
                            ))}
                        </div>
                        {hasRole ? (
                            <button onClick={handleLogout} className="w-full px-4 py-3 text-red-500 font-bold text-left">Sign Out</button>
                        ) : (
                            <Link to="/login" className="block w-full py-3 bg-gray-900 text-white rounded-xl text-center font-bold">Sign In</Link>
                        )}
                    </div>
                )}
            </nav>
        </header>
    );
}