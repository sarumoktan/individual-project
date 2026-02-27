import { Link, useLocation } from 'react-router-dom';
import Logo from '../logo/Logo';
import { useState, useEffect } from 'react';
import Switch from '../button/Switch';
import { useSelector } from 'react-redux';
import MenuButton from '../button/MenuButton';
import { NavigationLinks } from '../../utils/index.js';

export default function Navbar() {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const Theme = useSelector((state) => state.theme.lightTheme);

    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    if (location.pathname === '/bus-booking/dashboard') return null;

    const isActive = (url) => location.pathname === url;

    return (
        <header
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300
                ${isOpen ? 'min-h-screen md:min-h-fit' : ''}
                ${scrolled
                    ? Theme
                        ? 'bg-white shadow-md border-b border-gray-100'
                        : 'bg-gray-900 shadow-md border-b border-gray-800'
                    : Theme
                        ? 'bg-white/80 backdrop-blur-md border-b border-gray-100/60'
                        : 'bg-gray-900/80 backdrop-blur-md border-b border-gray-800/60'
                }`}
        >
            <nav className="max-w-7xl mx-auto px-4 sm:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Logo />
                    </div>

                    {/* Desktop nav links */}
                    <ul className="hidden md:flex items-center gap-1">
                        {NavigationLinks.map((nav, i) => (
                            <li key={`${nav.ID}${i}`}>
                                <Link
                                    to={nav.URL}
                                    className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150
                                        ${isActive(nav.URL)
                                            ? 'bg-orange-500 text-white'
                                            : Theme
                                                ? 'text-gray-600 hover:text-orange-500 hover:bg-orange-50'
                                                : 'text-gray-300 hover:text-orange-400 hover:bg-orange-500/10'
                                        }`}
                                >
                                    {nav.Title}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Right side: switch + hamburger */}
                    <div className="flex items-center gap-3">
                        <Switch customerStyle={true} />

                        {/* Hamburger — mobile only */}
                        <div className="md:hidden">
                            <MenuButton onClick={() => setIsOpen(!isOpen)} />
                        </div>
                    </div>
                </div>

                {/* Mobile dropdown */}
                {isOpen && (
                    <div className="md:hidden pb-6 pt-2">
                        <ul
                            className={`flex flex-col gap-1 rounded-2xl p-3 border
                                ${Theme
                                    ? 'bg-gray-50 border-gray-100'
                                    : 'bg-gray-800 border-gray-700'
                                }`}
                        >
                            {NavigationLinks.map((nav, i) => (
                                <li key={`mobile-${nav.ID}${i}`}>
                                    <Link
                                        to={nav.URL}
                                        className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150
                                            ${isActive(nav.URL)
                                                ? 'bg-orange-500 text-white'
                                                : Theme
                                                    ? 'text-gray-700 hover:bg-orange-50 hover:text-orange-500'
                                                    : 'text-gray-200 hover:bg-orange-500/10 hover:text-orange-400'
                                            }`}
                                    >
                                        {nav.Title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </nav>
        </header>
    );
}