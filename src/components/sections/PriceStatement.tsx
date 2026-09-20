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
 * The positioning section: real prices at display scale.
 *
 * Previously three bordered cards in a row — the most template-looking thing
 * on the page. Now the figures ARE the layout: each price is set at up to
 * 9rem, rules are hairlines instead of boxes, and the row reveals by wiping
 * its own underline. Nothing is contained in a card.
 */

const HEADLINE = "Lahore prices. Lahore fire.";

const facts = [
  { value: "0.80", label: "Plain naan", detail: "Pulled from the tandoor to order" },
  { value: "5.99", label: "Any chicken main", detail: "Ten of them, all the same price" },
  { value: "21.99", label: "Mix grill, for the table", detail: "Twenty pieces off the charcoal" },
];

function PriceRow({ fact, index }: { fact: (typeof facts)[number]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={inView}
      transition={{ duration: 0.7, ease: EASE_LAHORI, delay: index * 0.09 }}
      className="group relative border-t border-brand-surface/12 py-7 sm:py-9"
    >
      {/* The rule fills gold on hover — the only decoration in the section. */}
      <span
        aria-hidden
        className="absolute -top-px left-0 h-px w-0 bg-brand-accent
          transition-[width] duration-700 ease-lahori group-hover:w-full"
      />

      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3 sm:gap-10">
        <p className="font-heading italic font-light leading-[0.8] text-brand-surface tabular-nums
          text-[clamp(4rem,15vw,9rem)] tracking-[-0.03em]
          transition-colors duration-500 group-hover:text-brand-accent">
          <span className="align-top text-[0.42em] mr-1 tracking-normal">£</span>
          {fact.value}
        </p>

        <div className="sm:text-right sm:pb-3 shrink-0">
          <p className="font-body text-sm sm:text-base uppercase tracking-[0.18em] text-brand-surface">
            {fact.label}
          </p>
          <p className="mt-1.5 font-body text-[13px] text-brand-muted">{fact.detail}</p>
        </div>
      </div>
    </motion.div>
  );
}

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

        // xPercent is a transform — compositor only, no layout, no paint.
        const tween = gsap.fromTo(
          ghost,
          { xPercent: isMobile ? 8 : 16 },
          {
            xPercent: isMobile ? -8 : -16,
            ease: "none",
            scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 0.5 },
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
    <section ref={sectionRef} className="relative bg-brand-base overflow-hidden py-24 sm:py-36 lg:py-44">
      <span
        ref={ghostRef}
        aria-hidden
        className="pointer-events-none select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          whitespace-nowrap font-heading italic text-[30vw] leading-none text-brand-surface/[0.025] transform-gpu"
      >
        Lahoriwala
      </span>

      <div className="relative z-10 px-5 sm:px-10 lg:px-16 max-w-[1600px] mx-auto">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={inView}
          className="font-body text-[10px] uppercase tracking-[0.4em] text-brand-accent mb-8"
        >
          No theatre in the pricing
        </motion.p>

        <motion.h2
          variants={stagger(0.075)}
          initial="hidden"
          whileInView="visible"
          viewport={inView}
          className="font-heading italic font-light text-[clamp(2.5rem,9vw,6.5rem)] leading-[0.94]
            tracking-[-0.02em] text-brand-surface text-balance max-w-[14ch]"
        >
          <SplitWords text={HEADLINE} />
        </motion.h2>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={inView}
          className="mt-8 font-body text-base sm:text-lg leading-relaxed text-brand-muted max-w-[44ch]"
        >
          Nothing here is priced to impress you. It is priced to feed you, the way it
          would be fed to you at home.
        </motion.p>

        <div className="mt-16 sm:mt-24 border-b border-brand-surface/12">
          {facts.map((fact, i) => (
            <PriceRow key={fact.label} fact={fact} index={i} />
          ))}
        </div>

        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={inView} className="mt-12">
          <Link
            href={routes.menu}
            className="group inline-flex items-center gap-4 font-heading italic
              text-3xl sm:text-4xl text-brand-surface hover:text-brand-accent transition-colors duration-300"
          >
            Read the whole menu
            <ArrowRight className="w-7 h-7 transition-transform duration-500 group-hover:translate-x-2" strokeWidth={1.4} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
