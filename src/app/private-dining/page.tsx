// src/app/signature/page.tsx
"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  type Variants,
} from "framer-motion";
import Navbar from "@/components/Hero/Navbar";
import MagneticButton from "@/components/shared/MagneticButton";

interface Hour {
  mark: number; // 0–12
  label: string;
  title: string;
  note: string;
  ledger: string[];
  image: string;
}

const hours: Hour[] = [
  {
    mark: 0,
    label: "H — 00",
    title: "Ignition",
    note: "The pot goes on at close of service, before the kitchen has finished its own dinner. Bone, water, nothing else yet.",
    ledger: ["22:40 — SHIN BONE, MARROW-IN", "22:41 — COLD WATER, FULL SUBMERGE", "22:42 — FLAME TO LOW"],
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1400&auto=format&fit=crop",
  },
  {
    mark: 2,
    label: "H — 02",
    title: "The Spice Bloom",
    note: "Whole cassia, black cardamom, and mace from Akbari Mandi go in unground — they will be strained out at hour ten, their oils long since given up.",
    ledger: ["00:38 — CASSIA, WHOLE", "00:39 — BLACK CARDAMOM x6", "00:41 — MACE BLADE, HAND-TORN"],
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1400&auto=format&fit=crop",
  },
  {
    mark: 5,
    label: "H — 05",
    title: "Bone & Marrow",
    note: "The collagen starts to let go. The kitchen leaves it alone here — no lid disturbance, no tasting, no stirring. Only the flame is checked.",
    ledger: ["03:52 — LID UNTOUCHED SINCE H2", "04:10 — FLAME CHECK, NO ADJUSTMENT"],
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1400&auto=format&fit=crop",
  },
  {
    mark: 8,
    label: "H — 08",
    title: "The Reduction",
    note: "Whole spices are lifted out. What remains is reduced by more than half — the point where nihari stops being a stock and becomes itself.",
    ledger: ["06:44 — WHOLE SPICE, STRAINED OUT", "07:15 — VOLUME AT 44%"],
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1600&auto=format&fit=crop",
  },
  {
    mark: 10,
    label: "H — 10",
    title: "Final Simmer",
    note: "Wheat flour, toasted dry, is worked in to thicken — the only flour that touches the pot in ten hours. The colour turns from brown to near-black.",
    ledger: ["08:50 — TOASTED ATTA, FOLDED IN", "09:20 — COLOUR CHECK, PASS"],
    image: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?q=80&w=1400&auto=format&fit=crop",
  },
  {
    mark: 12,
    label: "H — 12",
    title: "The Tarka",
    note: "Ghee, sliced ginger, and green chilli, smoking-hot, poured over the surface at the pass — the last thing that happens before it reaches you.",
    ledger: ["10:38 — GHEE TO SMOKE POINT", "10:39 — GINGER, JULIENNE", "10:40 — POURED, TABLESIDE"],
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1600&auto=format&fit=crop",
  },
];

const CIRCUMFERENCE = 2 * Math.PI * 42;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const wordUp: Variants = {
  hidden: { opacity: 0, y: "0.6em" },
  visible: { opacity: 1, y: "0em", transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } },
};

