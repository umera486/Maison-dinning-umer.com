// components/sections/Gallery.tsx
"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

interface Dish {
  id: string;
  name: string;
  descriptor: string;
  price: number;
  image: string;
  badge?: string;
}

const dishes: Dish[] = [
  {
    id: "seekh-kebab",
    name: "Seekh Kebab",
    descriptor: "Charcoal-fired, hand-rolled",
    price: 14,
    image: "https://images.unsplash.com/photo-1599487488170-ded1ec92642f?q=80&w=1000&auto=format&fit=crop",
    badge: "Best Seller",
  },
  {
    id: "tawa-chicken",
    name: "Tawa Chicken",
    descriptor: "Cast iron, desi ghee finish",
    price: 16,
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "brain-masala",
    name: "Brain Masala",
    descriptor: "Lahori heritage spice",
    price: 12,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "mutton-karahi",
    name: "Mutton Karahi",
    descriptor: "Deep wok, slow-cooked",
    price: 18,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1000&auto=format&fit=crop",
    badge: "Signature",
  },
  {
    id: "tandoori-naan",
    name: "Tandoori Naan",
    descriptor: "Fresh-pulled, 900°C oven",
    price: 5,
    image: "https://images.unsplash.com/photo-1626777553626-0604131584d4?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "chicken-karahi",
    name: "Chicken Karahi",
    descriptor: "Tomato, peppercorn, ghee",
    price: 15,
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "nihari",
    name: "Nihari",
    descriptor: "12-hour slow-cooked",
    price: 14,
    image: "https://images.unsplash.com/photo-1585932702519-f21cc028cb0c?q=80&w=1000&auto=format&fit=crop",
    badge: "Legend",
  },
  {
    id: "lamb-raan",
    name: "Lamb Raan",
    descriptor: "Whole, 40-day aged",
    price: 48,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop",
  },
];

interface GalleryItemProps {
  dish: Dish;
  index: number;
  onAddToCart: (dish: Dish) => void;
  isMobile: boolean;
}

