// src/components/layout/Footer.tsx
"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { MapPin, Phone, ArrowUpRight, ShieldCheck, Car, Clock, ChevronUp } from "lucide-react";
import {
  site,
  socials,
  deliveryPartners,
  navLinks,
  telHref,
  mapsHref,
  isPlaceholder,
  getOpenState,
  hoursConfirmed,
} from "@/lib/site";
import { socialIcons } from "@/components/shared/SocialIcons";
import { EASE_LAHORI, fadeUp, inView as inViewConfig } from "@/lib/motion";

/**
 * The marquee only animates while it is on screen. An `Infinity` transform
 * loop running below the fold still occupies a compositor layer and wakes the
 * animation frame on every tick — across a long page that is measurable on a
 * phone. Gating it costs one IntersectionObserver.
 */
function Ribbon() {
  const ref = useRef<HTMLDivElement>(null);
  const isNear = useInView(ref, { margin: "200px 0px 200px 0px" });
  const reduceMotion = useReducedMotion() ?? false;
  const shouldRun = isNear && !reduceMotion;

  const phrases = [
    site.disciplines.join(" · "),
    `${site.halal.body} Certified Halal`,
    site.parking,
  ];

  return (
    <div
      ref={ref}
      className="relative bg-brand-accent py-4 md:py-5 border-y-4 border-brand-base overflow-hidden -skew-y-[1deg] z-30"
    >
      <div className="absolute inset-y-0 left-0 w-16 sm:w-28 bg-linear-to-r from-brand-base to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 sm:w-28 bg-linear-to-l from-brand-base to-transparent z-20 pointer-events-none" />

      <motion.div
        animate={shouldRun ? { x: ["0%", "-50%"] } : { x: "0%" }}
        transition={
          shouldRun ? { duration: 26, repeat: Infinity, ease: "linear" } : { duration: 0 }
        }
        className="flex whitespace-nowrap items-center w-max transform-gpu"
        aria-hidden
      >
        {/* Two identical halves: the loop resets at -50%, which lands exactly
            on the start of the second half, so the seam is invisible. */}
        {[0, 1].map((half) => (
          <div key={half} className="flex items-center">
            {[0, 1, 2].map((rep) =>
              phrases.map((phrase) => (
                <span key={`${half}-${rep}-${phrase}`} className="flex items-center">
                  <span className="font-heading italic text-xl sm:text-3xl md:text-4xl font-light text-brand-base uppercase tracking-wide px-5 sm:px-8">
                    {phrase}
                  </span>
                  <span className="text-brand-green text-base sm:text-lg" aria-hidden>
                    ✦
                  </span>
                </span>
              ))
            )}
          </div>
        ))}
      </motion.div>

      {/* The marquee is decorative repetition; this is what a screen reader gets. */}
      <span className="sr-only">
        {site.disciplines.join(", ")}. {site.halal.bodyFull} certified halal. {site.parking}.
      </span>
    </div>
  );
}

function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-body text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-accent border-b border-brand-surface/15 pb-2.5 mb-5">
      {children}
    </p>
  );
}

