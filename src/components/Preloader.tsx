// components/Preloader.tsx
"use client";
import { motion, Variants, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const word1 = "LAHORI".split("");
  const word2 = "WALA".split("");

  const loadingPhrases = [
    "Sourcing Authentic Spices...",
    "Curating the Heritage...",
    "Firing the Tandoor...",
    "Preparing Your Experience...",
  ];

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % loadingPhrases.length);
    }, 700);
    return () => clearInterval(interval);
  }, [isLoading]);

  const containerVariants: Variants = {
    hidden: { opacity: 1, y: 0 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
    exit: { opacity: 0, y: "-100vh", transition: { duration: 0.9, ease: [0.77, 0, 0.175, 1] } },
  };

  const letterVariants: Variants = {
    hidden: { y: "150%", opacity: 0, rotate: 15 },
    visible: { y: "0%", opacity: 1, rotate: 0, transition: { duration: 0.8, ease: [0.6, 0.01, -0.05, 0.95] } },
  };

  const iconVariants: Variants = {
    hidden: { opacity: 0, scale: 0, rotate: -180 },
    visible: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 1, ease: "backOut", delay: 0.7 } },
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isLoading && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{ willChange: "transform, opacity" }}
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#0D0D0F] bg-[radial-gradient(ellipse_at_bottom_left,_rgba(229,169,60,0.08)_0%,_transparent_50%),_radial-gradient(ellipse_at_bottom_right,_rgba(229,169,60,0.08)_0%,_transparent_50%)] px-4 overflow-hidden"
        >
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <Image
              src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=1600&auto=format&fit=crop"
              alt="Tandoor Ambiance"
              fill
              sizes="100vw"
              priority
              quality={60}
              className="object-cover opacity-15 blur-[4px] scale-105"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(13,13,15,0.6)_0%,_rgba(13,13,15,0.92)_100%)]" />
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 sm:gap-4 md:gap-6 text-[#F5EFEB] font-heading font-bold text-3xl sm:text-5xl md:text-7xl lg:text-8xl tracking-wider sm:tracking-widest text-center">
            <div className="flex overflow-hidden pb-2 sm:pb-4">
              {word1.map((char, i) => (
                <motion.span key={`w1-${i}`} variants={letterVariants} className="inline-block">
                  {char}
                </motion.span>
              ))}
            </div>

            <motion.div variants={iconVariants} className="text-[#E5A93C] flex items-center justify-center mx-1 sm:mx-2 md:mx-4 pb-1 sm:pb-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 sm:w-10 sm:h-10 md:w-16 md:h-16 lg:w-20 lg:h-20">
                <path d="M12 2v2" />
                <path d="M4 16C4 11.5817 7.58172 8 12 8C16.4183 8 20 11.5817 20 16" />
                <rect x="2" y="16" width="20" height="2" rx="1" />
                <path d="M12 8v2" opacity="0.3" />
              </svg>
            </motion.div>

            <div className="flex overflow-hidden pb-2 sm:pb-4">
              {word2.map((char, i) => (
                <motion.span key={`w2-${i}`} variants={letterVariants} className="inline-block">
                  {char}
                </motion.span>
              ))}
            </div>
          </div>

          <div className="absolute bottom-12 sm:bottom-16 z-10 h-6 overflow-hidden text-center px-4">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentTextIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="font-body text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#9E988F]"
              >
                {loadingPhrases[currentTextIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}