'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'motion/react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const plans = [
  {
    name: 'Free',
    price: { monthly: 0, yearly: 0 },
    description: 'Perfect for getting started.',
    cta: 'Get Started Free',
    href: '/sign-up?plan=free',
    highlighted: false,
    features: [
      { label: 'Up to 3 forms', included: true },
      { label: '100 submissions / month', included: true },
      { label: '1 theme (Starter)', included: true },
      { label: 'QR code sharing', included: true },
      { label: 'CSV export', included: false },
      { label: 'Webhook notifications', included: false },
      { label: 'Custom themes', included: false },
      { label: 'Priority support', included: false },
    ],
  },
  {
    name: 'Pro',
    price: { monthly: 499, yearly: 3999 },
    description: 'For serious form builders.',
    cta: 'Get Started',
    href: '/sign-up?plan=pro',
    highlighted: true,
    features: [
      { label: 'Unlimited forms', included: true },
      { label: '10,000 submissions / month', included: true },
      { label: 'All 5 themes', included: true },
      { label: 'QR code sharing', included: true },
      { label: 'CSV export', included: true },
      { label: 'Webhook notifications', included: true },
      { label: 'Custom themes', included: false },
      { label: 'Priority support', included: false },
    ],
  },
  {
    name: 'Enterprise',
    price: { monthly: null, yearly: null },
    description: 'Custom solutions for teams.',
    cta: 'Contact Sales',
    href: 'mailto:sales@starform.dev',
    highlighted: false,
    features: [
      { label: 'Everything in Pro', included: true },
      { label: 'Custom submission limits', included: true },
      { label: 'Custom themes', included: true },
      { label: 'Priority support', included: true },
      { label: 'Dedicated account manager', included: true },
      { label: 'On-premise deployment', included: false },
    ],
  },
];

function PlanCard({
  plan,
  index,
  isInView,
  yearly,
}: {
  plan: (typeof plans)[0];
  index: number;
  isInView: boolean;
  yearly: boolean;
}) {
  return (
    <motion.div
      className={`relative flex flex-col rounded-xl border p-8 transition-all ${plan.highlighted ? 'border-primary/30 bg-card' : 'border-border bg-card'}`}
      initial={{ opacity: 0, y: 50, filter: 'blur(8px)' }}
      animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ type: 'spring', stiffness: 80, damping: 18, delay: index * 0.1 }}
      style={{
        boxShadow: plan.highlighted
          ? '0 8px 32px oklch(0.47 0.155 248 / 0.12), 0 24px 60px oklch(0.78 0.088 308 / 0.08)'
          : 'var(--shadow-card)',
      }}
    >
      {plan.highlighted && (
        <motion.span
          className="font-body absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-0.5 text-[0.75rem] font-medium uppercase tracking-widest text-primary-foreground"
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: index * 0.1 + 0.2 }}
        >
          Most Popular
        </motion.span>
      )}

      <h3 className="font-display mb-1 text-[1.25rem] font-medium text-foreground">{plan.name}</h3>
      <p className="font-body mb-5 text-sm text-muted-foreground">{plan.description}</p>

      <div className="mb-6">
        {plan.price.monthly == null ? (
          <span className="font-display text-[2rem] font-normal tracking-[-0.01em] text-foreground">
            Custom
          </span>
        ) : (
          <div className="flex items-baseline gap-1">
            <span className="font-display text-[2rem] font-normal tracking-[-0.01em] text-foreground">
              ₹{yearly ? plan.price.yearly : plan.price.monthly}
            </span>
            <span className="font-body text-sm text-muted-foreground">
              /{yearly ? 'year' : 'month'}
            </span>
          </div>
        )}
      </div>

      <Button asChild variant={plan.highlighted ? 'default' : 'outline'} className="mb-8 w-full">
        <Link href={plan.href}>{plan.cta}</Link>
      </Button>

      <div className="gradient-divider mb-6" />
      <div className="flex flex-col gap-3">
        {plan.features.map((feature, i) => (
          <motion.div
            key={feature.label}
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -10 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: index * 0.1 + 0.3 + i * 0.05 }}
          >
            {feature.included ? (
              <Check className="h-4 w-4 shrink-0 text-primary" />
            ) : (
              <X className="h-4 w-4 shrink-0 text-muted-foreground/40" />
            )}
            <span
              className={`font-body text-sm ${feature.included ? 'text-foreground' : 'text-muted-foreground/60'}`}
            >
              {feature.label}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export function Pricing() {
  const [yearly, setYearly] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="pricing" className="relative overflow-hidden py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6" ref={ref}>
        <div className="mb-12 flex flex-col items-center gap-4 text-center">
          <motion.span
            className="eyebrow inline-block"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          >
            Pricing
          </motion.span>
          <motion.h2
            className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-normal tracking-[-0.01em] text-foreground"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ type: 'spring', stiffness: 80, damping: 18, delay: 0.1 }}
          >
            Simple, transparent pricing
          </motion.h2>

          <motion.div
            className="mt-4 flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            <span
              className={`font-body text-sm ${yearly ? 'text-muted-foreground' : 'text-foreground'}`}
            >
              Monthly
            </span>
            <button
              onClick={() => setYearly(!yearly)}
              className={`relative h-6 w-11 rounded-full transition-colors ${yearly ? 'bg-primary' : 'bg-border'}`}
              role="switch"
              aria-checked={yearly}
              aria-label="Toggle yearly billing"
            >
              <motion.span
                className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-background shadow-sm"
                animate={{ x: yearly ? 20 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
            <span
              className={`font-body text-sm ${yearly ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              Yearly
              <span className="ml-1.5 rounded-full bg-secondary/30 px-2 py-0.5 text-[0.75rem] text-secondary-foreground">
                Save ~33%
              </span>
            </span>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {plans.map((plan, index) => (
            <PlanCard
              key={plan.name}
              plan={plan}
              index={index}
              isInView={isInView}
              yearly={yearly}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
