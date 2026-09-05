// src/app/heritage/page.tsx
"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import Navbar from "@/components/Hero/Navbar";
import MagneticButton from "@/components/shared/MagneticButton";
import Footer from "@/components/sections/Footer";

interface Era {
  index: string;
  year: string;
  title: string;
  description: string;
  image: string;
  align: "left" | "right";
  // Palette themes for each scroll block
  cardBg: string;
  textColor: string;
  accentColor: string;
  borderColor: string;
  badgeBg: string;
}

const eras: Era[] = [
  {
    index: "01",
    year: "1947",
    title: "The Walled City",
    description:
      "Behind Lahore's Delhi Gate, nihari is left to simmer overnight over dying embers — an unbroken discipline passed down verbally, kitchen to kitchen, across generations.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop",
    align: "left",
    cardBg: "bg-[#140805]",
    textColor: "text-[#FAF7F2]",
    accentColor: "text-[#E5A93C]",
    borderColor: "border-[#E5A93C]/30",
    badgeBg: "bg-[#E5A93C]/15 text-[#E5A93C]",
  },
  {
    index: "02",
    year: "1962",
    title: "Akbari Mandi",
    description:
      "The family's spice trade begins at South Asia's premier whole-spice market — cassia quills, black cardamom pods, and wild mace, sorted and stone-crushed strictly by hand.",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1200&auto=format&fit=crop",
    align: "right",
    cardBg: "bg-[#C59438]",
    textColor: "text-[#120604]",
    accentColor: "text-[#120604]",
    borderColor: "border-[#120604]/25",
    badgeBg: "bg-[#120604]/10 text-[#120604]",
  },
  {
    index: "03",
    year: "1994",
    title: "Dum Pukht",
    description:
      "Regal recipes recorded for posterity. Copper cauldrons sealed airtight with kneaded wheat dough, allowing mutton to tenderize entirely in its own natural steam.",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1200&auto=format&fit=crop",
    align: "left",
    cardBg: "bg-[#2B1108]",
    textColor: "text-[#FAF7F2]",
    accentColor: "text-[#F3B755]",
    borderColor: "border-[#F3B755]/30",
    badgeBg: "bg-[#F3B755]/15 text-[#F3B755]",
  },
  {
    index: "04",
    year: "2011",
    title: "First London Tawa",
    description:
      "A 140kg seasoned cast-iron plate arrives in East London. The very first UK service maintains the uncompromising 12-hour fire discipline of the original Lahore kitchen.",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1600&auto=format&fit=crop",
    align: "right",
    cardBg: "bg-[#EAE2D5]",
    textColor: "text-[#140805]",
    accentColor: "text-[#8E3216]",
    borderColor: "border-[#8E3216]/25",
    badgeBg: "bg-[#8E3216]/10 text-[#8E3216]",
  },
  {
    index: "05",
    year: "Present",
    title: "Central London",
    description:
      "Mughal grand dining integrated with Michelin-calibre hospitality. The ancient Walled City's kitchen, reconstructed without dilution in the heart of the capital.",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1400&auto=format&fit=crop",
    align: "left",
    cardBg: "bg-[#0A0302]",
    textColor: "text-[#FAF7F2]",
    accentColor: "text-[#E5A93C]",
    borderColor: "border-[#E5A93C]/40",
    badgeBg: "bg-[#E5A93C]/20 text-[#E5A93C]",
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } },
};

