"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Typography Entrance
const textVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 },
  },
};

// Fan-Out Entrance Animation
const petalVariants: Variants = {
  hidden: { opacity: 0, x: "-50%", y: "0%", rotate: 0, scale: 0.8 },
  visible: (custom) => ({
    opacity: 1,
    x: `calc(-50% + ${custom.x}px)`,
    y: `calc(-50% + ${custom.y}px)`,
    rotate: custom.rotate,
    scale: 1,
    transition: {
      delay: custom.delay,
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export default function HeroText() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const parallaxWrapperRef = useRef<HTMLDivElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Safely check mobile width on mount to prevent SSR hydration errors
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;
    const mm = gsap.matchMedia();

    mm.add(
      {
        isSmall: "(max-width: 767px)",
        reduceMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { isSmall, reduceMotion } = context.conditions as { isSmall: boolean; reduceMotion: boolean };
        if (reduceMotion) return;

        const depth = isSmall ? 0.4 : 1;

        gsap.set([parallaxWrapperRef.current, textContentRef.current], {
          force3D: true,
          willChange: "transform, opacity",
        });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.2, 
          },
        });

        // Background elements fade and move up, text moves down slightly
        tl.to(parallaxWrapperRef.current, { y: -200 * depth, opacity: 0, scale: 0.9 }, 0)
          .to(textContentRef.current, { y: 100 * depth, opacity: 0 }, 0);

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative h-full w-full flex flex-col items-center justify-center overflow-hidden bg-brand-base px-4"
    >
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-brand-accent)_0%,_transparent_45%)] opacity-[0.08] pointer-events-none transform-gpu" />

      {/* The "Blooming Petals" Scroll Wrapper */}
      <div ref={parallaxWrapperRef} className="absolute inset-0 w-full h-full pointer-events-none flex items-center justify-center">
        
        {/* Petal 1: Left */}
        <motion.div
          custom={{ x: isMobile ? -100 : -220, y: isMobile ? 10 : 20, rotate: isMobile ? -10 : -16, delay: 0.6 }}
          variants={petalVariants}
          initial="hidden"
          animate="visible"
          className="absolute top-1/2 left-1/2 w-[150px] h-[220px] md:w-[280px] md:h-[400px] rounded-2xl overflow-hidden shadow-2xl origin-bottom border border-brand-surface/10 group pointer-events-auto cursor-pointer"
        >
          {/* Continuous Floating Shift Animation */}
          <motion.div 
            animate={{ y: ["0%", "-4%", "0%"] }} 
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0 }}
            className="relative w-full h-full"
          >
            <Image src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop" alt="Culinary Art" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
            {/* Color Reveal Overlay */}
            <div className="absolute inset-0 bg-brand-base/50 group-hover:bg-transparent transition-colors duration-700 z-10" />
          </motion.div>
        </motion.div>

        {/* Petal 2: Right */}
        <motion.div
          custom={{ x: isMobile ? 100 : 220, y: isMobile ? 10 : 20, rotate: isMobile ? 10 : 16, delay: 0.75 }}
          variants={petalVariants}
          initial="hidden"
          animate="visible"
          className="absolute top-1/2 left-1/2 w-[150px] h-[220px] md:w-[280px] md:h-[400px] rounded-2xl overflow-hidden shadow-2xl origin-bottom border border-brand-surface/10 group pointer-events-auto cursor-pointer"
        >
          {/* Continuous Floating Shift Animation */}
          <motion.div 
            animate={{ y: ["0%", "-4%", "0%"] }} 
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="relative w-full h-full"
          >
            <Image src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=800&auto=format&fit=crop" alt="Dining Room" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-brand-base/50 group-hover:bg-transparent transition-colors duration-700 z-10" />
          </motion.div>
        </motion.div>

        {/* Petal 3: Center (Hero Image) */}
        <motion.div
          custom={{ x: 0, y: isMobile ? -30 : -20, rotate: 0, delay: 0.9 }}
          variants={petalVariants}
          initial="hidden"
          animate="visible"
          className="absolute top-1/2 left-1/2 w-[170px] h-[250px] md:w-[320px] md:h-[460px] rounded-2xl overflow-hidden shadow-2xl origin-bottom border border-brand-surface/10 z-10 group pointer-events-auto cursor-pointer"
        >
          {/* Continuous Floating Shift Animation */}
          <motion.div 
            animate={{ y: ["0%", "-4%", "0%"] }} 
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="relative w-full h-full"
          >
            <Image src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800&auto=format&fit=crop" alt="Reserve Cellar" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-brand-base/50 group-hover:bg-transparent transition-colors duration-700 z-10" />
          </motion.div>
        </motion.div>
      </div>

      {/* Foreground Massive Typography */}
      <div ref={textContentRef} className="relative z-20 w-full text-center space-y-2 max-w-6xl mx-auto pointer-events-none drop-shadow-2xl">
        <motion.div variants={textVariants} initial="hidden" animate="visible" className="overflow-hidden">
          <span className="inline-block font-body text-[0.65rem] sm:text-xs uppercase tracking-[0.35em] sm:tracking-[0.4em] text-brand-surface/90">
            Fine Dining Architecture
          </span>
        </motion.div>

        <motion.div variants={textVariants} initial="hidden" animate="visible" className="overflow-hidden">
          <h1 className="font-heading italic font-light tracking-tight text-[clamp(5.5rem,18vw,14rem)] leading-[0.85] text-balance 
            bg-gradient-to-br from-brand-surface via-brand-surface to-brand-accent/80 text-transparent bg-clip-text pb-4">
            Maison.
          </h1>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.7 }}
        className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-brand-surface/70 z-20"
      >
        <span className="font-body text-[9px] uppercase tracking-[0.4em]">Explore</span>
        <span className="block h-8 w-[1px] bg-brand-surface/40" />
      </motion.div>
    </div>
  );
}