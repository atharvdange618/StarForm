import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HeroArt } from './hero-art';

export function Hero() {
  return (
    <section className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden">
      <HeroArt />

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-8 px-9 text-center pt-28 pb-24">
        <div
          className="badge eyebrow"
          style={{
            background: 'var(--badge-cerulean-bg)',
            color: 'var(--badge-cerulean-fg)',
          }}
        >
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: 'var(--chart-1)' }}
          />
          Form builder reimagined
        </div>

        <h1
          className="font-display text-[clamp(3.5rem,_9vw,_7rem)] leading-[1.05] font-[300] tracking-[-0.01em] text-foreground"
          style={{ textWrap: 'balance' }}
        >
          Forms that feel{' '}
          <span
            className="text-primary"
            style={{
              textShadow:
                '0 0 60px oklch(0.47 0.155 248 / 0.25), 0 0 120px oklch(0.47 0.155 248 / 0.12)',
            }}
          >
            beautiful
          </span>
        </h1>

        <p
          className="font-body max-w-[56ch] text-lg leading-[1.75] text-muted-foreground"
          style={{ textWrap: 'pretty' }}
        >
          Build dynamic forms with animated themes, collect responses, and uncover insights. No
          code, no complexity - just pure creative flow.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Button asChild size="lg" className="group/btn">
            <Link href="/sign-up">
              Get Started Free
              <span className="flex h-7 w-7 mx-1 items-center justify-center rounded-full bg-primary-foreground/20 text-xs transition-transform group-hover/btn:translate-x-0.5">
                →
              </span>
            </Link>
          </Button>

          <Button asChild size="lg" variant="outline">
            <Link href="#features">See Features</Link>
          </Button>
        </div>

        <p className="eyebrow" style={{ opacity: 0.7 }}>
          Free to start · No credit card required
        </p>
      </div>
    </section>
  );
}
