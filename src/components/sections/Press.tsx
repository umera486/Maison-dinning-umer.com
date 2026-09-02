// components/sections/DigitalMenu.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StackSection from "@/components/layout/StackSection";
import MagneticButton from "@/components/shared/MagneticButton";

interface MenuItem {
  id: string;
  name: string;
  price: string;
  badge?: string;
}

interface MenuCategory {
  id: string;
  number: string;
  name: string;
  items: MenuItem[];
}

const menuCategories: MenuCategory[] = [
  {
    id: "bbq",
    number: "01",
    name: "BBQ & Grills",
    items: [
      { id: "1", name: "Royal Malai Boti", price: "£18.50", badge: "Chef's Pick" },
      { id: "2", name: "Lahori Seekh Kebab", price: "£16.00" },
      { id: "3", name: "Smoked Lamb Chops", price: "£24.00", badge: "Signature" },
      { id: "4", name: "Tandoori Jhinga Prawns", price: "£22.00" },
    ],
  },
  {
    id: "karahi",
    number: "02",
    name: "Karahi & Wok",
    items: [
      { id: "5", name: "Shinwari Mutton Karahi", price: "£36.00", badge: "Must Try" },
      { id: "6", name: "Lahori Chicken Karahi", price: "£28.00" },
      { id: "7", name: "Desi Ghee Boun Karahi", price: "£32.00" },
      { id: "8", name: "Peshawari Balti Gosht", price: "£30.00" },
    ],
  },
  {
    id: "specials",
    number: "03",
    name: "Shahi Mains",
    items: [
      { id: "9", name: "Royal Lahori Nihari", price: "£22.00", badge: "Limited Daily" },
      { id: "10", name: "Peshawari Namkeen Gosht", price: "£34.00" },
      { id: "11", name: "Shahi Murg Handi", price: "£26.00" },
      { id: "12", name: "Shahi Haleem Reserve", price: "£20.00" },
    ],
  },
  {
    id: "rice",
    number: "04",
    name: "Biryani & Breads",
    items: [
      { id: "13", name: "Dum Pukht Mutton Biryani", price: "£21.00", badge: "Best Seller" },
      { id: "14", name: "Khamiri Naan", price: "£4.50" },
      { id: "15", name: "Roghani Naan", price: "£5.50" },
      { id: "16", name: "Taftan Saffron Bread", price: "£6.00" },
    ],
  },
];

export default function DigitalMenu({ index }: { index: number }) {
  const [activeCategory, setActiveCategory] = useState<string>("bbq");
  const currentCategoryData = menuCategories.find((cat) => cat.id === activeCategory) || menuCategories[0];

  return (
    <StackSection
      index={index}
      className="bg-[#FAF7F2] text-[#0D0402] flex flex-col justify-between py-10 sm:py-14 md:py-16 relative overflow-hidden select-none"
    >
      {/* Subtle light background dot matrix */}
      <div 
        aria-hidden 
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(#0D0402 1px, transparent 1px)`,
          backgroundSize: "28px 28px"
        }}
      />

      {/* Header Section — Compact & Tight */}
      <div className="px-6 sm:px-12 md:px-20 z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <span className="font-body text-[10px] uppercase tracking-[0.4em] text-[#966A1E] block mb-2 font-bold">
            The Digital Dastarkhwan
          </span>
          <h2 className="font-heading italic font-normal tracking-tight text-[clamp(2.2rem,5vw,5rem)] leading-[0.95] text-[#0D0402]">
            Master <span className="not-italic font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#0D0402] via-[#0D0402] to-[#966A1E]">Menu.</span>
          </h2>
        </div>
        <p className="font-body text-xs sm:text-sm text-[#2C201C] font-normal max-w-xs leading-relaxed">
          Mughal lineage and Lahori street mastery, curated into an elite editorial spread.
        </p>
      </div>

      {/* Asymmetric / Non-Linear Category Navigation (Scattered Editorial Placement) */}
      <div className="px-6 sm:px-12 md:px-20 mt-6 sm:mt-8 z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-5xl">
        {menuCategories.map((cat, idx) => {
          const isActive = cat.id === activeCategory;
          // Apply slight non-linear vertical staggering offsets on desktop for avant-garde layout
          const offsetClass = idx === 1 ? "lg:translate-y-3" : idx === 2 ? "lg:-translate-y-2" : idx === 3 ? "lg:translate-y-2" : "";

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`relative group px-4 py-3 sm:py-3.5 font-body text-[11px] sm:text-xs uppercase tracking-[0.25em] transition-all duration-300 cursor-pointer overflow-hidden text-left flex flex-col justify-between min-h-[70px] border ${
                isActive
                  ? "bg-[#0D0402] text-[#FAF7F2] border-[#0D0402] shadow-md"
                  : "bg-transparent text-[#2C0102] border-[#0D0402]/20 hover:border-[#0D0402]"
              } ${offsetClass}`}
            >
              <span className={`text-[9px] font-mono opacity-60 ${isActive ? "text-[#966A1E]" : "text-[#966A1E]"}`}>
                {cat.number}
              </span>
              <span className="font-semibold tracking-wider relative z-10 truncate">{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Compressed Master Menu Grid — No descriptions, clean ultra-minimal rows */}
      <div className="px-6 sm:px-12 md:px-20 my-6 sm:my-8 z-10 max-w-6xl w-full mx-auto">
        <div className="relative border-t border-b border-[#0D0402]/15 py-4 sm:py-6">
          
          <div className="flex items-center justify-between pb-3 mb-4 font-body text-[9px] uppercase tracking-[0.3em] text-[#966A1E] font-bold">
            <span>Index · {currentCategoryData.name}</span>
            <span>Rate (GBP)</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{ willChange: "transform, opacity" }}
              className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4 sm:gap-y-5 transform-gpu"
            >
              {currentCategoryData.items.map((item, idx) => (
                <div
                  key={item.id}
                  className="group relative flex items-baseline justify-between border-b border-[#0D0402]/10 pb-3.5"
                >
                  <div className="flex items-baseline gap-3 pr-4 truncate">
                    <span className="font-body text-[10px] text-[#966A1E] font-mono font-bold shrink-0">0{idx + 1}</span>
                    <h3 className="font-heading italic font-bold text-lg sm:text-xl text-[#0D0402] truncate">
                      {item.name}
                    </h3>
                    {item.badge && (
                      <span className="text-[8px] uppercase tracking-widest px-1.5 py-0.5 bg-[#966A1E]/15 text-[#734E12] font-bold shrink-0 hidden sm:inline-block">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="font-heading text-lg sm:text-xl text-[#0D0402] font-semibold shrink-0">
                    {item.price}
                  </span>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

        </div>
      </div>

      {/* Bottom Action Bar — Compact */}
      <div className="px-6 sm:px-12 md:px-20 z-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#0D0402]/15 font-body text-[11px] uppercase tracking-[0.25em]">
        <span className="text-[#2C201C] font-medium">100% Zabiha Halal &amp; Authentic Prep</span>
        <MagneticButton
          onClick={() => alert("Opening reservation gateway...")}
          className="w-full sm:w-auto px-6 py-3 bg-[#0D0402] text-[#FAF7F2] font-bold rounded-none cursor-pointer transition-transform duration-300 hover:scale-105 shadow-md text-center"
        >
          Reserve Dastarkhwan
        </MagneticButton>
      </div>
    </StackSection>
  );
}