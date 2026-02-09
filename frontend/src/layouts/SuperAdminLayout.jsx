import Navbar from '../components/superadmin/layout/Navbar';
import SuperSidebar from '../components/superadmin/layout/SuperSidebar';

export default function SuperAdminLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50 flex">            
            <SuperSidebar />
            <div className="flex-1 flex flex-col lg:ml-64 transition-all duration-300">
                <Navbar />
                <main className="p-6 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
