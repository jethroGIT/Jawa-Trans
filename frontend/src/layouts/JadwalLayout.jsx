import Navbar from "../components/NavbarSolid";
import Footer from "../components/Footer";

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