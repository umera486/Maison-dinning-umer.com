"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import StackSection from "@/components/layout/StackSection";

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  mobileSpan: string;
  desktopSpan: string;
}

const items: GalleryItem[] = [
  {
    id: "gallery-1",
    title: "The Autumn Venison",
    category: "Signature Plating",
    description: "A masterclass in restraint. Wild-foraged venison, smoked blackberry reduction, and salt-baked celeriac. A seasonal signature that changes every three weeks.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop",
    mobileSpan: "col-span-12 h-[260px]",
    desktopSpan: "md:col-span-7 md:row-span-2 md:h-[calc(100vh-160px)]",
  },
  {
    id: "gallery-2",
    title: "Limestone Reserves",
    category: "The Cellar",
    description: "Our sub-terrain vault, temperature-locked at 13°C. Home to over 3,500 bottles, including vertical collections of rare Burgundies.",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1000&auto=format&fit=crop",
    mobileSpan: "col-span-6 h-[200px]",
    desktopSpan: "md:col-span-5 md:row-span-1 md:h-[calc(50vh-90px)]",
  },
  {
    id: "gallery-3",
    title: "The Obsidian Salon",
    category: "Architecture",
    description: "Designed for absolute discretion. Acoustic paneling, private kitchen access, and seating for twelve. The pinnacle of our private dining experience.",
    image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=1000&auto=format&fit=crop",
    mobileSpan: "col-span-6 h-[200px]",
    desktopSpan: "md:col-span-5 md:row-span-1 md:h-[calc(50vh-90px)]",
  },
];

const gpuLayer: React.CSSProperties = {
  willChange: "transform, opacity",
  transform: "translateZ(0)",
  backfaceVisibility: "hidden",
};

export default function Gallery({ index }: { index: number }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedId) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [selectedId]);

  return (
    <StackSection index={index} className="bg-[#EAE5DF] text-brand-base flex flex-col relative overflow-hidden">
      
      {/* Header */}
      <div className="absolute top-0 w-full z-20 flex items-center justify-between px-5 sm:px-8 md:px-12 py-5 sm:py-6 font-body text-[0.6rem] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] font-medium mix-blend-difference text-brand-surface pointer-events-none">
        <span>The Room &amp; The Table</span>
        <span>Visual Identity</span>
      </div>

      {/* Main Grid Container */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 pt-20 sm:pt-24 pb-6 flex items-center justify-center">
        <div className="w-full grid grid-cols-12 gap-3 sm:gap-4 md:gap-5 items-stretch">
          {items.map((item) => (
            <motion.div
              key={item.id}
              layoutId={`card-container-${item.id}`}
              onClick={() => setSelectedId(item.id)}
              className={`${item.mobileSpan} ${item.desktopSpan} relative rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer group shadow-lg`}
              style={gpuLayer}
            >
              <motion.div 
                layoutId={`card-image-${item.id}`}
                className="absolute inset-0 w-full h-full group-hover:scale-105 transition-transform duration-1000 ease-[0.16,1,0.3,1]"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={85}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-brand-base/40 md:opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-[0.16,1,0.3,1]" />
              </motion.div>

              {/* Reveal Text */}
              <div className="absolute inset-0 p-4 sm:p-6 md:p-8 flex flex-col justify-end pointer-events-none z-10 bg-gradient-to-t from-brand-base/80 via-transparent to-transparent md:bg-none">
                <motion.div 
                  initial={{ y: 10, opacity: 0.9 }}
                  whileHover={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="block font-body text-[0.6rem] sm:text-[0.65rem] uppercase tracking-[0.2em] text-brand-accent mb-1 sm:mb-2">
                    {item.category}
                  </span>
                  <h3 className="font-heading italic font-light text-brand-surface text-xl sm:text-2xl md:text-3xl">
                    {item.title}
                  </h3>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Expanded Cinematic View */}
      <AnimatePresence>
        {selectedId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-brand-base/95 backdrop-blur-xl p-3 sm:p-6 md:p-12 overflow-y-auto"
          >
            {items.filter(i => i.id === selectedId).map(item => (
              <motion.div
                key="expanded-card"
                layoutId={`card-container-${item.id}`}
                className="relative w-full max-w-5xl my-auto rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col md:flex-row bg-[#131316] shadow-2xl max-h-[90vh] md:max-h-[85vh]"
                style={gpuLayer}
              >
                {/* Image Side */}
                <motion.div 
                  layoutId={`card-image-${item.id}`}
                  className="relative w-full md:w-3/5 h-[40vh] md:h-full shrink-0 overflow-hidden"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 60vw"
                    quality={90}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#131316] via-transparent to-transparent opacity-80" />
                </motion.div>

                {/* Content Side */}
                <motion.div 
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full md:w-2/5 p-6 sm:p-8 md:p-12 flex flex-col justify-center overflow-y-auto relative"
                >
                  {/* Close Button */}
                  <button 
                    onClick={() => setSelectedId(null)}
                    className="absolute top-5 right-5 sm:top-8 sm:right-8 w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-brand-surface/20 flex items-center justify-center text-brand-surface hover:border-brand-accent hover:text-brand-accent transition-colors cursor-pointer group z-20 bg-[#131316]/80 backdrop-blur-sm"
                  >
                    <span className="transform group-hover:rotate-90 transition-transform duration-500 text-base sm:text-lg font-light">✕</span>
                  </button>

                  <span className="inline-block font-body text-[0.6rem] sm:text-xs uppercase tracking-[0.3em] text-brand-accent mb-3 sm:mb-4">
                    {item.category}
                  </span>
                  
                  <h2 className="font-heading italic font-light text-brand-surface text-2xl sm:text-4xl md:text-5xl leading-[1.1] mb-4 sm:mb-6">
                    {item.title}
                  </h2>
                  
                  <p className="font-body text-brand-muted text-xs sm:text-sm md:text-base font-light leading-relaxed">
                    {item.description}
                  </p>

                  <div className="mt-6 sm:mt-10 pt-4 border-t border-brand-surface/10">
                    <span className="font-body text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-brand-surface/40">
                      Archived Frame — Maison Collection
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
    </StackSection>
  );
}