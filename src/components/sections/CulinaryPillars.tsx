// components/sections/CulinaryPillars.tsx
"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import StackSection, { useNearViewport } from "@/components/layout/StackSection";

interface Pillar {
  id: string;
  categoryNumber: string;
  title: string;
  subtitle: string;
  description: string;
  meta: string[];
  image: string;
  theme: "dark" | "gold" | "light";
}

const pillars: Pillar[] = [
  {
    id: "bbq",
    categoryNumber: "01",
    title: "BBQ Pit",
    subtitle: "Charcoal-smoked seekh kebabs & chops",
    description: "Charcoal-smoked seekh kebabs, malai boti, and tender chops charred over 900°C open coals, served sizzling tableside.",
    meta: ["Certified Halal", "Live Tandoor", "Tableside Finish"],
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop",
    theme: "light",
  },
  {
    id: "tawa",
    categoryNumber: "02",
    title: "Tawa Piece",
    subtitle: "Cast iron seared Lahori classics",
    description: "Legendary Lahori tawa chicken and brain masala seared on seasoned cast iron with fresh ginger, green chillies, and desi ghee.",
    meta: ["Cast Iron Sizzle", "Desi Ghee Infused", "Lahori Classic"],
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=1200&auto=format&fit=crop",
    theme: "gold",
  },
  {
    id: "karahi",
    categoryNumber: "03",
    title: "Mutton Karahi",
    subtitle: "Deep wok slow-cooked heritage",
    description: "Slow-cooked Shinwari mutton and classic Lahori chicken karahi prepared in a deep wok with rich tomato gravy and crushed peppercorns.",
    meta: ["Open Flame Wok", "Pure Tomato Base", "Family Feasts"],
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1200&auto=format&fit=crop",
    theme: "dark",
  },
];

const themeClasses: Record<Pillar["theme"], string> = {
  dark: "bg-brand-base text-brand-surface",
  gold: "bg-brand-accent text-brand-base",
  light: "bg-[#EAE5DF] text-brand-base",
};

function ScrollLinkedCard({ pillar }: { pillar: Pillar }) {
  const reduceMotion = useReducedMotion() ?? false;
  const { ref: cardRef, isNear } = useNearViewport<HTMLDivElement>();

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "start start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);
  const applyMotion = isNear && !reduceMotion;

  return (
    <div ref={cardRef} className="h-full w-full flex flex-col justify-center py-10 lg:py-0 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0 items-center w-full">
        
        {/* Left Column: Text content with clean internal padding */}
        <div className="lg:col-span-6 px-6 sm:px-12 lg:pl-20 lg:pr-12 flex flex-col justify-center z-10 space-y-5">
          <span className="font-body text-[10px] sm:text-xs uppercase tracking-[0.3em] opacity-60 font-medium">
            Category {pillar.categoryNumber}
          </span>

          <div>
            <h2 className="font-heading italic font-bold leading-[0.92] tracking-tight text-[clamp(3rem,7.5vw,6.5rem)] text-balance">
              <span className="block not-italic font-light opacity-80 text-[0.45em] uppercase tracking-[0.2em] mb-1">
                {pillar.subtitle}
              </span>
              {pillar.title}
            </h2>
            <p className="font-body font-light leading-relaxed text-sm sm:text-base max-w-[40ch] opacity-90 mt-4">
              {pillar.description}
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex flex-wrap gap-2 font-body text-[9px] sm:text-[10px] uppercase tracking-[0.2em]">
              {pillar.meta.map((m) => (
                <span
                  key={m}
                  className="border border-current/25 px-3 py-1 rounded-full font-medium cursor-default"
                >
                  {m}
                </span>
              ))}
            </div>

            <button 
              onClick={() => alert(`Exploring category: ${pillar.title}`)}
              className="group relative inline-flex items-center gap-3 font-body text-xs uppercase tracking-[0.25em] font-medium pt-2 cursor-pointer"
            >
              <span className="relative pb-1">
                Explore Dish
                <span className="absolute left-0 bottom-0 w-full h-[1px] bg-current origin-left scale-x-100 transition-transform duration-300" />
              </span>
              <span className="transform group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </button>
          </div>
        </div>

        {/* Right Column: Full-Bleed Edge-to-Edge Image */}
        <div className="lg:col-span-6 relative w-full h-[42vh] sm:h-[50vh] lg:h-screen overflow-hidden flex items-center justify-center">
          <motion.div
            style={applyMotion ? { scale: imageScale, willChange: "transform" } : {}}
            className="w-full h-full transform-gpu relative"
          >
            <Image
              src={pillar.image}
              alt={pillar.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={85}
              priority
              className="object-cover w-full h-full"
            />
            <div
              className={`absolute inset-0 bg-gradient-to-t ${
                pillar.theme === "dark"
                  ? "from-brand-base/40"
                  : pillar.theme === "gold"
                  ? "from-brand-accent/20"
                  : "from-[#EAE5DF]/25"
              } via-transparent to-transparent pointer-events-none`}
            />
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
        <StackSection key={pillar.id} index={startIndex + i} className={`${themeClasses[pillar.theme]} relative p-0`}>
          <ScrollLinkedCard pillar={pillar} />
        </StackSection>
      ))}
    </>
  );
}