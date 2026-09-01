"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface StackSectionProps {
  children: ReactNode;
  /** Stacking order — later tiles must sit above earlier ones. */
  index: number;
  /** The base layer has no incoming edge to reveal, so skip the tile chrome. */
  first?: boolean;
  className?: string;
}

/**
 * "Tile-shift" stacking scroll.
 *
 * Each section is `position: sticky; top: 0; height: 100dvh`. In normal
 * document flow, later siblings paint above earlier ones — so as the user
 * scrolls past one tile's own height, the sticky section behind it stays
 * pinned while the next tile's top edge physically slides up and covers it,
 * like a card being dealt on top of the last one. No scroll-jacking, no JS
 * scroll interception: it's pure CSS position:sticky, so it's as cheap as
 * native scrolling gets.
 *
 * The pinned (lower) layer gets a subtle scale-down + dim as it's covered,
 * driven by its own scroll progress — this is the only per-frame transform
 * work happening, and it's GPU-composited (`transform` + `filter`, both on
 * their own layer via `will-change`).
 */
export default function StackSection({ children, index, first = false, className = "" }: StackSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const brightness = useTransform(scrollYProgress, [0, 1], [1, 0.6]);
  const filter = useTransform(brightness, (b) => `brightness(${b})`);

  return (
    <div ref={ref} className="sticky top-0 h-[100dvh] w-full" style={{ zIndex: index }}>
      <motion.div
        style={{ scale, filter, willChange: "transform, filter" }}
        className={[
          "h-full w-full overflow-hidden",
          first ? "" : "rounded-t-[2rem] md:rounded-t-[3rem] shadow-[0_-40px_90px_-25px_rgba(0,0,0,0.65)]",
          className,
        ].join(" ")}
      >
        {children}
      </motion.div>
    </div>
  );
}
