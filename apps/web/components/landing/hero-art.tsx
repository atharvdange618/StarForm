'use client';

import { useEffect, useRef } from 'react';

function buildSvg(
  cerulean: string,
  lavender: string,
  sage: string,
  gold: string,
  rose: string,
): string {
  const row1 = [120, 240, 380, 540, 700, 860, 1020, 1180, 1320]
    .map((x, i) => {
      const c = [cerulean, lavender, sage, gold, rose, cerulean, lavender, sage, gold];
      return `<circle cx="${x}" cy="160" r="${i % 3 === 0 ? 2.5 : 1.8}" fill="${c[i]}" />`;
    })
    .join('\n          ');

  const row2 = [80, 220, 360, 500, 660, 820, 980, 1140, 1300, 1420]
    .map((x, i) => {
      const c = [gold, rose, cerulean, lavender, sage, gold, rose, cerulean, lavender, sage];
      return `<circle cx="${x}" cy="340" r="${i % 3 === 0 ? 2.8 : 1.6}" fill="${c[i]}" />`;
    })
    .join('\n          ');

  const row3 = [160, 300, 450, 600, 760, 920, 1080, 1240, 1380]
    .map((x, i) => {
      const c = [lavender, cerulean, rose, sage, gold, lavender, cerulean, rose, sage];
      return `<circle cx="${x}" cy="560" r="${i % 3 === 0 ? 2.2 : 1.5}" fill="${c[i]}" />`;
    })
    .join('\n          ');

  const row4 = [100, 260, 420, 580, 740, 900, 1060, 1220, 1360]
    .map((x, i) => {
      const c = [rose, gold, lavender, cerulean, sage, rose, gold, lavender, cerulean];
      return `<circle cx="${x}" cy="760" r="${i % 3 === 0 ? 2.0 : 1.4}" fill="${c[i]}" />`;
    })
    .join('\n          ');

  return `
    <svg
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      class="w-full h-full"
    >
      <defs>
        <radialGradient id="bg-orb-lavender" cx="15%" cy="20%" r="45%">
          <stop offset="0%" stop-color="${lavender}" stop-opacity="0.22" />
          <stop offset="100%" stop-color="${lavender}" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="bg-orb-cerulean" cx="85%" cy="15%" r="50%">
          <stop offset="0%" stop-color="${cerulean}" stop-opacity="0.18" />
          <stop offset="100%" stop-color="${cerulean}" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="bg-orb-gold" cx="50%" cy="90%" r="40%">
          <stop offset="0%" stop-color="${gold}" stop-opacity="0.16" />
          <stop offset="100%" stop-color="${gold}" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="bg-orb-rose" cx="80%" cy="75%" r="38%">
          <stop offset="0%" stop-color="${rose}" stop-opacity="0.14" />
          <stop offset="100%" stop-color="${rose}" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="bg-orb-sage" cx="20%" cy="80%" r="35%">
          <stop offset="0%" stop-color="${sage}" stop-opacity="0.12" />
          <stop offset="100%" stop-color="${sage}" stop-opacity="0" />
        </radialGradient>

        <radialGradient id="node-glow-cerulean" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${cerulean}" stop-opacity="0.8" />
          <stop offset="60%" stop-color="${cerulean}" stop-opacity="0.2" />
          <stop offset="100%" stop-color="${cerulean}" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="node-glow-gold" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${gold}" stop-opacity="0.8" />
          <stop offset="60%" stop-color="${gold}" stop-opacity="0.2" />
          <stop offset="100%" stop-color="${gold}" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="node-glow-rose" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${rose}" stop-opacity="0.8" />
          <stop offset="60%" stop-color="${rose}" stop-opacity="0.2" />
          <stop offset="100%" stop-color="${rose}" stop-opacity="0" />
        </radialGradient>

        <filter id="blur-xl" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="40" />
        </filter>
        <filter id="blur-lg" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="16" />
        </filter>
        <filter id="blur-sm" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>

        <linearGradient id="stroke-cerulean-h" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${cerulean}" stop-opacity="0" />
          <stop offset="30%" stop-color="${cerulean}" stop-opacity="0.18" />
          <stop offset="70%" stop-color="${cerulean}" stop-opacity="0.18" />
          <stop offset="100%" stop-color="${cerulean}" stop-opacity="0" />
        </linearGradient>
        <linearGradient id="stroke-lavender-d" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${lavender}" stop-opacity="0" />
          <stop offset="50%" stop-color="${lavender}" stop-opacity="0.15" />
          <stop offset="100%" stop-color="${lavender}" stop-opacity="0" />
        </linearGradient>
        <linearGradient id="stroke-gold-d" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${gold}" stop-opacity="0" />
          <stop offset="50%" stop-color="${gold}" stop-opacity="0.13" />
          <stop offset="100%" stop-color="${gold}" stop-opacity="0" />
        </linearGradient>
        <linearGradient id="stroke-rose-h" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${rose}" stop-opacity="0" />
          <stop offset="50%" stop-color="${rose}" stop-opacity="0.12" />
          <stop offset="100%" stop-color="${rose}" stop-opacity="0" />
        </linearGradient>
        <linearGradient id="stroke-sage-d" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${sage}" stop-opacity="0" />
          <stop offset="50%" stop-color="${sage}" stop-opacity="0.12" />
          <stop offset="100%" stop-color="${sage}" stop-opacity="0" />
        </linearGradient>
      </defs>

      <g filter="url(#blur-xl)">
        <rect width="1440" height="900" fill="url(#bg-orb-lavender)" />
        <rect width="1440" height="900" fill="url(#bg-orb-cerulean)" />
        <rect width="1440" height="900" fill="url(#bg-orb-gold)" />
        <rect width="1440" height="900" fill="url(#bg-orb-rose)" />
        <rect width="1440" height="900" fill="url(#bg-orb-sage)" />
      </g>

      <g class="hero-art-curves">
        <path d="M -80 260 C 200 140, 580 320, 900 210 S 1280 80, 1540 200"
          fill="none" stroke="url(#stroke-cerulean-h)" stroke-width="1.6" stroke-linecap="round" />
        <path d="M 60 680 C 280 520, 560 480, 820 380 S 1160 240, 1400 120"
          fill="none" stroke="url(#stroke-lavender-d)" stroke-width="1.4" stroke-linecap="round" />
        <path d="M 1480 760 C 1200 680, 900 720, 640 640 S 280 520, -40 600"
          fill="none" stroke="url(#stroke-gold-d)" stroke-width="1.3" stroke-linecap="round" />
        <path d="M -40 160 C 200 200, 420 120, 680 170 S 1000 260, 1260 180 S 1400 100, 1520 140"
          fill="none" stroke="url(#stroke-rose-h)" stroke-width="1.1" stroke-linecap="round" />
        <path d="M -40 800 C 200 740, 500 780, 760 720 S 1100 640, 1480 680"
          fill="none" stroke="url(#stroke-sage-d)" stroke-width="1.2" stroke-linecap="round" />
        <path d="M -80 310 C 240 190, 600 360, 920 250 S 1300 130, 1540 250"
          fill="none" stroke="${cerulean}" stroke-opacity="0.06" stroke-width="2.5" stroke-linecap="round" />
      </g>

      <g class="hero-art-grid">
        ${row1}
        ${row2}
        ${row3}
        ${row4}
      </g>

      <g class="hero-art-lines" stroke-linecap="round">
        <line x1="120" y1="160" x2="240" y2="160" stroke="${cerulean}" stroke-width="0.8" />
        <line x1="380" y1="160" x2="540" y2="160" stroke="${lavender}" stroke-width="0.8" />
        <line x1="700" y1="160" x2="860" y2="160" stroke="${sage}" stroke-width="0.8" />
        <line x1="1020" y1="160" x2="1180" y2="160" stroke="${gold}" stroke-width="0.8" />
        <line x1="80" y1="340" x2="220" y2="340" stroke="${gold}" stroke-width="0.8" />
        <line x1="360" y1="340" x2="500" y2="340" stroke="${rose}" stroke-width="0.8" />
        <line x1="660" y1="340" x2="820" y2="340" stroke="${cerulean}" stroke-width="0.8" />
        <line x1="980" y1="340" x2="1140" y2="340" stroke="${lavender}" stroke-width="0.8" />
        <line x1="240" y1="160" x2="220" y2="340" stroke="${lavender}" stroke-width="0.6" />
        <line x1="540" y1="160" x2="500" y2="340" stroke="${cerulean}" stroke-width="0.6" />
        <line x1="860" y1="160" x2="820" y2="340" stroke="${gold}" stroke-width="0.6" />
        <line x1="1180" y1="160" x2="1140" y2="340" stroke="${rose}" stroke-width="0.6" />
        <line x1="300" y1="560" x2="360" y2="340" stroke="${cerulean}" stroke-width="0.6" />
        <line x1="600" y1="560" x2="660" y2="340" stroke="${sage}" stroke-width="0.6" />
        <line x1="920" y1="560" x2="980" y2="340" stroke="${lavender}" stroke-width="0.6" />
      </g>

      <g filter="url(#blur-lg)">
        <circle cx="148" cy="188" r="28" fill="url(#node-glow-cerulean)" />
      </g>
      <g filter="url(#blur-sm)">
        <circle cx="148" cy="188" r="10" fill="${cerulean}" opacity="0.35" />
      </g>
      <circle cx="148" cy="188" r="3.5" fill="${cerulean}" opacity="0.75" />

      <g filter="url(#blur-lg)">
        <circle cx="1292" cy="148" r="24" fill="url(#node-glow-gold)" />
      </g>
      <g filter="url(#blur-sm)">
        <circle cx="1292" cy="148" r="9" fill="${gold}" opacity="0.35" />
      </g>
      <circle cx="1292" cy="148" r="3" fill="${gold}" opacity="0.7" />

      <g filter="url(#blur-lg)">
        <circle cx="1100" cy="752" r="26" fill="url(#node-glow-rose)" />
      </g>
      <g filter="url(#blur-sm)">
        <circle cx="1100" cy="752" r="9" fill="${rose}" opacity="0.35" />
      </g>
      <circle cx="1100" cy="752" r="3.2" fill="${rose}" opacity="0.7" />

      <g filter="url(#blur-lg)">
        <circle cx="340" cy="768" r="22" fill="url(#node-glow-cerulean)" />
      </g>
      <g filter="url(#blur-sm)">
        <circle cx="340" cy="768" r="8" fill="${sage}" opacity="0.35" />
      </g>
      <circle cx="340" cy="768" r="2.8" fill="${sage}" opacity="0.7" />

      <g>
        <circle cx="200" cy="80" r="2.2" fill="${cerulean}" opacity="0.4">
          <animate attributeName="cy" values="80;70;80" dur="6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0.7;0.4" dur="6s" repeatCount="indefinite" />
        </circle>
        <circle cx="1300" cy="60" r="1.8" fill="${gold}" opacity="0.35">
          <animate attributeName="cy" values="60;52;60" dur="5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.35;0.6;0.35" dur="5s" repeatCount="indefinite" />
        </circle>
        <circle cx="1400" cy="440" r="2" fill="${rose}" opacity="0.3">
          <animate attributeName="cx" values="1400;1392;1400" dur="7s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0.55;0.3" dur="7s" repeatCount="indefinite" />
        </circle>
        <circle cx="720" cy="870" r="1.6" fill="${lavender}" opacity="0.35">
          <animate attributeName="cy" values="870;862;870" dur="4.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0.55;0.3" dur="4.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="60" cy="820" r="2" fill="${sage}" opacity="0.3">
          <animate attributeName="cy" values="820;812;820" dur="5.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.25;0.5;0.25" dur="5.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="1370" cy="620" r="1.5" fill="${cerulean}" opacity="0.3">
          <animate attributeName="cy" values="620;613;620" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0.5;0.3" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="480" cy="50" r="1.8" fill="${gold}" opacity="0.28">
          <animate attributeName="cy" values="50;44;50" dur="6.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.28;0.5;0.28" dur="6.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="960" cy="870" r="1.6" fill="${rose}" opacity="0.28">
          <animate attributeName="cy" values="870;863;870" dur="5.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.28;0.48;0.28" dur="5.8s" repeatCount="indefinite" />
        </circle>
      </g>

      <g filter="url(#blur-lg)" class="hero-art-halos">
        <ellipse cx="720" cy="-20" rx="480" ry="120" fill="${cerulean}" />
        <ellipse cx="720" cy="920" rx="560" ry="130" fill="${lavender}" />
      </g>
    </svg>
  `;
}

function readColors() {
  const s = getComputedStyle(document.documentElement);
  return {
    cerulean: s.getPropertyValue('--chart-1').trim() || 'oklch(0.52 0.155 248)',
    lavender: s.getPropertyValue('--chart-2').trim() || 'oklch(0.75 0.092 308)',
    sage: s.getPropertyValue('--chart-3').trim() || 'oklch(0.72 0.118 148)',
    gold: s.getPropertyValue('--chart-4').trim() || 'oklch(0.8 0.115 82)',
    rose: s.getPropertyValue('--chart-5').trim() || 'oklch(0.72 0.125 352)',
  };
}

export function HeroArt() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function render() {
      if (!container) return;
      const { cerulean, lavender, sage, gold, rose } = readColors();
      container.innerHTML = buildSvg(cerulean, lavender, sage, gold, rose);
    }

    render();

    const observer = new MutationObserver(render);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
      style={{
        maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
      }}
    />
  );
}
