import HomeLayout from '../../layouts/HomeLayout';
import CustomLine from './sections/CustomLine';
import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import TravelPartners from './sections/TravelPartners';
import PaymentPartners from './sections/PaymentPartners';
import BenefitSection from './sections/BenefitSection';
import ServicesSection from './sections/ServicesSection';

export default function HomePage() {
    return (
        <HomeLayout>
            <HeroSection />
            <AboutSection />
            <CustomLine />
            <TravelPartners />
            <CustomLine />
            <PaymentPartners />
            <CustomLine />
            <BenefitSection />
            <CustomLine />
            <ServicesSection />
        </HomeLayout>
    );
}