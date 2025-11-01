export default function EmptyState() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
                <div className="bg-gray-100 text-gray-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak Ada Jadwal</h3>
                <p className="text-gray-600">Belum ada jadwal bus yang tersedia saat ini.</p>
            </div>
        </div>
    );
}