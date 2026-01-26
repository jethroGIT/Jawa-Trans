import { Bell, Search, UserCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const [user, setUser] = useState({ name: 'Staff Mitra', role: 'Mitra' });

    useEffect(() => {
        // Simulasi ambil data user dari localStorage
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) setUser(storedUser);
    }, []);

    return (
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-40">
            {/* Left Side: Page Title or Breadcrumb (Optional) */}
            <div className="hidden md:block">
                <h2 className="text-xl font-bold text-gray-800">
                    Portal Staff Mitra
                </h2>
                <p className="text-sm text-gray-500">Kelola user dan fasilitas mitra</p>
            </div>

            {/* Right Side: Search & Profile */}
            <div className="flex items-center gap-6 ml-auto">
                {/* Notifications */}
                <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                    <Bell className="w-6 h-6" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                {/* Divider */}
                <div className="h-8 w-px bg-gray-200"></div>

                {/* Profile Dropdown Trigger */}
                <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                    <div className="bg-blue-100 p-2 rounded-full">
                        <UserCircle className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="hidden md:block text-left">
                        <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                </div>
            </div>
        </header>
    );
}