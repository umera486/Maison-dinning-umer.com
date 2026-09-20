// src/components/layout/Preloader.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";
import { site } from "@/lib/site";
import { EASE_SEAL, EASE_LAHORI } from "@/lib/motion";

/**
 * A self-contained overlay. It does NOT gate the page.
 *
 * The previous version lived in `page.tsx` as `{isLoaded && <everything/>}`,
 * which meant the entire site was absent from the server-rendered HTML until
 * a 3.2s timer elapsed on the client. The homepage shipped 20KB of markup
 * while /menu shipped 222KB — search engines and link previews saw an empty
 * page, and anyone on a slow connection stared at a logo.
 *
 * Now the page renders underneath and this floats on top, so:
 *  - the HTML is complete and indexable
 *  - it plays once per session, not on every navigation
 *  - a tap, scroll or key press dismisses it immediately
 *  - it is skipped outright for reduced-motion users
 */

const SESSION_KEY = "lw-intro-seen";
const HOLD_MS = 1600;

const shellVariants: Variants = {
  visible: { opacity: 1 },
  exit: {
    opacity: 0,
    y: "-12%",
    transition: { duration: 0.75, ease: EASE_SEAL },
  },
};

const letterVariants: Variants = {
  hidden: { y: "115%" },
  visible: (i: number) => ({
    y: "0%",
    transition: { duration: 0.75, ease: EASE_LAHORI, delay: 0.06 * i },
  }),
};

export default function Preloader() {
  // Starts true so the overlay is present in the server HTML and there is no
  // flash of content before it mounts. The effect below takes it away again
  // within a frame for anyone who has already seen it.
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const reduceMotion = useReducedMotion() ?? false;

  const dismiss = useCallback(() => setVisible(false), []);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      // Private mode / blocked storage — treat as unseen and just play it.
    }

    if (seen || reduceMotion) {
      setVisible(false);
      return;
    }

    setReady(true);
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

  // Lock scrolling only while the overlay is actually up.
  useEffect(() => {
    if (!visible || !ready) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [visible, ready]);

  const letters = site.name.split("");

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          variants={shellVariants}
          initial="visible"
          animate="visible"
          exit="exit"
          onClick={dismiss}
          aria-hidden
          className="fixed inset-0 z-999 flex flex-col items-center justify-center bg-brand-base px-5 transform-gpu"
        >
          {/* Two soft pools of gold rather than a photograph. A background
              image here would compete with the hero for the LCP fetch. */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(229,169,60,0.14),transparent_60%)]" />

          <div className="relative flex overflow-hidden">
            {letters.map((char, i) => (
              <motion.span
                key={`${char}-${i}`}
                custom={i}
                variants={letterVariants}
                initial="hidden"
                animate="visible"
                className="inline-block font-heading text-brand-surface text-[clamp(1.9rem,9vw,5rem)]
                  font-light tracking-[0.1em] transform-gpu"
              >
                {char}
              </motion.span>
            ))}
          </div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: HOLD_MS / 1000, ease: "linear" }}
            className="mt-6 h-px w-28 sm:w-40 origin-left bg-brand-accent/70 transform-gpu"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-5 font-body text-[9px] sm:text-[10px] uppercase tracking-[0.34em] text-brand-muted text-center"
          >
            {site.tagline} · {site.branch}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
