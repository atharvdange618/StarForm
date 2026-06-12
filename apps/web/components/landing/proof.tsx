'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';

export default function Proof() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="relative">
      <div className="max-w-7xl mx-auto px-8 lg:px-14">
        <div className="brushstroke" />
      </div>

      <div className="max-w-7xl mx-auto px-8 lg:px-14 py-24 lg:py-32">
        <div className="grid lg:grid-cols-[1fr_auto] gap-12 lg:gap-20 items-center">
          <div>
            <motion.span
              className="eyebrow inline-block"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            >
              A reader writes
            </motion.span>

            <motion.blockquote
              className="pullquote mt-6 font-display text-foreground text-[clamp(1.6rem,3.4vw,2.4rem)]"
              initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
              animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
              transition={{ type: 'spring', stiffness: 80, damping: 18, delay: 0.15 }}
            >
              <span className="text-accent relative leading-0 top-[0.2em] mr-[0.05em] text-[1.2em]">
                &quot;
              </span>
              I&apos;ve used Typeform, Tally, Google Forms, Airtable forms. StarForm is the first
              one I actually <em className="italic text-primary">look forward</em> to opening on
              Monday morning. The submissions feel like postcards, not data.
            </motion.blockquote>

            <motion.div
              className="mt-9 flex items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.3 }}
            >
              <motion.div
                className="w-12 h-12 rounded-full flex items-center justify-center font-display bg-(--badge-gold-bg) text-(--badge-gold-fg) text-[1.1rem] font-medium"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                KC
              </motion.div>
              <div>
                <div className="font-body text-sm text-foreground font-medium">Kamlesh Chavan</div>
                <div className="font-body italic text-sm text-muted-foreground">
                  Game Developer · using StarForm since beta-3
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="lg:border-l lg:pl-12 border-border"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ type: 'spring', stiffness: 80, damping: 18, delay: 0.25 }}
          >
            <Number label="forms built" value="6,142" delay={0.35} isInView={isInView} />
            <div className="my-6 w-full h-px bg-border" />
            <Number label="submissions collected" value="318k" delay={0.4} isInView={isInView} />
            <div className="my-6 w-full h-px bg-border" />
            <Number label="median response time" value="2m 14s" delay={0.45} isInView={isInView} />
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 lg:px-14">
        <div className="brushstroke" />
      </div>
    </section>
  );
}

function Number({
  label,
  value,
  delay,
  isInView,
}: {
  label: string;
  value: string;
  delay: number;
  isInView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ type: 'spring', stiffness: 100, damping: 20, delay }}
    >
      <div className="eyebrow mb-1">{label}</div>
      <motion.div
        className="font-display text-foreground text-[2.5rem] font-normal tracking-[-0.015em] leading-none"
        initial={{ scale: 0.8 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ type: 'spring', stiffness: 100, damping: 15, delay: delay + 0.1 }}
      >
        {value}
      </motion.div>
    </motion.div>
  );
}
