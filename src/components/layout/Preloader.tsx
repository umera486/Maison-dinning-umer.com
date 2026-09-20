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
 * Deliberately bare: flat black, the mark, hairlines, and a counter. The
 * previous version sat on a gold radial glow, which is the single most dated
 * thing you can put behind a logo — it reads as a 2015 template. Structure and
 * precise typography carry this instead of a gradient.
 *
 * Layout is a full-bleed frame rather than a centred stack: the counter is
 * anchored bottom-left at display size, metadata bottom-right, a progress
 * hairline across the very bottom edge. The mark sits alone in the middle.
 *
 * Exit: the whole curtain collapses into the logo's circle via one clip-path
 * interpolation, so the site is revealed from the outside in.
 *
 * Performance — this runs at first paint on a cold cache:
 *  - Exit is a single composited clip-path; no layout, no paint.
 *  - No canvas, no blend modes, no backdrop-filter, no blur.
 *  - Counter is one state update per ~40ms, not per frame.
 *
 * It does not gate the page: the site renders underneath, so the HTML is
 * complete and indexable. Plays once per session; dismissable by tap, scroll
 * or key; skipped entirely under reduced motion.
 */

const SESSION_KEY = "lw-intro-seen";
const HOLD_MS = 2200;

// Circumference of the r=93 ring in the logo's 200×200 viewBox.
const RING_LENGTH = 2 * Math.PI * 93;

export default function Preloader() {
  // Starts true so the overlay is in the server HTML — no flash of content
  // before hydration. Removed within a frame for anyone who has seen it.
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
      const p = Math.min(1, (performance.now() - started) / (HOLD_MS - 350));
      setCount(Math.round(p * 100));
      if (p >= 1) clearInterval(counter);
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
          initial={{ clipPath: "circle(145% at 50% 50%)" }}
          exit={{
            clipPath: "circle(0% at 50% 50%)",
            transition: { duration: 0.95, ease: EASE_SEAL },
          }}
          className="fixed inset-0 z-999 bg-brand-base"
        >
          {/* Mark, alone in the middle. */}
          <motion.div
            exit={{ scale: 1.14, opacity: 0, transition: { duration: 0.75, ease: EASE_SEAL } }}
            className="absolute inset-0 flex items-center justify-center transform-gpu"
          >
            <div className="relative w-[136px] sm:w-[176px] aspect-square">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, ease: EASE_LAHORI, delay: 0.1 }}
                className="absolute inset-0 transform-gpu"
              >
                <Logo className="w-full h-full" tone="brand" withWordmark={false} />
              </motion.div>

              {/* The ring writes itself. */}
              <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full -rotate-90">
                <motion.circle
                  cx="100"
                  cy="100"
                  r="93"
                  fill="none"
                  stroke="#15803d"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeDasharray={RING_LENGTH}
                  initial={{ strokeDashoffset: RING_LENGTH }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 1.6, ease: EASE_LAHORI, delay: 0.05 }}
                />
              </svg>
            </div>
          </motion.div>

          {/* Frame: counter bottom-left, metadata bottom-right, name top-left. */}
          <motion.div
            exit={{ opacity: 0, transition: { duration: 0.35 } }}
            className="absolute inset-0 p-5 sm:p-8 lg:p-10 flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className="reveal-mask">
                <motion.span
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.8, ease: EASE_LAHORI, delay: 0.25 }}
                  className="block font-heading text-brand-surface text-sm sm:text-base tracking-[0.2em] transform-gpu"
                >
                  {site.name}
                </motion.span>
              </div>

              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.55 }}
                className="font-mono text-[10px] uppercase tracking-[0.18em] text-brand-muted text-right"
              >
                {site.branch}
                <br />
                London
              </motion.span>
            </div>

            <div className="flex items-end justify-between gap-6">
              {/* Counter at display scale — the structural anchor. */}
              <span className="font-heading italic font-light text-brand-surface leading-[0.78]
                text-[clamp(4.5rem,18vw,11rem)] tabular-nums tracking-[-0.04em]">
                {String(count).padStart(2, "0")}
              </span>

              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="font-mono text-[10px] uppercase tracking-[0.18em] text-brand-muted text-right pb-3 sm:pb-5"
              >
                {site.tagline}
              </motion.span>
            </div>
          </motion.div>

          {/* Progress hairline along the bottom edge. */}
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: (HOLD_MS - 350) / 1000, ease: "linear" }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className="absolute bottom-0 left-0 right-0 h-px origin-left bg-brand-accent transform-gpu"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
