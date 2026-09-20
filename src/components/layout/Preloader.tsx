// src/components/layout/Preloader.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Logo from "@/components/brand/Logo";
import { site } from "@/lib/site";
import { EASE_SEAL, EASE_LAHORI } from "@/lib/motion";

/**
 * The intro.
 *
 * Sequence: the badge scales in, the green ring traces itself, a counter runs
 * to 100, then the entire overlay collapses INTO the logo's circle — the site
 * is revealed from the outside in and the curtain disappears through the mark
 * itself.
 *
 * Performance notes, because this runs at the worst possible moment (first
 * paint, cold cache):
 *  - The exit is a single `clip-path: circle()` interpolation. Clip-path on a
 *    composited layer is GPU work, not layout or paint.
 *  - No canvas here. The previous version ran the ember particle system during
 *    load, competing with the hero's LCP image for main-thread time.
 *  - No blend modes and no backdrop-filter anywhere in this tree.
 *  - The counter is one state update per ~40ms, not per frame.
 *
 * It does NOT gate the page: the site renders underneath and this floats on
 * top, so the HTML is complete and indexable. Plays once per session,
 * dismissable by tap/scroll/key, skipped entirely under reduced motion.
 */

const SESSION_KEY = "lw-intro-seen";
const HOLD_MS = 2300;

// Circumference of the r=93 ring in the logo's 200×200 viewBox.
const RING_LENGTH = 2 * Math.PI * 93;

export default function Preloader() {
  // Starts true so the overlay is in the server HTML — no flash of content
  // before hydration. Removed within a frame for anyone who's seen it.
  const [visible, setVisible] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [count, setCount] = useState(0);
  const reduceMotion = useReducedMotion() ?? false;

  const dismiss = useCallback(() => setVisible(false), []);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      // Private mode / blocked storage — treat as unseen.
    }

    if (seen || reduceMotion) {
      setVisible(false);
      return;
    }

    setPlaying(true);
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* non-fatal */
    }

    const started = performance.now();
    const counter = setInterval(() => {
      const progress = Math.min(1, (performance.now() - started) / (HOLD_MS - 400));
      setCount(Math.round(progress * 100));
      if (progress >= 1) clearInterval(counter);
    }, 40);

    const timer = setTimeout(dismiss, HOLD_MS);
    window.addEventListener("wheel", dismiss, { passive: true, once: true });
    window.addEventListener("touchstart", dismiss, { passive: true, once: true });
    window.addEventListener("keydown", dismiss, { once: true });

    return () => {
      clearInterval(counter);
      clearTimeout(timer);
      window.removeEventListener("wheel", dismiss);
      window.removeEventListener("touchstart", dismiss);
      window.removeEventListener("keydown", dismiss);
    };
  }, [dismiss, reduceMotion]);

  useEffect(() => {
    if (!visible || !playing) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [visible, playing]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          onClick={dismiss}
          aria-hidden
          // The whole curtain collapses into the badge. `circle(0%)` at centre
          // is the logo's position, so the overlay vanishes through the mark.
          initial={{ clipPath: "circle(145% at 50% 50%)" }}
          exit={{
            clipPath: "circle(0% at 50% 50%)",
            transition: { duration: 1, ease: EASE_SEAL },
          }}
          className="fixed inset-0 z-999 flex flex-col items-center justify-center bg-brand-base px-6"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_110%,rgba(229,169,60,0.14),transparent_60%)]" />

          {/* Badge grows slightly as the curtain closes around it, so the
              collapse reads as the mark swallowing the screen. */}
          <motion.div
            exit={{ scale: 1.12, opacity: 0, transition: { duration: 0.8, ease: EASE_SEAL } }}
            className="relative w-[190px] sm:w-[250px] aspect-square transform-gpu"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: EASE_LAHORI, delay: 0.15 }}
              className="absolute inset-0 transform-gpu"
            >
              <Logo className="w-full h-full" tone="brand" withWordmark={false} />
            </motion.div>

            {/* The ring writes itself around the badge. */}
            <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full -rotate-90">
              <motion.circle
                cx="100"
                cy="100"
                r="93"
                fill="none"
                stroke="#15803d"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeDasharray={RING_LENGTH}
                initial={{ strokeDashoffset: RING_LENGTH }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1.7, ease: EASE_LAHORI, delay: 0.1 }}
              />
            </svg>
          </motion.div>

          <motion.div
            exit={{ opacity: 0, y: -14, transition: { duration: 0.4 } }}
            className="relative mt-8 flex flex-col items-center transform-gpu"
          >
            <div className="flex overflow-hidden">
              {site.name.split("").map((char, i) => (
                <motion.span
                  key={`${char}-${i}`}
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.7, ease: EASE_LAHORI, delay: 0.6 + i * 0.04 }}
                  className="inline-block font-heading text-brand-surface
                    text-[clamp(1.4rem,6.5vw,2.5rem)] font-light tracking-[0.16em] transform-gpu"
                >
                  {char}
                </motion.span>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              className="mt-5 flex items-center gap-4"
            >
              <span className="font-body text-[9px] uppercase tracking-[0.34em] text-brand-muted">
                {site.tagline}
              </span>
              <span className="w-8 h-px bg-brand-accent/40" />
              <span className="font-body text-[11px] tabular-nums text-brand-accent w-8 text-right">
                {count}
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
