"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { scrollState } from "@/lib/scrollStore";

interface Options {
  /** Degrees of skew at full scroll speed. */
  skew?: number;
  /** Extra horizontal stretch at full speed, as a scale factor. */
  stretch?: number;
  /** Set false to leave the element alone (e.g. off-screen). */
  active?: boolean;
}

/**
 * Skews and stretches an element in proportion to scroll velocity, so type
 * leans into the direction of travel and settles when you stop.
 *
 * Driven from the GSAP ticker reading `scrollState`, never React state — a
 * velocity-reactive effect updates every frame, and a re-render per frame is
 * exactly the thing that would break the 55fps floor.
 *
 * Writes are skipped when the value hasn't meaningfully changed, so a
 * stationary page costs one comparison per frame and no style recalc.
 */
export function useVelocitySkew<T extends HTMLElement>({
  skew = 4,
  stretch = 0,
  active = true,
}: Options = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !active) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const setSkew = gsap.quickSetter(el, "skewY", "deg");
    const setScaleX = stretch ? gsap.quickSetter(el, "scaleX") : null;

    let lastSkew = 0;
    let lastScale = 1;

    const tick = () => {
      const n = scrollState.normalized;
      const nextSkew = n * skew;
      const nextScale = 1 + Math.abs(n) * stretch;

      if (Math.abs(nextSkew - lastSkew) > 0.01) {
        setSkew(nextSkew);
        lastSkew = nextSkew;
      }
      if (setScaleX && Math.abs(nextScale - lastScale) > 0.002) {
        setScaleX(nextScale);
        lastScale = nextScale;
      }
    };

    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      gsap.set(el, { skewY: 0, scaleX: 1 });
    };
  }, [skew, stretch, active]);

  return ref;
}
