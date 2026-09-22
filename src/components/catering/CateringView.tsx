// src/components/catering/CateringView.tsx
"use client";

import { img } from "@/data/images";
import { useEffect, useRef } from "react";
import SmartImage from "@/components/shared/SmartImage";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Phone, MessageCircle, Users, Flame, Clock } from "lucide-react";
import { getSharingDishes, formatPrice } from "@/lib/menu";
import { site, telHref, socials } from "@/lib/site";
import { stagger, fadeUp, inView, EASE_LAHORI } from "@/lib/motion";
import SplitWords from "@/components/shared/SplitWords";

gsap.registerPlugin(ScrollTrigger);

/**
 * Catering enquiry page. Replaces the old /private-dining, which invented a
 * fine-dining "12-hour nihari vigil" experience the kitchen does not sell.
 *
 * The flyer advertises catering, so this is a real service — but the owner has
 * not supplied catering prices. Rather than invent a per-head figure, the page
 * shows the real sharing dishes at their real menu prices and drives the
 * enquiry to a phone call, which is how this kitchen actually takes bookings.
 */

const HEADLINE = "Feed everyone.";

const occasions = [
  {
    icon: Users,
    title: "Family gatherings",
    body: "Eid, birthdays, the weekend everyone turns up at once. Platters sized for a full table rather than a plate.",
  },
  {
    icon: Flame,
    title: "Parties & events",
    body: "Live charcoal, whole chargha, mixed grills by the dozen. Trays of biryani that still steam when they land.",
  },
  {
    icon: Clock,
    title: "Ordered ahead",
    body: "The slow dishes — nihari, paye, haleem — need the night before. Give us notice and they'll be ready.",
  },
];

