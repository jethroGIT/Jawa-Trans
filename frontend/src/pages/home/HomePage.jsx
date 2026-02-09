import { useRef } from 'react';
import HomeLayout from '../../layouts/HomeLayout';
import CustomLine from './sections/CustomLine';
import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import TravelPartners from './sections/TravelPartners';
import PaymentPartners from './sections/PaymentPartners';
import BenefitSection from './sections/BenefitSection';
import ServicesSection from './sections/ServicesSection';
import Footer from '../../components/customer/Footer';

export default function HomePage() {
    const heroRef = useRef(null);
    const aboutRef = useRef(null);
    const benefitRef = useRef(null);
    const footerRef = useRef(null);

    const scrollToSection = (ref) => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <HomeLayout scrollSections={{ heroRef, aboutRef, benefitRef, footerRef, scrollToSection }}>
            <div ref={heroRef}>
                <HeroSection />
            </div>
            <div ref={aboutRef}>
                <AboutSection />
            </div>
            <CustomLine />
            <TravelPartners />
            <CustomLine />
            <PaymentPartners />
            <CustomLine />
            <div ref={benefitRef}>
                <BenefitSection />
            </div>
            <CustomLine />
            <ServicesSection />
            <div ref={footerRef}>
                <Footer />
            </div>
        </HomeLayout>
    );
}