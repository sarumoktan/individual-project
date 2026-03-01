import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBus, FaCalendarAlt, FaUsers, FaBars, FaTimes, FaChevronDown, FaBell, FaUserCircle } from 'react-icons/fa';
import { MdDashboard, MdDirectionsBus } from 'react-icons/md';

const navLinks = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: MdDashboard,
        path: '/admin/dashboard',
        sub: null,
    },
    {
        id: 'buses',
        label: 'My Buses',
        icon: FaBus,
        path: '/admin/buses',

    },
    {
        id: 'schedules',
        label: 'Schedules',
        icon: FaCalendarAlt,
        path: '/admin/schedules',
    },
    {
        id: 'staff',
        label: 'Staff',
        icon: FaUsers,
        path: '/admin/staffs',
    },
];

export default function OperatorNavbar() {
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);

    const isActive = (path) => location.pathname.startsWith(path);

    const toggleDropdown = (id) => {
        setOpenDropdown(prev => prev === id ? null : id);
    };

    return (
        <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link to="/admin/dashboard" className="flex items-center gap-2.5 flex-shrink-0">
                        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                            <MdDirectionsBus className="text-white text-lg" />
                        </div>
                        <div className="leading-none">
                            <span className="font-black text-gray-900 text-base tracking-tight">Yatra</span>
                            <span className="font-black text-orange-500 text-base tracking-tight">Sathi</span>
                            <p className="text-[9px] text-gray-400 font-medium tracking-widest uppercase">Operator Panel</p>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <div key={link.id} className="relative">
                                {link.sub ? (
                                    <button
                                        onClick={() => toggleDropdown(link.id)}
                                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors duration-150
                                            ${isActive(link.path)
                                                ? 'bg-orange-50 text-orange-600'
                                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                            }`}
                                    >
                                        <link.icon className="text-base" />
                                        {link.label}
                                        <FaChevronDown
                                            className={`text-[10px] transition-transform duration-200 ${openDropdown === link.id ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                ) : (
                                    <Link
                                        to={link.path}
                                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors duration-150
                                            ${isActive(link.path)
                                                ? 'bg-orange-50 text-orange-600'
                                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                            }`}
                                    >
                                        <link.icon className="text-base" />
                                        {link.label}
                                    </Link>
                                )}

                                {/* Dropdown */}
                                {link.sub && openDropdown === link.id && (
                                    <div className="absolute top-full left-0 mt-1 w-44 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50">
                                        {link.sub.map((sub, i) => (
                                            <Link
                                                key={i}
                                                to={sub.path}
                                                onClick={() => setOpenDropdown(null)}
                                                className={`block px-4 py-2 text-sm font-medium transition-colors
                                                    ${location.pathname === sub.path
                                                        ? 'text-orange-600 bg-orange-50'
                                                        : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                                                    }`}
                                            >
                                                {sub.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Right side */}
                    <div className="hidden md:flex items-center gap-2">
                        {/* Notification bell */}
                        <button className="relative p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                            <FaBell className="text-base" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full"></span>
                        </button>

                        {/* Profile */}
                        <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                            <div className="w-7 h-7 bg-orange-100 rounded-full flex items-center justify-center">
                                <FaUserCircle className="text-orange-500 text-lg" />
                            </div>
                            <div className="text-left leading-none">
                                <p className="text-xs font-bold text-gray-800">Ram Prasad</p>
                                <p className="text-[10px] text-gray-400 mt-0.5">Operator</p>
                            </div>
                        </button>
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setMobileOpen(p => !p)}
                        className="md:hidden p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                        {mobileOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-2 space-y-1">
                    {navLinks.map((link) => (
                        <div key={link.id}>
                            {link.sub ? (
                                <>
                                    <button
                                        onClick={() => toggleDropdown(link.id)}
                                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors
                                            ${isActive(link.path) ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        <span className="flex items-center gap-2">
                                            <link.icon />
                                            {link.label}
                                        </span>
                                        <FaChevronDown className={`text-[10px] transition-transform ${openDropdown === link.id ? 'rotate-180' : ''}`} />
                                    </button>
                                    {openDropdown === link.id && (
                                        <div className="pl-8 space-y-1 mt-1">
                                            {link.sub.map((sub, i) => (
                                                <Link
                                                    key={i}
                                                    to={sub.path}
                                                    onClick={() => { setOpenDropdown(null); setMobileOpen(false); }}
                                                    className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors
                                                        ${location.pathname === sub.path
                                                            ? 'text-orange-600 bg-orange-50'
                                                            : 'text-gray-500 hover:text-orange-600 hover:bg-orange-50'
                                                        }`}
                                                >
                                                    {sub.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Link
                                    to={link.path}
                                    onClick={() => setMobileOpen(false)}
                                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors
                                        ${isActive(link.path) ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <link.icon />
                                    {link.label}
                                </Link>
                            )}
                        </div>
                    ))}

                    <div className="pt-2 border-t border-gray-100 flex items-center gap-3 px-3 py-2">
                        <FaUserCircle className="text-orange-400 text-2xl" />
                        <div>
                            <p className="text-sm font-bold text-gray-800">Ram Prasad</p>
                            <p className="text-xs text-gray-400">Operator</p>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}