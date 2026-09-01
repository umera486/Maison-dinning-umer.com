"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import StackSection from "@/components/layout/StackSection";

interface Pillar {
  id: string;
  label: string;
  title: string;
  description: string;
  meta: string[];
  image: string;
  theme: "dark" | "gold" | "light";
}

const pillars: Pillar[] = [
  {
    id: "tasting",
    label: "01 — Culinary Direction",
    title: "The Tasting Menu",
    description: "A seven-course arc through seasonal ingredients, built around a single guiding idea each quarter and executed with modern French precision.",
    meta: ["Seasonal Sourcing", "Wine Pairing", "Chef's Table"],
    // Fixed: Ultra-premium plating image
    image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=1000&auto=format&fit=crop", 
    theme: "light",
  },
  {
    id: "cellar",
    label: "02 — The Reserve",
    title: "The Wine Cellar",
    description: "3,500 bottles held in sub-terrain limestone vaults — rare Bordeaux, private Burgundian allocations, and verticals going back four decades.",
    meta: ["Rare Vintages", "Sommelier Curation", "Private Tastings"],
    // Fixed: Verified deep luxury wine cellar image
    image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=1000&auto=format&fit=crop", 
    theme: "gold",
  },
  {
    id: "private",
    label: "03 — Exclusive",
    title: "Obsidian Salon",
    description: "An intimate room for up to twelve guests, a private kitchen view, and acoustic design built for conversation, not noise.",
    meta: ["Up to 12 Guests", "Bespoke Menus", "Full Buyout"],
    // Fixed: Intimate luxury dining room
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop", 
    theme: "dark",
  },
];

const themeClasses: Record<Pillar["theme"], string> = {
  dark: "bg-brand-base text-brand-surface",
  gold: "bg-brand-accent text-brand-base",
  light: "bg-[#EAE5DF] text-brand-base",
};

// ---------------------------------------------------------------------------
// Inner Scroll Engine Component (Isolates Scroll Math per Card)
// ---------------------------------------------------------------------------
function ScrollLinkedCard({ pillar }: { pillar: Pillar }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion() ?? false;

  // Track the scroll progress of THIS specific card as it enters the screen
  const { scrollYProgress } = useScroll({
  target: cardRef,
  // Start tracking when card enters bottom of viewport, end when it pins to top
  offset: ["start end", "start start"], 
});

  // 1. Image Scaling (Scroll-driven: 80% to 100%)
  const imageScale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  // 2. Text Highlighting (Scroll-driven: 30% opacity to 100% opacity)
  const textOpacity = useTransform(scrollYProgress, [0.3, 0.8], [0.2, 1]);
  // 3. Text Y Shift (Scroll-driven: slightly moving up into place)
  const textY = useTransform(scrollYProgress, [0.2, 1], [40, 0]);

  return (
    <div ref={cardRef} className="h-full w-full flex flex-col justify-center px-5 sm:px-8 md:px-16 py-14 lg:py-0">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        
        {/* Left Side: Typography & Interactions */}
        <div className="lg:col-span-7 flex flex-col justify-center z-10">
          <span className="font-body text-[0.65rem] sm:text-xs uppercase tracking-[0.3em] opacity-70 mb-6 sm:mb-8 block">
            {pillar.label}
          </span>

          <motion.div style={reduceMotion ? {} : { y: textY, opacity: textOpacity, willChange: "transform, opacity" }}>
            <h2 className="font-heading font-bold leading-[0.92] tracking-tight text-[clamp(3rem,8vw,7.5rem)] text-balance mb-6 md:mb-8">
              {pillar.title}
            </h2>

            <p className="font-body font-light leading-relaxed text-[clamp(1rem,1.2vw+0.6rem,1.25rem)] max-w-[42ch]">
              {pillar.description}
            </p>
          </motion.div>

          {/* Hover Engine: Meta Pills & Discover Button */}
          <div className="mt-8 md:mt-12 space-y-8">
            {/* Meta tags */}
            <div className="flex flex-wrap gap-3 sm:gap-4 font-body text-[0.6rem] sm:text-[10px] uppercase tracking-[0.2em]">
              {pillar.meta.map((m) => (
                <span 
                  key={m} 
                  className="border border-current/20 px-4 py-2 rounded-full transition-transform duration-300 hover:scale-105 hover:bg-current hover:text-brand-base cursor-default"
                >
                  {m}
                </span>
              ))}
            </div>

            {/* Lethal Hover Button with Line & Arrow */}
            <button className="group relative flex items-center gap-3 font-body text-xs sm:text-sm uppercase tracking-[0.25em] font-medium overflow-hidden">
              <span className="relative pb-1">
                Explore {pillar.title.split(" ")[1] || "More"}
                {/* Animated Underline */}
                <span className="absolute left-0 bottom-0 w-full h-[1px] bg-current origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[0.16,1,0.3,1] transform-gpu" />
              </span>
              {/* Sliding Arrow Reveal */}
              <span className="transform -translate-x-6 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 ease-[0.16,1,0.3,1] transform-gpu">
                →
              </span>
            </button>
          </div>
        </div>

        {/* Right Side: Scroll-Driven Parallax Image */}
        <div className="lg:col-span-5 relative w-full h-[40vh] lg:h-[65vh] rounded-2xl overflow-hidden shadow-2xl group cursor-pointer">
          <motion.div
            style={reduceMotion ? {} : { scale: imageScale, willChange: "transform" }}
            className="w-full h-full transform-gpu"
          >
            {/* Internal Image Hover Zoom */}
            <motion.div 
              className="relative w-full h-full transition-transform duration-700 ease-[0.16,1,0.3,1] group-hover:scale-110"
              style={{ willChange: "transform" }}
            >
              <Image 
                src={pillar.image} 
                alt={pillar.title} 
                fill 
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
                quality={85}
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${pillar.theme === 'dark' ? 'from-brand-base/80' : pillar.theme === 'gold' ? 'from-brand-accent/50' : 'from-[#EAE5DF]/60'} via-transparent to-transparent opacity-100 group-hover:opacity-0 transition-opacity duration-700`} />
            </motion.div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}

export default function CulinaryPillars({ startIndex }: { startIndex: number }) {
  return (
    <>
      {pillars.map((pillar, i) => (
        <StackSection key={pillar.id} index={startIndex + i} className={`${themeClasses[pillar.theme]} relative`}>
          <ScrollLinkedCard pillar={pillar} />
        </StackSection>
      ))}
    </>
  );
}