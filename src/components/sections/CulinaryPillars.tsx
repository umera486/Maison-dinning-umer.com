// components/sections/CulinaryPillars.tsx
"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import StackSection, { useNearViewport } from "@/components/layout/StackSection";

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
    id: "tandoor",
    label: "01 — Live Fire",
    title: "The Tandoor Table",
    description:
      "Seekh kebabs, tandoori chicken, and fresh naan pulled straight from a 900°C clay oven, finished tableside in front of you.",
    meta: ["Certified Halal", "Live Tandoor", "Chef's Selection"],
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=1000&auto=format&fit=crop",
    theme: "light",
  },
  {
    id: "shahi-reserve",
    label: "02 — The Reserve",
    title: "The Shahi Reserve",
    description:
      "Hand-blended Kashmiri chai, organic desi ghee preparations, and a reserve of whole spices sourced directly from Lahore's Akbari Mandi.",
    meta: ["Kashmiri Chai", "Organic Desi Ghee", "Artisanal Spice"],
    image: "https://images.unsplash.com/photo-1608835291093-394b0c943a75?q=80&w=1000&auto=format&fit=crop",
    theme: "gold",
  },
  {
    id: "darbar",
    label: "03 — Private Majlis",
    title: "The Darbar Hall",
    description:
      "A private hall seating up to twenty guests, styled after the grand Mughal darbars, for weddings, walimas, and family celebrations.",
    meta: ["Up to 20 Guests", "Bespoke Menus", "Full Buyout"],
    image: "https://images.unsplash.com/photo-1517244683847-7456b63c5969?q=80&w=1000&auto=format&fit=crop",
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
  // Near-viewport gate: useScroll below still subscribes (framer requires
  // a stable ref), but we only ever *apply* the derived transforms to
  // style when the card is actually close to the screen — off-screen
  // cards render at their resting values with zero style writes.
  const { ref: cardRef, isNear } = useNearViewport<HTMLDivElement>();

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "start start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const textOpacity = useTransform(scrollYProgress, [0.3, 0.8], [0.2, 1]);
  const textY = useTransform(scrollYProgress, [0.2, 1], [40, 0]);

  const applyMotion = isNear && !reduceMotion;

  return (
    <div ref={cardRef} className="h-full w-full flex flex-col justify-center px-5 sm:px-8 md:px-16 py-14 lg:py-0">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        <div className="lg:col-span-7 flex flex-col justify-center z-10">
          <span className="font-body text-[0.65rem] sm:text-xs uppercase tracking-[0.3em] opacity-70 mb-6 sm:mb-8 block">
            {pillar.label}
          </span>

          <motion.div style={applyMotion ? { y: textY, opacity: textOpacity, willChange: "transform, opacity" } : {}}>
            <h2 className="font-heading font-bold leading-[0.92] tracking-tight text-[clamp(3rem,8vw,7.5rem)] text-balance mb-6 md:mb-8">
              {pillar.title}
            </h2>
            <p className="font-body font-light leading-relaxed text-[clamp(1rem,1.2vw+0.6rem,1.25rem)] max-w-[42ch]">
              {pillar.description}
            </p>
          </motion.div>

          <div className="mt-8 md:mt-12 space-y-8">
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

            <button className="group relative flex items-center gap-3 font-body text-xs sm:text-sm uppercase tracking-[0.25em] font-medium overflow-hidden">
              <span className="relative pb-1">
                Explore {pillar.title.split(" ").slice(-1)[0]}
                <span className="absolute left-0 bottom-0 w-full h-[1px] bg-current origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 transform-gpu" />
              </span>
              <span className="transform -translate-x-6 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 transform-gpu">
                →
              </span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 relative w-full h-[40vh] lg:h-[65vh] rounded-2xl overflow-hidden shadow-2xl group cursor-pointer">
          <motion.div
            style={applyMotion ? { scale: imageScale, willChange: "transform" } : {}}
            className="w-full h-full transform-gpu"
          >
            <motion.div
              className="relative w-full h-full transition-transform duration-700 group-hover:scale-110"
              style={{ willChange: "transform" }}
            >
              <Image
                src={pillar.image}
                alt={pillar.title}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                quality={80}
                className="object-cover"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t ${
                  pillar.theme === "dark"
                    ? "from-brand-base/80"
                    : pillar.theme === "gold"
                    ? "from-brand-accent/50"
                    : "from-[#EAE5DF]/60"
                } via-transparent to-transparent opacity-100 group-hover:opacity-0 transition-opacity duration-700`}
              />
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