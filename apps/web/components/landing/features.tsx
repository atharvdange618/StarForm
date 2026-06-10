'use client';

import { useRef, useEffect } from 'react';
import { motion, useInView, useMotionValue } from 'motion/react';
import { Lock, BarChart3, FileDown, History, ShieldCheck, Webhook, Palette } from 'lucide-react';

function DoubleBezelCard({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
      animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{
        type: 'spring',
        stiffness: 80,
        damping: 18,
        delay,
      }}
    >
      <div
        className="relative rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm p-1"
        style={{
          boxShadow: `
            inset 0 1px 0 oklch(1 0 0 / 0.06),
            inset 0 -1px 0 oklch(0 0 0 / 0.04),
            0 8px 32px oklch(0 0 0 / 0.08)
          `,
        }}
      >
        <div
          className="relative rounded-xl bg-card/80 backdrop-blur-md p-8 lg:p-10 overflow-hidden"
          style={{
            boxShadow: 'inset 0 1px 2px oklch(0 0 0 / 0.06)',
          }}
        >
          {children}
        </div>
      </div>
    </motion.div>
  );
}

function AnimatedChart() {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <div className="mt-7 relative h-32">
      <svg ref={ref} viewBox="0 0 600 130" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartFillNew" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-1)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--chart-1)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((y) => (
          <line
            key={y}
            x1="0"
            x2="600"
            y1={130 * y}
            y2={130 * y}
            stroke="var(--border)"
            strokeWidth="0.5"
          />
        ))}
        <motion.path
          d="M0,100 C50,80 90,90 140,60 C190,35 230,55 280,40 C330,28 370,52 420,30 C470,12 510,28 560,18 L600,15 L600,130 L0,130 Z"
          fill="url(#chartFillNew)"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
        />
        <motion.path
          d="M0,100 C50,80 90,90 140,60 C190,35 230,55 280,40 C330,28 370,52 420,30 C470,12 510,28 560,18 L600,15"
          fill="none"
          stroke="var(--chart-1)"
          strokeWidth="1.75"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : {}}
          transition={{
            type: 'spring',
            stiffness: 60,
            damping: 18,
            delay: 0.3,
            duration: 1.5,
          }}
        />
        {[
          [140, 60],
          [280, 40],
          [420, 30],
          [560, 18],
        ].map(([x, y], i) => (
          <motion.circle
            key={`${x}-${y}`}
            cx={x}
            cy={y}
            r="3"
            fill="var(--card)"
            stroke="var(--chart-1)"
            strokeWidth="1.5"
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20,
              delay: 0.8 + i * 0.1,
            }}
          />
        ))}
      </svg>
    </div>
  );
}

function ParallaxOrb({ className, speed = 0.5 }: { className: string; speed?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      mouseX.set((e.clientX - centerX) * speed * 0.3);
      mouseY.set((e.clientY - centerY) * speed * 0.3);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [speed, mouseX, mouseY]);

  return (
    <motion.div
      ref={ref}
      className={`absolute pointer-events-none ${className}`}
      style={{ x: mouseX, y: mouseY }}
      aria-hidden="true"
    />
  );
}

