import { ArrowRight } from 'lucide-react';

export function CTA() {
  return (
    <section className="relative">
      <div className="max-w-[1280px] mx-auto px-8 lg:px-14">
        <div className="brushstroke" />
      </div>

      <div className="max-w-[920px] mx-auto px-8 lg:px-14 py-32 lg:py-48 text-center relative">
        <div
          className="absolute -top-10 left-1/2 -translate-x-1/2 w-[80%] h-64 orb-gold pointer-events-none"
          aria-hidden="true"
        />
        <span className="eyebrow">A blank canvas awaits</span>
        <h2 className="font-display mt-5 mx-auto text-balance text-foreground max-w-[16ch] leading-[1.08] tracking-[-0.01em] font-normal text-[clamp(2.5rem,_6vw,_4.5rem)]">
          Build your first form in{' '}
          <em className="italic text-primary font-normal">under five minutes</em>.
        </h2>
        <p className="mt-7 font-body italic mx-auto text-pretty text-muted-foreground max-w-[62ch] leading-[1.75] text-lg">
          No card. No demo call. Just a blank cream canvas, a cursor, and you.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <button className="btn-primary">
            Start composing
            <ArrowRight size={16} strokeWidth={1.75} />
          </button>
          <button className="btn-ghost">View the docs</button>
        </div>
      </div>
    </section>
  );
}
