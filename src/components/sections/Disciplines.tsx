// src/components/sections/Disciplines.tsx
"use client";

import { Fragment, useCallback, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { routes } from "@/lib/site";
import { EASE_LAHORI, EASE_SEAL } from "@/lib/motion";

/**
 * The five disciplines printed across the top of the flyer:
 * KARAHI · BBQ · NIHARI · PAYE · STREET FOOD.
 *
 * Each one links into the matching section of /menu, so this reads as an
 * index rather than a second, competing menu. That was the flaw in the old
 * homepage: three sections all listing dishes, none of them the real menu.
 */

interface Discipline {
  id: string;
  headline: string;
  tagline: string;
  description: string;
  /** Anchors into a real category on /menu. */
  href: string;
  /** A real dish and its real price — no invented luxury pricing. */
  example: string;
  image: string;
}

const disciplines: Discipline[] = [
  {
    id: "karahi",
    headline: "Karahi",
    tagline: "Iron wok, open flame",
    description:
      "Cooked to order in the wok — tomato, fresh ginger and crushed pepper, nothing held back to a pot.",
    href: `${routes.menu}#lamb-mains`,
    example: "Lamb Karahi · £7.99",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "bbq",
    headline: "BBQ",
    tagline: "Live charcoal",
    description:
      "Seekh kabab, lamb chops and tikka straight off the skewer. The mixed grill feeds a table of four.",
    href: `${routes.menu}#starters-non-veg`,
    example: "Mix Grill (Large) · £21.99",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "nihari",
    headline: "Nihari",
    tagline: "Started the night before",
    description:
      "Shank cooked down overnight into marrow gravy, finished with ginger, green chilli and lemon.",
    href: `${routes.menu}#specials`,
    example: "Lahori Nihari · £7.99",
    image: "https://images.unsplash.com/photo-1585932702519-f21cc028cb0c?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "paye",
    headline: "Paye",
    tagline: "Slow, patient, unhurried",
    description:
      "Trotters taken all the way to collagen. The kunna is cooked Chiniot-style, in clay.",
    href: `${routes.menu}#specials`,
    example: "Lamb Kunna Paye · £9.99",
    image: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "street-food",
    headline: "Street Food",
    tagline: "How Lahore actually eats",
    description:
      "Dynamite tossed hot in chilli glaze, whole chargha, halwa puri at breakfast. Loud, fast, honest.",
    href: `${routes.menu}#lahori-dynamite`,
    example: "Lahori Chicken Dynamite · £6.99",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=1600&auto=format&fit=crop",
  },
];

const TRANSITION_LOCK_MS = 420;
const IMAGE_SIZES = "(min-width: 768px) 58vw, 100vw";

const containerVariants: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.035, delayChildren: 0.04 } },
  exit: { transition: { staggerChildren: 0.012, staggerDirection: -1 } },
};

const itemVariants: Variants = {
  initial: { opacity: 0, y: "0.5em" },
  animate: { opacity: 1, y: "0em", transition: { duration: 0.5, ease: EASE_LAHORI } },
  exit: { opacity: 0, y: "-0.35em", transition: { duration: 0.18 } },
};

