export default function ErrorState({ error }) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
                <div className="bg-red-100 text-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Terjadi Kesalahan</h3>
                <p className="text-gray-600">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
                >
                    Coba Lagi
                </button>
            </div>
        </div>
    );
}