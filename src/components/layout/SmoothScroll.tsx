"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // First layout pass (fonts, images) can change document height after
    // ScrollTrigger has already measured it — refresh once things settle.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("load", refresh);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}