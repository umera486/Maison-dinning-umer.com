// src/app/shahi-reserve/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  type Variants,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Hero/Navbar";
import MagneticButton from "@/components/shared/MagneticButton";
import Footer from "@/components/sections/Footer";

gsap.registerPlugin(ScrollTrigger);

interface Lot {
  no: string;
  name: string;
  provenance: string;
  note: string;
  yield: string;
  image: string;
}

const lots: Lot[] = [
  {
    no: "01",
    name: "Mongra Saffron, Kashmir Reserve",
    provenance: "Pampore Valley, single harvest",
    note: "Hand-picked stigmas only, dried within four hours of harvest. Steeped tableside in warm milk, never pre-infused.",
    yield: "8 covers per seating",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1400&auto=format&fit=crop",
  },
  {
    no: "02",
    name: "40-Day Dry-Aged Lamb Rack",
    provenance: "Aged in-house, Central London",
    note: "Dry-aged past the point most kitchens will risk, then finished over live charcoal. The fat renders differently — you'll notice.",
    yield: "6 covers per seating",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1600&auto=format&fit=crop",
  },
  {
    no: "03",
    name: "Akbari Mandi Garam Masala, Aged Blend",
    provenance: "Lahore, hand-blended, cellar-rested 3 years",
    note: "Whole spice, ground in small batches and rested in clay before use — a blend the kitchen does not sell, only serves.",
    yield: "By allocation only",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1400&auto=format&fit=crop",
  },
  {
    no: "04",
    name: "Family Mango Achaar, Batch of 1994",
    provenance: "Original family recipe, single annual batch",
    note: "Made once a year, from the same recipe carried out of the Walled City. What's poured tonight is what's left of this year's batch.",
    yield: "12 jars remaining",
    image: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?q=80&w=1400&auto=format&fit=crop",
  },
  {
    no: "05",
    name: "Vintage Gur, Punjab Highland",
    provenance: "Single-farm jaggery, aged 18 months",
    note: "Slow-aged rather than fresh-pressed — deeper, almost smoked in character. Closes the tasting, served with the Reserve's own kahwa.",
    yield: "Final course, all seatings",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1400&auto=format&fit=crop",
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const wordUp: Variants = {
  hidden: { opacity: 0, y: "0.6em" },
  visible: { opacity: 1, y: "0em", transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } },
};

/**
 * Fixed vault dial: a brass ring whose arm turns continuously via a GSAP
 * ScrollTrigger scrub across the whole corridor (imperative, no React
 * state per frame — pure transform). A separate, cheap framer scroll
 * subscription buckets progress into a lot index and only re-renders on
 * the ~5 moments that number actually changes.
 */
function VaultDial({ corridorRef }: { corridorRef: React.RefObject<HTMLDivElement | null> }) {
  const armRef = useRef<SVGLineElement>(null);
  const [activeLot, setActiveLot] = useState(lots[0]);

  const { scrollYProgress } = useScroll({ target: corridorRef, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(lots.length - 1, Math.floor(v * lots.length));
    if (lots[idx].no !== activeLot.no) setActiveLot(lots[idx]);
  });

  useEffect(() => {
    if (!corridorRef.current || !armRef.current) return;
    const ctx = gsap.context(() => {
      gsap.set(armRef.current, { transformOrigin: "50% 50%", force3D: true });
      gsap.to(armRef.current, {
        rotate: 720,
        ease: "none",
        scrollTrigger: {
          trigger: corridorRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
        },
      });
    });
    return () => ctx.revert();
  }, [corridorRef]);

  return (
    <div
      className="fixed z-40 flex items-center gap-3 sm:gap-4
        top-20 left-1/2 -translate-x-1/2
        md:top-auto md:bottom-10 md:right-10 md:left-auto md:translate-x-0"
    >
      <div className="relative w-14 h-14 sm:w-16 sm:h-16">
        <svg viewBox="0 0 96 96" className="w-full h-full">
          <circle cx="48" cy="48" r="44" fill="#FAF7F2" stroke="#120604" strokeOpacity="0.12" strokeWidth="1" />
          {Array.from({ length: 12 }).map((_, i) => (
            <line
              key={i}
              x1="48"
              y1="8"
              x2="48"
              y2="13"
              stroke="#120604"
              strokeOpacity="0.25"
              strokeWidth="1"
              transform={`rotate(${i * 30} 48 48)`}
            />
          ))}
          <circle cx="48" cy="48" r="3" fill="#966A1E" />
          <line ref={armRef} x1="48" y1="48" x2="48" y2="16" stroke="#C59438" strokeWidth="1.6" strokeLinecap="round" style={{ willChange: "transform" }} />
        </svg>
      </div>
      <div className="hidden sm:flex flex-col leading-none">
        <span className="font-mono text-[9px] tracking-[0.25em] text-[#966A1E] mb-1">THE VAULT</span>
        <span className="font-heading italic font-light text-lg text-[#120604]">LOT {activeLot.no}</span>
      </div>
    </div>
  );
}

/** Claim interaction: a wax-seal stamp that scales/rotates in on click,
 *  then settles — spring, transform-only, no layout shift (absolute
 *  overlay sized to match the button box). */
function ClaimSeal({ lotNo }: { lotNo: string }) {
  const [claimed, setClaimed] = useState(false);
  const ledgerNo = useRef(Math.floor(1000 + Math.random() * 8999));

  return (
    <div className="relative inline-flex">
      <MagneticButton
        onClick={() => setClaimed(true)}
        className={`px-7 sm:px-8 py-3.5 sm:py-4 rounded-none border font-body text-xs uppercase tracking-[0.2em] cursor-pointer transition-colors duration-500 ${
          claimed
            ? "border-[#966A1E] bg-[#966A1E]/10 text-[#966A1E]"
            : "border-[#120604] text-[#120604] hover:bg-[#120604] hover:text-[#FAF7F2]"
        }`}
      >
        {claimed ? `Allocated — Ledger No. ${ledgerNo.current}` : `Reserve Lot ${lotNo}`}
      </MagneticButton>

      <motion.div
        aria-hidden
        initial={false}
        animate={claimed ? { scale: 1, rotate: -8, opacity: 1 } : { scale: 0, rotate: -40, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 16 }}
        style={{ willChange: "transform, opacity" }}
        className="pointer-events-none absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-11 h-11 sm:w-12 sm:h-12
          rounded-full border-2 border-[#966A1E] flex items-center justify-center bg-[#FAF7F2]"
      >
        <span className="font-heading italic text-[9px] sm:text-[10px] text-[#966A1E] leading-none text-center">
          SEALED
        </span>
      </motion.div>
    </div>
  );
}

function LotPanel({ lot, index }: { lot: Lot; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const isDark = index % 2 === 1;

  return (
    <section
      ref={ref}
      className={`relative px-5 sm:px-8 md:px-16 py-16 sm:py-24 md:py-32 overflow-hidden ${
        isDark ? "bg-[#140805] text-[#FAF7F2]" : "bg-[#FAF7F2] text-[#120604]"
      }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-14 items-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
          className={`md:col-span-6 relative h-[48vh] sm:h-[60vh] md:h-[75vh] overflow-hidden ${
            isDark ? "md:order-2" : ""
          }`}
        >
          <motion.div className="absolute inset-0 h-[124%] -top-[12%]" style={{ y: imageY, willChange: "transform" }}>
            <Image
              src={lot.image}
              alt={lot.name}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              quality={82}
              priority={index === 0}
              className="object-cover transform-gpu"
            />
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
          className={`md:col-span-5 md:col-start-8 ${isDark ? "md:order-1" : ""}`}
        >
          <div className="flex items-center gap-3 mb-5 sm:mb-6">
            <span className="font-mono text-[10px] tracking-[0.3em] text-[#966A1E]">LOT {lot.no}</span>
            <span className={`h-px w-8 ${isDark ? "bg-[#FAF7F2]/25" : "bg-[#120604]/20"}`} />
            <span className="font-mono text-[10px] tracking-[0.3em] opacity-50">{lot.yield}</span>
          </div>

          <h2 className="font-heading italic font-light leading-[0.98] text-[clamp(2rem,4.5vw,3.25rem)] mb-4 text-balance">
            {lot.name}
          </h2>
          <span className="block font-mono text-[10px] tracking-[0.2em] opacity-50 mb-5 sm:mb-6">
            {lot.provenance.toUpperCase()}
          </span>
          <p className="font-body text-sm sm:text-base leading-relaxed opacity-75 max-w-[46ch] mb-8 sm:mb-10">
            {lot.note}
          </p>

          <ClaimSeal lotNo={lot.no} />
        </motion.div>
      </div>
    </section>
  );
}

export default function ShahiReservePage() {
  const corridorRef = useRef<HTMLDivElement>(null);

  return (
    <main className="relative bg-[#FAF7F2] text-[#120604] overflow-x-hidden">
      <Navbar />
      <VaultDial corridorRef={corridorRef} />

      {/* Hero */}
      <section className="relative pt-32 sm:pt-40 px-5 sm:px-8 md:px-16 pb-16 sm:pb-24">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-4xl">
          <span className="font-mono text-[10px] tracking-[0.3em] text-[#966A1E] block mb-6 sm:mb-8">
            THE SHAHI RESERVE
          </span>
          <div className="overflow-hidden">
            <motion.h1
              variants={wordUp}
              className="font-heading italic font-light leading-[0.92] text-[clamp(2.75rem,8vw,6.5rem)] text-balance"
            >
              Five lots.
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1
              variants={wordUp}
              className="font-heading italic font-light leading-[0.92] text-[clamp(2.75rem,8vw,6.5rem)] text-[#966A1E] text-balance"
            >
              Never more than the season gives.
            </motion.h1>
          </div>
          <motion.p variants={fadeUp} className="mt-6 sm:mt-8 font-body text-sm sm:text-base text-[#120604]/70 max-w-[54ch] leading-relaxed">
            The Reserve is not a menu — it's a ledger. Five ingredients, sourced in quantities too small to promise,
            released to the table only while they last. Scroll to see what's currently allocated.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-3 border-t border-[#120604]/15 pt-6"
          >
            {[
              { label: "FORMAT", value: "SEASONAL ALLOCATION VAULT" },
              { label: "ACCESS", value: "BY RESERVATION" },
              { label: "LOTS RELEASED", value: "QUARTERLY" },
            ].map((meta) => (
              <div key={meta.label} className="py-3 sm:py-0 sm:px-6 first:sm:pl-0 border-b sm:border-b-0 sm:border-l first:sm:border-l-0 border-[#120604]/15">
                <span className="font-mono text-[9px] tracking-[0.25em] text-[#966A1E] block mb-1">{meta.label}</span>
                <span className="font-body text-sm text-[#120604]/80">{meta.value}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* The Vault Corridor */}
      <div ref={corridorRef}>
        {lots.map((lot, i) => (
          <LotPanel key={lot.no} lot={lot} index={i} />
        ))}
      </div>

      {/* Ledger summary */}
      <section className="px-5 sm:px-8 md:px-16 py-16 sm:py-20 border-t border-[#120604]/15">
        <span className="font-mono text-[10px] tracking-[0.3em] text-[#966A1E] block mb-8 sm:mb-10">
          THE FULL LEDGER
        </span>
        <div>
          {lots.map((lot) => (
            <motion.div
              key={lot.no}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.6 }}
              variants={fadeUp}
              className="grid grid-cols-12 gap-4 sm:gap-8 items-center py-5 sm:py-6 border-t border-[#120604]/15 last:border-b"
            >
              <span className="col-span-2 sm:col-span-1 font-mono text-xs tracking-[0.2em] text-[#966A1E]">
                {lot.no}
              </span>
              <span className="col-span-10 sm:col-span-5 font-heading italic font-light text-lg sm:text-xl text-balance">
                {lot.name}
              </span>
              <span className="hidden sm:block col-span-6 font-mono text-[11px] tracking-[0.15em] text-[#120604]/50 uppercase">
                {lot.yield}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Close */}
      <Footer />
    </main>
  );
}