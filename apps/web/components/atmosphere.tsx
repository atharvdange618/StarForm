'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

export default function Atmosphere() {
  const { scrollY } = useScroll();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const y1 = useTransform(scrollY, [0, 1000], [0, 120]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -80]);
  const y3 = useTransform(scrollY, [0, 1000], [0, 100]);
  const y4 = useTransform(scrollY, [0, 1000], [0, -60]);
  const y5 = useTransform(scrollY, [0, 1000], [0, 90]);

  if (!mounted) {
    return (
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute orb-lavender"
          style={{ top: '-10%', left: '-8%', width: '60vw', height: '60vw' }}
        />
        <div
          className="absolute orb-cerulean"
          style={{ top: '5%', right: '-12%', width: '55vw', height: '55vw' }}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <motion.div
        className="absolute orb-lavender"
        style={{
          top: '-15%',
          left: '-12%',
          width: '70vw',
          height: '70vw',
          y: y1,
        }}
      />
      <motion.div
        className="absolute orb-cerulean"
        style={{
          top: '0%',
          right: '-18%',
          width: '65vw',
          height: '65vw',
          y: y2,
        }}
      />
      <motion.div
        className="absolute orb-sage"
        style={{
          top: '50%',
          left: '-15%',
          width: '55vw',
          height: '55vw',
          y: y3,
        }}
      />
      <motion.div
        className="absolute orb-rose"
        style={{
          top: '65%',
          right: '-12%',
          width: '50vw',
          height: '50vw',
          y: y4,
        }}
      />
      <motion.div
        className="absolute orb-gold"
        style={{
          bottom: '-20%',
          left: '15%',
          width: '70vw',
          height: '60vw',
          y: y5,
        }}
      />

      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '180px',
          mixBlendMode: 'multiply',
          opacity: 0.4,
          zIndex: 9999,
        }}
      />
    </div>
  );
}
