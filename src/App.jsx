import { useCallback, useState } from 'react';
import AuroraBackground from '@/components/layout/AuroraBackground';
import CornerLogo from '@/components/layout/CornerLogo';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import RegistrationModal from '@/components/registration/RegistrationModal';
import AboutSection from '@/components/sections/AboutSection';
import Hero from '@/components/sections/Hero';
import JoinSection from '@/components/sections/JoinSection';
import ServicesSection from '@/components/sections/ServicesSection';

export default function App() {
  // Which registration form is open ('Talent' | 'Brand' | 'Agency'), or null.
  const [registrationType, setRegistrationType] = useState(null);
  const closeRegistration = useCallback(() => setRegistrationType(null), []);

  return (
    <>
      {/* Sits outside the content wrapper so it stays behind everything (z-0 vs z-10). */}
      <AuroraBackground />

      <div className="min-h-screen relative text-zinc-100 flex flex-col z-10">
        <CornerLogo />
        <Navbar />
        <Hero />
        <JoinSection onSelect={setRegistrationType} />
        <ServicesSection />
        <AboutSection />

        {registrationType && (
          <RegistrationModal
            key={registrationType}
            type={registrationType}
            onClose={closeRegistration}
          />
        )}

        <Footer />
      </div>
    </>
  );
}
