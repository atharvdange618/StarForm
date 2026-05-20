'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const plans = [
  {
    name: 'Free',
    price: { monthly: 0, yearly: 0 },
    description: 'Perfect for getting started.',
    cta: 'Get Started Free',
    href: '/sign-up',
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
    href: '/sign-up',
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

export function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="relative overflow-hidden py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex flex-col items-center gap-4 text-center">
          <span className="eyebrow">Pricing</span>
          <h2
            className="font-display text-[clamp(1.75rem,_4vw,_2.5rem)] font-[400] tracking-[-0.01em] text-foreground"
            style={{ textWrap: 'balance' }}
          >
            Simple, transparent pricing
          </h2>

          <div className="mt-4 flex items-center gap-3">
            <span
              className={`font-body text-sm ${!yearly ? 'text-foreground' : 'text-muted-foreground'}`}
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
              <span
                className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-background shadow-sm transition-transform ${yearly ? 'translate-x-5' : 'translate-x-0'}`}
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
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-[calc(var(--radius)*1.2)] border p-8 transition-all ${
                plan.highlighted
                  ? 'border-primary/30 bg-card shadow-[var(--shadow-card)]'
                  : 'border-border bg-card shadow-[var(--shadow-card)]'
              }`}
            >
              {plan.highlighted && (
                <span className="font-body absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-0.5 text-[0.75rem] font-medium uppercase tracking-[0.1em] text-primary-foreground">
                  Most Popular
                </span>
              )}

              <h3 className="font-display mb-1 text-[1.25rem] font-[500] text-foreground">
                {plan.name}
              </h3>

              <p className="font-body mb-5 text-sm text-muted-foreground">{plan.description}</p>

              <div className="mb-6">
                {plan.price.monthly === null ? (
                  <span className="font-display text-[2rem] font-[400] tracking-[-0.01em] text-foreground">
                    Custom
                  </span>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-[2rem] font-[400] tracking-[-0.01em] text-foreground">
                      ₹{yearly ? plan.price.yearly : plan.price.monthly}
                    </span>
                    <span className="font-body text-sm text-muted-foreground">
                      /{yearly ? 'year' : 'month'}
                    </span>
                  </div>
                )}
              </div>

              <Button
                asChild
                variant={plan.highlighted ? 'default' : 'outline'}
                className="mb-8 w-full"
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>

              <div className="gradient-divider mb-6" />
              <div className="flex flex-col gap-3">
                {plan.features.map((feature) => (
                  <div key={feature.label} className="flex items-center gap-3">
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
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
