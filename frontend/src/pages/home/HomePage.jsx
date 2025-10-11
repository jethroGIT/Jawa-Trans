import HomeLayout from '../../layouts/HomeLayout';
import HeroSection from './sections/HeroSection';
import FeaturesSection from './sections/FeaturesSection';
import BenefitSection from './sections/BenefitSection';

export default function HomePage() {
    return (
        <HomeLayout>
            <HeroSection />
            <FeaturesSection />
            <BenefitSection />
        </HomeLayout>
    );
}