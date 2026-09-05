// components/sections/DigitalMenu.tsx
"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import MagneticButton from "@/components/shared/MagneticButton";

interface MenuItem {
  id: string;
  name: string;
  descriptor: string;
  price: number;
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
    id: "tikka",
    number: "01",
    name: "Lahori Tikka & Grills",
    items: [
      { id: "t1", name: "Classic Lahori Fire Tikka", descriptor: "Charcoal-smoked leg quarter, 900°C spice rub", price: 14.50, badge: "Must Try" },
      { id: "t2", name: "Royal Malai Boti Skewer", descriptor: "Tender cream-marinated chicken, butter glaze", price: 16.00, badge: "Chef's Pick" },
      { id: "t3", name: "Smoked Lamb Rib Chops", descriptor: "Aged chops charred over open coals", price: 24.00, badge: "Signature" },
      { id: "t4", name: "Tandoori Seekh Kebab", descriptor: "Hand-minced prime mutton, green chillies", price: 15.00 },
    ],
  },
  {
    id: "karahi",
    number: "02",
    name: "Karahi & Wok",
    items: [
      { id: "k1", name: "Shinwari Mutton Karahi", descriptor: "Pure tomato base, crushed black pepper", price: 36.00, badge: "Legendary" },
      { id: "k2", name: "Lahori Chicken Karahi", descriptor: "Deep wok cooked with fresh ginger & ghee", price: 28.00 },
      { id: "k3", name: "Desi Ghee Special Karahi", descriptor: "Rich, slow-simmered heritage recipe", price: 32.00 },
    ],
  },
  {
    id: "specials",
    number: "03",
    name: "Shahi Mains",
    items: [
      { id: "s1", name: "Royal Lahori Nihari", descriptor: "12-hour slow-cooked shank, marrow gravy", price: 22.00, badge: "Limited Daily" },
      { id: "s2", name: "Peshawari Namkeen Gosht", descriptor: "Minimalist salt-roasted tender mutton", price: 34.00 },
      { id: "s3", name: "Shahi Murg Handi", descriptor: "Velvety cashew and tomato cream sauce", price: 26.00 },
    ],
  },
  {
    id: "breads",
    number: "04",
    name: "Breads & Sides",
    items: [
      { id: "b1", name: "Khamiri Naan", descriptor: "Fermented clay-oven hearth bread", price: 4.50 },
      { id: "b2", name: "Roghani Sesame Naan", descriptor: "Butter-brushed with roasted sesame", price: 5.50 },
      { id: "b3", name: "Dum Pukht Mutton Biryani", descriptor: "Aromatic long-grain basmati, layered meat", price: 21.00, badge: "Best Seller" },
    ],
  },
];

interface MenuCardProps {
  item: MenuItem;
  index: number;
  onAddToCart: (item: MenuItem) => void;
}

