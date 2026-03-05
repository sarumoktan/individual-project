import { Link, useLocation } from 'react-router-dom';
import { FaBus, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

const links = {
    'Travel': [
        { label: 'Search Buses',   url: '/bus-booking/search-buses' },
        { label: 'Popular Routes', url: '/routes'                   },
        { label: 'My Tickets',     url: '/tickets'                  },
        { label: 'Track My Bus',   url: '/track'                    },
    ],
    'Company': [
        { label: 'About Us',    url: '/about'   },
        { label: 'Careers',     url: '/careers' },
        { label: 'Blog',        url: '/blog'    },
        { label: 'Contact',     url: '/contact' },
    ],
    'Support': [
        { label: 'Help Center',      url: '/help'    },
        { label: 'Refund Policy',    url: '/refunds' },
        { label: 'Privacy Policy',   url: '/privacy' },
        { label: 'Terms of Service', url: '/terms'   },
    ],
};

const socials = [
    { icon: FaFacebook,  url: '#', label: 'Facebook'  },
    { icon: FaInstagram, url: '#', label: 'Instagram'  },
    { icon: FaTwitter,   url: '#', label: 'Twitter'   },
];

const payments = ['eSewa', 'Khalti', 'IME Pay', 'ConnectIPS', 'Visa'];

export default function Footer() {
    const location = useLocation();

    // Hide on operator pages
    if (location.pathname.startsWith('/operator')) return null;
    if (location.pathname === '/login')             return null;
    if (location.pathname === '/signup')            return null;

    return (
        <footer className="bg-gray-900 text-gray-400">

            {/* Main footer grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

                    {/* Brand column */}
                    <div className="lg:col-span-2 space-y-5">
                        <Link to="/" className="flex items-center gap-2.5 group w-fit">
                            <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center group-hover:bg-orange-600 transition-colors">
                                <FaBus className="text-white text-sm" />
                            </div>
                            <span className="font-black text-white text-lg tracking-tight">
                                Yatra<span className="text-orange-400">Nepal</span>
                            </span>
                        </Link>
                        <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                            Nepal's bus ticketing platform. Book seats from Kathmandu to anywhere in the country in under 60 seconds.
                        </p>

                        {/* Contact */}
                        <div className="space-y-2.5">
                            <a href="tel:+977014XXXXXX" className="flex items-center gap-2.5 text-sm text-gray-500 hover:text-orange-400 transition-colors">
                                <FaPhone className="text-gray-600 text-xs flex-shrink-0" />
                                +977 01-4XXXXXX
                            </a>
                            <a href="mailto:support@yatranepal.com" className="flex items-center gap-2.5 text-sm text-gray-500 hover:text-orange-400 transition-colors">
                                <FaEnvelope className="text-gray-600 text-xs flex-shrink-0" />
                                support@yatranepal.com
                            </a>
                            <div className="flex items-center gap-2.5 text-sm text-gray-500">
                                <FaMapMarkerAlt className="text-gray-600 text-xs flex-shrink-0" />
                                Kalanki, Kathmandu, Nepal
                            </div>
                        </div>

                        {/* Socials */}
                        <div className="flex items-center gap-2">
                            {socials.map(s => (
                                <a
                                    key={s.label}
                                    href={s.url}
                                    aria-label={s.label}
                                    className="w-8 h-8 bg-gray-800 hover:bg-orange-500 border border-gray-700 hover:border-orange-500 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-150"
                                >
                                    <s.icon className="text-xs" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {Object.entries(links).map(([group, items]) => (
                        <div key={group} className="space-y-4">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{group}</p>
                            <ul className="space-y-2.5">
                                {items.map(item => (
                                    <li key={item.label}>
                                        <Link
                                            to={item.url}
                                            className="text-sm text-gray-500 hover:text-orange-400 transition-colors font-medium"
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-600">
                        &copy; {new Date().getFullYear()} YatraNepal. All rights reserved.
                    </p>

                    {/* Payment badges */}
                    <div className="flex items-center gap-1.5 flex-wrap justify-center">
                        <span className="text-xs text-gray-600 mr-1">We accept</span>
                        {payments.map(p => (
                            <span
                                key={p}
                                className="text-[11px] font-bold px-2.5 py-1 bg-gray-800 border border-gray-700 rounded-lg text-gray-400"
                            >
                                {p}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}