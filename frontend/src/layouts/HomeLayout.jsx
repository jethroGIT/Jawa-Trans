import Navbar from "../components/customer/NavbarTransform";
import Footer from "../components/customer/Footer";

export default function HomeLayout({ children, scrollSections }) {
    return (
        <div className="min-h-screen">
            <Navbar scrollSections={scrollSections} />
            <main>
                {children}
            </main>
        </div>
    );
}