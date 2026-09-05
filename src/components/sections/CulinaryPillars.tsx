// components/sections/CulinaryPillars.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import MagneticButton from "@/components/shared/MagneticButton";

// 1. DYNAMIC ARCHITECTURE: Added 'price' for backend/cart integration
interface Pillar {
  id: string;
  number: string;
  title: string;
  descriptor: string;
  description: string;
  meta: string[];
  image: string;
  price: number; 
}

const pillars: Pillar[] = [
  {
    id: "bbq",
    number: "01",
    title: "The Tandoor Table",
    descriptor: "Live Charcoal 900°C",
    description: "Charcoal-smoked seekh kebabs, malai boti, and tender chops charred over open coals, served sizzling tableside.",
    meta: ["Live Tandoor", "Tableside Finish"],
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop",
    price: 45.00,
  },
  {
    id: "tawa",
    number: "02",
    title: "Tawa Piece",
    descriptor: "Cast Iron Seared",
    description: "Legendary Lahori tawa chicken and brain masala seared on seasoned cast iron with fresh ginger and pure desi ghee.",
    meta: ["Desi Ghee Infused", "Lahori Classic"],
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=1200&auto=format&fit=crop",
    price: 38.50,
  },
  {
    id: "karahi",
    number: "03",
    title: "Mutton Karahi",
    descriptor: "Deep Wok Heritage",
    description: "Slow-cooked Shinwari mutton and classic Lahori chicken karahi prepared with a rich tomato base and crushed peppercorns.",
    meta: ["Open Flame Wok", "Family Feasts"],
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1200&auto=format&fit=crop",
    price: 55.00,
  },
];

