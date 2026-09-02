// components/sections/Press.tsx
"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import StackSection from "@/components/layout/StackSection";

interface PressQuote {
  id: string;
  number: string;
  publication: string;
  quote: string;
  location: string;
  year: string;
}

const pressQuotes: PressQuote[] = [
  {
    id: "timeout",
    number: "01",
    publication: "Time Out London",
    quote: "The tandoor here runs hotter and more honest than anywhere else claiming Lahori roots in the city.",
    location: "London",
    year: "2026",
  },
  {
    id: "halalguide",
    number: "02",
    publication: "The Halal Food Guide",
    quote: "Fully certified, unapologetically Punjabi, and plated with a precision usually reserved for tasting menus.",
    location: "UK-wide",
    year: "2026",
  },
  {
    id: "eater",
    number: "03",
    publication: "Eater London",
    quote: "The Shahi Reserve chai service alone is worth the booking — hand-blended, unhurried, genuinely rare.",
    location: "London",
    year: "2025",
  },
  {
    id: "zomato",
    number: "04",
    publication: "Zomato Editor's Pick",
    quote: "Nihari that tastes like it was simmered overnight, because it was. A rare thing done properly.",
    location: "UK",
    year: "2025",
  },
];

const HOVER_LOCK_MS = 350;

const gpuLayer: React.CSSProperties = {
  willChange: "transform, opacity",
  transform: "translateZ(0)",
  backfaceVisibility: "hidden",
};

export default function Press({ index }: { index: number }) {
  const [activeId, setActiveId] = useState<string>("timeout");
  const [isLocked, setIsLocked] = useState(false);
  const lockTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduceMotion = useReducedMotion() ?? false;

  const activeItem = pressQuotes.find((item) => item.id === activeId) ?? pressQuotes[0];

  // Debounces onMouseEnter so a fast sweep across the list can't fire the
  // AnimatePresence swap 4x in under a second.
  const setActive = useCallback(
    (id: string) => {
      if (id === activeId || isLocked) return;
      setActiveId(id);
      setIsLocked(true);
      if (lockTimeout.current) clearTimeout(lockTimeout.current);
      lockTimeout.current = setTimeout(() => setIsLocked(false), HOVER_LOCK_MS);
    },
    [activeId, isLocked]
  );

  return (
    <StackSection
      index={index}
      className="bg-brand-base text-brand-surface flex flex-col justify-between py-8 sm:py-12 md:py-16 relative overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex justify-between px-6 sm:px-12">
        <div className="w-px h-full bg-brand-surface" />
        <div className="w-px h-full bg-brand-surface hidden md:block" />
        <div className="w-px h-full bg-brand-surface" />
      </div>

      <div className="px-5 sm:px-8 md:px-16 flex flex-col md:flex-row md:items-end justify-between gap-4 z-10 shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-2 sm:mb-3">
            <span className="w-6 h-[1px] bg-brand-accent" />
            <span className="font-body text-[0.6rem] sm:text-xs uppercase tracking-[0.3em] text-brand-accent">
              Critical Record
            </span>
          </div>
          <h2 className="font-heading font-light italic leading-[1.02] tracking-tight text-[clamp(2.2rem,5vw,4.8rem)] max-w-4xl text-balance">
            Praised by the UK&rsquo;s sharpest food press.
          </h2>
        </div>
        <div className="font-body text-[10px] sm:text-xs uppercase tracking-[0.3em] text-brand-muted pb-1">
          [ Verified Coverage ]
        </div>
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-5 sm:px-8 md:px-16 my-auto z-10 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center border-t border-brand-surface/15">
          <div className="lg:col-span-6 flex flex-col divide-y divide-brand-surface/15">
            {pressQuotes.map((item) => {
              const isActive = activeId === item.id;
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => !reduceMotion && setActive(item.id)}
                  onClick={() => setActive(item.id)}
                  className="group relative py-4 sm:py-6 cursor-pointer flex items-center justify-between transition-colors duration-500"
                >
                  <div className="flex items-center gap-5 sm:gap-8">
                    <span
                      className={`font-body text-xs sm:text-sm tracking-widest transition-colors duration-300 ${
                        isActive ? "text-brand-accent font-bold" : "text-brand-muted/50"
                      }`}
                    >
                      {item.number}
                    </span>
                    <div>
                      <h3
                        className={`font-heading text-lg sm:text-2xl tracking-tight transition-all duration-500 ${
                          isActive ? "text-brand-surface translate-x-2" : "text-brand-surface/40 group-hover:text-brand-surface/70"
                        }`}
                      >
                        {item.publication}
                      </h3>
                      <span className="font-body text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-brand-muted mt-0.5 block">
                        {item.location} — {item.year}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-brand-surface/20 flex items-center justify-center transition-all duration-500 shrink-0 ${
                      isActive
                        ? "bg-brand-accent text-brand-base border-brand-accent scale-110"
                        : "text-brand-surface/30 group-hover:border-brand-surface/60 group-hover:text-brand-surface"
                    }`}
                  >
                    <span className="text-[10px] sm:text-xs transform -rotate-45">→</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-6 lg:pl-6">
            <div className="relative p-6 sm:p-10 md:p-12 rounded-3xl bg-[#131316] border border-brand-surface/10 shadow-2xl overflow-hidden flex flex-col justify-between min-h-[300px] sm:min-h-[360px]">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none" />

              {/* Opacity/y only — the blur-filter cross-fade this replaced
                  was compositing a full blur pass on every hover swap. */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeItem.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  style={gpuLayer}
                  className="relative z-10 flex flex-col justify-between h-full space-y-6 sm:space-y-8"
                >
                  <div className="font-heading text-5xl sm:text-6xl text-brand-accent/40 leading-none">&ldquo;</div>

                  <p className="font-heading italic font-light text-[clamp(1.25rem,2.5vw,2.2rem)] text-brand-surface leading-snug">
                    {activeItem.quote}
                  </p>

                  <div className="pt-6 border-t border-brand-surface/10 flex items-center justify-between">
                    <div>
                      <span className="block font-body text-[8px] sm:text-[9px] uppercase tracking-[0.3em] text-brand-accent mb-1">
                        Verified Source
                      </span>
                      <span className="font-heading text-base sm:text-lg text-brand-surface tracking-wide">
                        {activeItem.publication}
                      </span>
                    </div>
                    <span className="font-body text-[11px] sm:text-xs text-brand-muted tracking-widest">
                      [{activeItem.year}]
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 sm:px-8 md:px-16 flex items-center justify-between font-body text-[0.6rem] sm:text-xs uppercase tracking-[0.3em] text-brand-muted/60 border-t border-brand-surface/10 pt-4 sm:pt-5 z-10 shrink-0">
        <span>Press Office</span>
        <span>media@lahoriwala.co.uk</span>
      </div>
    </StackSection>
  );
}