export default function Proof() {
  return (
    <section className="relative">
      <div className="max-w-[1280px] mx-auto px-8 lg:px-14">
        <div className="brushstroke" />
      </div>

      <div className="max-w-[1080px] mx-auto px-8 lg:px-14 py-24 lg:py-32">
        <div className="grid lg:grid-cols-[1fr_auto] gap-12 lg:gap-20 items-center">
          <div>
            <span className="eyebrow">A reader writes</span>
            <blockquote className="pullquote mt-6 font-display text-foreground text-[clamp(1.6rem,_3.4vw,_2.4rem)]">
              <span className="text-accent relative leading-[0] top-[0.2em] mr-[0.05em] text-[1.2em]">
                &quot;
              </span>
              I&apos;ve used Typeform, Tally, Google Forms, Airtable forms. StarForm is the first
              one I actually <em className="italic text-primary">look forward</em> to opening on
              Monday morning. The submissions feel like postcards, not data.
            </blockquote>

            <div className="mt-9 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-display bg-[var(--badge-gold-bg)] text-[var(--badge-gold-fg)] text-[1.1rem] font-medium">
                AR
              </div>
              <div>
                <div className="font-body text-sm text-foreground font-medium">Aurélie Renaud</div>
                <div className="font-body italic text-sm text-muted-foreground">
                  Editor, Maison Étretat · using StarForm since beta-3
                </div>
              </div>
            </div>
          </div>

          <div className="lg:border-l lg:pl-12 border-border">
            <Number label="forms built" value="6,142" />
            <div className="my-6 w-full h-px bg-border" />
            <Number label="submissions collected" value="318k" />
            <div className="my-6 w-full h-px bg-border" />
            <Number label="median response time" value="2m 14s" />
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-8 lg:px-14">
        <div className="brushstroke" />
      </div>
    </section>
  );
}

function Number({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="eyebrow mb-1">{label}</div>
      <div className="font-display text-foreground text-[2.5rem] font-normal tracking-[-0.015em] leading-none">
        {value}
      </div>
    </div>
  );
}
