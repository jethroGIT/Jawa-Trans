import Navbar from "../components/customer/NavbarSolid";
import Footer from "../components/customer/Footer";

export default function JadwalLayout({ children }) {
    return (
        <div className="min-h-screen">
            <Navbar />
            <main>
                {children}
            </main>
            <Footer />
        </div>
    );
}