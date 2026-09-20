/**
 * One motion vocabulary for the whole site.
 *
 * Every section imports its easing and variants from here so the site moves
 * like a single object. The curves are lifted from HeroText.tsx, which is the
 * agreed quality bar.
 *
 * Performance rules these encode:
 *  - Only `transform` and `opacity` are ever animated. Animating `filter`,
 *    `box-shadow`, `background-position` or layout properties forces paint or
 *    layout every frame and is what drops a phone below 55fps.
 *  - `willChange` is applied for the duration of a transition and released
 *    afterwards. Leaving it on permanently costs GPU memory on mobile and can
 *    make things slower, not faster.
 */

import type { Variants, Transition } from "framer-motion";

/** The hero's curve. Slow out, hard settle. */
export const EASE_LAHORI = [0.16, 1, 0.3, 1] as const;
/** Heavier, more mechanical — for overlays, seals and clip-path reveals. */
export const EASE_SEAL = [0.76, 0, 0.24, 1] as const;

export const DURATION = {
  quick: 0.3,
  base: 0.6,
  slow: 1.2,
} as const;

export const spring = {
  /** Magnetic pull on cursor-following elements. */
  pull: { type: "spring", stiffness: 280, damping: 18, mass: 0.2 },
  /** Press feedback. Snappier, so a tap feels immediate. */
  press: { type: "spring", stiffness: 420, damping: 22, mass: 0.25 },
  /** Layout indicators sliding between positions. */
  indicator: { type: "spring", stiffness: 350, damping: 25 },
} satisfies Record<string, Transition>;

/** Standard reveal: rise and fade. The site's default entrance. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE_LAHORI },
  },
};

/**
 * A line of text sliding up from behind a mask. Put `.reveal-mask` on the
 * parent — this variant only moves the child.
 */
export const maskUp: Variants = {
  hidden: { y: "110%" },
  visible: {
    y: "0%",
    transition: { duration: 0.9, ease: EASE_LAHORI },
  },
};

/** Parent that releases children one after another. */
export function stagger(childDelay = 0.07, initialDelay = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: childDelay, delayChildren: initialDelay },
    },
  };
}

/**
 * Per-word motion typography. Split a string with `splitWords` and give each
 * word this variant inside a `stagger()` parent.
 */
export const wordUp: Variants = {
  hidden: { opacity: 0, y: "0.6em" },
  visible: {
    opacity: 1,
    y: "0em",
    transition: { duration: 0.75, ease: EASE_LAHORI },
  },
};

export function splitWords(text: string): string[] {
  return text.split(" ");
}

/**
 * Standard `whileInView` config. `once` matters for performance — re-triggering
 * on every scroll past keeps observers and transitions alive for the life of
 * the page. `amount` is low so reveals fire before the reader arrives, which
 * reads as responsive rather than late.
 */
export const inView = { once: true, amount: 0.2 } as const;

/**
 * Reduced-motion fallback: state changes instantly, nothing moves. Spread over
 * a transition when `useReducedMotion()` is true rather than disabling the
 * animation entirely, so elements still reach their final state.
 */
export const instant: Transition = { duration: 0 };
