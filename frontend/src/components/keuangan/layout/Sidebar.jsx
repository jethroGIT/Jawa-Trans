import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    LogOut,
    History,
    FilePieChart,
    TrendingUp,
} from 'lucide-react';

import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/BW/banner.png';

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();

    // Menu khusus untuk Staff Mitra
    const menuItems = [
        {
            name: 'Laporan Keuangan',
            path: '/keuangan/laporan',
            icon: FilePieChart
        },
    ];

    const handleLogout = () => {
        Swal.fire({
            title: 'Keluar?',
            text: "Apakah Anda yakin ingin mengakhiri sesi?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#2563EB',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Keluar',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/employee/login');
            }
        });
    };

    return (
        <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-gray-200 shadow-sm hidden lg:flex lg:flex-col">
            {/* Logo Area */}
            <div className="flex items-center justify-center h-20 border-b border-gray-100 px-6">
                <img src={logo} alt="Jawa Trans" className="h-16 w-auto" />
            </div>

            {/* Menu Items */}
            <div className="flex-1 flex flex-col gap-1 p-4 overflow-y-auto">
                <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Menu Utama
                </p>

                {menuItems.map((item) => {
                    const Icon = item.icon;
                    // Cek apakah path saat ini cocok dengan item menu
                    const isActive = location.pathname.startsWith(item.path);

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-slate-800 text-blue-400'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                            {item.name}
                        </Link>
                    );
                })}
            </div>

            {/* User Profile & Logout */}
            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 rounded-xl hover:bg-slate-800 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    Keluar
                </button>
            </div>
        </aside>
    );
}