function MenuCard({ item, index, onAddToCart }: MenuCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const reduceMotion = useReducedMotion() ?? false;

  const initialX = reduceMotion ? 0 : index % 2 === 0 ? -50 : 50;

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onAddToCart(item);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1500);
    },
    [item, onAddToCart]
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: initialX, y: 15 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full aspect-[4/3] sm:aspect-[16/10] [perspective:1200px]"
    >
      <motion.div
        className="w-full h-full relative cursor-pointer shadow-lg rounded-xl"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* FRONT FACE: Name, Price, Badge & Shiny Wave */}
        <div className="absolute inset-0 [backface-visibility:hidden] overflow-hidden rounded-xl bg-[#0D0402] border border-[#FAF7F2]/15 p-4 sm:p-5 flex flex-col justify-between text-left">
          
          {/* Tapered & Feathered Glass Shine Effect */}
          <motion.div 
            className="absolute -top-[20%] -bottom-[20%] w-[80%] z-20 pointer-events-none blur-[6px]"
            animate={{ left: ["-100%", "200%"] }}
            transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
          >
            <div 
              className="w-full h-full bg-gradient-to-r from-transparent via-[#FAF7F2]/25 to-transparent"
              style={{ clipPath: "polygon(30% 0, 50% 0, 100% 100%, 0% 100%)" }}
            />
          </motion.div>

          {/* Top Row: Badge & Price */}
          <div className="flex items-center justify-between relative z-10">
            {item.badge ? (
              <span className="px-2 py-0.5 rounded-full bg-[#B91C1C]/30 border border-[#B91C1C]/50 font-body text-[7px] sm:text-[8px] font-bold uppercase tracking-[0.2em] text-[#E5A93C]">
                {item.badge}
              </span>
            ) : <span />}
            <span className="font-heading italic text-base sm:text-lg font-light text-[#E5A93C]">
              £{item.price.toFixed(2)}
            </span>
          </div>

          {/* Middle: Dish Name */}
          <div className="my-auto relative z-10">
            <h3 className="font-heading italic font-light text-lg sm:text-xl text-[#FAF7F2] leading-tight">
              {item.name}
            </h3>
          </div>

          {/* Bottom Tap Hint */}
          <div className="pt-2 border-t border-[#FAF7F2]/10 flex items-center justify-between relative z-10">
            <span className="font-body text-[5.5px] sm:text-[6px] uppercase tracking-[0.25em] text-[#FAF7F2]/50">
              Tap for details
            </span>
            <span className="text-[#E5A93C] text-xs">→</span>
          </div>
        </div>

        {/* BACK FACE: Detailed Description & Prominent Add to Cart Button */}
        <div 
          className="absolute inset-0 [backface-visibility:hidden] overflow-hidden rounded-xl bg-[#0D0402] border border-[#E5A93C]/30 p-4 sm:p-5 flex flex-col justify-between text-left shadow-2xl"
          style={{ transform: "rotateY(180deg)" }}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] text-[#E5A93C] uppercase tracking-widest">Details</span>
            <span className="font-heading italic text-sm text-[#E5A93C]">£{item.price.toFixed(2)}</span>
          </div>

          <div className="my-auto space-y-1">
            <h3 className="font-heading italic font-light text-base sm:text-lg text-[#FAF7F2]">
              {item.name}
            </h3>
            <p className="font-body text-[0.6rem] sm:text-[0.65rem] text-[#FAF7F2]/70 leading-relaxed uppercase tracking-wider">
              {item.descriptor}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#FAF7F2]/10">
            <span className="font-body text-[5.5px] uppercase tracking-widest text-[#FAF7F2]/40">Instant Order</span>
            
            {/* Prominent Plus Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToCart}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-md shrink-0 ${
                isAdded 
                  ? "bg-emerald-600 text-white" 
                  : "bg-[#E5A93C] text-[#0D0402] hover:bg-[#FAF7F2]"
              }`}
              aria-label={`Add ${item.name} to cart`}
            >
              <span className="font-bold text-lg leading-none">
                {isAdded ? "✓" : "+"}
              </span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function DigitalMenu() {
  const [activeCategory, setActiveCategory] = useState<string>("tikka");

  const currentCategoryData = menuCategories.find((cat) => cat.id === activeCategory) || menuCategories[0];

  const handleAddToCart = useCallback((item: MenuItem) => {
    window.dispatchEvent(
      new CustomEvent("addToCart", { 
        detail: { 
          dish: { id: item.id, name: item.name, price: item.price, descriptor: item.descriptor }, 
          quantity: 1 
        } 
      })
    );
  }, []);

  return (
    <section className="relative isolate z-30 w-full bg-[#0D0402] text-[#FAF7F2] py-12 sm:py-16 px-4 sm:px-8 md:px-16 overflow-hidden">
      {/* Ambient Crimson Glow Gradients */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(185,28,28,0.15),transparent_70%)] blur-2xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(229,169,60,0.06),transparent_70%)] blur-3xl" />

      {/* Header Section */}
      <div className="max-w-4xl mx-auto mb-8 sm:mb-12 text-center relative z-10">
        <span className="font-body text-[9px] sm:text-[10px] uppercase tracking-[0.4em] text-[#E5A93C] block mb-2 font-bold">
          The Digital Dastarkhwan
        </span>
        <h2 className="font-heading italic font-light text-[clamp(2.25rem,5vw,4rem)] leading-[1.05] text-[#FAF7F2] mb-3">
          Master <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FAF7F2] via-[#E5A93C] to-[#B91C1C]">Menu.</span>
        </h2>
        <p className="font-body text-xs sm:text-sm text-[#FAF7F2]/70 font-light max-w-[46ch] mx-auto leading-relaxed">
          Charcoal-smoked Lahori tikka lineage and open-flame mastery, ready to flip and order instantly.
        </p>
      </div>

      {/* Category Navigation Pills */}
      <div className="max-w-4xl mx-auto mb-8 relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {menuCategories.map((cat) => {
          const isActive = cat.id === activeCategory;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`relative group px-3.5 py-3 font-body text-[10px] sm:text-[11px] uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer overflow-hidden text-left flex flex-col justify-between min-h-[60px] border rounded-xl ${
                isActive
                  ? "bg-[#E5A93C] text-[#0D0402] border-[#E5A93C] shadow-md shadow-[#E5A93C]/20 font-bold"
                  : "bg-[#FAF7F2]/5 text-[#FAF7F2]/80 border-[#FAF7F2]/10 hover:border-[#E5A93C]/50 hover:bg-[#FAF7F2]/10"
              }`}
            >
              <span className={`text-[8px] font-mono opacity-80 ${isActive ? "text-[#0D0402]" : "text-[#E5A93C]"}`}>
                {cat.number}
              </span>
              <span className="tracking-wider relative z-10 truncate mt-1">{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Strict 2-Column Grid Layout for Menu Items */}
      <div className="max-w-4xl mx-auto relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-2 gap-3 sm:gap-5"
          >
            {currentCategoryData.items.map((item, index) => (
              <MenuCard
                key={item.id}
                item={item}
                index={index}
                onAddToCart={handleAddToCart}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}