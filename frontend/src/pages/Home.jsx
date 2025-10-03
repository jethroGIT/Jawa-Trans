import Navbar from "../components/Navbar"

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8 mt-16">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        Selamat Datang di JawaTrans
                    </h1>
                    <p className="text-lg text-gray-600 mb-8">
                        Layanan transportasi terbaik untuk perjalanan Anda
                    </p>
                    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-2">Mudah</h3>
                            <p className="text-gray-600">Pemesanan yang cepat dan mudah</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-2">Aman</h3>
                            <p className="text-gray-600">Perjalanan dengan keamanan terjamin</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-2">Nyaman</h3>
                            <p className="text-gray-600">Kenyamanan selama perjalanan</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}