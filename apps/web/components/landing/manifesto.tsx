'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';

export default function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative">
      <div className="max-w-[1080px] mx-auto px-8 lg:px-14 py-28 lg:py-40 text-center">
        <motion.span
          className="eyebrow inline-block"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0 }}
        >
          Our position
        </motion.span>

        <motion.div
          className="mt-8 relative"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.p
            className="font-display mx-auto text-balance text-foreground max-w-[28ch] leading-tight tracking-[-0.015em] font-light text-[clamp(2rem,4.5vw,3.5rem)]"
            initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
            animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ type: 'spring', stiffness: 80, damping: 18, delay: 0.25 }}
          >
            Most form tools treat questions like rows in a spreadsheet.
          </motion.p>

          <motion.p
            className="font-display mx-auto text-balance text-primary max-w-[28ch] leading-tight tracking-[-0.015em] text-[clamp(2.2rem,5vw,4rem)]"
            initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
            animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ type: 'spring', stiffness: 80, damping: 18, delay: 0.4 }}
          >
            <em className="italic">We treat them like brushstrokes</em>
          </motion.p>

          <motion.p
            className="font-display mx-auto text-balance text-foreground max-w-[28ch] leading-tight tracking-[-0.015em] font-light text-[clamp(2rem,4.5vw,3.5rem)]"
            initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
            animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ type: 'spring', stiffness: 80, damping: 18, delay: 0.55 }}
          >
            - each one earning its place on the canvas.
          </motion.p>
        </motion.div>

        <motion.div
          className="mt-12 flex items-center justify-center gap-3"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.7 }}
        >
          <motion.span
            className="inline-block w-1.5 h-1.5 rounded-full bg-primary"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span className="font-body italic text-sm text-muted-foreground">
            A small note from the makers of StarForm
          </span>
          <motion.span
            className="inline-block w-1.5 h-1.5 rounded-full bg-accent"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          />
        </motion.div>
      </div>

      <div className="max-w-[1280px] mx-auto px-8 lg:px-14">
        <div className="brushstroke" />
      </div>
    </section>
  );
}
