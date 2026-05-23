import { Navbar } from '@/components/landing/navbar';
import { Pricing } from '@/components/landing/pricing';
import { FAQ } from '@/components/landing/faq';
import { Footer } from '@/components/landing/footer';
import Atmosphere from '@/components/atmosphere';

export default function PricingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Atmosphere />
      <div className="relative z-10">
        <Navbar />
        <Pricing />
        <FAQ />
        <Footer />
      </div>
    </div>
  );
}
