// src/components/fx/Embers.tsx
"use client";

import { useEffect, useRef } from "react";

/**
 * Charcoal embers drifting up behind the hero.
 *
 * The kitchen's whole identity is live fire, so this is the one ambient
 * effect that's actually *about* the restaurant rather than decoration.
 *
 * Performance discipline, because this is the only per-frame painting on the
 * site:
 *  - Canvas, not DOM. 40 animated divs would mean 40 composited layers.
 *  - Hard-disabled below 768px and under prefers-reduced-motion. A phone GPU
 *    should not be burning battery on ambience.
 *  - Pauses entirely when the hero scrolls out of view (IntersectionObserver)
 *    and when the tab is hidden.
 *  - Canvas is sized to devicePixelRatio, capped at 2 — uncapped DPR on a 3x
 *    screen means painting 9x the pixels for no visible gain.
 *  - Particles are pooled and recycled; nothing is allocated per frame.
 */

interface Ember {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  life: number;
  maxLife: number;
}

const COUNT = 34;

export default function Embers({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const smallQuery = window.matchMedia("(max-width: 767px)");
    if (motionQuery.matches || smallQuery.matches) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let frame: number | null = null;
    let running = false;

    const embers: Ember[] = [];

    const resetEmber = (e: Ember, initial = false) => {
      e.x = Math.random() * width;
      // Start below the fold so they rise into frame, unless seeding.
      e.y = initial ? Math.random() * height : height + Math.random() * 40;
      e.vx = (Math.random() - 0.5) * 0.22;
      e.vy = -(0.18 + Math.random() * 0.45);
      e.radius = 0.6 + Math.random() * 1.7;
      e.maxLife = 220 + Math.random() * 320;
      e.life = initial ? Math.random() * e.maxLife : 0;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    for (let i = 0; i < COUNT; i++) {
      const e: Ember = { x: 0, y: 0, vx: 0, vy: 0, radius: 1, life: 0, maxLife: 1 };
      resetEmber(e, true);
      embers.push(e);
    }

    const draw = () => {
      frame = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, width, height);

      for (const e of embers) {
        e.life += 1;
        e.x += e.vx;
        e.y += e.vy;
        // A slow horizontal wander, so they don't rise in straight lines.
        e.vx += (Math.random() - 0.5) * 0.012;

        if (e.life > e.maxLife || e.y < -20) {
          resetEmber(e);
          continue;
        }

        // Fade in over the first fifth of life, out over the last half.
        const t = e.life / e.maxLife;
        const alpha = t < 0.2 ? t / 0.2 : 1 - (t - 0.2) / 0.8;

        ctx.beginPath();
        ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(229, 169, 60, ${(alpha * 0.55).toFixed(3)})`;
        ctx.fill();
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(draw);
    };

    const stop = () => {
      running = false;
      if (frame !== null) {
        cancelAnimationFrame(frame);
        frame = null;
      }
      ctx.clearRect(0, 0, width, height);
    };

    // Only burn frames while the hero is actually on screen.
    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting && !document.hidden ? start() : stop()),
      { threshold: 0 }
    );
    observer.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : undefined);
    document.addEventListener("visibilitychange", onVisibility);

    const onResize = () => resize();
    window.addEventListener("resize", onResize, { passive: true });

    // If the viewport crosses into mobile, shut it down entirely.
    const onBreakpoint = (e: MediaQueryListEvent) => (e.matches ? stop() : start());
    smallQuery.addEventListener("change", onBreakpoint);

    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
      smallQuery.removeEventListener("change", onBreakpoint);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 w-full h-full ${className}`}
    />
  );
}
