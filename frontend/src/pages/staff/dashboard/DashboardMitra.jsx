import StaffLayout from '../../../layouts/StaffLayout';

export default function DashboardMitra() {
    return (
        <StaffLayout>
            {/* Apapun yang ditulis di sini akan menjadi {children} */}
            <h1 className="text-2xl font-bold mb-4">Statistik Penjualan</h1>

            <div className="bg-white p-6 rounded-lg shadow">
                <p>Ini isinya grafik atau whatever cuyy</p>
            </div>
        </StaffLayout>
    );
}