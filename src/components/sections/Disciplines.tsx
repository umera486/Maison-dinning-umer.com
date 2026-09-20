// src/components/sections/Disciplines.tsx
"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import SmartImage from "@/components/shared/SmartImage";
import { img } from "@/data/images";
import { routes } from "@/lib/site";

gsap.registerPlugin(ScrollTrigger);

/**
 * The five disciplines printed across the flyer, as a pinned horizontal
 * cinema: the section sticks and the panels travel sideways as you scroll.
 *
 * This replaces a left-list / right-image split that read like a template.
 * The rules that make it feel expensive rather than busy: full-bleed imagery,
 * display type at 13vw, almost no chrome, and one idea per screen.
 *
 * Mobile does NOT get the pin. Pinned horizontal scroll on a phone fights the
 * browser's own gesture handling and address-bar resize, and it is the single
 * most reliable way to make a site feel broken on touch. Phones get the same
 * panels stacked vertically, full-bleed, which loses none of the drama.
 */

interface Discipline {
  no: string;
  name: string;
  meta: string;
  line: string;
  example: string;
  href: string;
  image: string;
}

const disciplines: Discipline[] = [
  {
    no: "01",
    name: "Karahi",
    meta: "Iron wok · open flame",
    line: "Finished in front of you. Tomato, ginger, crushed pepper — never ladled from a pot made that morning.",
    example: "Lamb Karahi · £7.99",
    href: `${routes.menu}#lamb-mains`,
    image: img.karahi,
  },
  {
    no: "02",
    name: "BBQ",
    meta: "Live charcoal",
    line: "Seekh kabab, lamb chops, tikka — straight off the skewer. The large mixed grill feeds a table of four.",
    example: "Mix Grill · £21.99",
    href: `${routes.menu}#starters-non-veg`,
    image: img.grill,
  },
  {
    no: "03",
    name: "Nihari",
    meta: "Started the night before",
    line: "Shank cooked down overnight into marrow gravy. Ginger, green chilli and lemon at the pass.",
    example: "Lahori Nihari · £7.99",
    href: `${routes.menu}#specials`,
    image: img.curry,
  },
  {
    no: "04",
    name: "Paye",
    meta: "Slow, patient, unhurried",
    line: "Trotters taken all the way to collagen. The kunna is cooked Chiniot-style, in clay.",
    example: "Kunna Paye · £9.99",
    href: `${routes.menu}#specials`,
    image: img.spread,
  },
  {
    no: "05",
    name: "Street Food",
    meta: "How Lahore actually eats",
    line: "Dynamite tossed hot in chilli glaze, whole chargha, halwa puri at breakfast. Loud, fast, honest.",
    example: "Chicken Dynamite · £6.99",
    href: `${routes.menu}#lahori-dynamite`,
    image: img.tawa,
  },
];

function Panel({ item, index }: { item: Discipline; index: number }) {
  return (
    <article
      data-panel
      className="relative w-screen h-[85svh] md:h-screen shrink-0 overflow-hidden"
    >
      <SmartImage
        src={item.image}
        alt={item.name}
        label={item.name}
        fill
        sizes="100vw"
        quality={75}
        preload={index === 0}
        loading={index === 0 ? undefined : "lazy"}
        className="object-cover"
      />

      {/* Two scrims: one lifts the whole frame off white, one anchors the
          type. Fixed gradients, so no per-frame paint. */}
      <div className="absolute inset-0 bg-brand-base/45" />
      <div className="absolute inset-0 bg-linear-to-t from-brand-base via-brand-base/25 to-transparent" />

      <div className="relative h-full flex flex-col justify-end px-5 sm:px-10 lg:px-16 pb-14 sm:pb-20">
        <span className="font-body text-[11px] tracking-[0.4em] text-brand-accent mb-4 tabular-nums">
          {item.no} — {item.meta.toUpperCase()}
        </span>

        {/* The whole point of the section. Display scale, nothing else
            competing with it. */}
        <h3 className="font-heading italic font-light text-brand-surface text-over-image
          text-[clamp(3.5rem,13vw,11rem)] leading-[0.86] tracking-[-0.02em] mb-6">
          {item.name}
        </h3>

        <p className="font-body text-sm sm:text-base leading-relaxed text-brand-surface/75 max-w-[44ch] mb-7">
          {item.line}
        </p>

        <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
          <span className="font-heading italic text-2xl sm:text-3xl text-brand-accent">
            {item.example}
          </span>
          <Link
            href={item.href}
            className="group inline-flex items-center gap-2.5 font-body text-[11px] uppercase tracking-[0.22em]
              text-brand-surface border-b border-brand-surface/30 pb-1.5
              hover:text-brand-accent hover:border-brand-accent transition-colors duration-300"
          >
            See it on the menu
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" strokeWidth={1.8} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function Disciplines() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const mm = gsap.matchMedia();

    // Desktop only. See the note at the top of this file.
    mm.add(
      {
        isDesktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      },
      (ctx) => {
        const { isDesktop } = ctx.conditions as { isDesktop: boolean };
        if (!isDesktop) return;

        const panels = gsap.utils.toArray<HTMLElement>("[data-panel]", track);
        const distance = () => track.scrollWidth - window.innerWidth;

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            // Scroll length equals the horizontal distance, so the mapping is
            // 1:1 and the pin never feels sticky or rushed.
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              if (progressRef.current) {
                progressRef.current.style.transform = `scaleX(${self.progress})`;
              }
            },
          },
        });

        void panels;

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
          gsap.set(track, { x: 0 });
        };
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-brand-base overflow-hidden">
      {/* Section label sits above the pin, so it stays put while panels move. */}
      <div className="absolute top-0 inset-x-0 z-20 px-5 sm:px-10 lg:px-16 pt-24 sm:pt-28 pointer-events-none">
        <div className="flex items-baseline justify-between gap-6">
          <p className="font-body text-[10px] uppercase tracking-[0.4em] text-brand-surface/55">
            What we cook
          </p>
          <p className="hidden md:block font-body text-[10px] uppercase tracking-[0.3em] text-brand-surface/35">
            Scroll →
          </p>
        </div>
      </div>

      {/*
        No `will-change` here, deliberately. This track is five viewports wide
        (~9600px on a 1080p screen), and promoting it to its own compositor
        layer means holding a texture that size in GPU memory for the whole
        page — which caused stutter rather than preventing it. GSAP's
        force3D already promotes it only while the tween is actually running.
      */}
      <div ref={trackRef} className="flex flex-col md:flex-row md:w-max">
        {disciplines.map((item, i) => (
          <Panel key={item.no} item={item} index={i} />
        ))}
      </div>

      {/* Horizontal progress, desktop only — the one piece of chrome that
          tells you how far the pinned run goes. */}
      <div className="hidden md:block absolute bottom-0 inset-x-0 h-px bg-brand-surface/15 z-20">
        <span
          ref={progressRef}
          className="block h-full w-full origin-left scale-x-0 bg-brand-accent"
        />
      </div>
    </section>
  );
}
