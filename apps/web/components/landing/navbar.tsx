'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useUser, UserButton } from '@clerk/nextjs';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeToggle } from '@/components/theme-toggle';
import { StarFormLogo } from '@/components/logo';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Dashboard', href: '/dashboard', requiresAuth: true },
];

function Logo() {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      <Link href="/" className="flex items-center text-foreground">
        <StarFormLogo size={24} showText={true} />
      </Link>
    </motion.div>
  );
}

function NavLinkItem({
  href,
  label,
  isHovered,
}: {
  href: string;
  label: string;
  isHovered: boolean;
}) {
  return (
    <Link
      href={href}
      className="font-body relative px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      {label}
      <motion.span
        className="absolute inset-x-3 bottom-0 h-px rounded-full bg-primary/40"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      />
    </Link>
  );
}

export function Navbar() {
  const { isSignedIn } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const visibleLinks = navLinks.filter((link) => !link.requiresAuth || isSignedIn);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 mx-auto mt-4 flex w-full max-w-5xl items-center justify-between px-4">
      <div
        className="relative flex w-full items-center justify-between rounded-full border border-border/20 bg-background/40 px-5 py-2 backdrop-blur-3xl"
        style={{
          boxShadow: `
            0 1px 2px oklch(0 0 0 / 0.05),
            0 4px 24px oklch(0 0 0 / 0.08),
            inset 0 1px 0 oklch(1 0 0 / 0.08),
            inset 0 -1px 0 oklch(0 0 0 / 0.05)
          `,
        }}
      >
        <Logo />

        <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:flex items-center gap-0.5">
          {visibleLinks.map((link) => (
            <div
              key={link.href}
              onMouseEnter={() => setHoveredLink(link.href)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <NavLinkItem
                href={link.href}
                label={link.label}
                isHovered={hoveredLink === link.href}
              />
            </div>
          ))}
        </div>

        <div className="relative z-10 flex items-center gap-1">
          <ThemeToggle />
          <div className="mx-1 h-5 w-px bg-border/50" />

          {isSignedIn ? (
            <div className="hidden md:block">
              <UserButton />
            </div>
          ) : (
            <div className="hidden items-center gap-1 md:flex">
              <Link
                href="/sign-in"
                className="font-body rounded-full px-4 py-1.5 text-[0.9375rem] text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
              >
                Sign In
              </Link>
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <Link
                  href="/sign-up"
                  className="font-body rounded-full bg-primary px-4 py-1.5 text-[0.9375rem] text-primary-foreground shadow-(--shadow-navbar-button) transition-all hover:bg-primary/80"
                >
                  Sign Up
                </Link>
              </motion.div>
            </div>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-all hover:bg-primary/10 hover:text-foreground md:hidden"
            aria-label="Toggle menu"
          >
            <motion.div animate={{ rotate: mobileOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </motion.div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="absolute inset-x-4 top-full mt-3 flex flex-col gap-1.5 rounded-3xl border border-border/30 bg-background/90 p-4 shadow-(--shadow-navbar-dropdown) backdrop-blur-3xl md:hidden"
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          >
            {visibleLinks.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
                transition={{
                  type: 'spring',
                  stiffness: 320,
                  damping: 28,
                  delay: index * 0.04,
                }}
              >
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-full px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}

            <motion.div
              className="mt-2 border-t border-border/30 pt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              {isSignedIn ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-full px-4 py-2.5 transition-colors hover:bg-primary/10"
                >
                  <UserButton />
                  <span className="text-sm text-muted-foreground">Dashboard</span>
                </Link>
              ) : (
                <div className="flex flex-col gap-1.5">
                  <Link
                    href="/sign-in"
                    onClick={() => setMobileOpen(false)}
                    className="font-body rounded-full px-4 py-2.5 text-center text-[0.9375rem] text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={() => setMobileOpen(false)}
                    className="font-body rounded-full bg-primary px-4 py-2.5 text-center text-[0.9375rem] text-primary-foreground shadow-(--shadow-navbar-button) transition-all hover:bg-primary/80"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
