// src/components/sections/StoryTeaser.tsx
"use client";

import { img } from "@/data/images";
import { useEffect, useRef } from "react";
import SmartImage from "@/components/shared/SmartImage";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { routes, site } from "@/lib/site";
import { stagger, fadeUp, inView } from "@/lib/motion";
import SplitWords from "@/components/shared/SplitWords";

gsap.registerPlugin(ScrollTrigger);

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

        // Shallower on phones — the same travel over a short viewport reads
        // as a jolt rather than depth.
        const travel = isMobile ? 7 : 14;

        const tween = gsap.fromTo(
          image,
          { yPercent: -travel },
          {
            yPercent: travel,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.4,
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
    <section ref={sectionRef} className="relative w-full bg-brand-base py-16 sm:py-24 overflow-hidden">
      <div className="px-5 sm:px-8 lg:px-14 max-w-[1500px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-10 lg:gap-16 items-center">
          {/* Parallax image */}
          <div className="relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5] rounded-2xl overflow-hidden order-1 lg:order-none border border-brand-surface/10">
            <div ref={imageRef} className="absolute inset-0 -top-[16%] h-[132%] transform-gpu">
              <SmartImage
                src={img.charcoal}
                alt="The charcoal grill at work"
                fill
                sizes="(min-width: 1024px) 620px, 100vw"
                quality={75}
                loading="lazy"
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-linear-to-t from-brand-base/60 via-transparent to-transparent pointer-events-none" />
          </div>

          <div className="order-2">
            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={inView}
              className="font-body text-[10px] uppercase tracking-[0.3em] text-brand-accent mb-5"
            >
              Our story
            </motion.p>

            <motion.h2
              variants={stagger(0.07)}
              initial="hidden"
              whileInView="visible"
              viewport={inView}
              className="font-heading italic font-light text-[clamp(2rem,7vw,4rem)] leading-[1] tracking-tight text-brand-surface text-balance max-w-[13ch]"
            >
              <SplitWords text={HEADLINE} />
            </motion.h2>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={inView}
              className="mt-7 space-y-4 max-w-[48ch]"
            >
              <p className="font-body text-sm sm:text-base leading-relaxed text-brand-muted">
                The recipes did not change when they crossed continents. The nihari still
                goes on the night before. The karahi is still finished in the wok in front
                of you, not ladled from a pot made that morning.
              </p>
              <p className="font-body text-sm sm:text-base leading-relaxed text-brand-muted">
                What changed is the address — {site.address.line1}, a short walk from
                Norbury station, with the charcoal lit by mid-morning.
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={inView}
              className="mt-9"
            >
              <Link
                href={routes.heritage}
                className="group inline-flex items-center gap-3 rounded-full border border-brand-surface/25
                  px-7 h-12 font-body text-[11px] uppercase tracking-[0.2em] text-brand-surface
                  hover:border-brand-accent hover:text-brand-accent transition-colors duration-300"
              >
                Read our story
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