export default function CateringView() {
  const heroRef = useRef<HTMLElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const sharing = getSharingDishes();

  const whatsapp = socials.find((s) => s.id === "whatsapp" && s.confirmed);

  useEffect(() => {
    const section = heroRef.current;
    const image = heroImageRef.current;
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

        const travel = isMobile ? 8 : 18;
        const tween = gsap.fromTo(
          image,
          { yPercent: -travel },
          {
            yPercent: travel,
            ease: "none",
            scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: 0.4 },
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
    <div className="relative bg-brand-base">
      {/* ---------- Hero ---------- */}
      <section ref={heroRef} className="relative h-[78dvh] min-h-[480px] overflow-hidden">
        <div ref={heroImageRef} className="absolute inset-0 -top-[12%] h-[124%] transform-gpu">
          <SmartImage
            src={img.grill}
            alt="A mixed grill built for a table"
            fill
            sizes="100vw"
            quality={75}
            preload
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-scrim via-scrim/55 to-scrim/40" />

        <div className="absolute inset-0 flex flex-col justify-end px-5 sm:px-8 lg:px-14 pb-12 sm:pb-16">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_LAHORI }}
            className="font-body text-[10px] uppercase tracking-[0.34em] text-accent-on-image mb-5"
          >
            Catering · {site.branch}
          </motion.p>

          <motion.h1
            variants={stagger(0.08, 0.1)}
            initial="hidden"
            animate="visible"
            className="font-heading italic font-light text-[clamp(2.75rem,12vw,7rem)] leading-[0.94]
              tracking-tight text-on-image text-over-image text-balance max-w-[12ch]"
          >
            <SplitWords text={HEADLINE} />
          </motion.h1>
        </div>
      </section>

      {/* ---------- Occasions ---------- */}
      <section className="px-5 sm:px-8 lg:px-14 py-16 sm:py-24">
        <div className="max-w-[1500px] mx-auto">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={inView}
            className="font-body text-sm sm:text-base leading-relaxed text-brand-muted max-w-[52ch] mb-12 sm:mb-16"
          >
            The same kitchen, the same charcoal, scaled up. We cater across South London
            from the Norbury kitchen — tell us how many you&rsquo;re feeding and when, and
            we&rsquo;ll build it around the menu.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-brand-surface/10 border border-brand-surface/10 rounded-2xl overflow-hidden">
            {occasions.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={inView}
                  transition={{ duration: 0.6, ease: EASE_LAHORI, delay: i * 0.1 }}
                  className="bg-brand-base p-6 sm:p-8"
                >
                  <Icon className="w-6 h-6 text-brand-accent mb-5" strokeWidth={1.6} />
                  <h2 className="font-heading italic text-2xl text-brand-surface leading-tight mb-3">
                    {item.title}
                  </h2>
                  <p className="font-body text-[13px] leading-relaxed text-brand-muted">{item.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- Sharing dishes ---------- */}
      <section className="px-5 sm:px-8 lg:px-14 pb-16 sm:pb-24">
        <div className="max-w-[1500px] mx-auto">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={inView}
            className="font-heading italic font-light text-[clamp(1.85rem,6vw,3.25rem)] leading-tight text-brand-surface mb-3"
          >
            Where most orders start.
          </motion.h2>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={inView}
            className="font-body text-[13px] text-brand-muted mb-9 max-w-[48ch]"
          >
            Menu prices, for reference. Larger quantities are quoted on the phone.
          </motion.p>

          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {sharing.map((dish, i) => (
              <motion.li
                key={dish.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={inView}
                transition={{ duration: 0.55, ease: EASE_LAHORI, delay: Math.min(i * 0.07, 0.3) }}
                className="group relative rounded-2xl overflow-hidden border border-brand-surface/12 bg-brand-raise"
              >
                {dish.image && (
                  <div className="relative aspect-16/10 overflow-hidden">
                    <SmartImage
                      src={dish.image}
                      alt={dish.name}
                      fill
                      sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw"
                      quality={75}
                      loading="lazy"
                      className="object-cover transition-transform duration-[900ms] ease-lahori group-hover:scale-105 transform-gpu"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-brand-base/85 to-transparent" />
                  </div>
                )}

                <div className="p-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-heading italic text-xl text-brand-surface leading-tight">
                      {dish.name}
                    </h3>
                    <span className="font-heading italic text-lg text-brand-accent tabular-nums shrink-0">
                      {formatPrice(dish)}
                    </span>
                  </div>

                  {(dish.composition || dish.description) && (
                    <p className="mt-2 font-body text-[12px] leading-relaxed text-brand-muted">
                      {dish.composition ?? dish.description}
                    </p>
                  )}
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Enquiry ---------- */}
      <section className="px-5 sm:px-8 lg:px-14 pb-20 sm:pb-28">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={inView}
          className="max-w-[1500px] mx-auto rounded-2xl border border-brand-accent/25 bg-brand-accent/[0.06] p-7 sm:p-11"
        >
          <h2 className="font-heading italic font-light text-[clamp(1.85rem,6vw,3rem)] leading-tight text-brand-surface max-w-[16ch]">
            Tell us how many, and when.
          </h2>

          <p className="mt-4 font-body text-sm leading-relaxed text-brand-muted max-w-[46ch]">
            Catering is quoted per order — it depends on numbers, dishes and notice.
            One phone call and we&rsquo;ll have it costed for you.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-3">
            <a
              href={telHref}
              className="inline-flex items-center justify-center gap-2.5 h-14 px-8 rounded-full
                bg-brand-surface text-brand-base font-body text-[11px] uppercase tracking-[0.2em] font-semibold
                hover:bg-brand-accent transition-colors duration-300"
            >
              <Phone className="w-4 h-4" strokeWidth={2.5} />
              {site.phone.display}
            </a>

            {whatsapp && (
              <a
                href={whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 h-14 px-8 rounded-full
                  border border-brand-surface/25 font-body text-[11px] uppercase tracking-[0.2em]
                  text-brand-surface hover:border-brand-accent hover:text-brand-accent
                  transition-colors duration-300"
              >
                <MessageCircle className="w-4 h-4" strokeWidth={2} />
                Message on WhatsApp
              </a>
            )}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
