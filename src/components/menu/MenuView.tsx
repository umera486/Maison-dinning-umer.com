// src/components/menu/MenuView.tsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SmartImage from "@/components/shared/SmartImage";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flame, Leaf, Users, Sunrise, Star } from "lucide-react";
import {
  getCategories,
  getDishCount,
  getLowestPrice,
  formatPrice,
  type Dish,
  type MenuCategory,
  type DishTag,
} from "@/lib/menu";
import { site, telHref } from "@/lib/site";
import { EASE_LAHORI, stagger } from "@/lib/motion";
import SplitWords from "@/components/shared/SplitWords";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ *
 * Dish tags
 * ------------------------------------------------------------------ */

const TAG_META: Record<DishTag, { label: string; icon: typeof Flame; tone: string }> = {
  veg: { label: "Vegetarian", icon: Leaf, tone: "text-brand-green-light border-brand-green-light/30" },
  spicy: { label: "Spicy", icon: Flame, tone: "text-orange-300 border-orange-300/30" },
  sharing: { label: "To share", icon: Users, tone: "text-brand-surface/70 border-brand-surface/20" },
  breakfast: { label: "Nashta", icon: Sunrise, tone: "text-brand-surface/70 border-brand-surface/20" },
  signature: { label: "Signature", icon: Star, tone: "text-brand-accent border-brand-accent/35" },
};

function TagPips({ tags }: { tags?: DishTag[] }) {
  if (!tags?.length) return null;
  return (
    <span className="inline-flex items-center gap-1.5 shrink-0">
      {tags.map((tag) => {
        const meta = TAG_META[tag];
        const Icon = meta.icon;
        return (
          <span
            key={tag}
            title={meta.label}
            className={`inline-flex items-center justify-center w-[18px] h-[18px] rounded-full border ${meta.tone}`}
          >
            <Icon className="w-2.5 h-2.5" strokeWidth={2} aria-hidden />
            <span className="sr-only">{meta.label}</span>
          </span>
        );
      })}
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * Dish row
 *
 * Rows, not cards. 98 flip cards would mean 98 perspective contexts and
 * 98 transform layers — the single biggest frame-rate risk on this page.
 * A row is one flex container and reads like an actual menu.
 * ------------------------------------------------------------------ */

/**
 * Row reveal is driven by a variant inherited from the category's <ul>, not by
 * its own `whileInView`.
 *
 * Every `whileInView` creates an IntersectionObserver. With 98 dishes that was
 * 98 observers plus 98 independently-scheduled transitions on one page, all
 * registered during mount. Inheriting from one parent variant means one
 * observer per category — 15 instead of 98 — and the stagger is handled by the
 * parent for free.
 */
const rowVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_LAHORI } },
};

function DishRow({ dish }: { dish: Dish }) {
  return (
    <motion.li
      variants={rowVariants}
      className="group relative border-b border-brand-surface/[0.09] last:border-b-0"
    >
      <div className="flex items-baseline gap-3 py-4 sm:py-[18px]">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-heading text-[17px] sm:text-xl text-brand-surface leading-snug transition-colors duration-300 group-hover:text-brand-accent">
              {dish.name}
            </h3>
            <TagPips tags={dish.tags} />
          </div>

          {dish.description && (
            <p className="mt-1 font-body text-[12.5px] sm:text-[13px] leading-relaxed text-brand-muted max-w-[52ch]">
              {dish.description}
            </p>
          )}

          {dish.composition && (
            <p className="mt-1.5 font-body text-[11px] leading-relaxed text-brand-surface/45 max-w-[52ch]">
              {dish.composition}
            </p>
          )}

          {dish.priceNote && dish.price !== null && (
            <p className="mt-1 font-body text-[10.5px] uppercase tracking-[0.14em] text-brand-surface/40">
              {dish.priceNote}
            </p>
          )}
        </div>

        {/* Leader line. Hidden on small screens where there isn't room for it
            to read as anything but noise. */}
        <span
          aria-hidden
          className="hidden sm:block flex-1 min-w-6 translate-y-[-4px] border-b border-dotted border-brand-surface/20"
        />

        <span className="font-heading italic text-lg sm:text-xl text-brand-accent whitespace-nowrap shrink-0 tabular-nums">
          {formatPrice(dish)}
        </span>
      </div>
    </motion.li>
  );
}

/* ------------------------------------------------------------------ *
 * Category section
 * ------------------------------------------------------------------ */

