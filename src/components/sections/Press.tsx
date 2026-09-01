"use client";

import { useState } from "react";
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
    id: "figaro",
    number: "01",
    publication: "Le Figaro Gastronomie",
    quote: "An immutable temple of taste where French precision meets radical contemporary architecture.",
    location: "Paris",
    year: "2026",
  },
  {
    id: "michelin",
    number: "02",
    publication: "Michelin Guide",
    quote: "Sub-terrain limestone vaults and an uncompromising discipline that commands global attention.",
    location: "International",
    year: "2026",
  },
  {
    id: "worlds50",
    number: "03",
    publication: "The World's 50 Best",
    quote: "A sensory masterclass. Every course unfolds like a chapter of a deeply considered novel.",
    location: "Global Index",
    year: "2025",
  },
  {
    id: "gault",
    number: "04",
    publication: "Gault & Millau",
    quote: "Flawless synchronization of spatial acoustics, lighting, and avant-garde technique.",
    location: "Europe",
    year: "2025",
  },
];

const gpuLayer: React.CSSProperties = {
  willChange: "transform, opacity, filter",
  transform: "translateZ(0)",
  backfaceVisibility: "hidden",
};

export default function Press({ index }: { index: number }) {
  const [activeId, setActiveId] = useState<string>("figaro");
  const reduceMotion = useReducedMotion() ?? false;

  const activeItem = pressQuotes.find((item) => item.id === activeId) || pressQuotes[0];

  return (
    <StackSection index={index} className="bg-brand-base text-brand-surface flex flex-col justify-between py-8 sm:py-12 md:py-16 relative overflow-hidden">
      
      {/* Architectural Background Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex justify-between px-6 sm:px-12">
        <div className="w-px h-full bg-brand-surface" />
        <div className="w-px h-full bg-brand-surface hidden md:block" />
        <div className="w-px h-full bg-brand-surface" />
      </div>

      {/* Section Header */}
      <div className="px-5 sm:px-8 md:px-16 flex flex-col md:flex-row md:items-end justify-between gap-4 z-10 shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-2 sm:mb-3">
            <span className="w-6 h-[1px] bg-brand-accent" />
            <span className="font-body text-[0.6rem] sm:text-xs uppercase tracking-[0.3em] text-brand-accent">
              Critical Record
            </span>
          </div>
          <h2 className="font-heading font-light italic leading-[1.02] tracking-tight text-[clamp(2.2rem,5vw,4.8rem)] max-w-4xl text-balance">
            Echoes from the global culinary vanguard.
          </h2>
        </div>
        <div className="font-body text-[10px] sm:text-xs uppercase tracking-[0.3em] text-brand-muted pb-1">
          [ Verified Accolades ]
        </div>
      </div>

      {/* Swiss-Style Editorial Matrix - Constrained to screen */}
      <div className="relative w-full max-w-7xl mx-auto px-5 sm:px-8 md:px-16 my-auto z-10 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center border-t border-brand-surface/15">
          
          {/* Left Column: Interactive Publication List */}
          <div className="lg:col-span-6 flex flex-col divide-y divide-brand-surface/15">
            {pressQuotes.map((item) => {
              const isActive = activeId === item.id;
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => !reduceMotion && setActiveId(item.id)}
                  onClick={() => setActiveId(item.id)}
                  className="group relative py-4 sm:py-6 cursor-pointer flex items-center justify-between transition-colors duration-500"
                >
                  <div className="flex items-center gap-5 sm:gap-8">
                    <span className={`font-body text-xs sm:text-sm tracking-widest transition-colors duration-300 ${isActive ? "text-brand-accent font-bold" : "text-brand-muted/50"}`}>
                      {item.number}
                    </span>
                    <div>
                      <h3 className={`font-heading text-lg sm:text-2xl tracking-tight transition-all duration-500 ${isActive ? "text-brand-surface translate-x-2" : "text-brand-surface/40 group-hover:text-brand-surface/70"}`}>
                        {item.publication}
                      </h3>
                      <span className="font-body text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-brand-muted mt-0.5 block">
                        {item.location} — {item.year}
                      </span>
                    </div>
                  </div>

                  {/* Animated Indicator */}
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-brand-surface/20 flex items-center justify-center transition-all duration-500 shrink-0 ${isActive ? "bg-brand-accent text-brand-base border-brand-accent scale-110" : "text-brand-surface/30 group-hover:border-brand-surface/60 group-hover:text-brand-surface"}`}>
                    <span className="text-[10px] sm:text-xs transform -rotate-45">→</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: High-Impact Floating Quote Display */}
          <div className="lg:col-span-6 lg:pl-6">
            <div className="relative p-6 sm:p-10 md:p-12 rounded-3xl bg-[#131316] border border-brand-surface/10 shadow-2xl overflow-hidden flex flex-col justify-between min-h-[300px] sm:min-h-[360px] transform-gpu">
              
              {/* Subtle Corner Glow */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeItem.id}
                  initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  style={gpuLayer}
                  className="relative z-10 flex flex-col justify-between h-full space-y-6 sm:space-y-8"
                >
                  <div className="font-heading text-5xl sm:text-6xl text-brand-accent/40 leading-none">“</div>
                  
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

      {/* Bottom Footer Info */}
      <div className="px-5 sm:px-8 md:px-16 flex items-center justify-between font-body text-[0.6rem] sm:text-xs uppercase tracking-[0.3em] text-brand-muted/60 border-t border-brand-surface/10 pt-4 sm:pt-5 z-10 shrink-0">
        <span>Global Press Office</span>
        <span>media@maisondining.com</span>
      </div>

    </StackSection>
  );
}