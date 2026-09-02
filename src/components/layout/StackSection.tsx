// components/layout/StackSection.tsx
"use client";

import { useRef, type ReactNode } from "react";
import { useInView } from "framer-motion";

interface StackSectionProps {
  children: ReactNode;
  index: number;
  className?: string;
}

/**
 * Flat sticky + z-index only. No per-frame scale/brightness/filter work —
 * that was costing every panel a live useScroll+useTransform pair whether
 * or not it was ever on screen. This is the entire stacking effect now.
 */
export default function StackSection({ children, index, className = "" }: StackSectionProps) {
  return (
    <div
      className={`sticky top-0 h-[100dvh] w-full overflow-hidden ${className}`}
      style={{ zIndex: index }}
    >
      {children}
    </div>
  );
}

/**
 * Gates expensive scroll-linked work (GSAP ScrollTriggers, useScroll/
 * useTransform chains, continuous loops) to panels actually near the
 * viewport. `margin` extends the activation zone so nothing pops in/out
 * abruptly. Import this inside any section that needs scroll-driven motion.
 */
export function useNearViewport<T extends HTMLElement>(margin: string = "50% 0px 50% 0px") {
  const ref = useRef<T>(null);
  const isNear = useInView(ref, { margin: margin as unknown as `${number}px`, amount: 0 });
  return { ref, isNear };
}