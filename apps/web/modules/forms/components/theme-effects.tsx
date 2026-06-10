'use client';

import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  z: number;
  prevZ: number;
  hue: number;
}

const STAR_COUNT = 600;

export function WarpDriveEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    let cx = 0;
    let cy = 0;

    let speed = 6;
    const targetSpeed = 18;
    const acceleration = 0.04;

    function makestar(): Star {
      return {
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: Math.random() * width,
        prevZ: 0,
        hue: Math.random() < 0.6 ? 220 + Math.random() * 50 : 180 + Math.random() * 20,
      };
    }

    const stars: Star[] = [];

    function resize() {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      cx = width / 2;
      cy = height / 2;

      stars.length = 0;
      for (let i = 0; i < STAR_COUNT; i++) {
        const s = makestar();
        s.z = Math.random() * width;
        s.prevZ = s.z;
        stars.push(s);
      }
    }

    resize();
    window.addEventListener('resize', resize);

    function draw() {
      if (!ctx) return;
      if (speed < targetSpeed) {
        speed = Math.min(targetSpeed, speed + acceleration);
      }

      ctx.fillStyle = 'rgba(2, 4, 18, 0.35)';
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        if (!s) continue;
        s.prevZ = s.z;
        s.z -= speed;

        if (s.z <= 0) {
          const ns = makestar();
          ns.z = width;
          ns.prevZ = width;
          stars[i] = ns;
          continue;
        }

        const scaleNow = width / s.z;
        const scalePrev = width / s.prevZ;

        const xNow = cx + s.x * scaleNow;
        const yNow = cy + s.y * scaleNow;
        const xPrev = cx + s.x * scalePrev;
        const yPrev = cy + s.y * scalePrev;

        const proximity = 1 - s.z / width;
        const brightness = Math.min(1, proximity * 1.4);
        const lineWidth = Math.max(0.5, proximity * 2.5);

        const lightness = Math.round(50 + proximity * 45);
        const saturation = Math.round(80 - proximity * 60);
        const alpha = Math.min(1, 0.4 + brightness * 0.6);

        ctx.beginPath();
        ctx.moveTo(xPrev, yPrev);
        ctx.lineTo(xNow, yNow);

        const grad = ctx.createLinearGradient(xPrev, yPrev, xNow, yNow);
        grad.addColorStop(0, `hsla(${s.hue}, ${saturation}%, ${lightness - 15}%, 0)`);
        grad.addColorStop(1, `hsla(${s.hue}, ${saturation}%, ${lightness}%, ${alpha})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.stroke();

        if (proximity > 0.6) {
          const dotRadius = proximity * 2;
          ctx.beginPath();
          ctx.arc(xNow, yNow, dotRadius, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${s.hue}, 40%, 95%, ${proximity * 0.9})`;
          ctx.fill();
        }
      }

      const coreSize = 80 + Math.sin(Date.now() * 0.002) * 20;
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreSize);
      coreGrad.addColorStop(0, 'hsla(230, 100%, 85%, 0.18)');
      coreGrad.addColorStop(0.4, 'hsla(245, 100%, 70%, 0.07)');
      coreGrad.addColorStop(1, 'hsla(260, 100%, 60%, 0)');
      ctx.beginPath();
      ctx.arc(cx, cy, coreSize, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
}

const MATRIX_CHARS =
  'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function MatrixRainEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let lastTime = 0;
    const fps = 20;
    const interval = 1000 / fps;

    const fontSize = 14;
    let cols: number;
    let drops: number[];

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      cols = Math.floor(canvas.width / fontSize);
      const prev = drops ?? [];
      drops = Array.from({ length: cols }, (_, i) => prev[i] ?? Math.floor(Math.random() * -50));
    }

    resize();
    window.addEventListener('resize', resize);

    function draw(timestamp: number) {
      if (!canvas || !ctx) return;
      animId = requestAnimationFrame(draw);

      const elapsed = timestamp - lastTime;
      if (elapsed < interval) return;
      lastTime = timestamp - (elapsed % interval);

      ctx.fillStyle = 'rgba(6, 16, 9, 0.18)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < drops.length; i++) {
        const drop = drops[i];
        if (drop === undefined) continue;
        const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)] ?? '';
        const y = drop * fontSize;

        ctx.fillStyle = `oklch(0.95 0.18 145)`;
        ctx.font = `bold ${fontSize}px monospace`;
        ctx.fillText(char, i * fontSize, y);

        ctx.fillStyle = `oklch(0.60 0.14 145 / 0.85)`;
        ctx.font = `${fontSize}px monospace`;
        if (drop > 1) {
          const bodyChar = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)] ?? '';
          ctx.fillText(bodyChar, i * fontSize, y - fontSize);
        }

        let currentDrop = drop;
        if (y > canvas.height && Math.random() > 0.975) {
          currentDrop = 0;
        }
        drops[i] = currentDrop + 1;
      }
    }

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="matrix-rain" aria-hidden="true" />;
}
