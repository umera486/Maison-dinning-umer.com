// src/app/contact/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";
import gsap from "gsap";
import Navbar from "@/components/Hero/Navbar";
import MagneticButton from "@/components/shared/MagneticButton";

interface Channel {
  id: string;
  ch: string;
  title: string;
  tag: string;
  meta: string;
  description: string;
  details: { label: string; value: string }[];
  cta: string;
  confirmLabel: string;
  image: string;
}

const channels: Channel[] = [
  {
    id: "reservations",
    ch: "01",
    title: "Daily Dining",
    tag: "HOST DESK",
    meta: "RESPONSE UNDER 5 MIN",
    description:
      "Table bookings for two to eight guests, dietary notes, and priority seating times. The host desk manages the dining room for lunch and dinner service every evening.",
    details: [
      { label: "Direct Line", value: "+44 20 7946 0011" },
      { label: "Email", value: "reservations@lahoriwala.co.uk" },
      { label: "Seatings", value: "Daily, 12:00 — 22:30" },
    ],
    cta: "Call the Host Desk",
    confirmLabel: "Request logged — the host desk will confirm via SMS / phone shortly.",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "dispatch",
    ch: "02",
    title: "Kitchen Dispatch & London Delivery",
    tag: "COURIER HOTLINE",
    meta: "LIVE ORDER DISPATCH",
    description:
      "Takeaway coordination, sealed thermal packaging status, and direct live contact with the dedicated courier transport delivering fresh orders across London.",
    details: [
      { label: "Dispatch Hotline", value: "+44 20 7946 0022" },
      { label: "Email", value: "dispatch@lahoriwala.co.uk" },
      { label: "Delivery Zones", value: "London Zones 1 – 3, Same-Evening Courier" },
    ],
    cta: "Call the Courier Hotline",
    confirmLabel: "Dispatch team notified — tracking coordinates follow immediately.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "events",
    ch: "03",
    title: "Private Events & General Management",
    tag: "EVENT DIRECTOR",
    meta: "APPOINTMENT ONLY",
    description:
      "The Private Dastarkhwan for ten to twenty-six guests, bespoke multi-course feast menus, and full restaurant buyouts — arranged personally with our Event Director.",
    details: [
      { label: "Direct Line", value: "+44 20 7946 0033" },
      { label: "Email", value: "events@lahoriwala.co.uk" },
      { label: "Lead Time", value: "48 Hours Minimum Advance Notice" },
    ],
    cta: "Speak with the Event Director",
    confirmLabel: "Enquiry logged — our Director will contact you within 24 hours.",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1600&auto=format&fit=crop",
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
};

const wordUp: Variants = {
  hidden: { opacity: 0, y: "0.5em" },
  visible: { opacity: 1, y: "0em", transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

function SwitchboardRail({
  activeIndex,
  headerRefs,
  containerRef,
}: {
  activeIndex: number;
  headerRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const wireRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion() ?? false;

  useEffect(() => {
    const header = headerRefs.current[activeIndex];
    const container = containerRef.current;
    const wire = wireRef.current;
    if (!header || !container || !wire) return;

    const headerRect = header.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const y = headerRect.top - containerRect.top + headerRect.height / 2;

    if (reduceMotion) {
      gsap.set(wire, { y });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.to(wire, { y, duration: 0.6, ease: "power3.inOut", force3D: true });
    });
    return () => ctx.revert();
  }, [activeIndex, headerRefs, containerRef, reduceMotion]);

  return (
    <div className="hidden md:block absolute -left-8 lg:-left-12 top-0 bottom-0 w-px">
      <div className="absolute inset-0 bg-[#120604]/20" />
      {channels.map((_, i) => (
        <div
          key={i}
          className="absolute -left-[4px] w-[9px] h-[9px] rounded-full bg-[#120604]/30"
          style={{ top: `${(i / (channels.length - 1)) * 100}%` }}
        />
      ))}
      <div
        ref={wireRef}
        className="absolute -left-[5px] top-0 w-[11px] h-[11px] rounded-full bg-[#C59438] shadow-[0_0_12px_#C59438]"
        style={{ willChange: "transform" }}
      >
        <span className="absolute inset-0 rounded-full bg-[#C59438] animate-ping opacity-60" />
      </div>
    </div>
  );
}

function ChannelForm({ channel }: { channel: Channel }) {
  const [sent, setSent] = useState(false);

  return (
    <div className="pt-6 sm:pt-8">
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 p-4 bg-[#FAF7F2] border-2 border-[#966A1E] rounded-md shadow-md"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#966A1E] shrink-0 animate-pulse" />
            <p className="font-body text-sm sm:text-base font-bold text-[#120604]">{channel.confirmLabel}</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2"
          >
            <label className="flex flex-col gap-2 sm:col-span-1">
              <span className="font-mono text-[11px] sm:text-xs font-bold tracking-[0.25em] text-[#966A1E]">
                FULL NAME *
              </span>
              <input
                required
                type="text"
                placeholder="Lord / Lady / Guest Name"
                className="bg-transparent border-b-2 border-[#120604]/30 focus:border-[#C59438] outline-none py-2.5 font-body text-base font-semibold text-[#120604] placeholder:text-[#120604]/40 transition-colors duration-300"
              />
            </label>

            <label className="flex flex-col gap-2 sm:col-span-1">
              <span className="font-mono text-[11px] sm:text-xs font-bold tracking-[0.25em] text-[#966A1E]">
                CONTACT (PHONE OR EMAIL) *
              </span>
              <input
                required
                type="text"
                placeholder="+44 7... or your@email.com"
                className="bg-transparent border-b-2 border-[#120604]/30 focus:border-[#C59438] outline-none py-2.5 font-body text-base font-semibold text-[#120604] placeholder:text-[#120604]/40 transition-colors duration-300"
              />
            </label>

            <label className="flex flex-col gap-2 sm:col-span-2">
              <span className="font-mono text-[11px] sm:text-xs font-bold tracking-[0.25em] text-[#966A1E]">
                INQUIRY / SPECIAL REQUEST *
              </span>
              <textarea
                required
                rows={2}
                placeholder="Party size, preferred time, dietary requirements, or delivery address..."
                className="bg-transparent border-b-2 border-[#120604]/30 focus:border-[#C59438] outline-none py-2.5 font-body text-base font-semibold text-[#120604] placeholder:text-[#120604]/40 resize-none transition-colors duration-300"
              />
            </label>

            <div className="sm:col-span-2 pt-3">
              <MagneticButton
                onClick={() => {}}
                className="w-full sm:w-auto px-8 sm:px-10 py-4 rounded-none bg-[#120604] text-[#FAF7F2] font-body text-xs uppercase tracking-[0.25em] font-bold cursor-pointer hover:bg-[#C59438] hover:text-[#120604] transition-colors duration-300 shadow-xl"
              >
                Connect with {channel.tag}
              </MagneticButton>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChannelPanel({
  channel,
  index,
  isOpen,
  onToggle,
  registerRef,
}: {
  channel: Channel;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  registerRef: (el: HTMLButtonElement | null) => void;
}) {
  return (
    <div className="border-t-2 border-[#120604]/15 last:border-b-2">
      <button
        ref={registerRef}
        onClick={onToggle}
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between gap-4 sm:gap-8 py-7 sm:py-9 text-left cursor-pointer transition-colors duration-300 ${
          isOpen ? "bg-[#140805]/[0.03]" : "hover:bg-[#140805]/[0.015]"
        }`}
      >
        <div className="flex items-baseline gap-4 sm:gap-6 min-w-0">
          <span
            className={`font-heading italic font-bold text-2xl sm:text-4xl transition-colors duration-300 ${
              isOpen ? "text-[#C59438]" : "text-[#120604]/40"
            }`}
          >
            {channel.ch}
          </span>
          <div className="min-w-0">
            <h3 className="font-heading italic font-bold text-2xl sm:text-3xl md:text-4xl text-[#120604] tracking-tight truncate">
              {channel.title}
            </h3>
            <span className="inline-block font-mono text-[10px] sm:text-xs font-bold tracking-[0.25em] text-[#966A1E] mt-1 uppercase">
              {channel.tag}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
          <span className="hidden md:block font-mono text-xs font-bold tracking-[0.2em] text-[#120604]/70 uppercase">
            {channel.meta}
          </span>
          <motion.span
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ willChange: "transform" }}
            className={`relative w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${
              isOpen
                ? "border-[#C59438] bg-[#C59438] text-[#140805]"
                : "border-[#120604]/30 text-[#120604] hover:border-[#C59438]"
            }`}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 font-bold">
              <line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </motion.span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ height: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }, opacity: { duration: 0.3 } }}
            style={{ willChange: "height, opacity", overflow: "hidden" }}
          >
            <div className="pb-10 sm:pb-16 pt-2 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
              <motion.div variants={fadeUp} initial="hidden" animate="visible" className="md:col-span-7 space-y-6">
                <p className="font-body text-base sm:text-lg leading-relaxed text-[#140805] font-normal max-w-[54ch]">
                  {channel.description}
                </p>

                <div className="space-y-3 sm:space-y-4 pt-2">
                  {channel.details.map((d) => (
                    <div
                      key={d.label}
                      className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 border-b border-[#120604]/15 pb-3"
                    >
                      <span className="font-mono text-xs font-bold tracking-[0.2em] text-[#966A1E] w-36 shrink-0 uppercase">
                        {d.label}
                      </span>
                      <span className="font-body text-base sm:text-lg font-bold text-[#120604] tracking-tight">
                        {d.value}
                      </span>
                    </div>
                  ))}
                </div>

                <ChannelForm channel={channel} />
              </motion.div>

              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="md:col-span-5 relative w-full h-[36vh] sm:h-[42vh] md:h-auto min-h-[280px] md:min-h-[400px] rounded-2xl overflow-hidden shadow-2xl border border-[#120604]/15"
              >
                <Image
                  src={channel.image}
                  alt={channel.title}
                  fill
                  sizes="(min-width: 768px) 45vw, 100vw"
                  quality={85}
                  priority={index === 0}
                  className="object-cover transform-gpu"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#140805]/70 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 text-[#FAF7F2]">
                  <span className="font-mono text-[10px] sm:text-xs font-bold tracking-[0.3em] text-[#C59438] block mb-1">
                    ACTIVE CHANNEL // {channel.ch}
                  </span>
                  <p className="font-heading italic font-bold text-xl sm:text-2xl">{channel.tag}</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ContactPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const headerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <main className="relative bg-[#FAF7F2] text-[#120604] overflow-x-hidden selection:bg-[#C59438] selection:text-[#FAF7F2]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 sm:pt-40 md:pt-48 px-6 sm:px-10 md:px-16 md:pl-28 lg:pl-36 pb-14 sm:pb-20 max-w-7xl">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-xs font-bold tracking-[0.35em] text-[#966A1E]">
              CONCIERGE COMMUNICATIONS
            </span>
            <span className="h-px w-10 bg-[#966A1E]/40" />
            <span className="font-mono text-xs font-semibold tracking-[0.3em] text-[#120604]/60">
              CENTRAL LONDON
            </span>
          </div>

          <div className="overflow-hidden">
            <motion.h1
              variants={wordUp}
              className="font-heading italic font-bold leading-[0.92] text-[clamp(2.8rem,7.5vw,6.5rem)] text-[#120604]"
            >
              Three dedicated desks.
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1
              variants={wordUp}
              className="font-heading italic font-bold leading-[0.92] text-[clamp(2.8rem,7.5vw,6.5rem)] text-transparent bg-clip-text bg-gradient-to-r from-[#966A1E] via-[#C59438] to-[#8E3216]"
            >
              One singular house.
            </motion.h1>
          </div>

          <motion.p
            variants={fadeUp}
            className="pt-2 font-body text-base sm:text-lg text-[#140805] max-w-[56ch] leading-relaxed font-normal"
          >
            Every communication at Lahori Wala is routed directly to the specialist equipped to resolve it immediately—never through an unmonitored general inbox. Select your channel below.
          </motion.p>
        </motion.div>
      </section>

      {/* Switchboard Accordion */}
      <section className="relative px-6 sm:px-10 md:px-16 md:pl-28 lg:pl-36 pb-20 sm:pb-28 max-w-7xl">
        <div ref={containerRef} className="relative">
          <SwitchboardRail activeIndex={activeIndex} headerRefs={headerRefs} containerRef={containerRef} />
          {channels.map((channel, i) => (
            <ChannelPanel
              key={channel.id}
              channel={channel}
              index={i}
              isOpen={activeIndex === i}
              onToggle={() => setActiveIndex(i)}
              registerRef={(el) => (headerRefs.current[i] = el)}
            />
          ))}
        </div>
      </section>

      {/* Location / Physical Address Footer */}
      <section className="bg-[#120604] text-[#FAF7F2] px-6 sm:px-10 md:px-16 py-16 sm:py-24 border-t border-[#C59438]/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8">
          <div className="space-y-2">
            <span className="font-mono text-xs font-bold tracking-[0.25em] text-[#C59438] uppercase block">
              LOCATION &amp; VALET
            </span>
            <p className="font-body text-base font-normal text-[#FAF7F2] leading-relaxed">
              Ghakhar Plaza, Suite 402
              <br />
              Central London, UK
            </p>
            <span className="font-mono text-[11px] text-[#FAF7F2]/60 block tracking-widest pt-1">
              Private entrance &amp; curbside pickup
            </span>
          </div>

          <div className="space-y-2">
            <span className="font-mono text-xs font-bold tracking-[0.25em] text-[#C59438] uppercase block">
              SERVICE HOURS
            </span>
            <p className="font-body text-base font-normal text-[#FAF7F2] leading-relaxed">
              Daily Dining: 12:00 — 22:30
              <br />
              Kitchen Dispatch: Until 22:00
            </p>
            <span className="font-mono text-[11px] text-[#FAF7F2]/60 block tracking-widest pt-1">
              Open 7 days a week including bank holidays
            </span>
          </div>

          <div className="space-y-2">
            <span className="font-mono text-xs font-bold tracking-[0.25em] text-[#C59438] uppercase block">
              DIRECT DESK
            </span>
            <p className="font-body text-base font-normal text-[#FAF7F2] leading-relaxed">
              concierge@lahoriwala.co.uk
              <br />
              +44 20 7946 0000
            </p>
            <span className="font-mono text-[11px] text-[#FAF7F2]/60 block tracking-widest pt-1">
              Immediate response during service hours
            </span>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-[#FAF7F2]/15 max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-[11px] tracking-[0.25em] text-[#FAF7F2]/60 uppercase">
          <span>Lahori Wala — Central London</span>
          <span>EST. 1947 // CULINARY ARCHIVE</span>
        </div>
      </section>
    </main>
  );
}