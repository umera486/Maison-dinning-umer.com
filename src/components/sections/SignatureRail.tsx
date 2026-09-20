// src/components/sections/SignatureRail.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import SmartImage from "@/components/shared/SmartImage";
import { getSignatureDishes, formatPrice } from "@/lib/menu";
import { routes } from "@/lib/site";
import { fadeUp, inView, EASE_LAHORI } from "@/lib/motion";

/**
 * The kitchen's signatures, as an editorial index.
 *
 * Replaces a horizontal rail of rounded photo-cards. A card carousel is the
 * most template-looking component on a restaurant site: every item is the
 * same rounded rectangle, and the photography does all the work.
 *
 * Here the *type* does the work. Rows are hairline-separated, names are set
 * large, and the photograph is revealed in a single fixed frame as you move
 * down the list — one image on screen at a time, at size, rather than nine
 * thumbnails competing for attention.
 *
 * Mobile keeps a thumbnail per row instead: hover-to-reveal is meaningless on
 * touch, and a sticky image panel would eat the screen.
 */

export default function SignatureRail() {
  const dishes = getSignatureDishes().filter((d) => d.image);
  const [active, setActive] = useState(0);

  return (
    <section className="relative bg-brand-base py-20 sm:py-28 lg:py-36">
      <div className="px-5 sm:px-10 lg:px-16 max-w-[1600px] mx-auto">
        {/* Section head — monospace metadata rather than the gold uppercase
            label that was repeated in every other section. */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={inView}
          className="flex items-baseline justify-between gap-6 border-b border-brand-surface/15 pb-5 mb-12 sm:mb-16"
        >
          <h2 className="font-heading italic font-light text-[clamp(2rem,7vw,4.5rem)] leading-[0.95] tracking-[-0.02em] text-brand-surface">
            Signatures
          </h2>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-muted shrink-0 tabular-nums">
            {String(dishes.length).padStart(2, "0")} dishes
          </span>
        </motion.div>

        <div className="lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16 xl:gap-24">
          {/* ---------- Index ---------- */}
          <ul className="border-t border-brand-surface/12">
            {dishes.map((dish, i) => (
              <motion.li
                key={dish.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={inView}
                transition={{ duration: 0.55, ease: EASE_LAHORI, delay: Math.min(i * 0.05, 0.3) }}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="group border-b border-brand-surface/12"
              >
                <Link href={routes.menu} className="relative flex items-center gap-4 sm:gap-6 py-5 sm:py-6">
                  <span className="font-mono text-[10px] text-brand-muted tabular-nums shrink-0 w-6 pt-1.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Mobile thumbnail. Hidden on desktop, where the large
                      frame on the right does this job. */}
                  <span className="lg:hidden relative w-14 h-14 shrink-0 overflow-hidden">
                    <SmartImage
                      src={dish.image as string}
                      alt=""
                      label={dish.name}
                      fill
                      sizes="56px"
                      quality={60}
                      loading="lazy"
                      className="object-cover"
                    />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block font-heading italic font-light text-brand-surface
                      text-[clamp(1.3rem,4.5vw,2.5rem)] leading-[1.1] tracking-[-0.01em]
                      transition-colors duration-400 group-hover:text-brand-accent">
                      {dish.name}
                    </span>
                    {dish.description && (
                      <span className="hidden sm:block mt-1.5 font-body text-[12.5px] text-brand-muted line-clamp-1">
                        {dish.description}
                      </span>
                    )}
                  </span>

                  <span className="font-heading italic text-lg sm:text-2xl text-brand-accent tabular-nums shrink-0">
                    {formatPrice(dish)}
                  </span>
                </Link>
              </motion.li>
            ))}
          </ul>

          {/* ---------- Reveal frame (desktop) ---------- */}
          <div className="hidden lg:block">
            <div className="sticky top-28">
              <div className="relative aspect-4/5 overflow-hidden bg-brand-raise">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={dishes[active]?.id ?? "none"}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.55, ease: EASE_LAHORI }}
                    className="absolute inset-0 transform-gpu"
                  >
                    <SmartImage
                      src={dishes[active]?.image as string}
                      alt={dishes[active]?.name ?? ""}
                      label={dishes[active]?.name}
                      fill
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      quality={75}
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex items-baseline justify-between gap-4 pt-4 mt-4 border-t border-brand-surface/15">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-muted tabular-nums">
                  {String(active + 1).padStart(2, "0")} / {String(dishes.length).padStart(2, "0")}
                </span>
                <span className="font-body text-[11px] uppercase tracking-[0.16em] text-brand-surface/70 text-right">
                  {dishes[active]?.name}
                </span>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={inView}
          className="mt-12 sm:mt-16"
        >
          <Link
            href={routes.menu}
            className="group inline-flex items-baseline gap-4 font-heading italic
              text-2xl sm:text-4xl text-brand-surface hover:text-brand-accent transition-colors duration-300"
          >
            <span className="font-mono not-italic text-[10px] tracking-[0.2em] text-brand-accent">→</span>
            All 98 dishes
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
