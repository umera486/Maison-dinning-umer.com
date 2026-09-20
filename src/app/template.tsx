"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE_SEAL } from "@/lib/motion";

/**
 * Route transition.
 *
 * `template.tsx` is remounted with a fresh key on every navigation (unlike
 * `layout.tsx`, which persists), so an enter animation here plays on each
 * route change without any router plumbing.
 *
 * Exit animations are not attempted: the App Router unmounts the old tree
 * before the new one renders, so a true exit would need the whole app wrapped
 * in a frozen-router hack. A fast wipe *in* reads just as intentional and
 * doesn't fight the framework.
 *
 * Four panels wipe up in sequence. Everything is `transform` + `opacity`, so
 * the compositor does all of it.
 */

const PANELS = 4;

export default function Template({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion() ?? false;

  if (reduceMotion) return <>{children}</>;

  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[300] flex">
        {Array.from({ length: PANELS }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            transition={{
              duration: 0.75,
              ease: EASE_SEAL,
              // Panels leave left-to-right, so the reveal sweeps across the
              // page rather than lifting like a single flat sheet.
              delay: i * 0.055,
            }}
            style={{ transformOrigin: "top" }}
            className="h-full flex-1 bg-brand-base origin-top"
          />
        ))}

        {/* The wordmark rides the curtain out. */}
        <motion.span
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "linear" }}
          dir="rtl"
          lang="ur"
          className="absolute inset-0 flex items-center justify-center
            text-[14vw] sm:text-[8vw] leading-none text-brand-accent/25 select-none"
          style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}
        >
          لاہوری والا
        </motion.span>
      </div>

      {children}
    </>
  );
}
