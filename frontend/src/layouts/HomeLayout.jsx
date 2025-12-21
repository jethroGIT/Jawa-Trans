import Navbar from "../components/customer/NavbarTransform";
import Footer from "../components/customer/Footer";

export default function HomeLayout({ children }) {
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