function GalleryItem({ dish, index, onAddToCart }: GalleryItemProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const reduceMotion = useReducedMotion() ?? false;

  // Even index slides from Left (-70px), Odd index slides from Right (+70px)
  const initialX = reduceMotion ? 0 : index % 2 === 0 ? -70 : 70;

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onAddToCart(dish);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1500);
    },
    [dish, onAddToCart]
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: initialX, y: 20 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full aspect-[4/5] sm:aspect-[3/4] [perspective:1200px]"
    >
      <motion.div
        className="w-full h-full relative cursor-pointer shadow-xl rounded-2xl"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* FRONT FACE: Details & Dish Name First with Tapered Shiny Wave */}
        <div className="absolute inset-0 [backface-visibility:hidden] overflow-hidden rounded-2xl bg-brand-base border border-brand-surface/15 p-5 sm:p-6 flex flex-col justify-between text-left">
          
          {/* Tapered & Feathered Glass Shine Effect (Every 2 Seconds) */}
          <motion.div 
            className="absolute -top-[20%] -bottom-[20%] w-[80%] z-20 pointer-events-none blur-[6px]"
            animate={{ left: ["-100%", "200%"] }}
            transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
          >
            <div 
              className="w-full h-full bg-gradient-to-r from-transparent via-brand-surface/30 to-transparent"
              style={{ clipPath: "polygon(30% 0, 50% 0, 100% 100%, 0% 100%)" }}
            />
          </motion.div>

          {/* Top Row: Badge & Price */}
          <div className="flex items-center justify-between relative z-10">
            {dish.badge ? (
              <span className="px-2.5 py-1 rounded-full bg-brand-accent/20 border border-brand-accent/40 font-body text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.2em] text-brand-accent">
                {dish.badge}
              </span>
            ) : <span />}
            <span className="font-heading italic text-lg sm:text-xl font-light text-brand-accent">
              £{dish.price}
            </span>
          </div>

          {/* Middle: Name & Descriptor */}
          <div className="space-y-2 my-auto relative z-10">
            <h3 className="font-heading italic font-light text-xl sm:text-2xl text-brand-surface leading-tight">
              {dish.name}
            </h3>
            <p className="font-body text-[0.65rem] sm:text-[0.7rem] text-brand-muted uppercase tracking-[0.2em]">
              {dish.descriptor}
            </p>
          </div>

          {/* Bottom Hint */}
          <div className="pt-2 border-t border-brand-surface/10 flex items-center justify-between relative z-10">
            <span className="font-body text-[0.6rem] uppercase tracking-[0.25em] text-brand-surface/50">
              Tap to view photo
            </span>
            <span className="text-brand-accent text-sm">→</span>
          </div>
        </div>

        {/* BACK FACE: Perfectly Contained Picture Zoom Reveal + Prominent Plus Button */}
        <div 
          className="absolute inset-0 [backface-visibility:hidden] overflow-hidden rounded-2xl bg-brand-base border border-brand-surface/15"
          style={{ transform: "rotateY(180deg)" }}
        >
          {/* Strictly Contained Image Inside Card Shape */}
          <motion.div 
            className="absolute inset-0 w-full h-full overflow-hidden rounded-2xl"
            animate={{ scale: isFlipped ? 1.05 : 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src={dish.image}
              alt={dish.name}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              quality={85}
              className="object-cover rounded-2xl"
            />
          </motion.div>

          {/* Dark Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-base/95 via-brand-base/30 to-transparent pointer-events-none rounded-2xl" />

          {/* Content Over Image */}
          <div className="absolute inset-0 z-10 p-5 sm:p-6 flex flex-col justify-between rounded-2xl">
            <div className="flex justify-end">
              <span className="font-heading italic text-base sm:text-lg font-light text-brand-accent bg-brand-base/70 backdrop-blur-md px-3 py-1 rounded-full border border-brand-accent/30 shadow-lg">
                £{dish.price}
              </span>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <h3 className="font-heading italic font-light text-xl sm:text-2xl text-brand-surface mb-1">
                  {dish.name}
                </h3>
                <p className="font-body text-[0.65rem] text-brand-muted uppercase tracking-[0.2em]">
                  {dish.descriptor}
                </p>
              </div>

              {/* Prominent Circular Plus Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleAddToCart}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full
                  bg-brand-accent/90 hover:bg-brand-accent backdrop-blur-xl border border-brand-accent/40
                  flex items-center justify-center cursor-pointer transform-gpu transition-all duration-300
                  shadow-2xl hover:shadow-[0_0_25px_rgba(229,169,60,0.5)] flex-shrink-0"
                aria-label={`Add ${dish.name} to cart`}
              >
                <motion.span
                  animate={{
                    scale: isAdded ? 0.8 : 1,
                    opacity: isAdded ? 0 : 1,
                  }}
                  className="text-brand-base font-bold text-2xl leading-none"
                >
                  +
                </motion.span>

                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={
                    isAdded
                      ? { scale: 1, opacity: 1 }
                      : { scale: 0, opacity: 0 }
                  }
                  className="absolute text-brand-base text-xl font-bold"
                >
                  ✓
                </motion.span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Gallery() {
  const [isMobile, setIsMobile] = useState(false);
  const reduceMotion = useReducedMotion() ?? false;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleAddToCart = useCallback((dish: Dish) => {
    window.dispatchEvent(
      new CustomEvent("addToCart", { detail: { dish, quantity: 1 } })
    );
  }, []);

  const shuffledDishes = useMemo(
    () => (reduceMotion ? dishes : dishes),
    [reduceMotion]
  );

  return (
    <section className="relative isolate z-30 w-full bg-brand-base py-16 sm:py-20 md:py-24 px-4 sm:px-8 md:px-16 overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-4xl mx-auto mb-12 sm:mb-16 md:mb-20 text-center"
      >
        <span className="inline-block font-body text-[0.6rem] sm:text-xs uppercase tracking-[0.35em] text-brand-muted mb-3">
          The Signature Spread
        </span>
        <h2 className="font-heading italic font-light text-[clamp(2.25rem,5.5vw,4rem)] leading-[1.05] text-brand-surface mb-3">
          Shoppable Culinary Moments
        </h2>
        <p className="font-body text-xs sm:text-sm text-brand-muted leading-relaxed max-w-[48ch] mx-auto">
          Every dish is a story, every moment is an order. Tap, add, and bring Lahori Wala to your table.
        </p>
      </motion.div>

      {/* Strict 2-Column Grid Layout (Even cards slide from left, Odd cards slide from right) */}
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 gap-3 sm:gap-6">
          {shuffledDishes.map((dish, index) => (
            <GalleryItem
              key={dish.id}
              dish={dish}
              index={index}
              onAddToCart={handleAddToCart}
              isMobile={isMobile}
            />
          ))}
        </div>
      </div>

      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-brand-accent/5 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
}