export default function Footer() {
  const openState = getOpenState();
  const liveSocials = socials.filter((s) => s.confirmed && !isPlaceholder(s.href));

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative w-full bg-brand-base text-brand-surface">
      <Ribbon />

      <div className="relative px-5 sm:px-8 lg:px-14 pt-14 sm:pt-20 pb-8 overflow-hidden">
        {/* Static grid texture — a background-image, so it costs one paint and
            never re-rasterises. */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[linear-gradient(to_right,#F5EFEB_1px,transparent_1px),linear-gradient(to_bottom,#F5EFEB_1px,transparent_1px)] bg-[size:48px_48px]" />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={inViewConfig}
          className="relative z-10 max-w-[1500px] mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14">
            {/* Identity + contact */}
            <div className="md:col-span-5 space-y-7">
              <div>
                <h2 className="font-heading italic text-4xl sm:text-5xl lg:text-6xl font-light leading-[0.95] tracking-tight">
                  {site.name}
                  <span className="not-italic font-normal text-brand-accent">.</span>
                </h2>
                <p className="mt-3 font-body text-[11px] uppercase tracking-[0.28em] text-brand-muted">
                  {site.tagline} · {site.branch}
                </p>
              </div>

              <div className="space-y-4">
                <a
                  href={mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3.5 w-fit"
                >
                  <MapPin className="w-[18px] h-[18px] text-brand-accent shrink-0 mt-0.5" strokeWidth={1.6} />
                  <span className="font-body text-xs sm:text-sm tracking-[0.1em] uppercase leading-relaxed text-brand-surface/85 group-hover:text-brand-accent transition-colors">
                    {site.address.line1}
                    <br />
                    {site.address.city}, {site.address.postcode}
                  </span>
                </a>

                <a href={telHref} className="group flex items-center gap-3.5 w-fit">
                  <Phone className="w-[18px] h-[18px] text-brand-accent shrink-0" strokeWidth={1.6} />
                  <span className="font-heading italic text-xl sm:text-2xl tracking-wide group-hover:text-brand-accent transition-colors">
                    {site.phone.display}
                  </span>
                </a>

                <div className="flex items-center gap-3.5 text-brand-muted">
                  <Car className="w-[18px] h-[18px] text-brand-accent shrink-0" strokeWidth={1.6} />
                  <span className="font-body text-[11px] uppercase tracking-[0.18em]">
                    {site.parking}
                  </span>
                </div>
              </div>

              <span className="inline-flex items-center gap-2.5 rounded-full border border-brand-green-light/30 bg-brand-green/15 px-4 py-2 text-brand-green-light">
                <ShieldCheck className="w-4 h-4 shrink-0" strokeWidth={1.8} />
                <span className="font-body text-[10px] uppercase tracking-[0.2em] font-semibold">
                  {site.halal.bodyFull}
                </span>
              </span>
            </div>

            {/* Navigation */}
            <div className="md:col-span-3">
              <ColumnHeading>Explore</ColumnHeading>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-2.5 font-body font-medium uppercase text-[11px] tracking-[0.2em] text-brand-surface/80 hover:text-brand-accent transition-colors"
                    >
                      <ArrowUpRight
                        className="w-3.5 h-3.5 text-brand-accent transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        strokeWidth={2}
                      />
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Hours + ordering */}
            <div className="md:col-span-4 space-y-8">
              <div>
                <ColumnHeading>Hours</ColumnHeading>
                {/* Opening times are not confirmed by the owner yet, so the
                    site asks rather than asserting times that may be wrong. */}
                {openState ? (
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        openState.open ? "bg-brand-green-light" : "bg-brand-muted"
                      }`}
                    />
                    <span className="font-body text-xs uppercase tracking-[0.18em] text-brand-surface/85">
                      {openState.open ? "Open now" : "Closed"}
                    </span>
                  </div>
                ) : (
                  <a href={telHref} className="group flex items-start gap-3 text-brand-surface/80 hover:text-brand-accent transition-colors">
                    <Clock className="w-[18px] h-[18px] text-brand-accent shrink-0 mt-0.5" strokeWidth={1.6} />
                    <span className="font-body text-[11px] uppercase tracking-[0.16em] leading-relaxed">
                      Call ahead for today&rsquo;s
                      <br />
                      serving times
                    </span>
                  </a>
                )}
              </div>

              <div>
                <ColumnHeading>Order In</ColumnHeading>
                <div className="flex flex-wrap gap-2">
                  {deliveryPartners.map((p) =>
                    p.confirmed && !isPlaceholder(p.href) ? (
                      <a
                        key={p.id}
                        href={p.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-brand-surface/20 px-3.5 py-2 font-body text-[10px] uppercase tracking-[0.16em] text-brand-surface/85 hover:border-brand-accent/50 hover:text-brand-accent transition-colors"
                      >
                        {p.label}
                      </a>
                    ) : (
                      // Rendered as a plain badge until a real storefront link
                      // exists — a link to nowhere is worse than no link.
                      <span
                        key={p.id}
                        className="rounded-full border border-brand-surface/15 px-3.5 py-2 font-body text-[10px] uppercase tracking-[0.16em] text-brand-muted"
                      >
                        {p.label}
                      </span>
                    )
                  )}
                </div>
                <p className="mt-3 font-body text-[10px] uppercase tracking-[0.15em] text-brand-muted">
                  Dine in · Takeaway · Catering
                </p>
              </div>

              {liveSocials.length > 0 && (
                <div className="flex items-center gap-2.5">
                  {liveSocials.map((s) => {
                    const Icon = socialIcons[s.id];
                    if (!Icon) return null;
                    return (
                      <a
                        key={s.id}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                        className="w-10 h-10 rounded-full border border-brand-surface/15 flex items-center justify-center text-brand-muted hover:text-brand-accent hover:border-brand-accent/40 transition-colors"
                      >
                        <Icon className="w-[18px] h-[18px]" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Legal bar */}
          <div className="mt-12 pt-6 border-t border-brand-surface/10 flex flex-col-reverse sm:flex-row items-center justify-between gap-5">
            <p className="font-body text-[9px] uppercase tracking-[0.22em] text-brand-surface/40 text-center sm:text-left">
              © {new Date().getFullYear()} {site.name} · {site.branch}, London
            </p>

            <button
              onClick={scrollToTop}
              className="group flex items-center gap-2.5 rounded-full border border-brand-surface/20 px-5 h-10 font-body text-[10px] uppercase tracking-[0.22em] text-brand-surface/80 hover:border-brand-accent/50 hover:text-brand-accent transition-colors cursor-pointer"
            >
              Back to top
              <ChevronUp className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" strokeWidth={2} />
            </button>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