const wordUp: Variants = {
  hidden: { opacity: 0, y: "0.5em" },
  visible: { opacity: 1, y: "0em", transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

function EraSpread({ era, priority }: { era: Era; priority: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["3%", "-3%"]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.06, 1, 1.06]);

  const isLeft = era.align === "left";

  return (
    <div ref={ref} className="relative w-full py-10 sm:py-14 md:py-0 border-b border-[#120604]/10 md:border-b-0">
      {/* Mobile-Only Header Strap */}
      <div className="flex items-center justify-between px-6 sm:px-10 pb-4 md:hidden">
        <span className="font-mono text-xs font-bold tracking-[0.3em] text-[#966A1E]">{era.index} // ARCHIVE</span>
        <span className="font-heading italic font-bold text-lg text-[#140805]">{era.year}</span>
      </div>

      <div className="relative md:min-h-[88vh] flex flex-col md:flex-row items-center justify-center">
        {/* Responsive Image Container: Fixed height for mobile, tablet, and desktop */}
        <div
          className={`relative w-full h-[48vh] sm:h-[58vh] md:h-[75vh] overflow-hidden ${
            isLeft ? "md:ml-0 md:mr-[10%] md:w-[64%]" : "md:mr-0 md:ml-[10%] md:w-[64%]"
          }`}
        >
          <motion.div
            className="absolute inset-0 h-[120%] -top-[10%]"
            style={{ y: imageY, scale: imageScale, willChange: "transform" }}
          >
            <Image
              src={era.image}
              alt={era.title}
              fill
              sizes="(min-width: 768px) 64vw, 100vw"
              quality={85}
              priority={priority}
              className="object-cover transform-gpu"
            />
          </motion.div>
        </div>

        {/* Dynamic Themed Editorial Block */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          variants={fadeUp}
          style={{ y: textY, willChange: "transform" }}
          className={`relative md:absolute z-10 w-[92%] sm:w-[88%] md:w-[42%] lg:w-[38%] -mt-12 md:mt-0 p-7 sm:p-9 lg:p-11 shadow-2xl border ${era.cardBg} ${era.borderColor} ${
            isLeft ? "md:right-0 md:bottom-8" : "md:left-0 md:top-8"
          }`}
        >
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <span className={`font-mono text-xs font-bold tracking-widest px-2.5 py-1 rounded-sm ${era.badgeBg}`}>
                {era.index}
              </span>
              <span className={`font-mono text-xs tracking-[0.25em] font-semibold opacity-75 ${era.textColor}`}>
                {era.year}
              </span>
            </div>
            <span className={`h-px w-10 ${era.borderColor.replace("border", "bg")}`} />
          </div>

          <h3 className={`font-heading italic font-bold leading-[0.95] text-[clamp(2.1rem,4.2vw,3.4rem)] mb-4 ${era.textColor}`}>
            {era.title}
          </h3>

          <p className={`font-body text-sm sm:text-base leading-relaxed font-normal opacity-95 ${era.textColor}`}>
            {era.description}
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function HeritagePage() {
  return (
    <main className="relative bg-[#FAF7F2] text-[#120604] overflow-x-hidden selection:bg-[#C59438] selection:text-[#FAF7F2]">
      <Navbar />

      {/* Hero — Asymmetric Editorial Spread */}
      <section className="relative pt-32 sm:pt-36 md:pt-44 px-6 sm:px-10 md:px-16 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-8 items-end max-w-7xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="md:col-span-8">
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <span className="font-mono text-[11px] tracking-[0.35em] text-[#966A1E] font-bold">ARCHIVE CHRONICLE</span>
              <span className="h-px w-10 bg-[#966A1E]/30" />
              <span className="font-mono text-[11px] tracking-[0.3em] text-[#120604]/60 font-semibold">1947 — LONDON</span>
            </div>

            <div className="overflow-hidden">
              <motion.h1
                variants={wordUp}
                className="font-heading italic font-bold leading-[0.9] text-[clamp(2.8rem,7.8vw,7.2rem)] text-[#120604]"
              >
                From the Walled City
              </motion.h1>
            </div>
            <div className="overflow-hidden mt-1 sm:mt-2">
              <motion.h1
                variants={wordUp}
                className="font-heading italic font-bold leading-[0.9] text-[clamp(2.8rem,7.8vw,7.2rem)] text-transparent bg-clip-text bg-gradient-to-r from-[#966A1E] via-[#C59438] to-[#8E3216]"
              >
                to Central London.
              </motion.h1>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="md:col-span-4 flex flex-col justify-end gap-5 pb-1"
          >
            <p className="font-body text-sm sm:text-base leading-relaxed text-[#140805] font-normal">
              Six decades. Two capitals. One unbroken code of overnight fires, hand-crushed whole spice, and steam-sealed cauldrons.
            </p>
            <div className="flex gap-8 pt-1 border-t border-[#120604]/15">
              <div>
                <span className="block font-heading text-3xl sm:text-4xl italic font-bold text-[#8E3216]">77</span>
                <span className="font-mono text-[10px] tracking-[0.25em] text-[#120604]/70 font-semibold">YEARS LINEAGE</span>
              </div>
              <div>
                <span className="block font-heading text-3xl sm:text-4xl italic font-bold text-[#966A1E]">12h</span>
                <span className="font-mono text-[10px] tracking-[0.25em] text-[#120604]/70 font-semibold">COAL-SIMMERED</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Hero Visual — Full-Bleed Offset Frame */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="relative mt-12 sm:mt-16 w-full max-w-7xl mx-auto h-[48vh] sm:h-[58vh] md:h-[72vh] overflow-hidden shadow-2xl"
        >
          <Image
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1600&auto=format&fit=crop"
            alt="Live charcoal flames at Lahori Wala"
            fill
            sizes="100vw"
            quality={85}
            priority
            className="object-cover transform-gpu"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#140805]/70 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 text-[#FAF7F2]">
            <span className="font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[#E5A93C] font-semibold block mb-1">
              Live Cooking Ritual
            </span>
            <p className="font-heading italic text-2xl sm:text-3xl font-bold">Raw Coals &amp; Heavy Iron Tawa</p>
          </div>
        </motion.div>
      </section>

      {/* Editorial Mission Statement */}
      <section className="px-6 sm:px-10 md:px-16 py-14 sm:py-20 border-t border-[#120604]/15 bg-[#F4EFEA]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-14 max-w-7xl mx-auto items-center">
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={fadeUp}
            className="md:col-span-5 font-heading italic font-bold text-[clamp(1.75rem,3.2vw,2.75rem)] leading-[1.1] text-[#8E3216]"
          >
            Two distinct cities. One discipline. Zero shortcuts taken.
          </motion.p>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={fadeUp}
            className="md:col-span-7 font-body text-sm sm:text-base md:text-lg text-[#140805] leading-relaxed font-normal"
          >
            What arrives on tables in Central London honors the exact ritual established behind Lahore&apos;s Delhi Gate. We do not blend or preprocess spices, nor do we accelerate cooking times with modern shorteners. The food remains unapologetic; only the dining room has evolved.
          </motion.p>
        </div>
      </section>

      {/* The 5 Era Spreads */}
      <section className="space-y-12 sm:space-y-16 md:space-y-24 py-12 md:py-20">
        {eras.map((era, i) => (
          <EraSpread key={era.index} era={era} priority={i === 0} />
        ))}
      </section>

      {/* Closing Reservation Section */}
      <Footer />
    </main>
  );
}