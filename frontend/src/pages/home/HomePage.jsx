import HomeLayout from '../../layouts/HomeLayout';
import HeroSection from './sections/HeroSection';
import PaymentPartners from './sections/PaymentPartners';
import BenefitSection from './sections/BenefitSection';

export default function HomePage() {
    return (
        <HomeLayout>
            <HeroSection />
            <PaymentPartners />
            <BenefitSection />
        </HomeLayout>
    );
}