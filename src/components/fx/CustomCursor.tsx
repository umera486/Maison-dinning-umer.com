// src/components/fx/CustomCursor.tsx
"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A gold ring that trails the pointer and swells over anything interactive.
 *
 * Rules that keep this from being the usual custom-cursor disaster:
 *  - The real cursor is never hidden. Hiding it and then failing to render a
 *    replacement (JS error, slow frame, dragged-out-of-window) leaves the
 *    visitor with no pointer at all. This rides alongside it.
 *  - Fine pointers only. A touch device gets nothing — no listeners, no rAF.
 *  - Position is written straight to `style.transform` inside one rAF loop.
 *    Routing this through React state would be a render per mousemove.
 *  - `mix-blend-difference` keeps it visible on both the dark base and the
 *    cream surfaces, without needing to know what's underneath.
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

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { x: target.x, y: target.y };
    let scale = 1;
    let targetScale = 1;
    let visible = false;
    let frame: number | null = null;

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) {
        visible = true;
        // Jump on first sight rather than flying in from the centre.
        current.x = e.clientX;
        current.y = e.clientY;
        if (ringRef.current) ringRef.current.style.opacity = "1";
      }
    };

    const onOver = (e: MouseEvent) => {
      const el = e.target as Element | null;
      targetScale = el?.closest?.(HOVER_SELECTOR) ? 2.1 : 1;
    };

    const onLeave = () => {
      visible = false;
      if (ringRef.current) ringRef.current.style.opacity = "0";
    };

    const render = () => {
      frame = requestAnimationFrame(render);
      // Critically damped-ish follow: fast enough to feel attached, slow
      // enough to read as a separate object.
      current.x += (target.x - current.x) * 0.18;
      current.y += (target.y - current.y) * 0.18;
      scale += (targetScale - scale) * 0.14;

      const ring = ringRef.current;
      if (ring) {
        ring.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`;
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    frame = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={ringRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[250] w-8 h-8 rounded-full
        border border-brand-accent opacity-0 mix-blend-difference
        transition-opacity duration-300 will-change-transform"
    />
  );
}
