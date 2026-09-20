// src/components/layout/Preloader.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Logo from "@/components/brand/Logo";
import Embers from "@/components/fx/Embers";
import { site } from "@/lib/site";
import { EASE_SEAL, EASE_LAHORI } from "@/lib/motion";

/**
 * The intro.
 *
 * A self-contained overlay that does NOT gate the page. The previous version
 * lived in `page.tsx` as `{isLoaded && <everything/>}`, so the whole site was
 * absent from the server HTML until a 3.2s client timer fired — the homepage
 * shipped 20KB of markup while /menu shipped 222KB.
 *
 * Now the page renders underneath and this floats on top:
 *  - the HTML is complete and indexable
 *  - it plays once per session, not on every navigation
 *  - a tap, scroll or key press dismisses it
 *  - reduced-motion users skip it entirely
 *
 * The sequence: the green ring traces itself, the skyline rises out of the
 * baseline, the wordmark clears, a gold sweep crosses the lot, then the whole
 * thing splits and lifts. Everything is transform/opacity or an SVG
 * stroke-dashoffset, so it stays on the compositor.
 */

const SESSION_KEY = "lw-intro-seen";
const HOLD_MS = 2600;

// Circumference of the r=93 ring in the logo's 200×200 viewBox.
const RING_LENGTH = 2 * Math.PI * 93;

export default function Preloader() {
  // Starts true so the overlay is in the server HTML and there's no flash of
  // content before hydration. The effect removes it within a frame for anyone
  // who has already seen it.
  const [visible, setVisible] = useState(true);
  const [playing, setPlaying] = useState(false);
  const reduceMotion = useReducedMotion() ?? false;

  const dismiss = useCallback(() => setVisible(false), []);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      // Private mode / blocked storage — treat as unseen and play it.
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

    const timer = setTimeout(dismiss, HOLD_MS);
    window.addEventListener("wheel", dismiss, { passive: true, once: true });
    window.addEventListener("touchstart", dismiss, { passive: true, once: true });
    window.addEventListener("keydown", dismiss, { once: true });

    return () => {
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
          exit={{ opacity: 0, transition: { duration: 0.5, ease: "linear", delay: 0.55 } }}
          className="fixed inset-0 z-999 overflow-hidden bg-brand-base"
        >
          {/* Two halves that part like doors on exit. */}
          {[0, 1].map((half) => (
            <motion.div
              key={half}
              initial={{ y: "0%" }}
              exit={{ y: half === 0 ? "-102%" : "102%" }}
              transition={{ duration: 0.85, ease: EASE_SEAL, delay: 0.1 }}
              className="absolute inset-x-0 h-1/2 bg-brand-base transform-gpu"
              style={{ top: half === 0 ? 0 : "50%" }}
            />
          ))}

          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_115%,rgba(229,169,60,0.16),transparent_62%)]" />
          <Embers />

          <motion.div
            exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.4, ease: EASE_LAHORI } }}
            className="relative h-full w-full flex flex-col items-center justify-center px-6"
          >
            <div className="relative w-[210px] sm:w-[280px] aspect-square">
              {/* The mark, revealed in layers */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: EASE_LAHORI, delay: 0.25 }}
                className="absolute inset-0 transform-gpu"
              >
                <Logo className="w-full h-full" tone="brand" withWordmark={false} />
              </motion.div>

              {/* The ring, traced. Drawn on top of the logo's own ring so the
                  stroke appears to write itself around the badge. */}
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
                  transition={{ duration: 1.5, ease: EASE_LAHORI }}
                />
              </svg>

              {/* Gold sweep across the mark */}
              <motion.div
                initial={{ x: "-130%" }}
                animate={{ x: "130%" }}
                transition={{ duration: 1.1, ease: EASE_LAHORI, delay: 1.15 }}
                className="absolute inset-y-0 w-1/2 -skew-x-12 pointer-events-none transform-gpu
                  bg-linear-to-r from-transparent via-brand-accent/25 to-transparent"
              />
            </div>

            {/* Wordmark, per-letter */}
            <div className="mt-7 flex overflow-hidden">
              {site.name.split("").map((char, i) => (
                <motion.span
                  key={`${char}-${i}`}
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.7, ease: EASE_LAHORI, delay: 0.75 + i * 0.045 }}
                  className="inline-block font-heading text-brand-surface
                    text-[clamp(1.5rem,7vw,2.75rem)] font-light tracking-[0.14em] transform-gpu"
                >
                  {char}
                </motion.span>
              ))}
            </div>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: HOLD_MS / 1000 - 0.5, ease: "linear", delay: 0.4 }}
              className="mt-5 h-px w-32 sm:w-44 origin-left bg-brand-accent/60 transform-gpu"
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.35 }}
              className="mt-5 font-body text-[9px] sm:text-[10px] uppercase tracking-[0.36em] text-brand-muted text-center"
            >
              {site.tagline} · {site.branch}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
