import Navbar from '../components/admin/layout/Navbar';
import Sidebar from '../components/admin/layout/Sidebar';

export default function AdminLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50 flex">            
            <Sidebar />
            <div className="flex-1 flex flex-col lg:ml-64 transition-all duration-300">
                <Navbar />
                <main className="p-6 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}