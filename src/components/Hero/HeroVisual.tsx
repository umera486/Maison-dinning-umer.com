"use client";

import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";

interface Experience {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

const experiences: Experience[] = [
  {
    id: "tasting",
    title: "The Grand Tasting",
    subtitle: "7-Course Avant-Garde Menu",
    description: "A symphony of rare seasonal harvests, precision French execution, and modern technique curated by Chef Laurent.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "cellar",
    title: "The Reserve Cellar",
    subtitle: "Century-Old Vintages",
    description: "Over 3,500 curated bottles housed in sub-terrain limestone vaults, featuring rare Bordeaux and private Burgundian allocations.",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "private",
    title: "The Obsidian Salon",
    subtitle: "Exclusive Private Dining",
    description: "An intimate architectural sanctuary for up to twelve guests, complete with a private kitchen view and bespoke acoustic design.",
    image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=1600&auto=format&fit=crop",
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

// LETHAL UPGRADE 2: Magnetic Button Engine
function MagneticButton({ children, onClick, className }: { children: React.ReactNode; onClick: () => void; className?: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setOffset({ x: x * 0.3, y: y * 0.3 }); // 0.3 controls the magnetic pull strength
  };

  const reset = () => setOffset({ x: 0, y: 0 });

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      onClick={onClick}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.5 }}
      className={className}
    >
      {children}
    </motion.button>
  );
}

export default function CulinaryMorphShowcase() {
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
      {/* Index rail */}
      <div className="relative z-10 w-full md:w-[42%] flex flex-col justify-center gap-1.5 sm:gap-2 px-5 sm:px-10 md:px-14 py-10 sm:py-16 md:py-0">
        <span className="font-body text-[0.65rem] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] text-brand-accent mb-6 sm:mb-8 flex items-center gap-4">
          <span className="w-8 h-[1px] bg-brand-accent/50 block"></span>
          Three Pillars of Maison
        </span>

        {experiences.map((exp, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={exp.id}
              onClick={() => goTo(idx)}
              disabled={isLocked && !isActive}
              aria-current={isActive}
              className="group relative w-full text-left py-3.5 sm:py-4 border-b border-brand-surface/10 last:border-b-0
                cursor-pointer disabled:cursor-default touch-manipulation
                transition-all duration-300 overflow-hidden"
            >
              {/* LETHAL UPGRADE 4: Subtle hover shift for inactive tabs */}
              <motion.div
                animate={{
                  scale: isActive ? 1 : 0.85,
                  opacity: isActive ? 1 : 0.4,
                  x: isActive ? 0 : 0,
                }}
                whileHover={!isActive ? { x: 8, opacity: 0.7 } : {}}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                style={{ ...gpuLayer, transformOrigin: "left center" }}
                className="flex items-baseline gap-3 sm:gap-4 relative z-10"
              >
                <span className="font-body text-[0.7rem] sm:text-xs text-brand-muted tabular-nums shrink-0 font-medium">
                  0{idx + 1}
                </span>
                <span className={`font-heading italic font-light leading-tight text-[clamp(1.5rem,5.5vw,3rem)] transition-colors duration-500 ${isActive ? 'text-brand-accent' : 'text-brand-surface'}`}>
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

        <div className="min-h-[160px] sm:min-h-[140px] pt-8 sm:pt-10">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={gpuLayer}
              className="space-y-4"
            >
              <span className="inline-block font-body text-[0.65rem] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-brand-surface/60">
                {current.subtitle}
              </span>
              <p className="font-body text-brand-muted text-sm sm:text-base font-light leading-relaxed max-w-[42ch]">
                <SplitWords text={current.description} reduceMotion={reduceMotion} />
              </p>
              
              {/* Used Magnetic Button Here */}
              <MagneticButton
                onClick={() => alert(`Reserving spot for: ${current.title}`)}
                className="mt-4 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full border border-brand-surface/20 text-brand-surface
                  font-body text-[0.65rem] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em]
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

      {/* Visual panel */}
      <div className="relative w-full md:w-[58%] aspect-[4/5] md:aspect-auto md:h-full overflow-hidden bg-brand-base">
        <AnimatePresence mode="sync" initial={false}>
          {/* LETHAL UPGRADE 1: Parallax Scale on Reveal */}
          <motion.div
            key={current.id}
            initial={{ clipPath: "inset(0% 0% 100% 0%)", scale: 1.15 }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)", scale: 1 }}
            exit={{ clipPath: "inset(100% 0% 0% 0%)", scale: 0.9 }}
            transition={{ duration: reduceMotion ? 0.2 : 1, ease: [0.76, 0, 0.24, 1] }}
            style={{ willChange: "clip-path, transform" }}
            className="absolute inset-0 transform-gpu"
          >
            {/* LETHAL UPGRADE 1b: Continuous slow breathing effect */}
            <motion.div 
              className="w-full h-full relative"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Image
                src={current.image}
                alt={current.title}
                fill
                sizes={IMAGE_SIZES}
                quality={85}
                priority={activeIndex === 0}
                className="object-cover"
              />
              {/* LETHAL UPGRADE 3: Film Grain & Luxury Vignette */}
              <div className="absolute inset-0 bg-brand-base/20 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-base/90 via-brand-base/20 to-transparent pointer-events-none" />
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')] mix-blend-overlay" />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}