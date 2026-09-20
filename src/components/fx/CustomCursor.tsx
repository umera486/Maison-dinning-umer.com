// src/components/fx/CustomCursor.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/**
 * A gold ring trailing the pointer, swelling over anything interactive.
 *
 * PERFORMANCE HISTORY — do not reintroduce `mix-blend-difference` here.
 * A blend mode on a fixed element forces the compositor to read the backdrop
 * behind it every frame, all the way down the scrolling page. It looked
 * clever and cost real frames. A solid ring with a soft dark outline stays
 * legible over both the dark base and cream surfaces without any blending.
 *
 * It also no longer runs its own requestAnimationFrame loop. It rides GSAP's
 * ticker, which Lenis already drives — one loop for the whole site instead of
 * four competing ones.
 *
 * Other rules that keep this from being the usual custom-cursor disaster:
 *  - The real cursor is never hidden. If this fails to render, the visitor
 *    still has a pointer.
 *  - Fine pointers only. Touch devices get nothing: no listeners, no ticker.
 */

const HOVER_SELECTOR = 'a, button, input, textarea, select, [role="button"], [data-cursor="hover"]';

export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduce.matches) return;

    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const ring = ringRef.current;
    if (!ring) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { x: target.x, y: target.y };
    let scale = 1;
    let targetScale = 1;
    let seen = false;

    // quickSetter avoids re-parsing the style string on every frame.
    const setX = gsap.quickSetter(ring, "x", "px");
    const setY = gsap.quickSetter(ring, "y", "px");
    const setScale = gsap.quickSetter(ring, "scale");

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!seen) {
        seen = true;
        current.x = e.clientX;
        current.y = e.clientY;
        ring.style.opacity = "1";
      }
    };

    const onOver = (e: MouseEvent) => {
      const el = e.target as Element | null;
      targetScale = el?.closest?.(HOVER_SELECTOR) ? 2 : 1;
    };

    const onLeave = () => {
      seen = false;
      ring.style.opacity = "0";
    };

    const tick = () => {
      // Fast enough to feel attached, slow enough to read as its own object.
      current.x += (target.x - current.x) * 0.18;
      current.y += (target.y - current.y) * 0.18;
      scale += (targetScale - scale) * 0.14;
      setX(current.x);
      setY(current.y);
      setScale(scale);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    gsap.ticker.add(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      gsap.ticker.remove(tick);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={ringRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-250 w-9 h-9 -ml-4.5 -mt-4.5
        rounded-full border border-brand-accent opacity-0 transition-opacity duration-300"
      style={{ boxShadow: "0 0 0 1px rgba(8,8,10,0.35)" }}
    />
  );
}
