import Link from 'next/link';
import { Zap } from 'lucide-react';
import { FaGithub, FaXTwitter } from 'react-icons/fa6';

const footerLinks = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'FAQ', href: '#faq' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 flex flex-col gap-4 md:col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-foreground">
              <Zap className="h-5 w-5 text-primary" />
              <span className="font-heading text-lg font-medium tracking-tight">StarForm</span>
            </Link>
            <p
              className="font-body max-w-[62ch] text-base leading-[1.75] text-muted-foreground"
              style={{ textWrap: 'pretty' }}
            >
              Build beautiful forms, collect responses, and uncover insights. No code, no
              complexity.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/atharvdange618/StarForm"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
                aria-label="GitHub"
              >
                <FaGithub className="h-4 w-4" />
              </a>
              <a
                href="https://x.com/atharvdangedev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
                aria-label="X (Twitter)"
              >
                <FaXTwitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title} className="flex flex-col gap-3">
              <span className="font-body text-[0.75rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {group.title}
              </span>
              {group.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="font-body text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="gradient-divider mt-12" />
        <div className="pt-6">
          <p className="font-body text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} StarForm Studio · Pas de pure noir, jamais. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
