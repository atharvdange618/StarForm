'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

function ParticleOrb({ className, duration = 8 }: { className: string; duration?: number }) {
  return (
    <motion.div
      className={`absolute rounded-full ${className}`}
      animate={{
        scale: [1, 1.2, 1],
        x: [0, 20, 0],
        y: [0, -15, 0],
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
      aria-hidden="true"
    />
  );
}

export function CTA() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 lg:px-14">
        <div className="brushstroke" />
      </div>

      <div className="max-w-230 mx-auto px-8 lg:px-14 py-32 lg:py-48 text-center relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <ParticleOrb className="w-80 h-80 -top-20 left-1/4 orb-gold opacity-40" duration={7} />
          <ParticleOrb
            className="w-96 h-96 top-1/3 -right-32 orb-cerulean opacity-30"
            duration={9}
          />
          <ParticleOrb
            className="w-72 h-72 -bottom-20 left-1/3 orb-lavender opacity-35"
            duration={8}
          />
          <ParticleOrb className="w-64 h-64 top-10 right-1/4 orb-rose opacity-25" duration={10} />

          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at center, transparent 30%, var(--background) 70%)',
            }}
          />
        </div>

        <motion.span
          className="eyebrow inline-block relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        >
          A blank canvas awaits
        </motion.span>

        <motion.h2
          className="font-display mt-5 mx-auto text-balance text-foreground max-w-[16ch] leading-[1.08] tracking-[-0.01em] font-normal text-[clamp(2.5rem,6vw,4.5rem)] relative z-10"
          initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
          animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ type: 'spring', stiffness: 80, damping: 18, delay: 0.15 }}
        >
          Build your first form in{' '}
          <em className="italic text-primary font-normal">under five minutes</em>.
        </motion.h2>

        <motion.p
          className="mt-7 font-body italic mx-auto text-pretty text-muted-foreground max-w-[62ch] leading-[1.75] text-lg relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: 'spring', stiffness: 80, damping: 18, delay: 0.3 }}
        >
          No card. No demo call. Just a blank cream canvas, a cursor, and you.
        </motion.p>

        {(() => {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
          const docsUrl = `${apiUrl}/docs`;
          return (
            <motion.div
              className="mt-10 flex flex-wrap items-center justify-center gap-4 relative z-10"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ type: 'spring', stiffness: 80, damping: 18, delay: 0.45 }}
            >
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="inline-block"
              >
                <Link
                  href="/dashboard"
                  className="btn-primary relative group px-10 py-5 text-lg inline-flex items-center justify-center"
                  style={{
                    boxShadow:
                      '0 4px 20px oklch(0.47 0.155 248 / 0.45), 0 8px 40px oklch(0.47 0.155 248 / 0.25)',
                  }}
                >
                  <span className="flex items-center gap-3">
                    Start composing
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <ArrowRight size={18} strokeWidth={1.75} />
                    </motion.span>
                  </span>

                  <motion.div
                    className="absolute inset-0 rounded-xl"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ opacity: 1, scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      boxShadow: '0 0 0 2px var(--primary), 0 0 30px oklch(0.47 0.155 248 / 0.4)',
                      pointerEvents: 'none',
                    }}
                  />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="inline-block"
              >
                <Link
                  href={docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost px-8 py-5 text-lg inline-flex items-center justify-center"
                >
                  View the docs
                </Link>
              </motion.div>
            </motion.div>
          );
        })()}
      </div>
    </section>
  );
}
