import { currentUser } from '@clerk/nextjs/server';
import { UserButton } from '@clerk/nextjs';
import { TRPCExample } from '@/components/trpc-example';
import Link from 'next/link';

export default async function Home() {
  const user = await currentUser();

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <h1 className="text-xl font-bold text-foreground">StarForm</h1>
        <nav className="flex items-center gap-4">
          {user ? (
            <UserButton />
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </header>
      <main className="flex flex-col items-center justify-center px-6 py-24">
        <h2
          className="mb-4 text-4xl font-bold text-foreground"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Build Beautiful Forms
        </h2>
        <p
          className="mb-8 max-w-md text-center text-muted-foreground"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Create dynamic forms with custom themes, animated designs, and powerful analytics.
        </p>
        <div className="flex gap-4">
          <Link
            href="/sign-up"
            className="rounded-md bg-primary px-6 py-3 text-primary-foreground hover:bg-primary/80"
          >
            Get Started Free
          </Link>
          <a
            href={user ? '/dashboard' : '/sign-in'}
            className="rounded-md border border-border bg-background px-6 py-3 text-foreground hover:bg-accent"
          >
            {user ? 'Dashboard' : 'Sign In'}
          </a>
        </div>
        <TRPCExample />
      </main>
    </div>
  );
}