// --- MOBILE 3D FLIP CARD COMPONENT ---
function MobileFlipCard({ 
  pillar, 
  onAddToCart 
}: { 
  pillar: Pillar; 
  onAddToCart: (id: string, name: string, price: number) => void 
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="relative w-full aspect-[3/4] mb-8 [perspective:1200px]">
      <motion.div
        className="w-full h-full relative cursor-pointer"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* FRONT FACE */}
        <div className="absolute inset-0 [backface-visibility:hidden] overflow-hidden rounded-2xl p-[2px]">
          {/* Animated Glowing Conic Border */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[200%] -translate-x-1/2 -translate-y-1/2"
            style={{
              background: "conic-gradient(from 0deg, transparent 70%, rgba(229,169,60,0.8) 100%)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
          
          <div className="relative w-full h-full rounded-[14px] bg-brand-base overflow-hidden group">
            <Image
              src={pillar.image}
              alt={pillar.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
            
            {/* The Main Sweeping Glass Shine Effect */}
            <motion.div 
              className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-brand-surface/40 to-transparent -skew-x-12 z-20 pointer-events-none"
              animate={{ left: ["-100%", "200%"] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
            />

            {/* Dark gradient for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-base/95 via-brand-base/30 to-brand-base/10 z-10" />
            
            <div className="absolute inset-0 z-20 flex flex-col justify-between p-6 text-center">
              {/* Top Badge */}
              <div className="w-full flex justify-end">
                 <span className="font-mono text-brand-surface/70 text-[0.6rem] uppercase tracking-widest border border-brand-surface/20 px-2 py-1 rounded">
                   {pillar.number}
                 </span>
              </div>

              {/* Center "Tap to Flip" Interaction Hint - Silver Charismatic Upgrade */}
              <div className="flex-grow flex items-center justify-center pointer-events-none">
                <motion.div 
                  animate={{ scale: [1, 1.03, 1], boxShadow: ["0px 0px 10px rgba(255,255,255,0.05)", "0px 0px 20px rgba(255,255,255,0.15)", "0px 0px 10px rgba(255,255,255,0.05)"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="relative bg-brand-base/50 backdrop-blur-md border border-brand-surface/30 px-6 py-2.5 rounded-full overflow-hidden"
                >
                  {/* Synchronized Inner Silver Glare */}
                  <motion.div 
                    className="absolute inset-0 w-[150%] bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                    animate={{ left: ["-150%", "150%"] }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
                  />
                  
                  {/* Charismatic Silver Shimmer Text */}
                  <motion.span 
                    className="relative z-10 font-body text-[0.65rem] uppercase tracking-[0.3em] font-bold bg-clip-text text-transparent"
                    style={{
                      backgroundImage: "linear-gradient(90deg, rgba(245,239,235,0.5) 0%, rgba(255,255,255,1) 50%, rgba(245,239,235,0.5) 100%)",
                      backgroundSize: "200% 100%",
                    }}
                    animate={{ backgroundPosition: ["200% 0%", "-200% 0%"] }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
                  >
                    Tap to Flip
                  </motion.span>
                </motion.div>
              </div>

              {/* Bottom Title */}
              <div>
                <span className="font-heading italic text-brand-surface text-3xl font-light mb-1 block">
                  {pillar.title}
                </span>
                <span className="font-body text-brand-surface/60 text-[0.65rem] uppercase tracking-widest block">
                  {pillar.descriptor}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BACK FACE (Detailed E-Commerce Layer) */}
        <div 
          className="absolute inset-0 [backface-visibility:hidden] overflow-hidden rounded-2xl bg-brand-base border border-brand-surface/15 p-6 sm:p-8 flex flex-col justify-between items-center text-center shadow-2xl"
          style={{ transform: "rotateY(180deg)" }}
        >
          {/* Header */}
          <div className="space-y-2 w-full pt-4">
            <span className="font-mono text-brand-accent text-xs tracking-widest block">
              {pillar.number}
            </span>
            <h3 className="font-heading italic text-brand-surface text-3xl sm:text-4xl font-light">
              {pillar.title}
            </h3>
            <div className="h-px w-12 bg-brand-accent/40 mx-auto my-3" />
          </div>
          
          {/* Middle Details */}
          <div className="space-y-5">
            <p className="font-body text-brand-surface/80 text-sm font-light leading-relaxed">
              {pillar.description}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {pillar.meta.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full border border-brand-surface/20 bg-brand-surface/5 text-brand-surface font-body text-[0.6rem] uppercase tracking-wider"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom CTA & Price (Dynamic Backend Ready) */}
          <div className="w-full space-y-4 pb-2">
            <div className="font-heading text-brand-surface text-2xl tracking-wide">
              £{pillar.price.toFixed(2)}
            </div>
            
            <MagneticButton
              onClick={(e) => {
                e.stopPropagation(); // VERY IMPORTANT: Stops the card from flipping back when clicking the button
                onAddToCart(pillar.id, pillar.title, pillar.price);
              }}
              className="w-full py-3.5 rounded-full border border-brand-accent bg-brand-accent/10 text-brand-accent font-body text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-brand-accent hover:text-brand-base transition-colors duration-300"
            >
              Add to Cart
              <span className="text-lg leading-none">+</span>
            </MagneticButton>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// --- MAIN COMPONENT EXPORT ---
export default function CulinaryPillars() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 2. DYNAMIC CART HANDLER: Ready for Zustand / API
  const handleAddToCart = (id: string, name: string, price: number) => {
    // In future: useCartStore.getState().addItem({ id, name, price, quantity: 1 })
    console.log(`[CART ACTION] Added ${name} to cart. ID: ${id}, Price: £${price}`);
    alert(`${name} added to your cart for £${price.toFixed(2)}!`);
  };

  if (!isMounted) return null;

  return (
    <section className="relative w-full min-h-screen bg-brand-base flex flex-col justify-center px-4 sm:px-8 py-12 md:py-20 overflow-hidden">
      
      {/* Section Header */}
      <div className="text-center mb-10 md:mb-16 space-y-3">
        <span className="font-body text-brand-accent text-xs uppercase tracking-[0.3em] font-medium">
          Our Culinary Pillars
        </span>
        <h2 className="font-heading italic text-brand-surface text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-tight">
          The Heritage Menu
        </h2>
      </div>

      {isMobile ? (
        /* MOBILE RENDER: 3D Flip Cards */
        <div className="w-full max-w-sm mx-auto flex flex-col">
          {pillars.map((pillar) => (
            <MobileFlipCard 
              key={pillar.id} 
              pillar={pillar} 
              onAddToCart={handleAddToCart} 
            />
          ))}
        </div>
      ) : (
        /* DESKTOP RENDER: Liquid Accordion */
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full max-w-[1400px] mx-auto h-[70vh] md:h-[65vh]">
          {pillars.map((pillar, idx) => {
            const isActive = activeIndex === idx;

            return (
              <motion.div
                key={pillar.id}
                layout
                onClick={() => setActiveIndex(idx)}
                onMouseEnter={() => setActiveIndex(idx)}
                initial={false}
                animate={{
                  flex: isActive ? 3 : 1,
                }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className={`relative rounded-2xl overflow-hidden cursor-pointer group transform-gpu ${
                  isActive ? "shadow-2xl shadow-brand-accent/10" : ""
                }`}
              >
                <motion.div
                  className="absolute inset-0 w-full h-full"
                  animate={{
                    scale: isActive ? 1.05 : 1,
                    filter: isActive ? "grayscale(0%) brightness(1)" : "grayscale(60%) brightness(0.6)",
                  }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Image
                    src={pillar.image}
                    alt={pillar.title}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover"
                    priority={idx === 0}
                  />
                </motion.div>

                <div
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    isActive
                      ? "bg-gradient-to-t from-brand-base/90 via-brand-base/40 to-transparent opacity-100"
                      : "bg-gradient-to-t from-brand-base/80 to-brand-base/20 opacity-70 group-hover:opacity-100"
                  }`}
                />

                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                  <motion.div
                    className="hidden md:flex absolute inset-0 items-end pb-8 pl-8 origin-bottom-left"
                    initial={false}
                    animate={{ opacity: isActive ? 0 : 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="font-heading italic text-brand-surface text-3xl whitespace-nowrap -rotate-90 origin-bottom-left pb-4">
                      {pillar.title}
                    </span>
                  </motion.div>

                  <AnimatePresence mode="wait">
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative z-10 w-full max-w-md"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <span className="font-mono text-brand-accent text-xs tracking-widest">
                            {pillar.number}
                          </span>
                          <div className="h-[1px] w-8 bg-brand-accent/50" />
                          <span className="font-body text-brand-surface/70 text-[0.65rem] uppercase tracking-[0.2em]">
                            {pillar.descriptor}
                          </span>
                        </div>

                        <h3 className="font-heading italic text-brand-surface text-3xl md:text-5xl font-light mb-4 leading-[1.1]">
                          {pillar.title}
                        </h3>

                        <p className="font-body text-brand-surface/80 text-sm md:text-base font-light leading-relaxed mb-6">
                          {pillar.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 mb-6">
                          <span className="font-heading text-brand-surface text-2xl tracking-wide">
                            £{pillar.price.toFixed(2)}
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {pillar.meta.map((tag) => (
                              <span
                                key={tag}
                                className="px-3 py-1.5 rounded-full border border-brand-surface/20 text-brand-surface font-body text-[0.65rem] uppercase tracking-wider backdrop-blur-sm"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <MagneticButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(pillar.id, pillar.title, pillar.price);
                          }}
                          className="px-8 py-3.5 rounded-full border border-brand-accent bg-brand-accent/10 text-brand-accent hover:bg-brand-accent hover:text-brand-base font-body text-xs uppercase tracking-[0.2em] flex items-center gap-3 w-fit transition-colors duration-300"
                        >
                          Add to Cart
                          <span className="text-lg leading-none">+</span>
                        </MagneticButton>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}