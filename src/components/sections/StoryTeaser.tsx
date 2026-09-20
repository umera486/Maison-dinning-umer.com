// src/components/sections/StoryTeaser.tsx
"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SmartImage from "@/components/shared/SmartImage";
import { img } from "@/data/images";
import { routes, site } from "@/lib/site";
import { stagger, fadeUp, inView } from "@/lib/motion";
import SplitWords from "@/components/shared/SplitWords";

gsap.registerPlugin(ScrollTrigger);

/**
 * Our story, as an editorial spread.
 *
 * Was a two-column grid with a rounded, bordered image beside a paragraph —
 * the default "content section" shape that appears on every template. Now the
 * image runs full-bleed and the headline breaks out over its bottom edge, so
 * the two layers overlap instead of sitting politely side by side. Body copy
 * drops into a narrow offset column beneath.
 *
 * Structure rather than decoration: hairline rules, monospace metadata, and
 * no rounded corners anywhere.
 */

const HEADLINE = "Lahore, cooked in Norbury.";

export default function StoryTeaser() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

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

        // Shallower on phones — the same travel across a short viewport reads
        // as a jolt rather than depth.
        const travel = isMobile ? 6 : 12;

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
    <section ref={sectionRef} className="relative bg-brand-base overflow-hidden">
      {/* Full-bleed band */}
      <div className="relative h-[58vh] sm:h-[70vh] lg:h-[82vh] overflow-hidden">
        <div ref={imageRef} className="absolute inset-0 -top-[12%] h-[124%] transform-gpu">
          <SmartImage
            src={img.charcoal}
            alt="The charcoal grill at work"
            label="The charcoal grill"
            fill
            sizes="100vw"
            quality={75}
            loading="lazy"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-brand-base/35" />
        <div className="absolute inset-0 bg-linear-to-t from-brand-base via-transparent to-transparent" />

        <div className="absolute top-0 inset-x-0 px-5 sm:px-10 lg:px-16 pt-10 sm:pt-14">
          <div className="max-w-[1600px] mx-auto flex items-baseline justify-between gap-6 border-b border-brand-surface/20 pb-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-brand-surface/70">
              Our story
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-brand-surface/45">
              Est. {site.branch}
            </span>
          </div>
        </div>
      </div>

      {/* Headline breaks out over the image's bottom edge. */}
      <div className="relative z-10 px-5 sm:px-10 lg:px-16 -mt-[10vh] sm:-mt-[13vh] lg:-mt-[16vh]">
        <div className="max-w-[1600px] mx-auto">
          <motion.h2
            variants={stagger(0.07)}
            initial="hidden"
            whileInView="visible"
            viewport={inView}
            className="font-heading italic font-light text-brand-surface text-over-image
              text-[clamp(2.25rem,9vw,7rem)] leading-[0.92] tracking-[-0.03em] text-balance max-w-[13ch]"
          >
            <SplitWords text={HEADLINE} />
          </motion.h2>

          {/* Offset body column — asymmetric rather than centred. */}
          <div className="mt-12 sm:mt-20 grid grid-cols-1 lg:grid-cols-12 gap-8">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={inView}
              className="lg:col-span-5 lg:col-start-6 space-y-6"
            >
              <p className="font-body text-base sm:text-lg leading-relaxed text-brand-surface/85">
                The recipes did not change when they crossed continents. The nihari still
                goes on the night before. The karahi is still finished in the wok in front
                of you, not ladled from a pot made that morning.
              </p>
              <p className="font-body text-base sm:text-lg leading-relaxed text-brand-muted">
                What changed is the address — {site.address.line1}, a short walk from
                Norbury station, with the charcoal lit by mid-morning.
              </p>

              <Link
                href={routes.heritage}
                className="group inline-flex items-baseline gap-4 pt-2 font-heading italic
                  text-2xl sm:text-3xl text-brand-surface hover:text-brand-accent transition-colors duration-300"
              >
                <span className="font-mono not-italic text-[10px] tracking-[0.2em] text-brand-accent">→</span>
                Read our story
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
