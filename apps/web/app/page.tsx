import { Navbar } from '@/components/landing/navbar';
import { Hero } from '@/components/landing/hero';
import { Pricing } from '@/components/landing/pricing';
import { FAQ } from '@/components/landing/faq';
import { CTA } from '@/components/landing/cta';
import { Footer } from '@/components/landing/footer';
import Atmosphere from '@/components/atmosphere';
import Manifesto from '@/components/landing/manifesto';
import HowItComposes from '@/components/landing/how-it-composes';
import Features from '@/components/landing/features';
import Proof from '@/components/landing/proof';

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Atmosphere />
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Manifesto />
        <HowItComposes />
        <Features />
        <Pricing />
        <Proof />
        <FAQ />
        <CTA />
        <Footer />
      </div>
    </div>
  );
}