function DisciplineNav({
  activeIndex,
  onSelect,
  isLocked,
}: {
  activeIndex: number;
  onSelect: (idx: number) => void;
  isLocked: boolean;
}) {
  return (
    <div className="relative w-full flex flex-col">
      {disciplines.map((item, idx) => {
        const isActive = idx === activeIndex;
        return (
          <button
            key={item.id}
            onClick={() => onSelect(idx)}
            disabled={isLocked && !isActive}
            aria-current={isActive ? "true" : "false"}
            className="group relative w-full text-left py-3 sm:py-3.5 border-b border-brand-surface/10 last:border-b-0
              cursor-pointer disabled:cursor-default touch-manipulation"
          >
            <motion.div
              animate={{ opacity: isActive ? 1 : 0.4 }}
              transition={{ duration: 0.35, ease: EASE_LAHORI }}
              className="flex items-baseline gap-3 sm:gap-4 transform-gpu"
            >
              <span className="font-body text-[10px] text-brand-muted tracking-[0.25em] shrink-0 tabular-nums">
                0{idx + 1}
              </span>
              <span
                className={`font-heading italic font-light leading-tight text-[clamp(1.75rem,5.5vw,3rem)] transition-colors duration-400 ${
                  isActive ? "text-brand-accent" : "text-brand-surface"
                }`}
              >
                {item.headline}
              </span>
              <span className="ml-auto font-body text-[9px] sm:text-[10px] uppercase tracking-[0.16em] text-brand-surface/45 text-right shrink-0 hidden sm:block">
                {item.tagline}
              </span>
            </motion.div>

            {isActive && (
              <motion.div
                layoutId="discipline-indicator"
                className="absolute left-0 -bottom-px h-[2px] w-14 bg-brand-accent"
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

function DisciplineImage({ item, reduceMotion }: { item: Discipline; reduceMotion: boolean }) {
  return (
    <AnimatePresence mode="sync" initial={false}>
      <motion.div
        key={item.id}
        initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
        animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
        exit={{ clipPath: "inset(100% 0% 0% 0%)" }}
        transition={{ duration: reduceMotion ? 0.18 : 0.75, ease: EASE_SEAL }}
        className="absolute inset-0"
      >
        <Image
          src={item.image}
          alt={item.headline}
          fill
          sizes={IMAGE_SIZES}
          quality={75}
          preload={item.id === disciplines[0].id}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-brand-base/85 via-brand-base/15 to-transparent pointer-events-none" />
      </motion.div>
    </AnimatePresence>
  );
}

function DisciplineDetail({ item, reduceMotion }: { item: Discipline; reduceMotion: boolean }) {
  const words = useMemo(() => item.description.split(" "), [item.description]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4, ease: EASE_LAHORI }}
        className="space-y-4 min-h-[150px] sm:min-h-[140px] transform-gpu"
      >
        <p className="font-body text-brand-muted text-sm sm:text-base font-light leading-relaxed max-w-[46ch]">
          {reduceMotion ? (
            item.description
          ) : (
            // Per-word motion typography. Each word is masked by its own
            // overflow-hidden span so it rises from nothing.
            <motion.span
              variants={containerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="inline"
            >
              {words.map((word, i) => (
                <Fragment key={`${word}-${i}`}>
                  <span className="inline-block overflow-hidden pb-0.5">
                    <motion.span variants={itemVariants} className="inline-block transform-gpu">
                      {word}
                    </motion.span>
                  </span>
                  {/* A real space, so the sentence doesn't read as one long
                      run-on word to screen readers and crawlers. */}
                  {i < words.length - 1 ? " " : null}
                </Fragment>
              ))}
            </motion.span>
          )}
        </p>

        <p className="font-heading italic text-brand-accent text-lg sm:text-xl">{item.example}</p>

        <Link
          href={item.href}
          className="group inline-flex items-center gap-2.5 rounded-full border border-brand-surface/25
            px-6 h-11 font-body text-[10px] uppercase tracking-[0.2em] text-brand-surface
            hover:border-brand-accent hover:text-brand-accent transition-colors duration-300"
        >
          See {item.headline} on the menu
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} />
        </Link>
      </motion.div>
    </AnimatePresence>
  );
}

export default function Disciplines() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const lockTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduceMotion = useReducedMotion() ?? false;

  const current = disciplines[activeIndex];

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
      <div className="relative z-10 w-full md:w-[46%] flex flex-col justify-center gap-6 px-5 sm:px-10 md:px-14 py-10 md:py-0">
        <div>
          <p className="font-body text-[10px] uppercase tracking-[0.3em] text-brand-accent mb-1.5">
            What we cook
          </p>
          <DisciplineNav activeIndex={activeIndex} onSelect={handleSelect} isLocked={isLocked} />
        </div>

        <DisciplineDetail item={current} reduceMotion={reduceMotion} />
      </div>

      <div className="relative w-full md:w-[54%] aspect-[4/5] md:aspect-auto md:h-full overflow-hidden bg-brand-base">
        <DisciplineImage item={current} reduceMotion={reduceMotion} />
      </div>
    </div>
  );
}
