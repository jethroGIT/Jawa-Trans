export default function FeaturesSection() {
    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition duration-300">
                        <div className="text-4xl mb-4">🚀</div>
                        <h3 className="text-xl font-semibold mb-2">Mudah</h3>
                        <p className="text-gray-600">Pemesanan yang cepat dan mudah</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition duration-300">
                        <div className="text-4xl mb-4">🛡️</div>
                        <h3 className="text-xl font-semibold mb-2">Aman</h3>
                        <p className="text-gray-600">Perjalanan dengan keamanan terjamin</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition duration-300">
                        <div className="text-4xl mb-4">⭐</div>
                        <h3 className="text-xl font-semibold mb-2">Nyaman</h3>
                        <p className="text-gray-600">Kenyamanan selama perjalanan</p>
                    </div>
                </div>
            </div>
        </section>
    );
}