function CategorySection({
  category,
  index,
  registerSection,
}: {
  category: MenuCategory;
  index: number;
  registerSection: (id: string, el: HTMLElement | null) => void;
}) {
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = imageWrapRef.current;
    const img = imageRef.current;
    if (!wrap || !img) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        isMobile: "(max-width: 767px)",
        isDesktop: "(min-width: 768px)",
        reduceMotion: "(prefers-reduced-motion: reduce)",
      },
      (ctx) => {
        const { isMobile, reduceMotion } = ctx.conditions as {
          isMobile: boolean;
          isDesktop: boolean;
          reduceMotion: boolean;
        };
        if (reduceMotion) return;

        // Shallower travel on phones: the same displacement over a shorter
        // viewport reads as a jolt, and costs more relative to the frame.
        const travel = isMobile ? 8 : 16;

        const tween = gsap.fromTo(
          img,
          { yPercent: -travel },
          {
            yPercent: travel,
            ease: "none",
            scrollTrigger: {
              trigger: wrap,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.4,
              // ScrollTrigger only runs work for triggers in range, so this
              // costs nothing while the section is far off screen.
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
      id={category.id}
      ref={(el) => registerSection(category.id, el)}
      // Sticky rail is ~56px; this keeps anchored headings clear of it.
      className="scroll-mt-[124px] sm:scroll-mt-[136px]"
      aria-labelledby={`${category.id}-heading`}
    >
      {/* Parallax band */}
      <div
        ref={imageWrapRef}
        className="relative h-[168px] sm:h-[230px] lg:h-[280px] overflow-hidden rounded-2xl"
      >
        <div ref={imageRef} className="absolute inset-0 -top-[18%] h-[136%] transform-gpu">
          <SmartImage
            src={category.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 900px, 100vw"
            quality={75}
            // `preload` replaces the deprecated `priority` prop in Next.js 16.
            preload={index === 0}
            loading={index === 0 ? undefined : "lazy"}
            className="object-cover"
          />
        </div>

        {/* Scrim. Fixed gradient, not an animated filter — keeps the heading
            legible over any photograph without costing a frame. */}
        <div className="absolute inset-0 bg-linear-to-t from-brand-base via-brand-base/55 to-brand-base/20" />

        <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-7">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-body text-[10px] font-semibold tracking-[0.28em] text-brand-accent">
              {category.number}
            </span>
            <span className="h-px w-8 bg-brand-accent/45" />
            <span className="font-body text-[10px] uppercase tracking-[0.2em] text-brand-surface/60">
              {category.items.length} {category.items.length === 1 ? "dish" : "dishes"}
            </span>
          </div>

          <h2
            id={`${category.id}-heading`}
            className="font-heading italic font-light text-[clamp(1.85rem,6.5vw,3.25rem)] leading-[1.05] text-brand-surface text-over-image text-balance"
          >
            {category.name}
          </h2>
        </div>
      </div>

      <p className="mt-4 sm:mt-5 font-body text-[13px] sm:text-sm leading-relaxed text-brand-muted max-w-[58ch]">
        {category.blurb}
      </p>

      {category.note && (
        <p className="mt-3 inline-block rounded-lg border border-brand-accent/25 bg-brand-accent/[0.07] px-3.5 py-2 font-body text-[11px] leading-relaxed tracking-[0.06em] text-brand-accent/90">
          {category.note}
        </p>
      )}

      <motion.ul
        variants={stagger(0.03)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
        className="mt-2 sm:mt-3"
      >
        {category.items.map((dish) => (
          <DishRow key={dish.id} dish={dish} />
        ))}
      </motion.ul>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Sticky category rail — horizontally scrollable on mobile
 * ------------------------------------------------------------------ */

function CategoryRail({
  categories,
  activeId,
}: {
  categories: MenuCategory[];
  activeId: string;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());

  // Keep the active pill in view as the reader scrolls through sections.
  // `nearest` avoids yanking the rail when the pill is already visible.
  useEffect(() => {
    const pill = pillRefs.current.get(activeId);
    const rail = railRef.current;
    if (!pill || !rail) return;

    const railBox = rail.getBoundingClientRect();
    const pillBox = pill.getBoundingClientRect();
    if (pillBox.left < railBox.left + 8 || pillBox.right > railBox.right - 8) {
      rail.scrollTo({
        left: pill.offsetLeft - rail.clientWidth / 2 + pill.clientWidth / 2,
        behavior: "smooth",
      });
    }
  }, [activeId]);

  return (
    <div className="sticky top-14 sm:top-16 lg:top-20 z-40 -mx-5 sm:-mx-8 lg:mx-0 bg-brand-base/95 border-b border-brand-surface/10 lg:border-0 lg:bg-transparent">
      <div
        ref={railRef}
        // `data-lenis-prevent` stops Lenis from hijacking this horizontal
        // scroller and dragging the whole page sideways on touch.
        data-lenis-prevent
        className="flex gap-2 overflow-x-auto px-5 sm:px-8 lg:px-0 py-3
          [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
          lg:flex-col lg:overflow-visible lg:py-0 lg:gap-1"
      >
        {categories.map((cat) => {
          const isActive = cat.id === activeId;
          return (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              ref={(el) => {
                if (el) pillRefs.current.set(cat.id, el);
                else pillRefs.current.delete(cat.id);
              }}
              aria-current={isActive ? "true" : undefined}
              className={`group relative shrink-0 rounded-full border px-4 h-9 flex items-center gap-2
                font-body text-[11px] uppercase tracking-[0.14em] whitespace-nowrap
                transition-colors duration-300 lg:w-full lg:justify-start lg:rounded-lg lg:h-auto lg:py-2.5 ${
                  isActive
                    ? "border-brand-accent/60 bg-brand-accent/15 text-brand-accent"
                    : "border-brand-surface/15 text-brand-surface/65 hover:text-brand-surface hover:border-brand-surface/30"
                }`}
            >
              <span className="font-mono text-[9px] opacity-70">{cat.number}</span>
              {cat.name}
            </a>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Page
 * ------------------------------------------------------------------ */

export default function MenuView() {
  const categories = useMemo(() => getCategories(), []);
  const [activeId, setActiveId] = useState(categories[0]?.id ?? "");
  const sections = useRef<Map<string, HTMLElement>>(new Map());
  const reduceMotion = useReducedMotion() ?? false;

  const registerSection = useCallback((id: string, el: HTMLElement | null) => {
    if (el) sections.current.set(id, el);
    else sections.current.delete(id);
  }, []);

  /**
   * Scroll-spy via IntersectionObserver rather than a scroll handler — the
   * browser does the geometry off the main thread, so this stays free no
   * matter how long the page gets.
   *
   * The negative bottom margin shrinks the observation band to the top strip
   * of the viewport, just under the sticky rail, so "active" means "the
   * heading you're reading" rather than "anything visible".
   */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-140px 0px -70% 0px", threshold: 0 }
    );

    const observed = Array.from(sections.current.values());
    observed.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [categories]);

  // ScrollTrigger measures the document before fonts and images settle; one
  // refresh after load stops every parallax band being offset.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    if (document.readyState === "complete") {
      refresh();
    } else {
      window.addEventListener("load", refresh);
      return () => window.removeEventListener("load", refresh);
    }
  }, []);

  const dishCount = getDishCount();
  const lowest = getLowestPrice();
  const headline = "Everything we cook.";

  return (
    <div className="relative bg-brand-base">
      {/* ---------- Hero ---------- */}
      <header className="relative px-5 sm:px-8 lg:px-14 pt-28 sm:pt-36 lg:pt-44 pb-10 sm:pb-14">
        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_LAHORI }}
          className="font-body text-[10px] sm:text-[11px] uppercase tracking-[0.34em] text-brand-accent mb-5"
        >
          {site.branch} · {site.tagline}
        </motion.p>

        {/* Motion typography: each word rises from behind its own mask. */}
        <motion.h1
          variants={stagger(0.08, 0.1)}
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          className="font-heading italic font-light text-[clamp(3rem,13vw,8rem)] leading-[0.92] tracking-tight text-brand-surface text-balance max-w-[16ch]"
        >
          <SplitWords text={headline} />
        </motion.h1>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_LAHORI, delay: 0.55 }}
          className="mt-7 sm:mt-9 flex flex-wrap items-center gap-x-6 gap-y-3"
        >
          <span className="font-body text-xs sm:text-sm text-brand-muted tracking-[0.05em]">
            <span className="text-brand-surface tabular-nums">{dishCount}</span> dishes ·{" "}
            <span className="text-brand-surface tabular-nums">{categories.length}</span> sections ·
            from <span className="text-brand-accent tabular-nums">£{lowest.toFixed(2)}</span>
          </span>

          <a
            href={telHref}
            className="inline-flex items-center gap-2 rounded-full border border-brand-accent/45 bg-brand-accent/10
              px-5 h-10 font-body text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-accent
              hover:bg-brand-accent hover:text-brand-base transition-colors duration-300"
          >
            Call to order · {site.phone.display}
          </a>
        </motion.div>
      </header>

      {/* ---------- Rail + sections ---------- */}
      <div className="px-5 sm:px-8 lg:px-14 pb-24 sm:pb-32">
        <div className="lg:grid lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-12 xl:gap-16 max-w-[1400px] mx-auto">
          <aside className="lg:sticky lg:top-28 lg:self-start lg:max-h-[calc(100dvh-9rem)] lg:overflow-y-auto lg:pr-2">
            <CategoryRail categories={categories} activeId={activeId} />
          </aside>

          <div className="space-y-16 sm:space-y-24 pt-8 lg:pt-0">
            {categories.map((cat, i) => (
              <CategorySection
                key={cat.id}
                category={cat}
                index={i}
                registerSection={registerSection}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
