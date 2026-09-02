// components/Hero/HeroVisual.tsx
"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import MagneticButton from "@/components/shared/MagneticButton";

interface Experience {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

const experiences: Experience[] = [
  {
    id: "tandoor",
    title: "The Tandoor Table",
    subtitle: "Live Charcoal-Fired Kebabs",
    description:
      "Seekh kebabs, tandoori chicken, and fresh naan pulled straight from a 900°C clay oven, finished tableside.",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "shahi-reserve",
    title: "The Shahi Reserve",
    subtitle: "Kashmiri Chai & Artisanal Spice",
    description:
      "Hand-blended Kashmiri chai, organic desi ghee preparations, and a reserve of whole spices sourced directly from Lahore's Akbari Mandi.",
    image: "https://images.unsplash.com/photo-1608835291093-394b0c943a75?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "darbar",
    title: "The Darbar Hall",
    subtitle: "Private Majlis Dining",
    description:
      "A private hall seating up to twenty guests, styled after the grand Mughal darbars, for weddings, walimas, and family celebrations.",
    image: "https://images.unsplash.com/photo-1517244683847-7456b63c5969?q=80&w=1600&auto=format&fit=crop",
  },
];

const TRANSITION_LOCK_MS = 500;
const IMAGE_SIZES = "(min-width: 768px) 58vw, 100vw";

const gpuLayer: React.CSSProperties = {
  willChange: "transform, opacity",
  transform: "translateZ(0)",
  backfaceVisibility: "hidden",
};

const wordContainer: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.035, delayChildren: 0.05 } },
  exit: { transition: { staggerChildren: 0.012, staggerDirection: -1 } },
};

const wordItem: Variants = {
  initial: { opacity: 0, y: "0.5em" },
  animate: { opacity: 1, y: "0em", transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: "-0.35em", transition: { duration: 0.18 } },
};

function SplitWords({ text, className, reduceMotion }: { text: string; className?: string; reduceMotion: boolean }) {
  const words = useMemo(() => text.split(" "), [text]);
  if (reduceMotion) return <span className={className}>{text}</span>;
  return (
    <motion.span
      variants={wordContainer}
      initial="initial"
      animate="animate"
      exit="exit"
      style={gpuLayer}
      className={`inline-block ${className ?? ""}`}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-1 mr-[0.28em]">
          <motion.span variants={wordItem} className="inline-block">
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

export default function HeroVisual() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const lockTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduceMotion = useReducedMotion() ?? false;

  const current = experiences[activeIndex];

  const goTo = useCallback(
    (idx: number) => {
      if (idx === activeIndex || isLocked) return;
      setActiveIndex(idx);
      setIsLocked(true);
      if (lockTimeout.current) clearTimeout(lockTimeout.current);
      lockTimeout.current = setTimeout(() => setIsLocked(false), TRANSITION_LOCK_MS);
    },
    [activeIndex, isLocked]
  );

  return (
    <div className="relative h-full w-full bg-brand-base flex flex-col md:flex-row overflow-hidden">
      <div className="relative z-10 w-full md:w-[45%] flex flex-col justify-center gap-2 px-6 sm:px-12 md:px-16 py-12 md:py-0">
        
        {/* Navigation selection items with minimal, breathable spacing */}
        <div className="flex flex-col gap-1 sm:gap-2 mb-6">
          {experiences.map((exp, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={exp.id}
                onClick={() => goTo(idx)}
                disabled={isLocked && !isActive}
                aria-current={isActive}
                className="group relative w-full text-left py-3 sm:py-3.5 border-b border-brand-surface/10 last:border-b-0
                  cursor-pointer disabled:cursor-default touch-manipulation transition-all duration-300 overflow-hidden"
              >
                <motion.div
                  animate={{ scale: isActive ? 1 : 0.9, opacity: isActive ? 1 : 0.35 }}
                  whileHover={!isActive ? { x: 6, opacity: 0.7 } : {}}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  style={{ ...gpuLayer, transformOrigin: "left center" }}
                  className="flex items-baseline gap-4 relative z-10"
                >
                  <span className="font-body text-[0.65rem] sm:text-xs text-brand-muted tabular-nums shrink-0 font-medium">
                    0{idx + 1}
                  </span>
                  <span
                    className={`font-heading italic font-light leading-tight text-[clamp(1.65rem,4.5vw,2.75rem)] transition-colors duration-500 ${
                      isActive ? "text-brand-accent" : "text-brand-surface"
                    }`}
                  >
                    {exp.title}
                  </span>
                </motion.div>

                {isActive && (
                  <motion.div
                    layoutId="weight-underline"
                    layout="position"
                    className="absolute left-0 -bottom-px h-[2px] w-16 sm:w-24 bg-brand-accent z-20"
                    style={gpuLayer}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Minimal content card section with refined typography */}
        <div className="min-h-[150px] sm:min-h-[130px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={gpuLayer}
              className="space-y-3 sm:space-y-4"
            >
              <span className="inline-block font-body text-[0.65rem] sm:text-xs uppercase tracking-[0.25em] text-brand-surface/60">
                {current.subtitle}
              </span>
              
              <p className="font-body text-brand-muted text-sm sm:text-base font-light leading-relaxed max-w-[40ch]">
                <SplitWords text={current.description} reduceMotion={reduceMotion} />
              </p>

              <MagneticButton
                onClick={() => alert(`Reserving spot for: ${current.title}`)}
                className="mt-3 px-6 sm:px-7 py-3 rounded-full border border-brand-surface/20 text-brand-surface
                  font-body text-[0.65rem] sm:text-xs uppercase tracking-[0.25em]
                  hover:bg-brand-surface hover:text-brand-base hover:border-brand-surface
                  transition-colors duration-300 cursor-pointer touch-manipulation flex items-center gap-3 group"
              >
                Explore Experience
                <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300">→</span>
              </MagneticButton>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* Visual panel with clean clip-path wipe */}
      <div className="relative w-full md:w-[55%] aspect-[4/5] md:aspect-auto md:h-full overflow-hidden bg-brand-base">
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={current.id}
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(100% 0% 0% 0%)" }}
            transition={{ duration: reduceMotion ? 0.2 : 0.85, ease: [0.76, 0, 0.24, 1] }}
            style={{ willChange: "clip-path" }}
            className="absolute inset-0"
          >
            <Image
              src={current.image}
              alt={current.title}
              fill
              sizes={IMAGE_SIZES}
              quality={80}
              priority={activeIndex === 0}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-base/85 via-brand-base/10 to-transparent pointer-events-none" />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}