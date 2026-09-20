// src/components/heritage/HeritageView.tsx
"use client";

import { img } from "@/data/images";
import { useEffect, useRef } from "react";
import SmartImage from "@/components/shared/SmartImage";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { site, routes, telHref } from "@/lib/site";
import { stagger, fadeUp, inView, EASE_LAHORI } from "@/lib/motion";
import SplitWords from "@/components/shared/SplitWords";

gsap.registerPlugin(ScrollTrigger);

/**
 * Our Story.
 *
 * NEEDS-CONFIRMATION: the owner has not supplied the restaurant's own family
 * history, so nothing here claims one. The old page invented dated milestones
 * ("1947 The Walled City", "1962 Akbari Mandi") for a real business, which is
 * a fabricated biography sitting on a live site.
 *
 * Instead these chapters describe the heritage of the *food* — which is
 * genuine, checkable culinary history — and each one links to the real dishes
 * on the menu that carry it. When the owner sends the family story, it should
 * be added as an opening chapter rather than replacing these.
 */

const HEADLINE = "The food came first.";

interface Chapter {
  no: string;
  title: string;
  body: string[];
  image: string;
  alt: string;
  linkLabel: string;
  href: string;
}

const chapters: Chapter[] = [
  {
    no: "01",
    title: "Cooked on the street, not for it",
    body: [
      "Lahori food grew up outdoors — in the lanes of the walled city, where a cook did one thing and did it for thirty years. A tawa. A karahi. A tandoor. No menu, no courses, no explanation.",
      "That is the discipline the kitchen keeps: a short list of dishes, each cooked by someone who has made it ten thousand times.",
    ],
    image: img.tawa,
    alt: "A cast-iron tawa at full heat",
    linkLabel: "Lahori Dynamite & street food",
    href: `${routes.menu}#lahori-dynamite`,
  },
  {
    no: "02",
    title: "The pot that starts the night before",
    body: [
      "Nihari is not a dish you decide to make at lunchtime. Shank goes into the pot as the kitchen closes, over a low flame, and stays there until the collagen gives up and the gravy turns near-black.",
      "Paye and haleem work the same way — slow, patient, unhurried. You cannot rush them, and there is no shortcut that tastes the same.",
    ],
    image: img.curry,
    alt: "Nihari, finished with ginger and green chilli",
    linkLabel: "Nihari, paye & haleem",
    href: `${routes.menu}#specials`,
  },
  {
    no: "03",
    title: "Live fire, every order",
    body: [
      "Charcoal is harder than gas. It is inconsistent, it needs watching, and it takes someone standing over it. It is also the only thing that puts that particular char on a seekh kabab or a lamb chop.",
      "Karahi is the same argument in a wok — finished to order, tomato and ginger and crushed pepper, never ladled out of something made that morning.",
    ],
    image: img.grill,
    alt: "Skewers over live charcoal",
    linkLabel: "The charcoal grill",
    href: `${routes.menu}#starters-non-veg`,
  },
  {
    no: "04",
    title: "Breakfast is a serious meal",
    body: [
      "In Lahore, nashta is not toast. It is halwa puri on a Sunday, paratha and eggs, a bowl of choolay — eaten early, eaten properly, and eaten with everyone.",
      "It travelled to London intact, which is why it is on the menu at all.",
    ],
    image: img.spread,
    alt: "Halwa puri laid out for breakfast",
    linkLabel: "Lahori nashta",
    href: `${routes.menu}#nashta`,
  },
];

