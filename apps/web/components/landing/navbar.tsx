'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useUser, UserButton } from '@clerk/nextjs';
import { Menu, X, Zap } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Dashboard', href: '/dashboard', requiresAuth: true },
];

export function Navbar() {
  const { isSignedIn } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 mx-auto mt-4 flex w-full max-w-5xl items-center justify-between px-4">
      <div className="relative flex w-full items-center justify-between rounded-full border border-border/20 bg-background/20 px-5 py-2 shadow-(--shadow-navbar) backdrop-blur-3xl">
        <Link
          href="/"
          className="relative z-10 flex items-center gap-2 text-foreground transition-all hover:opacity-80"
        >
          <Zap className="h-5 w-5 text-primary" />
          <span className="font-heading text-lg font-medium tracking-tight">StarForm</span>
        </Link>

        <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center md:flex">
          {navLinks
            .filter((link) => !link.requiresAuth || isSignedIn)
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-body relative px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
                <span className="absolute inset-x-3 bottom-0 h-px scale-x-0 rounded-full bg-primary/40 transition-transform hover:scale-x-100" />
              </Link>
            ))}
        </div>

        <div className="relative z-10 flex items-center gap-2">
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <div className="mx-1 h-5 w-px bg-border/50" />
          </div>

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
              <Link
                href="/sign-up"
                className="font-body rounded-full bg-primary px-4 py-1.5 text-[0.9375rem] text-primary-foreground shadow-(--shadow-navbar-button) transition-all hover:bg-primary/80 active:scale-[0.96]"
              >
                Sign Up
              </Link>
            </div>
          )}

          <button
            onClick={() => {
              setMobileOpen(!mobileOpen);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-all hover:bg-primary/10 hover:text-foreground md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="absolute inset-x-4 top-full mt-3 flex flex-col gap-2 rounded-3xl border border-border/30 bg-background/80 p-4 shadow-(--shadow-navbar-dropdown) backdrop-blur-3xl md:hidden">
          {navLinks
            .filter((link) => !link.requiresAuth || isSignedIn)
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => {
                  setMobileOpen(false);
                }}
                className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          <div className="mt-2 border-t border-border/30 pt-2">
            {isSignedIn ? (
              <Link
                href="/dashboard"
                onClick={() => {
                  setMobileOpen(false);
                }}
                className="flex items-center gap-3 rounded-full px-4 py-2 transition-colors hover:bg-primary/10"
              >
                <UserButton />
                <span className="text-sm text-muted-foreground">Dashboard</span>
              </Link>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/sign-in"
                  onClick={() => {
                    setMobileOpen(false);
                  }}
                  className="font-body rounded-full px-4 py-2 text-center text-[0.9375rem] text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => {
                    setMobileOpen(false);
                  }}
                  className="font-body rounded-full bg-primary px-4 py-2 text-center text-[0.9375rem] text-primary-foreground shadow-(--shadow-navbar-button) transition-all hover:bg-primary/80"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </nav>
  );
}
