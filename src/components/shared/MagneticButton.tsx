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
      className={`relative overflow-hidden group cursor-pointer ${className ?? ""}`}
    >
      {/* Continuous Liquid Flowing Waves Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-25 group-hover:opacity-60 transition-opacity duration-700">
        <motion.div
          className="absolute -inset-full flex items-center"
          initial={{ x: "0%" }}
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
        >
          <svg
            className="w-[200%] h-full"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,30 C150,90 350,-30 500,30 C650,90 850,-30 1000,30 C1150,90 1350,-30 1500,30 L1500,120 L0,120 Z"
              fill="currentColor"
              className="opacity-40"
            />
            <path
              d="M0,60 C200,10 400,100 600,60 C800,20 1000,100 1200,60 C1400,20 1600,100 1800,60 L1800,120 L0,120 Z"
              fill="currentColor"
              className="opacity-20"
            />
          </svg>
        </motion.div>
      </div>

      {/* Dynamic Fluid Light Sheen Sweep */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out z-0" />

      {/* Content wrapper */}
      <span className="relative z-10 flex items-center justify-center gap-2.5">
        {children}
      </span>
    </motion.button>
  );
}