function ChapterBlock({ chapter, index }: { chapter: Chapter; index: number }) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const flipped = index % 2 === 1;

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    if (!section || !image) return;

    const mm = gsap.matchMedia();

    mm.add(
      { isMobile: "(max-width: 767px)", reduceMotion: "(prefers-reduced-motion: reduce)" },
      (ctx) => {
        const { isMobile, reduceMotion } = ctx.conditions as {
          isMobile: boolean;
          reduceMotion: boolean;
        };
        if (reduceMotion) return;

        const travel = isMobile ? 7 : 14;
        const tween = gsap.fromTo(
          image,
          { yPercent: -travel },
          {
            yPercent: travel,
            ease: "none",
            scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 0.4 },
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
    <section ref={sectionRef} className="px-5 sm:px-8 lg:px-14 py-12 sm:py-20">
      <div className="max-w-[1500px] mx-auto">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
            flipped ? "lg:[&>*:first-child]:order-2" : ""
          }`}
        >
          <div className="relative aspect-4/3 sm:aspect-16/11 lg:aspect-4/5 rounded-2xl overflow-hidden border border-brand-surface/10">
            <div ref={imageRef} className="absolute inset-0 -top-[14%] h-[128%] transform-gpu">
              <SmartImage
                src={chapter.image}
                alt={chapter.alt}
                fill
                sizes="(min-width: 1024px) 620px, 100vw"
                quality={75}
                loading="lazy"
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-linear-to-t from-brand-base/55 to-transparent pointer-events-none" />
          </div>

          <div>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={inView}
              className="flex items-center gap-3 mb-5"
            >
              <span className="font-body text-[10px] font-semibold tracking-[0.28em] text-brand-accent tabular-nums">
                {chapter.no}
              </span>
              <span className="h-px w-10 bg-brand-accent/45" />
            </motion.div>

            <motion.h2
              variants={stagger(0.06)}
              initial="hidden"
              whileInView="visible"
              viewport={inView}
              className="font-heading italic font-light text-[clamp(1.85rem,6vw,3.25rem)] leading-[1.05] tracking-tight text-brand-surface text-balance max-w-[16ch]"
            >
              <SplitWords text={chapter.title} />
            </motion.h2>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={inView}
              className="mt-6 space-y-4 max-w-[50ch]"
            >
              {chapter.body.map((para) => (
                <p key={para.slice(0, 32)} className="font-body text-sm sm:text-base leading-relaxed text-brand-muted">
                  {para}
                </p>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={inView} className="mt-8">
              <Link
                href={chapter.href}
                className="group inline-flex items-center gap-2.5 rounded-full border border-brand-surface/25
                  px-6 h-12 font-body text-[10px] uppercase tracking-[0.2em] text-brand-surface
                  hover:border-brand-accent hover:text-brand-accent transition-colors duration-300"
              >
                {chapter.linkLabel}
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HeritageView() {
  const heroRef = useRef<HTMLElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = heroRef.current;
    const image = heroImageRef.current;
    if (!section || !image) return;

    const mm = gsap.matchMedia();
    mm.add({ reduceMotion: "(prefers-reduced-motion: reduce)" }, (ctx) => {
      const { reduceMotion } = ctx.conditions as { reduceMotion: boolean };
      if (reduceMotion) return;

      const tween = gsap.to(image, {
        yPercent: 14,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: 0.4 },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <div className="relative bg-brand-base">
      {/* ---------- Hero ---------- */}
      <section ref={heroRef} className="relative h-[82dvh] min-h-[500px] overflow-hidden">
        <div ref={heroImageRef} className="absolute inset-0 -top-[10%] h-[120%] transform-gpu">
          <SmartImage
            src={img.charcoal}
            alt="The tandoor at working heat"
            fill
            sizes="100vw"
            quality={75}
            preload
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-brand-base via-brand-base/60 to-brand-base/45" />

        <div className="absolute inset-0 flex flex-col justify-end px-5 sm:px-8 lg:px-14 pb-12 sm:pb-16">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_LAHORI }}
            className="font-body text-[10px] uppercase tracking-[0.34em] text-brand-accent mb-5"
          >
            Our story · {site.strapline}
          </motion.p>

          <motion.h1
            variants={stagger(0.08, 0.1)}
            initial="hidden"
            animate="visible"
            className="font-heading italic font-light text-[clamp(2.75rem,12vw,7rem)] leading-[0.94]
              tracking-tight text-brand-surface text-over-image text-balance max-w-[13ch]"
          >
            <SplitWords text={HEADLINE} />
          </motion.h1>
        </div>
      </section>

      {/* ---------- Intro ---------- */}
      <section className="px-5 sm:px-8 lg:px-14 pt-16 sm:pt-24">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={inView}
          className="max-w-[1500px] mx-auto font-heading italic font-light text-[clamp(1.35rem,3.6vw,2.15rem)] leading-[1.35] text-brand-surface/90 text-balance max-w-[26ch] sm:max-w-[34ch]"
        >
          Nothing about the cooking changed when it crossed continents. Only the address did.
        </motion.p>
      </section>

      {/* ---------- Chapters ---------- */}
      {chapters.map((chapter, i) => (
        <ChapterBlock key={chapter.no} chapter={chapter} index={i} />
      ))}

      {/* ---------- Halal + close ---------- */}
      <section className="px-5 sm:px-8 lg:px-14 py-16 sm:py-24">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={inView}
          className="max-w-[1500px] mx-auto rounded-2xl border border-brand-green-light/25 bg-brand-green/10 p-7 sm:p-11"
        >
          <ShieldCheck className="w-8 h-8 text-brand-green-light mb-5" strokeWidth={1.5} />

          <h2 className="font-heading italic font-light text-[clamp(1.75rem,5.5vw,2.75rem)] leading-tight text-brand-surface max-w-[18ch]">
            {site.halal.body} certified, not self-declared.
          </h2>

          <p className="mt-4 font-body text-sm leading-relaxed text-brand-muted max-w-[48ch]">
            The kitchen is monitored by the {site.halal.bodyFull} — an independent body
            that inspects the supply chain rather than taking the restaurant&rsquo;s word
            for it.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-3">
            <Link
              href={routes.menu}
              className="inline-flex items-center justify-center gap-2.5 h-14 px-8 rounded-full
                bg-brand-surface text-brand-base font-body text-[11px] uppercase tracking-[0.2em] font-semibold
                hover:bg-brand-accent transition-colors duration-300"
            >
              Read the menu
            </Link>

            <a
              href={telHref}
              className="inline-flex items-center justify-center gap-2.5 h-14 px-8 rounded-full
                border border-brand-surface/25 font-body text-[11px] uppercase tracking-[0.2em]
                text-brand-surface hover:border-brand-accent hover:text-brand-accent
                transition-colors duration-300"
            >
              Call {site.phone.display}
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
