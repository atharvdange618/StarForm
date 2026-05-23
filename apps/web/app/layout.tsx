import type { Metadata } from 'next';
import { Geist, Geist_Mono, Roboto, Figtree, Cormorant_Garamond, Lora } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';
import { cn } from '@/lib/utils';

const figtreeHeading = Figtree({ subsets: ['latin'], variable: '--font-heading' });
const roboto = Roboto({ subsets: ['latin'], variable: '--font-sans' });
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
  variable: '--font-body',
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: { default: 'StarForm', template: '%s | StarForm' },
  description:
    'Build beautiful forms, collect responses, and analyze results with style. Monetmorphic design meets powerful analytics.',
  openGraph: {
    title: 'StarForm',
    description: 'Build beautiful forms, collect responses, and analyze results with style.',
    url: 'https://starform.atharvdangedev.in',
    siteName: 'StarForm',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StarForm',
    description: 'Build beautiful forms, collect responses, and analyze results with style.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn('font-sans', roboto.variable, figtreeHeading.variable)}
      suppressHydrationWarning
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} ${lora.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
