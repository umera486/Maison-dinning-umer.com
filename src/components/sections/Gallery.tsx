// components/sections/Gallery.tsx
"use client";

import { useRef, useCallback } from "react";
import Image from "next/image";
import StackSection from "@/components/layout/StackSection";

interface Dish {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  category: string;
}

const dishes: Dish[] = [
  {
    id: "bbq",
    title: "BBQ Pit",
    subtitle: "Charcoal-smoked seekh kebabs & chops",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop",
    category: "01 — Live Fire",
  },
  {
    id: "tawa",
    title: "Tawa Piece",
    subtitle: "Cast iron seared Lahori classics",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=1000&auto=format&fit=crop",
    category: "02 — Cast Iron",
  },
  {
    id: "karahi",
    title: "Mutton Karahi",
    subtitle: "Deep wok slow-cooked heritage",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1000&auto=format&fit=crop",
    category: "03 — Wok Heirloom",
  },
  {
    id: "nihari",
    title: "Royal Nihari",
    subtitle: "12-hour simmered shank stew",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=1000&auto=format&fit=crop",
    category: "04 — Slow Stew",
  },
];

export default function Gallery({ index }: { index: number }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback((direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  }, []);

  return (
    <StackSection index={index} className="bg-[#1A0B08] text-[#F5EFEB] flex flex-col justify-center overflow-hidden relative py-20 select-none">
      
      {/* Section Header with Manual Navigation Arrow Buttons */}
      <div className="px-6 sm:px-12 md:px-20 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="font-body text-[10px] sm:text-xs uppercase tracking-[0.4em] text-[#E5A93C] block mb-3 font-medium">
            The Culinary Masterpieces
          </span>
          <h2 className="font-heading italic font-light tracking-tight text-[clamp(2.75rem,7vw,6rem)] leading-[0.95] text-[#F5EFEB]">
            Artisanal <span className="not-italic font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F5EFEB] via-[#F5EFEB] to-[#E5A93C]">Flavours.</span>
          </h2>
        </div>

        {/* Manual Left / Right Control Buttons */}
        <div className="flex items-center gap-4">
          <p className="font-body text-xs text-[#9E988F] font-light hidden lg:block mr-2">
            Explore via controls or swipe
          </p>
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll Left"
            className="w-12 h-12 rounded-full border border-[#E5A93C]/40 bg-[#24100C] text-[#F5EFEB] flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-[#E5A93C] hover:text-[#1A0B08] hover:border-[#E5A93C] transform-gpu"
          >
            ←
          </button>
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll Right"
            className="w-12 h-12 rounded-full border border-[#E5A93C]/40 bg-[#24100C] text-[#F5EFEB] flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-[#E5A93C] hover:text-[#1A0B08] hover:border-[#E5A93C] transform-gpu"
          >
            →
          </button>
        </div>
      </div>

      {/* Horizontally Scrollable Cards Container with Sharp Outlining */}
      <div 
        ref={scrollRef}
        className="w-full overflow-x-auto scrollbar-none px-6 sm:px-12 md:px-20 py-4 flex gap-6 sm:gap-8 snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {dishes.map((dish) => (
          <div
            key={dish.id}
            className="snap-start shrink-0 group relative w-[300px] sm:w-[360px] md:w-[400px] h-[440px] sm:h-[500px] rounded-none overflow-hidden bg-[#24100C] border border-[#E5A93C]/40 flex flex-col justify-end p-6 sm:p-8 cursor-pointer transform-gpu transition-all duration-500 hover:border-[#E5A93C] shadow-2xl"
          >
            {/* Background Image with Sharp Framing & Hover Zoom */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <Image
                src={dish.image}
                alt={dish.title}
                fill
                sizes="(max-width: 768px) 300px, 400px"
                quality={85}
                className="object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-[0.85] group-hover:brightness-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A0B08] via-[#1A0B08]/40 to-transparent opacity-90 group-hover:opacity-75 transition-opacity duration-500" />
            </div>

            {/* Card Content with Italicized Prominent Heading */}
            <div className="relative z-10 space-y-2 transform-gpu transition-transform duration-500 group-hover:-translate-y-2">
              <span className="font-body text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-[#E5A93C] font-semibold block">
                {dish.category}
              </span>
              <h3 className="font-heading italic font-bold text-3xl sm:text-4xl text-[#F5EFEB] tracking-tight">
                {dish.title}
              </h3>
              <p className="font-body text-xs sm:text-sm text-[#F5EFEB]/80 font-light leading-relaxed pt-1">
                {dish.subtitle}
              </p>
              <div className="pt-3 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#E5A93C] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span>Explore Dish</span>
                <span>→</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </StackSection>
  );
}