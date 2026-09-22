// components/Hero/HeroText.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SmartImage from "@/components/shared/SmartImage";
import { img } from "@/data/images";
import { motion, type Variants } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Phone } from "lucide-react";
import { useNearViewport } from "@/components/layout/StackSection";
import Embers from "@/components/fx/Embers";
import { site, telHref, routes } from "@/lib/site";

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

interface PetalCustom {
  x: number;
  y: number;
  rotate: number;
  delay: number;
}

const petalVariants: Variants = {
  hidden: { opacity: 0, x: "-50%", y: "0%", rotate: 0, scale: 0.8 },
  visible: (custom: PetalCustom) => ({
    opacity: 1,
    x: `calc(-50% + ${custom.x}px)`,
    y: `calc(-50% + ${custom.y}px)`,
    rotate: custom.rotate,
    scale: 1,
    transition: { delay: custom.delay, duration: 1.4, ease: [0.16, 1, 0.3, 1] },
  }),
};

/**
 * The three things the flyer leads with, as the three petals.
 *
 * Sources come from the shared verified set — the centre petal previously
 * pointed at an Unsplash ID that had 404'd, so the hero's largest image was
 * rendering as an empty card.
 */
const petals = [
  { label: "Live Charcoal BBQ", src: img.charcoal, sizes: "(min-width: 768px) 280px, 150px" },
  { label: "Karahi & Wok", src: img.karahi, sizes: "(min-width: 768px) 280px, 150px" },
  { label: "Nihari & Paye", src: img.curry, sizes: "(min-width: 768px) 320px, 170px" },
] as const;

export default function HeroText() {
  const parallaxWrapperRef = useRef<HTMLDivElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Gates the continuous petal-float loops and the GSAP scrub so neither
  // runs while this panel is nowhere near the viewport.
  const { ref: sectionRef, isNear } = useNearViewport<HTMLDivElement>();

  useEffect(() => {
    // matchMedia rather than a resize listener on innerWidth: it fires only
    // when the breakpoint is actually crossed, not on every resize frame
    // (and not on mobile browser chrome collapsing, which resize does).
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;
    const mm = gsap.matchMedia();

    mm.add(
      { isSmall: "(max-width: 767px)", reduceMotion: "(prefers-reduced-motion: reduce)" },
      (context) => {
        const { isSmall, reduceMotion } = context.conditions as {
          isSmall: boolean;
          reduceMotion: boolean;
        };
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

  const floatAnim = isNear ? { y: ["0%", "-4%", "0%"] } : { y: "0%" };
  const floatTransition = (delay: number, duration: number) =>
    isNear
      ? { duration, repeat: Infinity, ease: "easeInOut" as const, delay }
      : { duration: 0.3 };

  const petalGeometry: PetalCustom[] = [
    { x: isMobile ? -100 : -220, y: isMobile ? 10 : 20, rotate: isMobile ? -10 : -16, delay: 0.6 },
    { x: isMobile ? 100 : 220, y: isMobile ? 10 : 20, rotate: isMobile ? 10 : 16, delay: 0.75 },
    { x: 0, y: isMobile ? -30 : -20, rotate: 0, delay: 0.9 },
  ];

  const petalFloat: [number, number][] = [
    [0, 5],
    [1, 6],
    [2, 5.5],
  ];

  return (
    <div
      ref={sectionRef}
      className="relative h-full w-full flex flex-col items-center justify-center overflow-hidden bg-brand-base px-4"
    >
      {/* Embers off the charcoal. Desktop only, and it stops painting the
          moment the hero leaves the viewport. */}
      <Embers className="z-0" />

      <div
        ref={parallaxWrapperRef}
        className="absolute inset-0 w-full h-full pointer-events-none flex items-center justify-center"
      >
        {petals.map((petal, i) => {
          const isCentre = i === 2;
          const [delay, duration] = petalFloat[i];
          return (
            <motion.div
              key={petal.label}
              custom={petalGeometry[i]}
              variants={petalVariants}
              initial="hidden"
              animate="visible"
              className={`absolute top-1/2 left-1/2 rounded-2xl overflow-hidden shadow-2xl origin-bottom
                border border-brand-surface/10 group pointer-events-auto ${
                  isCentre
                    ? "w-[170px] h-[250px] md:w-[320px] md:h-[460px] z-10"
                    : "w-[150px] h-[220px] md:w-[280px] md:h-[400px]"
                }`}
            >
              <motion.div
                animate={floatAnim}
                transition={floatTransition(delay, duration)}
                className="relative w-full h-full transform-gpu"
              >
                <SmartImage
                  src={petal.src}
                  alt={petal.label}
                  label={petal.label}
                  fill
                  sizes={petal.sizes}
                  quality={75}
                  preload={isCentre}
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Theme-aware veil, NOT the always-dark scrim. The headline
                    sits directly over the centre petal, so this has to move
                    the photograph *towards the page background*: dark in dark
                    mode, cream in light. An always-dark scrim here left dark
                    light-mode text sitting on a dark image. */}
                <div className="absolute inset-0 bg-brand-base/55 group-hover:bg-transparent transition-colors duration-700 z-10" />

                {/* Names the dish the image is selling. Without this the
                    petals are decoration; with it they're the menu. */}
                <span className="absolute bottom-2.5 left-0 right-0 z-20 px-2 text-center font-body
                  text-[8px] md:text-[9px] uppercase tracking-[0.16em] text-brand-surface/90
                  opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {petal.label}
                </span>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      <div
        ref={textContentRef}
        className="relative z-20 w-full text-center space-y-2 max-w-6xl mx-auto pointer-events-none"
      >
        <motion.div variants={textVariants} initial="hidden" animate="visible" className="overflow-hidden">
          <span className="inline-block font-body text-[0.65rem] sm:text-xs uppercase tracking-[0.35em] sm:tracking-[0.4em] text-brand-surface/90">
            {site.strapline}
          </span>
        </motion.div>

        <motion.div variants={textVariants} initial="hidden" animate="visible" className="overflow-hidden">
          <h1
            className="font-heading italic font-light tracking-tight text-[clamp(3.25rem,13vw,11rem)] leading-[0.85] text-balance
            bg-linear-to-br from-brand-surface via-brand-surface to-brand-accent text-transparent bg-clip-text pb-4"
          >
            {site.nameSpaced}.
          </h1>
        </motion.div>

        {/* CTAs. The hero previously had none — a visitor who wanted the menu
            or the phone number had nowhere to go from the first screen. */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 pt-3 pointer-events-auto"
        >
          <Link
            href={routes.menu}
            className="inline-flex items-center justify-center rounded-full bg-brand-surface text-brand-base
              px-6 sm:px-8 h-11 font-body text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold
              hover:bg-brand-accent transition-colors duration-300 transform-gpu"
          >
            View the Menu
          </Link>

          <a
            href={telHref}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-surface/30
              px-6 sm:px-7 h-11 font-body text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-brand-surface
              hover:border-brand-accent hover:text-brand-accent transition-colors duration-300 transform-gpu"
          >
            <Phone className="w-3.5 h-3.5" strokeWidth={2} />
            {site.phone.display}
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.7 }}
        className="absolute bottom-5 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-brand-surface/70 z-20"
      >
        <span className="font-body text-[9px] uppercase tracking-[0.4em]">Explore</span>
        <span className="block h-8 w-[1px] bg-brand-surface/40" />
      </motion.div>
    </div>
  );
}
