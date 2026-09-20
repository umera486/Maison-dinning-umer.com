// src/components/sections/SignatureRail.tsx
"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getSignatureDishes, formatPrice } from "@/lib/menu";
import { routes } from "@/lib/site";
import { fadeUp, inView, EASE_LAHORI } from "@/lib/motion";

/**
 * The kitchen's signatures, as a horizontal rail.
 *
 * Deliberately a different interaction from /menu (which is vertical
 * typographic rows) so the two never feel like the same section twice — the
 * failure mode of the old homepage, where three consecutive sections were all
 * the same flip card and Mutton Karahi appeared in all three.
 *
 * Scrolling is native CSS scroll-snap: no scroll listener, no JS per frame,
 * and momentum behaves correctly on iOS. The arrows are a desktop affordance
 * layered on top, not the mechanism.
 */

export default function SignatureRail() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  // Only signatures we actually have a photograph for — a card with a missing
  // image is worse than one fewer card.
  const dishes = getSignatureDishes().filter((d) => d.image);

  const updateEdges = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateEdges();
  }, [updateEdges]);

  const nudge = useCallback((direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    // Advance by roughly one card plus its gap.
    const step = Math.min(el.clientWidth * 0.8, 340);
    el.scrollBy({ left: step * direction, behavior: "smooth" });
  }, []);

  return (
    <section className="relative w-full bg-brand-base py-16 sm:py-24 overflow-hidden">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={inView}
        className="px-5 sm:px-8 lg:px-14 mb-8 sm:mb-11"
      >
        <div className="flex items-end justify-between gap-6 max-w-[1500px] mx-auto">
          <div>
            <p className="font-body text-[10px] uppercase tracking-[0.3em] text-brand-accent mb-3">
              What people come back for
            </p>
            <h2 className="font-heading italic font-light text-[clamp(2rem,7vw,3.75rem)] leading-[1.02] text-brand-surface text-balance max-w-[14ch]">
              The ones we&rsquo;re known for.
            </h2>
          </div>

          {/* Arrows are supplementary — the rail is fully usable by swipe and
              keyboard without them, so they're hidden where they'd crowd. */}
          <div className="hidden md:flex items-center gap-2 shrink-0 pb-2">
            <button
              onClick={() => nudge(-1)}
              disabled={atStart}
              aria-label="Previous dishes"
              className="w-11 h-11 rounded-full border border-brand-surface/20 flex items-center justify-center
                text-brand-surface/80 hover:text-brand-accent hover:border-brand-accent/45
                disabled:opacity-25 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={1.8} />
            </button>
            <button
              onClick={() => nudge(1)}
              disabled={atEnd}
              aria-label="More dishes"
              className="w-11 h-11 rounded-full border border-brand-surface/20 flex items-center justify-center
                text-brand-surface/80 hover:text-brand-accent hover:border-brand-accent/45
                disabled:opacity-25 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </motion.div>

      <div
        ref={scrollerRef}
        onScroll={updateEdges}
        // Lenis would otherwise capture this gesture and scroll the page.
        data-lenis-prevent
        className="flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory
          px-5 sm:px-8 lg:px-14 pb-4
          [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {dishes.map((dish, i) => (
          <motion.article
            key={dish.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, ease: EASE_LAHORI, delay: Math.min(i * 0.05, 0.3) }}
            className="group relative shrink-0 snap-start
              w-[74vw] xs:w-[68vw] sm:w-[320px] lg:w-[360px]
              aspect-[3/4] rounded-2xl overflow-hidden bg-brand-raise border border-brand-surface/10"
          >
            <Image
              src={dish.image as string}
              alt={dish.name}
              fill
              sizes="(min-width: 1024px) 360px, (min-width: 640px) 320px, 74vw"
              quality={75}
              preload={i === 0}
              loading={i === 0 ? undefined : "lazy"}
              className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]
                group-hover:scale-[1.06] transform-gpu"
            />

            {/* Static gradient rather than an animated filter — legibility
                without a per-frame cost. */}
            <div className="absolute inset-0 bg-linear-to-t from-brand-base via-brand-base/35 to-transparent" />

            <div className="absolute inset-0 flex flex-col justify-end p-5">
              <h3 className="font-heading italic font-light text-2xl sm:text-[26px] leading-tight text-brand-surface text-over-image">
                {dish.name}
              </h3>

              {dish.description && (
                <p className="mt-1.5 font-body text-[12px] leading-relaxed text-brand-surface/70 line-clamp-2">
                  {dish.description}
                </p>
              )}

              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="font-heading italic text-xl text-brand-accent tabular-nums">
                  {formatPrice(dish)}
                </span>
                {dish.priceNote && (
                  <span className="font-body text-[9.5px] uppercase tracking-[0.14em] text-brand-surface/50 text-right">
                    {dish.priceNote}
                  </span>
                )}
              </div>
            </div>
          </motion.article>
        ))}

        {/* Terminal card: turns the end of the rail into a route to the menu
            instead of a dead stop. */}
        <Link
          href={routes.menu}
          className="group shrink-0 snap-start w-[58vw] sm:w-[240px] aspect-[3/4] rounded-2xl
            border border-brand-accent/30 bg-brand-accent/[0.06] flex flex-col items-center justify-center gap-4
            text-brand-accent hover:bg-brand-accent hover:text-brand-base transition-colors duration-400"
        >
          <span className="font-heading italic text-2xl text-center px-5 leading-tight">
            See all
            <br />
            the dishes
          </span>
          <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5" strokeWidth={1.6} />
        </Link>
      </div>
    </section>
  );
}
