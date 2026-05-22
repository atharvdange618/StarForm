import { Pencil, Layers, Settings2, Send } from 'lucide-react';

const steps = [
  {
    n: 'i',
    title: 'Sketch the details',
    body: "Name the form, set its tone, pick a visibility - public link, unlisted, or invite-only. Your respondents won't see this part.",
    icon: Pencil,
    badge: { bg: 'var(--badge-cerulean-bg)', fg: 'var(--badge-cerulean-fg)' },
  },
  {
    n: 'ii',
    title: 'Lay down the fields',
    body: 'Drag in text, number, email, phone, select, multiselect, checkbox, file. Reorder freely. Group with brushstroke dividers. Conditional logic on every field.',
    icon: Layers,
    badge: { bg: 'var(--badge-lavender-bg)', fg: 'var(--badge-lavender-fg)' },
  },
  {
    n: 'iii',
    title: 'Configure the canvas',
    body: 'Pick a theme, decide on rate limits, opt in to anonymous IP-hash dedup, and write the thank-you note your respondents will read after sending.',
    icon: Settings2,
    badge: { bg: 'var(--badge-sage-bg)', fg: 'var(--badge-sage-fg)' },
  },
  {
    n: 'iv',
    title: 'Publish, then collect',
    body: 'Hit publish - StarForm freezes an immutable snapshot you can always revisit. Share the link anywhere. Watch submissions arrive in real time, ready to export.',
    icon: Send,
    badge: { bg: 'var(--badge-gold-bg)', fg: 'var(--badge-gold-fg)' },
  },
];

export default function HowItComposes() {
  return (
    <section id="how" className="relative">
      <div className="max-w-7xl mx-auto px-8 lg:px-14 py-28 lg:py-36">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-14 lg:gap-24">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <span className="eyebrow">How it composes</span>
            <h2 className="font-display mt-4 text-balance text-foreground leading-[1.08] tracking-[-0.01em] font-normal text-[clamp(1.75rem,4vw,2.5rem)]">
              Four steps, from blank cream to first reply.
            </h2>
            <p className="mt-6 font-body text-pretty text-muted-foreground max-w-[62ch] leading-[1.75] text-base">
              The builder is a wizard that doesn&apos;t feel like one. You can flip back and forth
              as you work, and StarForm autosaves every gesture.
            </p>

            <div className="mt-9 inline-flex items-center gap-3">
              <span className="font-body italic text-sm text-muted-foreground">
                Median time to first form
              </span>
              <span className="font-display text-primary text-[2rem] font-medium tracking-[-0.01em] leading-none">
                4m 22s
              </span>
            </div>
          </div>

          <div className="relative">
            <div
              className="absolute left-6.5 top-2 bottom-2 w-px"
              style={{
                background:
                  'linear-gradient(to bottom, transparent, color-mix(in oklch, var(--primary) 35%, transparent) 15%, color-mix(in oklch, var(--accent) 40%, transparent) 50%, color-mix(in oklch, var(--chart-4) 35%, transparent) 85%, transparent)',
              }}
              aria-hidden="true"
            />

            <ol className="space-y-10">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <li key={step.n} className="relative pl-20">
                    <div className="absolute left-0 top-0 w-13.5 h-13.5 rounded-full flex items-center justify-center bg-card border border-border shadow-(--shadow-card)">
                      <Icon size={18} strokeWidth={1.5} color="var(--foreground)" />
                    </div>

                    <div className="flex items-baseline gap-3 mb-2">
                      <span
                        className="font-display italic"
                        style={{
                          fontSize: '1.15rem',
                          color: step.badge.fg,
                          fontWeight: 500,
                        }}
                      >
                        Step {step.n}
                      </span>
                      <span
                        className="badge"
                        style={{
                          background: step.badge.bg,
                          color: step.badge.fg,
                        }}
                      >
                        0{index + 1}
                      </span>
                    </div>
                    <h3 className="font-display text-foreground text-xl font-medium tracking-[-0.005em]">
                      {step.title}
                    </h3>
                    <p className="mt-3 font-body text-pretty text-muted-foreground max-w-[62ch] leading-[1.75] text-base">
                      {step.body}
                    </p>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 lg:px-14">
        <div className="brushstroke" />
      </div>
    </section>
  );
}
