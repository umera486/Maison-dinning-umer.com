// components/sections/Gallery.tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import StackSection from "@/components/layout/StackSection";

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  span: string;
}

// Placeholder Unsplash IDs — verify/replace with real Lahori Wala
// photography before ship (remotePatterns already covers images.unsplash.com).
const items: GalleryItem[] = [
  {
    id: "tandoor-1",
    title: "Live Tandoor, Charcoal-Fired",
    category: "The Tandoor Table",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=1400&auto=format&fit=crop",
    span: "col-span-7 row-span-2",
  },
  {
    id: "chai-1",
    title: "Hand-Blended Kashmiri Chai",
    category: "The Shahi Reserve",
    image: "https://images.unsplash.com/photo-1608835291093-394b0c943a75?q=80&w=1100&auto=format&fit=crop",
    span: "col-span-5 row-span-1",
  },
  {
    id: "darbar-1",
    title: "The Darbar Hall",
    category: "Private Majlis Dining",
    image: "https://images.unsplash.com/photo-1517244683847-7456b63c5969?q=80&w=1100&auto=format&fit=crop",
    span: "col-span-5 row-span-1",
  },
  {
    id: "karahi-1",
    title: "Chicken Karahi, Fresh Ginger",
    category: "The Tandoor Table",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=900&auto=format&fit=crop",
    span: "col-span-4 row-span-1",
  },
  {
    id: "spice-1",
    title: "Akbari Mandi Spice Reserve",
    category: "The Shahi Reserve",
    image: "https://images.unsplash.com/photo-1608835291093-394b0c943a75?q=80&w=900&auto=format&fit=crop",
    span: "col-span-4 row-span-1",
  },
  {
    id: "hall-1",
    title: "Evening Majlis Service",
    category: "Private Majlis Dining",
    image: "https://images.unsplash.com/photo-1517244683847-7456b63c5969?q=80&w=900&auto=format&fit=crop",
    span: "col-span-4 row-span-1",
  },
];

export default function Gallery({ index }: { index: number }) {
  return (
    <StackSection index={index} className="bg-brand-surface text-brand-base flex flex-col">
      <div className="flex items-center justify-between px-5 sm:px-8 md:px-12 py-5 sm:py-6 font-body text-[0.65rem] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em]">
        <span>The Kitchen &amp; The Table</span>
        <span className="hidden sm:inline">06 Selected</span>
      </div>

      <div className="flex-1 grid grid-cols-4 md:grid-cols-12 grid-rows-3 md:grid-rows-2 gap-2 sm:gap-3 px-3 sm:px-6 md:px-12 pb-4 sm:pb-6 md:pb-10 min-h-0">
        {items.map((item) => (
          <div key={item.id} className={`${item.span} relative overflow-hidden group`}>
            {/* transform-only zoom — no filter, no blend mode */}
            <motion.div
              className="absolute inset-0"
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ willChange: "transform" }}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(min-width: 768px) 40vw, 90vw"
                quality={75}
                className="object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-brand-base/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
              <p className="font-body text-[0.6rem] sm:text-xs uppercase tracking-[0.15em] text-brand-accent">{item.category}</p>
              <p className="font-heading italic font-light text-brand-surface text-sm sm:text-lg">{item.title}</p>
            </div>
          </div>
        ))}
      </div>
    </StackSection>
  );
}