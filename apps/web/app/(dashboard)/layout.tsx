import type { Metadata } from 'next';
import Link from 'next/link';
import { LayoutDashboard, FileEdit, Compass } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import { ThemeToggle } from '@/components/theme-toggle';
import { StarFormLogo } from '@/components/logo';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Manage your forms, view real-time feedback analytics, and share your forms.',
};

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Explore', href: '/explore', icon: Compass },
  { label: 'New Form', href: '/forms/new', icon: FileEdit },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background dashboard-layout">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center text-foreground transition-all hover:opacity-80"
            >
              <StarFormLogo size={24} showText={true} />
            </Link>
            <nav className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 rounded-full px-3 py-1.5 font-body text-sm text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="mx-1 h-5 w-px bg-border/50" />
            <UserButton />
          </div>
        </div>
      </header>
      <main className="flex-1 animate-page-enter">{children}</main>
    </div>
  );
}
