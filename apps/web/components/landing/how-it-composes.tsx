'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
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

function StepItem({
  step,
  index,
  isInView,
}: {
  step: (typeof steps)[0];
  index: number;
  isInView: boolean;
}) {
  const Icon = step.icon;
  const delay = index * 0.15;

  return (
    <motion.li
      className="relative pl-20"
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ type: 'spring', stiffness: 80, damping: 18, delay }}
    >
      <motion.div
        className="absolute left-0 top-0 w-13.5 h-13.5 rounded-full flex items-center justify-center bg-card border border-border shadow-(--shadow-card)"
        animate={
          isInView
            ? {
                boxShadow: [
                  '0 1px 2px oklch(0 0 0 / 0.05), 0 4px 16px oklch(0.47 0.155 248 / 0.07)',
                  '0 2px 4px oklch(0 0 0 / 0.08), 0 8px 24px oklch(0.47 0.155 248 / 0.14)',
                  '0 1px 2px oklch(0 0 0 / 0.05), 0 4px 16px oklch(0.47 0.155 248 / 0.07)',
                ],
              }
            : {}
        }
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay }}
      >
        <Icon size={18} strokeWidth={1.5} color="var(--foreground)" />
      </motion.div>

      <div className="flex items-baseline gap-3 mb-2">
        <span
          className="font-display italic"
          style={{ fontSize: '1.15rem', color: step.badge.fg, fontWeight: 500 }}
        >
          Step {step.n}
        </span>
        <motion.span
          className="badge"
          style={{ background: step.badge.bg, color: step.badge.fg }}
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: delay + 0.1 }}
        >
          0{index + 1}
        </motion.span>
      </div>
      <h3 className="font-display text-foreground text-xl font-medium tracking-[-0.005em]">
        {step.title}
      </h3>
      <p className="mt-3 font-body text-pretty text-muted-foreground max-w-[62ch] leading-[1.75] text-base">
        {step.body}
      </p>
    </motion.li>
  );
}

export default function HowItComposes() {
  const lineRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(contentRef, { once: true, margin: '-100px' });

  return (
    <section id="how" className="relative">
      <div className="max-w-7xl mx-auto px-8 lg:px-14 py-28 lg:py-36">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-14 lg:gap-24">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <motion.span
              className="eyebrow inline-block"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            >
              How it composes
            </motion.span>
            <motion.h2
              className="font-display mt-4 text-balance text-foreground leading-[1.08] tracking-[-0.01em] font-normal text-[clamp(1.75rem,4vw,2.5rem)]"
              initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
              animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
              transition={{ type: 'spring', stiffness: 80, damping: 18, delay: 0.1 }}
            >
              Four steps, from blank cream to first reply.
            </motion.h2>
            <motion.p
              className="mt-6 font-body text-pretty text-muted-foreground max-w-[62ch] leading-[1.75] text-base"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ type: 'spring', stiffness: 80, damping: 18, delay: 0.2 }}
            >
              The builder is a wizard that doesn&apos;t feel like one. You can flip back and forth
              as you work, and StarForm autosaves every gesture.
            </motion.p>

            <motion.div
              className="mt-9 inline-flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 }}
            >
              <span className="font-body italic text-sm text-muted-foreground">
                Median time to first form
              </span>
              <span className="font-display text-primary text-[2rem] font-medium tracking-[-0.01em] leading-none">
                4m 22s
              </span>
            </motion.div>
          </div>

          <div className="relative" ref={contentRef}>
            <motion.div
              ref={lineRef}
              className="absolute left-6.5 top-2 bottom-2 w-px"
              initial={{ scaleY: 0, originY: 0 }}
              animate={isInView ? { scaleY: 1 } : {}}
              transition={{ type: 'spring', stiffness: 60, damping: 20, delay: 0.3 }}
              style={{
                background:
                  'linear-gradient(to bottom, transparent, color-mix(in oklch, var(--primary) 35%, transparent) 15%, color-mix(in oklch, var(--accent) 40%, transparent) 50%, color-mix(in oklch, var(--chart-4) 35%, transparent) 85%, transparent)',
              }}
              aria-hidden="true"
            />

            <ol className="space-y-10">
              {steps.map((step, index) => (
                <StepItem key={step.n} step={step} index={index} isInView={isInView} />
              ))}
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
