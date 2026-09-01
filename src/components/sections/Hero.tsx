"use client";

import { motion } from "framer-motion";
import StackSection from "@/components/layout/StackSection";

export default function Hero({ index }: { index: number }) {
  return (
    <StackSection
      index={index}
      first={true}
      className="bg-brand-base text-brand-surface flex flex-col justify-between px-5 sm:px-8 md:px-12 py-6 sm:py-8"
    >
      <div className="flex items-center justify-between font-body text-[0.65rem] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] opacity-80">
        <span>Maison Dining</span>
        <span className="hidden sm:inline">Est. Paris / Lahore</span>
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ willChange: "transform, opacity" }}
        className="font-heading font-bold text-brand-surface leading-[0.82] tracking-tight 
          text-[clamp(3.5rem,17vw,14rem)] text-center md:text-left drop-shadow-2xl"
      >
        MAISON.
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="flex items-end justify-between font-body text-[0.65rem] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-brand-accent"
      >
        <span>Fine Dining Architecture</span>
        <motion.span 
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center gap-2 text-brand-surface"
        >
          Scroll to explore
          <span aria-hidden>↓</span>
        </motion.span>
      </motion.div>
    </StackSection>
  );
}