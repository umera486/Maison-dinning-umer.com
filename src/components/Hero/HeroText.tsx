// components/Hero/HeroText.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNearViewport } from "@/components/layout/StackSection";

gsap.registerPlugin(ScrollTrigger);

const textVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 },
  },
};

const petalVariants: Variants = {
  hidden: { opacity: 0, x: "-50%", y: "0%", rotate: 0, scale: 0.8 },
  visible: (custom) => ({
    opacity: 1,
    x: `calc(-50% + ${custom.x}px)`,
    y: `calc(-50% + ${custom.y}px)`,
    rotate: custom.rotate,
    scale: 1,
    transition: { delay: custom.delay, duration: 1.4, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function HeroText() {
  const parallaxWrapperRef = useRef<HTMLDivElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Gate the continuous petal-float loops and the GSAP scrub
  const { ref: sectionRef, isNear } = useNearViewport<HTMLDivElement>();

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
      { isSmall: "(max-width: 767px)", reduceMotion: "(prefers-reduced-motion: reduce)" },
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

        tl.to(parallaxWrapperRef.current, { y: -200 * depth, opacity: 0, scale: 0.9 }, 0).to(
          textContentRef.current,
          { y: 100 * depth, opacity: 0 },
          0
        );

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      }
    );

    return () => mm.revert();
  }, [sectionRef]);

  const floatAnim = (delay: number, duration: number) =>
    isNear
      ? { y: ["0%", "-4%", "0%"] as const }
      : { y: "0%" as const };

  const floatTransition = (delay: number, duration: number) =>
    isNear
      ? { duration, repeat: Infinity, ease: "easeInOut" as const, delay }
      : { duration: 0.3 };

  return (
    <div
      ref={sectionRef}
      className="relative h-full w-full flex flex-col items-center justify-center overflow-hidden bg-brand-base px-4"
    >
      <div
        ref={parallaxWrapperRef}
        className="absolute inset-0 w-full h-full pointer-events-none flex items-center justify-center"
      >
        {/* Petal 1: Live Tandoor */}
        <motion.div
          custom={{ x: isMobile ? -100 : -220, y: isMobile ? 10 : 20, rotate: isMobile ? -10 : -16, delay: 0.6 }}
          variants={petalVariants}
          initial="hidden"
          animate="visible"
          className="absolute top-1/2 left-1/2 w-[150px] h-[220px] md:w-[280px] md:h-[400px] rounded-2xl overflow-hidden shadow-2xl origin-bottom border border-brand-surface/10 group pointer-events-auto cursor-pointer"
        >
          <motion.div animate={floatAnim(0, 5) as any} transition={floatTransition(0, 5) as any} className="relative w-full h-full">
            <Image
              src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=800&auto=format&fit=crop"
              alt="Live Tandoor"
              fill
              sizes="(min-width: 768px) 280px, 150px"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-brand-base/50 group-hover:bg-transparent transition-colors duration-700 z-10" />
          </motion.div>
        </motion.div>

        {/* Petal 2: The Darbar Hall */}
        <motion.div
          custom={{ x: isMobile ? 100 : 220, y: isMobile ? 10 : 20, rotate: isMobile ? 10 : 16, delay: 0.75 }}
          variants={petalVariants}
          initial="hidden"
          animate="visible"
          className="absolute top-1/2 left-1/2 w-[150px] h-[220px] md:w-[280px] md:h-[400px] rounded-2xl overflow-hidden shadow-2xl origin-bottom border border-brand-surface/10 group pointer-events-auto cursor-pointer"
        >
          <motion.div animate={floatAnim(1, 6) as any} transition={floatTransition(1, 6) as any} className="relative w-full h-full">
            <Image
              src="https://images.unsplash.com/photo-1517244683847-7456b63c5969?q=80&w=800&auto=format&fit=crop"
              alt="The Darbar Hall"
              fill
              sizes="(min-width: 768px) 280px, 150px"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-brand-base/50 group-hover:bg-transparent transition-colors duration-700 z-10" />
          </motion.div>
        </motion.div>

        {/* Petal 3: The Shahi Reserve (center) */}
        <motion.div
          custom={{ x: 0, y: isMobile ? -30 : -20, rotate: 0, delay: 0.9 }}
          variants={petalVariants}
          initial="hidden"
          animate="visible"
          className="absolute top-1/2 left-1/2 w-[170px] h-[250px] md:w-[320px] md:h-[460px] rounded-2xl overflow-hidden shadow-2xl origin-bottom border border-brand-surface/10 z-10 group pointer-events-auto cursor-pointer"
        >
          <motion.div animate={floatAnim(2, 5.5) as any} transition={floatTransition(2, 5.5) as any} className="relative w-full h-full">
            <Image
              src="https://images.unsplash.com/photo-1608835291093-394b0c943a75?q=80&w=800&auto=format&fit=crop"
              alt="The Shahi Reserve"
              fill
              sizes="(min-width: 768px) 320px, 170px"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-brand-base/50 group-hover:bg-transparent transition-colors duration-700 z-10" />
          </motion.div>
        </motion.div>
      </div>

      <div
        ref={textContentRef}
        className="relative z-20 w-full text-center space-y-2 max-w-6xl mx-auto pointer-events-none"
      >
        <motion.div variants={textVariants} initial="hidden" animate="visible" className="overflow-hidden">
          <span className="inline-block font-body text-[0.65rem] sm:text-xs uppercase tracking-[0.35em] sm:tracking-[0.4em] text-brand-surface/90">
            Authentic Lahori &amp; Punjabi Cuisine
          </span>
        </motion.div>

        <motion.div variants={textVariants} initial="hidden" animate="visible" className="overflow-hidden">
          <h1
            className="font-heading italic font-light tracking-tight text-[clamp(4.25rem,15vw,12rem)] leading-[0.85] text-balance
            bg-gradient-to-br from-brand-surface via-brand-surface to-brand-accent/80 text-transparent bg-clip-text pb-4"
          >
            Lahori Wala.
          </h1>
        </motion.div>
      </div>

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