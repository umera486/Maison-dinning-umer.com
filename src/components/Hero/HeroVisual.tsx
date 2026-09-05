// components/Hero/HeroVisual.tsx
"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import MagneticButton from "@/components/shared/MagneticButton";

interface MenuCategory {
  id: string;
  headline: string;
  tagline: string;
  description: string;
  itemCount: number;
  image: string;
}

const categories: MenuCategory[] = [
  {
    id: "charcoal-signatures",
    headline: "Charcoal Signatures",
    tagline: "900°C Live Fire",
    description:
      "Seekh kebabs, tandoori chicken, and fresh naan pulled straight from a clay oven, finished tableside.",
    itemCount: 8,
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "slow-cooked-deghs",
    headline: "Slow-Cooked Deghs",
    tagline: "12-Hour Nihari & Dum Pukht",
    description:
      "Hand-blended Kashmiri chai, organic desi ghee preparations, and whole spices sourced from Akbari Mandi.",
    itemCount: 6,
    image: "https://images.unsplash.com/photo-1608835291093-394b0c943a75?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "karahi-handi",
    headline: "Karahi & Handi",
    tagline: "Iron Wok, Open Flame",
    description:
      "Deep-wok mutton karahi and classic Lahori chicken prepared in traditional clay vessels with rich tomato gravy.",
    itemCount: 5,
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

const containerVariants: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
  exit: { transition: { staggerChildren: 0.015, staggerDirection: -1 } },
};

const itemVariants: Variants = {
  initial: { opacity: 0, y: "0.5em" },
  animate: { opacity: 1, y: "0em", transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: "-0.35em", transition: { duration: 0.2 } },
};

function CategoryNav({
  categories,
  activeIndex,
  onSelect,
  isLocked,
}: {
  categories: MenuCategory[];
  activeIndex: number;
  onSelect: (idx: number) => void;
  isLocked: boolean;
}) {
  return (
    <div className="relative w-full flex flex-col gap-1 sm:gap-2 mb-8 sm:mb-10">
      {categories.map((cat, idx) => {
        const isActive = idx === activeIndex;
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(idx)}
            disabled={isLocked && !isActive}
            aria-current={isActive ? "true" : "false"}
            className="group relative w-full text-left py-4 sm:py-5 border-b border-brand-surface/10 last:border-b-0
              cursor-pointer disabled:cursor-default touch-manipulation overflow-hidden"
          >
            <motion.div
              animate={{
                scale: isActive ? 1 : 0.92,
                opacity: isActive ? 1 : 0.35,
              }}
              whileHover={!isActive ? { x: 8, opacity: 0.65 } : {}}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{ ...gpuLayer, transformOrigin: "left center" }}
              className="flex flex-col items-start gap-1.5 relative z-10"
            >
              <div className="flex items-baseline gap-3 sm:gap-4 w-full">
                <span className="font-body text-[10px] sm:text-xs text-brand-muted uppercase tracking-[0.25em] font-medium shrink-0">
                  0{idx + 1}
                </span>
                <span
                  className={`font-heading italic font-light leading-tight text-[clamp(2rem,5vw,3.25rem)] flex-1 transition-colors duration-500 ${
                    isActive ? "text-brand-accent" : "text-brand-surface"
                  }`}
                >
                  {cat.headline}
                </span>
              </div>

              <div className="flex items-center gap-3 ml-[2.5rem] sm:ml-14">
                <span className="font-body text-[0.65rem] sm:text-xs text-brand-surface/50 uppercase tracking-[0.2em]">
                  {cat.tagline}
                </span>
                <span className="font-mono text-[10px] text-brand-accent font-bold">{cat.itemCount} Items</span>
              </div>
            </motion.div>

            {isActive && (
              <motion.div
                layoutId="category-indicator"
                layout="position"
                className="absolute left-0 -bottom-px h-[2px] w-12 sm:w-16 bg-brand-accent z-20"
                style={gpuLayer}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

function MenuImage({
  category,
  reduceMotion,
}: {
  category: MenuCategory;
  reduceMotion: boolean;
}) {
  return (
    <AnimatePresence mode="sync" initial={false}>
      <motion.div
        key={category.id}
        initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
        animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
        exit={{ clipPath: "inset(100% 0% 0% 0%)" }}
        transition={{
          duration: reduceMotion ? 0.2 : 0.85,
          ease: [0.76, 0, 0.24, 1],
        }}
        style={{ willChange: "clip-path" }}
        className="absolute inset-0"
      >
        <Image
          src={category.image}
          alt={category.headline}
          fill
          sizes={IMAGE_SIZES}
          quality={82}
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-base/85 via-brand-base/15 to-transparent pointer-events-none" />
      </motion.div>
    </AnimatePresence>
  );
}

function MenuDescription({
  category,
  reduceMotion,
}: {
  category: MenuCategory;
  reduceMotion: boolean;
}) {
  const words = useMemo(() => category.description.split(" "), [category.description]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={category.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        style={gpuLayer}
        className="space-y-4 sm:space-y-5 min-h-[120px]"
      >
        <p className="font-body text-brand-muted text-sm sm:text-base font-light leading-relaxed max-w-[44ch]">
          {reduceMotion ? (
            category.description
          ) : (
            <motion.span
              variants={containerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={gpuLayer}
              className="inline"
            >
              {words.map((word, i) => (
                <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-1 mr-[0.28em]">
                  <motion.span variants={itemVariants} className="inline-block">
                    {word}
                  </motion.span>
                </span>
              ))}
            </motion.span>
          )}
        </p>

        <div className="flex items-center gap-2 pt-2">
  <MagneticButton
    onClick={() => alert(`Opening ${category.headline} menu…`)}
    className="px-6 sm:px-7 py-3 sm:py-3.5 rounded-full border border-brand-surface/20 text-brand-surface font-body text-[0.7rem] sm:text-xs uppercase tracking-[0.2em] touch-manipulation flex items-center gap-2 group"
  >
    {/* Aapke button ka text ya icon yahan aayega, jaise: */}
    View Menu
  </MagneticButton>
</div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function HeroVisual() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const lockTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduceMotion = useReducedMotion() ?? false;

  const current = categories[activeIndex];

  const handleSelect = useCallback(
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
      <div className="relative z-10 w-full md:w-[45%] flex flex-col justify-center gap-0 px-6 sm:px-12 md:px-16 py-12 md:py-0">
        <CategoryNav
          categories={categories}
          activeIndex={activeIndex}
          onSelect={handleSelect}
          isLocked={isLocked}
        />

        <MenuDescription category={current} reduceMotion={reduceMotion} />
      </div>

      <div className="relative w-full md:w-[55%] aspect-[4/5] md:aspect-auto md:h-full overflow-hidden bg-brand-base">
        <MenuImage category={current} reduceMotion={reduceMotion} />
      </div>
    </div>
  );
}