export default function Features() {
  return (
    <section id="features" className="relative">
      <div className="max-w-[1280px] mx-auto px-8 lg:px-14 py-28 lg:py-36">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
          <div>
            <span className="eyebrow">The gallery</span>
            <h2 className="font-display mt-4 text-balance text-foreground max-w-[20ch] leading-[1.08] tracking-[-0.01em] font-normal text-[clamp(1.75rem,4vw,2.5rem)]">
              Everything in StarForm earns its frame.
            </h2>
          </div>
          <p className="font-body italic text-pretty text-muted-foreground max-w-[62ch] leading-[1.75] text-base">
            We resisted feature creep on purpose. Each capability is here because three beta users
            asked for it - never because a competitor had it.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <DoubleBezelCard className="lg:col-span-7" delay={0}>
            <ParallaxOrb className="-top-16 -right-16 w-64 h-64 orb-cerulean" speed={0.8} />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-fullbg-(--badge-cerulean-bg)">
                  <BarChart3 size={17} strokeWidth={1.5} color="var(--badge-cerulean-fg)" />
                </span>
                <span className="badgebg-(--badge-cerulean-bg) text-(--badge-cerulean-fg)">
                  Analytics
                </span>
              </div>
              <h3 className="font-display text-balance text-foreground text-xl font-medium tracking-[-0.005em]">
                Submissions you&apos;ll actually want to look at.
              </h3>
              <p className="mt-3 font-body text-pretty text-muted-foreground max-w-[62ch] leading-[1.75] text-base">
                Beautiful, interactive charts that update instantly. Explore your data by date,
                question, or audience without any confusing setup. Just filter and download.
              </p>

              <AnimatedChart />

              <div className="mt-5 flex flex-wrap items-center gap-y-5 gap-x-6 sm:gap-8">
                <Stat label="Submissions, 30d" value="2,841" delta="+418" tone="cerulean" />
                <div className="hidden sm:block w-px h-9 bg-border" />
                <Stat label="Completion rate" value="78%" delta="+4pp" tone="sage" />
                <div className="hidden sm:block w-px h-9 bg-border" />
                <Stat label="Median time" value="1:48" delta="−22s" tone="gold" />
              </div>
            </div>
          </DoubleBezelCard>

          <DoubleBezelCard className="lg:col-span-5" delay={0.1}>
            <ParallaxOrb className="-bottom-16 -right-10 w-56 h-56 orb-lavender" speed={0.6} />
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-5">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-(--badge-lavender-bg)">
                  <Palette size={17} strokeWidth={1.5} color="var(--badge-lavender-fg)" />
                </span>
                <span className="badge bg-(--badge-lavender-bg) text-(--badge-lavender-fg)">
                  Themes
                </span>
              </div>
              <h3 className="font-display text-balance text-foreground text-xl font-medium tracking-[-0.005em]">
                Match the form to the moment.
              </h3>
              <p className="mt-3 font-body text-pretty text-muted-foreground max-w-[62ch] leading-[1.75] text-base">
                Customizable themes that control everything from colors and fonts to spacing and
                animations. Make your forms look perfectly on-brand.
              </p>

              <div className="mt-auto pt-7 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-3">
                {[
                  {
                    name: 'Morning Mist',
                    chips: [
                      'oklch(0.97 0.012 88)',
                      'oklch(0.47 0.155 248)',
                      'oklch(0.78 0.088 308)',
                    ],
                  },
                  {
                    name: 'Dusk Seine',
                    chips: [
                      'oklch(0.19 0.042 268)',
                      'oklch(0.67 0.13 245)',
                      'oklch(0.76 0.108 82)',
                    ],
                  },
                  {
                    name: 'Haystacks',
                    chips: ['oklch(0.95 0.04 82)', 'oklch(0.8 0.115 82)', 'oklch(0.6 0.17 22)'],
                  },
                ].map((t) => (
                  <div key={t.name} className="rounded-xl p-3 bg-background border border-border">
                    <div className="flex gap-1 mb-2">
                      {t.chips.map((c) => (
                        <span
                          key={c}
                          className="w-5 h-5 rounded-full border border-border"
                          style={{ background: c }}
                        />
                      ))}
                    </div>
                    <div className="font-display text-foreground text-[1.1rem] font-medium">
                      {t.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DoubleBezelCard>

          <FeatureTile
            colSpan={4}
            icon={History}
            tone={{ bg: 'var(--badge-sage-bg)', fg: 'var(--badge-sage-fg)' }}
            label="Versions"
            title="Safe, stress-free editing."
            body="Update your live forms anytime without losing or messing up the answers you've already collected."
            delay={0.15}
          />
          <FeatureTile
            colSpan={4}
            icon={FileDown}
            tone={{ bg: 'var(--badge-gold-bg)', fg: 'var(--badge-gold-fg)' }}
            label="Export"
            title="One-click downloads."
            body="Instantly download all your responses to a spreadsheet, whether you have a few answers or hundreds of thousands."
            delay={0.2}
          />
          <FeatureTile
            colSpan={4}
            icon={ShieldCheck}
            tone={{ bg: 'var(--badge-rose-bg)', fg: 'var(--badge-rose-fg)' }}
            label="Anti-spam"
            title="Smart duplicate prevention."
            body="Automatically block duplicate submissions behind the scenes without forcing your respondents to create an account."
            delay={0.25}
          />
          <FeatureTile
            colSpan={6}
            icon={Webhook}
            tone={{ bg: 'var(--badge-cerulean-bg)', fg: 'var(--badge-cerulean-fg)' }}
            label="Integrations"
            title="Connect to your favorite tools."
            body="Send form responses instantly to Slack, email, or thousands of other apps the moment a respondent hits submit."
            delay={0.3}
          />
          <FeatureTile
            colSpan={6}
            icon={Lock}
            tone={{ bg: 'var(--badge-lavender-bg)', fg: 'var(--badge-lavender-fg)' }}
            label="Visibility"
            title="Three flavours of share."
            body="Make your form public, unlisted, or invite-only. Automatically close it on a specific date, after a certain number of replies, or manually."
            delay={0.35}
          />
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-8 lg:px-14">
        <div className="brushstroke" />
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  delta,
  tone,
}: {
  label: string;
  value: string;
  delta: string;
  tone: 'cerulean' | 'sage' | 'gold';
}) {
  const colors: Record<string, { bg: string; fg: string }> = {
    cerulean: { bg: 'var(--badge-cerulean-bg)', fg: 'var(--badge-cerulean-fg)' },
    sage: { bg: 'var(--badge-sage-bg)', fg: 'var(--badge-sage-fg)' },
    gold: { bg: 'var(--badge-gold-bg)', fg: 'var(--badge-gold-fg)' },
  };
  const c = colors[tone];
  return (
    <div>
      <div className="eyebrow mb-1">{label}</div>
      <div className="flex items-baseline gap-2">
        <span className="font-display text-foreground text-[1.75rem] font-medium tracking-[-0.01em] leading-none">
          {value}
        </span>
        <span className="badge text-xs px-2 py-0.5" style={{ background: c?.bg, color: c?.fg }}>
          {delta}
        </span>
      </div>
    </div>
  );
}

function FeatureTile({
  colSpan,
  icon: Icon,
  tone,
  label,
  title,
  body,
  delay = 0,
}: {
  colSpan: number;
  icon: React.ElementType;
  tone: { bg: string; fg: string };
  label: string;
  title: string;
  body: string;
  delay?: number;
}) {
  const spanClass: Record<number, string> = {
    4: 'lg:col-span-4',
    5: 'lg:col-span-5',
    6: 'lg:col-span-6',
    7: 'lg:col-span-7',
    8: 'lg:col-span-8',
  };

  return (
    <DoubleBezelCard className={spanClass[colSpan]} delay={delay}>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <span
            className="inline-flex items-center justify-center w-9 h-9 rounded-full"
            style={{ background: tone.bg }}
          >
            <Icon size={15} strokeWidth={1.5} color={tone.fg} />
          </span>
          <span className="badge" style={{ background: tone.bg, color: tone.fg }}>
            {label}
          </span>
        </div>
        <h3 className="font-display text-balance text-foreground text-xl font-medium tracking-[-0.005em]">
          {title}
        </h3>
        <p className="mt-2.5 font-body text-pretty text-muted-foreground max-w-[62ch] leading-[1.75] text-base">
          {body}
        </p>
      </div>
    </DoubleBezelCard>
  );
}
