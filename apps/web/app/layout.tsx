import type { Metadata } from 'next';
import { Geist, Geist_Mono, Figtree, Cormorant_Garamond, Lora } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';
import { cn } from '@/lib/utils';

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
});
const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-display',
});
const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-heading',
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://starform.atharvdangedev.in'),
  title: { default: 'StarForm', template: '%s | StarForm' },
  description:
    'Build beautiful forms, collect responses, and analyze results with style. Monetmorphic design meets powerful analytics.',
  keywords: [
    'form builder',
    'beautiful forms',
    'interactive surveys',
    'feedback collection',
    'response analytics',
    'animated form themes',
    'no-code form creator',
    'typeform alternative',
    'monetmorphic design',
  ],
  authors: [{ name: 'Atharv Dange', url: 'https://atharvdangedev.in' }],
  creator: 'Atharv Dange',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'StarForm',
    description:
      'Build beautiful forms, collect responses, and analyze results with style. Monetmorphic design meets powerful analytics.',
    url: 'https://starform.atharvdangedev.in',
    siteName: 'StarForm',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'StarForm - Build beautiful forms with animated themes and powerful analytics',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StarForm',
    description:
      'Build beautiful forms, collect responses, and analyze results with style. Monetmorphic design meets powerful analytics.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(figtree.variable, lora.variable)} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
