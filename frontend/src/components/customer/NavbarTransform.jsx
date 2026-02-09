import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Settings, CreditCard, LogOut, ChevronDown, ChevronUp } from 'lucide-react';
import logo from '../../assets/BW/banner.png';
import logo2 from '../../assets/CL/banner.png';

export default function Navbar({ scrollSections }) {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const dropdownRef = useRef(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');

        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                setUser({ nama: storedUser });
            }
        }
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (isProfileOpen && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isProfileOpen]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        setIsProfileOpen(false);
        navigate('/login');
    };

    // Handle navigation dengan smooth scroll untuk menu di home page
    const handleNavClick = (item) => {
        if (scrollSections) {
            if (item.name === 'Home') {
                scrollSections.scrollToSection(scrollSections.heroRef);
            } else if (item.name === 'Tentang Kami') {
                scrollSections.scrollToSection(scrollSections.aboutRef);
            } else if (item.name === 'Layanan') {
                scrollSections.scrollToSection(scrollSections.benefitRef);
            } else if (item.name === 'Kontak') {
                scrollSections.scrollToSection(scrollSections.footerRef);
            } else {
                navigate(item.path);
            }
        } else {
            navigate(item.path);
        }
    };

    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'Tentang Kami', path: '/about' },
        { name: 'Layanan', path: '/services' },
        { name: 'Kontak', path: '/contact' }
    ];

    const avatarUrl = "https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=" + (user?.nama || 'User');

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-2xl font-bold text-blue-600">
                            <img
                                src={isScrolled ? logo2 : logo}
                                alt="JawaTrans Logo"
                                className="h-20 w-auto transition-all duration-300"
                            />
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            {navItems.map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => handleNavClick(item)}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition duration-200 ${isScrolled
                                        ? 'text-gray-700 hover:text-blue-600'
                                        : 'text-white hover:text-blue-300'
                                        }`}
                                >
                                    {item.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Auth Buttons - Desktop */}
                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center space-x-2 focus:outline-none p-2 rounded-lg transition"
                                >
                                    <img
                                        src={avatarUrl}
                                        alt="Profile"
                                        className="h-9 w-9 rounded-full border border-gray-200"
                                    />
                                </button>

                                {/* Dropdown Menu */}
                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100 transform origin-top-right transition-all z-50">
                                        {/* Header Dropdown (Card Style) */}
                                        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 text-white">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full flex items-center justify-center text-lg font-bold">
                                                    <img
                                                        src={avatarUrl}
                                                        alt="Profile"
                                                        className="rounded-full border"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm uppercase">{user.nama}</p>
                                                    <p className="text-xs text-blue-100">JawaTrans Member</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Menu Items */}
                                        <div className="p-2">
                                            <Link
                                                to="/list-tiket"
                                                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                <CreditCard size={18} />
                                                Payment List
                                            </Link>
                                            <Link
                                                to="/settings"
                                                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                <Settings size={18} />
                                                Setting
                                            </Link>

                                            <div className="h-px bg-gray-100 my-1"></div>

                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
                                            >
                                                <LogOut size={18} />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className={`px-3 py-2 text-sm font-medium transition duration-200 ${isScrolled
                                        ? 'text-gray-700 hover:text-blue-600'
                                        : 'text-white hover:text-blue-300'
                                        }`}
                                >
                                    Log In
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200"
                                >
                                    Daftar
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}