function VigilClock({ progress }: { progress: import("framer-motion").MotionValue<number> }) {
  const dashOffset = useTransform(progress, [0, 1], [CIRCUMFERENCE, 0]);
  const [activeHour, setActiveHour] = useState(hours[0]);

  useMotionValueEvent(progress, "change", (v) => {
    const bucket = hours.reduce((closest, h) => {
      const hProgress = h.mark / 12;
      return Math.abs(hProgress - v) < Math.abs(closest.mark / 12 - v) ? h : closest;
    }, hours[0]);
    if (bucket.mark !== activeHour.mark) setActiveHour(bucket);
  });

  return (
    <div
      className="fixed z-40 flex items-center gap-3 sm:gap-4
        top-24 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-[#FAF7F2]/95 border border-[#120604]/20 shadow-xl backdrop-blur-md
        md:top-auto md:bottom-10 md:right-10 md:left-auto md:translate-x-0 md:bg-transparent md:border-0 md:shadow-none md:p-0"
    >
      <div className="relative w-14 h-14 sm:w-16 sm:h-16">
        <svg viewBox="0 0 96 96" className="w-full h-full -rotate-90">
          <circle cx="48" cy="48" r="42" fill="none" stroke="#120604" strokeOpacity="0.2" strokeWidth="2" />
          <motion.circle
            cx="48"
            cy="48"
            r="42"
            fill="none"
            stroke="#C59438"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            style={{ strokeDashoffset: dashOffset, willChange: "stroke-dashoffset" }}
          />
        </svg>

        <motion.svg
          viewBox="0 0 24 24"
          className="absolute inset-0 m-auto w-4 h-4 sm:w-5 sm:h-5"
          animate={{ scale: [1, 1.12, 0.96, 1.06, 1], opacity: [0.85, 1, 0.8, 0.95, 0.85] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          style={{ willChange: "transform, opacity" }}
        >
          <path
            d="M12 2c1 3-2 4-2 7a2 2 0 004 0c0-1-.5-1.5-.5-2.5C15 8 17 10 17 13a5 5 0 11-10 0c0-4 3-6 5-11z"
            fill="#966A1E"
          />
        </motion.svg>
      </div>

      <div className="flex flex-col leading-none">
        <span className="font-mono text-[10px] tracking-[0.25em] text-[#966A1E] font-bold mb-1">THE VIGIL</span>
        <span className="font-heading italic font-bold text-lg sm:text-xl text-[#120604]">{activeHour.label}</span>
      </div>
    </div>
  );
}

function HourPanel({ hour, index }: { hour: Hour; index: number }) {
  const isDark = index % 2 === 1;

  return (
    <section
      className={`relative px-6 sm:px-10 md:px-16 py-20 sm:py-28 md:py-36 overflow-hidden ${
        isDark ? "bg-[#140805] text-[#FAF7F2]" : "bg-[#FAF7F2] text-[#120604]"
      }`}
    >
      {/* Visual guideline */}
      <motion.div
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: "top", willChange: "transform" }}
        className={`hidden md:block absolute left-16 top-24 bottom-24 w-px ${
          isDark ? "bg-[#C59438]/50" : "bg-[#120604]/25"
        }`}
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-14 items-center max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
          className={`md:col-span-5 ${isDark ? "md:order-2" : ""}`}
        >
          <div className="flex items-center gap-3 mb-5 sm:mb-6">
            <span className="font-mono text-xs font-bold tracking-[0.3em] text-[#966A1E] px-2 py-0.5 bg-[#966A1E]/10 rounded-sm">
              {hour.label}
            </span>
            <span className={`h-px w-8 ${isDark ? "bg-[#FAF7F2]/40" : "bg-[#120604]/30"}`} />
            <span className={`font-mono text-xs tracking-[0.3em] font-semibold ${isDark ? "text-[#FAF7F2]/70" : "text-[#120604]/70"}`}>
              OF TWELVE
            </span>
          </div>

          <h2 className="font-heading italic font-bold leading-[0.95] text-[clamp(2.5rem,5.5vw,4.5rem)] mb-5 sm:mb-6 text-balance">
            {hour.title}
          </h2>

          <p className={`font-body text-base sm:text-lg leading-relaxed max-w-[46ch] mb-7 sm:mb-8 font-medium ${
            isDark ? "text-[#FAF7F2]/90" : "text-[#24120E]"
          }`}>
            {hour.note}
          </p>

          <div className={`space-y-2 border-l-2 pl-4 ${isDark ? "border-[#C59438]" : "border-[#966A1E]"}`}>
            {hour.ledger.map((line) => (
              <p
                key={line}
                className={`font-mono text-xs sm:text-[13px] tracking-wider font-semibold ${
                  isDark ? "text-[#FAF7F2]/85" : "text-[#120604]"
                }`}
              >
                {line}
              </p>
            ))}
          </div>
        </motion.div>

        {/* Guaranteed responsive image container */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className={`md:col-span-6 md:col-start-7 relative w-full h-[48vh] sm:h-[58vh] md:h-[68vh] overflow-hidden rounded-xl shadow-2xl ${
            isDark ? "md:order-1 border border-[#C59438]/20" : "border border-[#120604]/10"
          }`}
        >
          <Image
            src={hour.image}
            alt={hour.title}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            quality={85}
            priority={index === 0}
            className="object-cover transform-gpu"
          />
        </motion.div>
      </div>
    </section>
  );
}

export default function SignatureVigilPage() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });

  return (
    <main className="relative bg-[#FAF7F2] text-[#120604] overflow-x-hidden selection:bg-[#C59438] selection:text-[#FAF7F2]">
      <Navbar />
      <VigilClock progress={scrollYProgress} />

      {/* Hero */}
      <section className="relative pt-32 sm:pt-40 md:pt-48 px-6 sm:px-10 md:px-16 pb-16 sm:pb-24 max-w-7xl mx-auto">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-4xl space-y-4">
          <span className="font-mono text-xs font-bold tracking-[0.35em] text-[#966A1E] block mb-4">
            THE SIGNATURE — NIHARI
          </span>

          <div className="overflow-hidden">
            <motion.h1
              variants={wordUp}
              className="font-heading italic font-bold leading-[0.92] text-[clamp(3rem,8.5vw,7rem)] text-[#120604] text-balance"
            >
              Twelve hours,
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1
              variants={wordUp}
              className="font-heading italic font-bold leading-[0.92] text-[clamp(3rem,8.5vw,7rem)] text-[#966A1E] text-balance"
            >
              one pot, no shortcuts.
            </motion.h1>
          </div>

          <motion.p variants={fadeUp} className="mt-6 sm:mt-8 font-body text-base sm:text-lg text-[#140805] max-w-[54ch] leading-relaxed font-normal">
            Scroll to follow the pot from ignition to tarka — the same twelve hours it spends in our kitchen before
            it reaches a table. Nothing here is compressed for the telling.
          </motion.p>
        </motion.div>
      </section>

      {/* The Vigil — hour-by-hour scroll narrative */}
      <div ref={trackRef}>
        {hours.map((hour, i) => (
          <HourPanel key={hour.mark} hour={hour} index={i} />
        ))}
      </div>

      {/* Close */}
      <section className="px-6 sm:px-10 md:px-16 py-20 sm:py-28 md:py-32 text-center bg-[#FAF7F2] border-t border-[#120604]/15">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeUp}
          className="font-heading italic font-bold leading-[1.02] text-[clamp(2.2rem,5.5vw,4.2rem)] max-w-3xl mx-auto mb-10 sm:mb-12 text-balance text-[#120604]"
        >
          The pot is already on. Come find out when it&apos;s ready.
        </motion.h2>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeUp}
          className="flex justify-center"
        >
          <MagneticButton
            onClick={() => alert("Opening the reservation flow…")}
            className="px-9 sm:px-12 py-4 sm:py-5 rounded-none bg-[#120604] text-[#FAF7F2] font-body text-xs uppercase tracking-[0.25em] font-bold cursor-pointer hover:bg-[#C59438] hover:text-[#120604] transition-colors duration-300 shadow-xl"
          >
            Reserve Your Table
          </MagneticButton>
        </motion.div>

        <p className="mt-16 sm:mt-20 font-mono text-xs tracking-[0.25em] text-[#120604]/60 font-semibold uppercase">
          Lahori Wala — Central London
        </p>
      </section>
    </main>
  );
}