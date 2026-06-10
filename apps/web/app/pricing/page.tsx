import type { Metadata } from 'next';
import { Navbar } from '@/components/landing/navbar';
import { Pricing } from '@/components/landing/pricing';
import { FAQ } from '@/components/landing/faq';
import { Footer } from '@/components/landing/footer';
import Atmosphere from '@/components/atmosphere';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Simple, transparent pricing. Choose the perfect plan to build interactive forms, collect unlimited responses, and analyze metrics.',
  openGraph: {
    title: 'Pricing Plans | StarForm',
    description:
      'Simple, transparent pricing. Choose the perfect plan to build interactive forms, collect responses, and analyze metrics.',
    url: 'https://starform.atharvdangedev.in/pricing',
  },
  twitter: {
    title: 'Pricing Plans | StarForm',
    description:
      'Simple, transparent pricing. Choose the perfect plan to build interactive forms, collect responses, and analyze metrics.',
  },
};

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
