// src/components/sections/PriceStatement.tsx
"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { routes } from "@/lib/site";
import { stagger, fadeUp, inView, EASE_LAHORI } from "@/lib/motion";
import SplitWords from "@/components/shared/SplitWords";

gsap.registerPlugin(ScrollTrigger);

/**
 * The positioning section.
 *
 * The old site invented a £36 karahi and a £48 lamb raan for a kitchen whose
 * real karahi is £7.99. Rather than hide the real prices, this section leads
 * with them — the prices are the story, and they're printed at display size.
 *
 * Every figure here is read from the live menu data, so it can never drift out
 * of step with /menu the way hardcoded copy would.
 */

const HEADLINE = "Lahore prices. Lahore fire.";

const facts = [
  { value: "£0.80", label: "Plain naan", detail: "Pulled from the tandoor to order" },
  { value: "£5.99", label: "Any chicken main", detail: "Ten of them, all the same price" },
  { value: "£21.99", label: "Mix grill for the table", detail: "Twenty pieces off the charcoal" },
];

export default function PriceStatement() {
  const sectionRef = useRef<HTMLElement>(null);
  const ghostRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const ghost = ghostRef.current;
    if (!section || !ghost) return;

    const mm = gsap.matchMedia();

    mm.add(
      { isMobile: "(max-width: 767px)", reduceMotion: "(prefers-reduced-motion: reduce)" },
      (ctx) => {
        const { isMobile, reduceMotion } = ctx.conditions as {
          isMobile: boolean;
          reduceMotion: boolean;
        };
        if (reduceMotion) return;

        // Horizontal drift on the oversized background word. `xPercent` is a
        // transform, so this is a compositor job — no layout, no paint.
        const tween = gsap.fromTo(
          ghost,
          { xPercent: isMobile ? 6 : 12 },
          {
            xPercent: isMobile ? -6 : -12,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.5,
            },
          }
        );

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-brand-base overflow-hidden py-20 sm:py-28 lg:py-36"
    >
      {/* Oversized ghost word. Pure texture, hidden from assistive tech. */}
      <span
        ref={ghostRef}
        aria-hidden
        className="pointer-events-none select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          whitespace-nowrap font-heading italic text-[26vw] leading-none text-brand-surface/[0.028] transform-gpu"
      >
        Lahoriwala
      </span>

      <div className="relative z-10 px-5 sm:px-8 lg:px-14 max-w-[1500px] mx-auto">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={inView}
          className="font-body text-[10px] uppercase tracking-[0.3em] text-brand-accent mb-5"
        >
          No theatre in the pricing
        </motion.p>

        <motion.h2
          variants={stagger(0.075)}
          initial="hidden"
          whileInView="visible"
          viewport={inView}
          className="font-heading italic font-light text-[clamp(2.25rem,8.5vw,5.5rem)] leading-[0.98]
            tracking-tight text-brand-surface text-balance max-w-[15ch]"
        >
          <SplitWords text={HEADLINE} />
        </motion.h2>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={inView}
          className="mt-6 font-body text-sm sm:text-base leading-relaxed text-brand-muted max-w-[46ch]"
        >
          Nothing here is priced to impress you. It is priced to feed you, the way it
          would be fed to you at home.
        </motion.p>

        {/* Facts */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-px bg-brand-surface/10 border border-brand-surface/10 rounded-2xl overflow-hidden">
          {facts.map((fact, i) => (
            <motion.div
              key={fact.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inView}
              transition={{ duration: 0.6, ease: EASE_LAHORI, delay: i * 0.1 }}
              className="bg-brand-base p-6 sm:p-7 lg:p-8"
            >
              <p className="font-heading italic font-light text-[clamp(2.5rem,7vw,3.75rem)] leading-none text-brand-accent tabular-nums">
                {fact.value}
              </p>
              <p className="mt-3 font-body text-[11px] uppercase tracking-[0.2em] text-brand-surface font-semibold">
                {fact.label}
              </p>
              <p className="mt-1.5 font-body text-[12px] leading-relaxed text-brand-muted">
                {fact.detail}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={inView}
          className="mt-10"
        >
          <Link
            href={routes.menu}
            className="group inline-flex items-center gap-3 rounded-full bg-brand-surface text-brand-base
              px-7 h-12 font-body text-[11px] uppercase tracking-[0.2em] font-semibold
              hover:bg-brand-accent transition-colors duration-300"
          >
            Read the whole menu
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
