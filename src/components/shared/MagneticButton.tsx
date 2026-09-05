// components/shared/MagneticButton.tsx
"use client";

import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { motion, useMotionValue, useSpring, useReducedMotion, type HTMLMotionProps } from "framer-motion";

// FIX: Changed from ButtonHTMLAttributes to HTMLMotionProps to eliminate TypeScript red lines on <motion.button>
interface MagneticButtonProps extends HTMLMotionProps<"button"> {
  children: ReactNode;
  className?: string;
  strength?: number;
  maxOffset?: number;
}

const PULL_SPRING = { stiffness: 280, damping: 18, mass: 0.2 };
const PRESS_SPRING = { stiffness: 420, damping: 22, mass: 0.25 };

const MagneticButton = forwardRef<HTMLButtonElement, MagneticButtonProps>(
  (props, forwardedRef) => {
    const {
      children,
      onClick,
      className = "",
      strength = 0.35,
      maxOffset = 14,
      type = "button",
      ...domProps
    } = props;

    const ref = useRef<HTMLButtonElement>(null);
    useImperativeHandle(forwardedRef, () => ref.current as HTMLButtonElement);

    const reduceMotion = useReducedMotion() ?? false;
    const [isCoarsePointer, setIsCoarsePointer] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    const rawX = useMotionValue(0);
    const rawY = useMotionValue(0);
    const x = useSpring(rawX, PULL_SPRING);
    const y = useSpring(rawY, PULL_SPRING);
    const scale = useSpring(1, PRESS_SPRING);

    const checkPointer = useCallback(() => {
      if (typeof window === "undefined") return;
      setIsCoarsePointer(window.matchMedia("(pointer: coarse)").matches);
    }, []);

    const handleMove = useCallback(
      (e: MouseEvent<HTMLButtonElement>) => {
        if (reduceMotion || isCoarsePointer || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const offsetX = (e.clientX - rect.left - rect.width / 2) * strength;
        const offsetY = (e.clientY - rect.top - rect.height / 2) * strength;
        rawX.set(Math.max(-maxOffset, Math.min(maxOffset, offsetX)));
        rawY.set(Math.max(-maxOffset, Math.min(maxOffset, offsetY)));
      },
      [reduceMotion, isCoarsePointer, rawX, rawY, strength, maxOffset]
    );

    const reset = useCallback(() => {
      rawX.set(0);
      rawY.set(0);
      scale.set(1);
      setIsPressed(false);
    }, [rawX, rawY, scale]);

    const handlePressStart = useCallback(() => {
      setIsPressed(true);
      scale.set(0.96);
    }, [scale]);

    const handlePressEnd = useCallback(() => {
      setIsPressed(false);
      scale.set(1);
    }, [scale]);

    return (  
      <motion.button
        ref={ref}
        type={type}
        onMouseEnter={checkPointer}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        onTouchCancel={handlePressEnd}
        onClick={onClick}
        style={{ x, y, scale, willChange: "transform" }}
        className={`group relative isolate overflow-hidden cursor-pointer transform-gpu select-none ${className}`}
        {...domProps}
      >
        <span
          aria-hidden
          className="absolute inset-0 -z-10 bg-current origin-center scale-x-0 group-hover:scale-x-100
            transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu"
          style={{ willChange: "transform" }}
        />

        <span
          className="relative z-10 flex items-center justify-center gap-2.5 transition-colors duration-500
            ease-[cubic-bezier(0.16,1,0.3,1)] mix-blend-difference"
        >
          {children}
        </span>

        <span
          aria-hidden
          className={`pointer-events-none absolute inset-0 -z-10 rounded-[inherit] border border-current
            transition-opacity duration-300 ${isPressed ? "opacity-30" : "opacity-0"}`}
        />
      </motion.button>
    );
  }
);

MagneticButton.displayName = "MagneticButton";

export default MagneticButton;