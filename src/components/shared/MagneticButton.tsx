// components/shared/MagneticButton.tsx
"use client";

import { useCallback, useRef, type ReactNode, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

interface MagneticButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  strength?: number;
}

const SPRING = { stiffness: 150, damping: 15, mass: 0.5 };

/**
 * Imperative motion values only — rawX/rawY are set directly in the
 * mousemove handler and never touch React state, so a 60-120Hz pointer
 * stream never triggers a component re-render. Spring smoothing happens
 * entirely inside Framer's own RAF loop.
 */
export default function MagneticButton({ children, onClick, className, strength = 0.3 }: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion() ?? false;

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING);
  const y = useSpring(rawY, SPRING);

  const handleMove = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      if (reduceMotion || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      rawX.set((e.clientX - rect.left - rect.width / 2) * strength);
      rawY.set((e.clientY - rect.top - rect.height / 2) * strength);
    },
    [reduceMotion, rawX, rawY, strength]
  );

  const reset = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      onClick={onClick}
      style={{ x, y, willChange: "transform" }}
      className={className}
    >
      {children}
    </motion.button>
  );
}