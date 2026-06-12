'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useTransform, useSpring, type Variants } from 'motion/react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { HeroArt } from './hero-art';

function MagneticButton({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 15 };
  const mouseX = useSpring(x, springConfig);
  const mouseY = useSpring(y, springConfig);

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ['7deg', '-7deg']);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ['-7deg', '7deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);
    x.set(deltaX * 12);
    y.set(deltaY * 12);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`relative cursor-pointer ${className}`}
      style={{ x: mouseX, y: mouseY, rotateX, rotateY, transformPerspective: 800 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}

const pulseVariants: Variants = {
  initial: { scale: 1 },
  pulse: {
    scale: [1, 1.03, 1],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20,
      duration: 0.7,
    },
  },
};

export function Hero() {
  const { isSignedIn } = useUser();

  return (
    <section className="relative flex min-h-dvh overflow-hidden">
      <HeroArt />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center px-8 lg:px-14 pt-28 pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center w-full">
          <motion.div
            className="flex flex-col gap-8 lg:pr-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <span
                className="badge eyebrow inline-flex items-center gap-2"
                style={{
                  background: 'var(--badge-cerulean-bg)',
                  color: 'var(--badge-cerulean-fg)',
                }}
              >
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full animate-pulse"
                  style={{ background: 'var(--chart-1)' }}
                />
                Form builder reimagined
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="font-display text-[clamp(2.75rem,7vw,5.5rem)] leading-[1.05] font-light tracking-[-0.02em] text-foreground"
              style={{ textWrap: 'balance' }}
            >
              Give your questions{' '}
              <span
                className="text-primary relative inline-block"
                style={{
                  textShadow:
                    '0 0 60px oklch(0.47 0.155 248 / 0.35), 0 0 120px oklch(0.47 0.155 248 / 0.15)',
                }}
              >
                a canvas
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="font-body max-w-[52ch] text-lg lg:text-xl leading-[1.75] text-muted-foreground"
              style={{ textWrap: 'pretty' }}
            >
              Build dynamic forms with animated themes, collect responses, and uncover insights. No
              code, no complexity - just pure creative flow.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 pt-2">
              <MagneticButton className="inline-flex">
                <Link
                  href={isSignedIn ? '/dashboard' : '/sign-up'}
                  className="btn-primary group flex items-center gap-3 px-8 py-4 text-base"
                >
                  <motion.span
                    variants={pulseVariants}
                    initial="initial"
                    animate="pulse"
                    className="flex items-center gap-2"
                  >
                    {isSignedIn ? 'Go to Dashboard' : 'Get Started Free'}
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-foreground/20 text-sm transition-transform group-hover:translate-x-0.5">
                      <ArrowRight size={14} strokeWidth={2} />
                    </span>
                  </motion.span>
                </Link>
              </MagneticButton>

              <MagneticButton>
                <Link href="#features" className="btn-ghost px-8 py-4 text-base">
                  See Features
                </Link>
              </MagneticButton>
            </motion.div>

            <motion.p variants={itemVariants} className="eyebrow pt-2" style={{ opacity: 0.7 }}>
              Free to start · No credit card required
            </motion.p>
          </motion.div>

          <motion.div
            className="hidden lg:flex items-center justify-center relative"
            initial={{ opacity: 0, x: 60, rotateY: -15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{
              type: 'spring',
              stiffness: 80,
              damping: 20,
              delay: 0.4,
              duration: 1,
            }}
          >
            <div className="relative w-full max-w-md">
              <motion.div
                className="absolute -top-4 -right-4 w-full h-full rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm"
                style={{
                  transform: 'rotate(6deg) translateZ(-20px)',
                  boxShadow: '0 20px 60px oklch(0 0 0 / 0.15)',
                }}
                animate={{ rotate: [6, 8, 6] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute -top-2 -right-2 w-full h-full rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm"
                style={{
                  transform: 'rotate(3deg) translateZ(-10px)',
                  boxShadow: '0 16px 48px oklch(0 0 0 / 0.12)',
                }}
                animate={{ rotate: [3, 5, 3] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="relative rounded-2xl border border-border/60 bg-card/80 backdrop-blur-md p-6 shadow-(--shadow-card)"
                style={{ boxShadow: '0 8px 32px oklch(0 0 0 / 0.1)' }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                      Feedback Form
                    </span>
                    <span className="text-[10px] font-medium text-muted-foreground/80">
                      Draft saved
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                        Full Name
                      </label>
                      <div className="h-10 w-full rounded-xl bg-background/50 border border-border/80 px-3 flex items-center text-xs text-foreground/85">
                        Jane Doe
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                        Email Address
                      </label>
                      <div className="h-10 w-full rounded-xl bg-background/50 border border-border/80 px-3 flex items-center text-xs text-foreground/85">
                        jane@starform.dev
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                        Feedback
                      </label>
                      <div className="h-20 w-full rounded-xl bg-background/50 border border-border/80 p-3 text-xs text-foreground/85 leading-relaxed overflow-hidden">
                        The smooth transitions and custom theme engine make creating forms a pure
                        joy!
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border/40">
                    <button className="h-9 px-4 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-medium shadow-sm transition-colors flex items-center justify-center">
                      Submit Response
                    </button>
                  </div>
                </div>

                <div
                  className="absolute -top-12 -right-12 w-32 h-32 rounded-full orb-cerulean opacity-60"
                  aria-hidden="true"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <span className="eyebrow text-xs" style={{ opacity: 0.5 }}>
          Scroll to explore
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={20} className="text-muted-foreground" style={{ opacity: 0.5 }} />
        </motion.div>
      </motion.div>
    </section>
  );
}
