"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollState, setScrollVelocity, resetScrollVelocity } from "@/lib/scrollStore";

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis handles the smooth-scroll easing; GSAP's ScrollTrigger listens to
 * the native `scroll` event by default and will silently drift out of sync
 * with Lenis's eased position. Two things fix that:
 *  1. Feed every Lenis scroll tick into ScrollTrigger.update() directly.
 *  2. Drive Lenis's own raf loop from GSAP's ticker (not requestAnimationFrame
 *     directly) so both libraries advance on the exact same frame, and turn
 *     off GSAP's lag smoothing so it never "catches up" against a scroll
 *     position Lenis is still easing toward.
 *
 * It also publishes scroll velocity to `scrollStore` so velocity-reactive
 * effects can read it per frame without a React re-render.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const lenis = new Lenis({
      duration: reduceMotion ? 0 : 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !reduceMotion,
    });
    lenisRef.current = lenis;

    const onScroll = (e: { velocity: number }) => {
      ScrollTrigger.update();
      if (!reduceMotion) setScrollVelocity(e.velocity);
    };

    lenis.on("scroll", onScroll);

    const tick = (time: number) => {
      lenis.raf(time * 1000);

      // Lenis stops emitting `scroll` once it settles, so the last velocity
      // would stay pinned forever and leave skewed type permanently crooked.
      // Ease it back toward zero every frame instead.
      if (!reduceMotion) {
        const current = scrollState.velocity;
        if (current !== 0) {
          const next = current * 0.88;
          setScrollVelocity(Math.abs(next) < 0.05 ? 0 : next);
        }
      }
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // First layout pass (fonts, images) can change document height after
    // ScrollTrigger has already measured it — refresh once things settle.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    return () => {
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(tick);
      window.removeEventListener("load", refresh);
      lenis.destroy();
      resetScrollVelocity();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
