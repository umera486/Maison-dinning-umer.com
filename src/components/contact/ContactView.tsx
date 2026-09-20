// src/components/contact/ContactView.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Car,
  Clock,
  Navigation,
  ShieldCheck,
  Train,
  Utensils,
} from "lucide-react";
import {
  site,
  socials,
  deliveryPartners,
  routes,
  telHref,
  mapsHref,
  isPlaceholder,
  getOpenState,
} from "@/lib/site";
import { socialIcons } from "@/components/shared/SocialIcons";
import { stagger, fadeUp, inView, EASE_LAHORI } from "@/lib/motion";
import SplitWords from "@/components/shared/SplitWords";

/**
 * Find Us.
 *
 * Replaces a "Contact Concierge" page built around a fictional switchboard
 * with four channels, three invented phone numbers and a host desk that
 * doesn't exist. This restaurant has one phone number and one address.
 *
 * Opening hours are still unconfirmed by the owner, so the page asks the
 * visitor to ring rather than printing times that may be wrong — see
 * `hoursConfirmed` in src/lib/site.ts.
 */

const HEADLINE = "Find us.";

export default function ContactView() {
  const openState = getOpenState();
  const liveSocials = socials.filter((s) => s.confirmed && !isPlaceholder(s.href));

  return (
    <div className="relative bg-brand-base">
      {/* ---------- Hero ---------- */}
      <section className="px-5 sm:px-8 lg:px-14 pt-28 sm:pt-36 lg:pt-44 pb-10 sm:pb-14">
        <div className="max-w-[1500px] mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_LAHORI }}
            className="font-body text-[10px] uppercase tracking-[0.34em] text-brand-accent mb-5"
          >
            {site.branch} · South London
          </motion.p>

          <motion.h1
            variants={stagger(0.08, 0.1)}
            initial="hidden"
            animate="visible"
            className="font-heading italic font-light text-[clamp(3rem,13vw,8rem)] leading-[0.92] tracking-tight text-brand-surface"
          >
            <SplitWords text={HEADLINE} />
          </motion.h1>
        </div>
      </section>

      {/* ---------- Details ---------- */}
      <section className="px-5 sm:px-8 lg:px-14 pb-16 sm:pb-24">
        <div className="max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
          {/* Left: the practical facts */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={inView}
            className="space-y-8"
          >
            <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="group block">
              <span className="flex items-center gap-2 font-body text-[10px] uppercase tracking-[0.22em] text-brand-accent mb-3">
                <MapPin className="w-3.5 h-3.5" strokeWidth={2} />
                Address
              </span>
              <span className="block font-heading italic font-light text-[clamp(1.75rem,5.5vw,2.75rem)] leading-tight text-brand-surface group-hover:text-brand-accent transition-colors">
                {site.address.line1}
              </span>
              <span className="block mt-1.5 font-body text-sm uppercase tracking-[0.16em] text-brand-muted">
                {site.address.city} · {site.address.postcode}
              </span>
            </a>

            <a href={telHref} className="group block">
              <span className="flex items-center gap-2 font-body text-[10px] uppercase tracking-[0.22em] text-brand-accent mb-3">
                <Phone className="w-3.5 h-3.5" strokeWidth={2} />
                Phone
              </span>
              <span className="block font-heading italic font-light text-[clamp(1.75rem,5.5vw,2.75rem)] leading-tight text-brand-surface group-hover:text-brand-accent transition-colors">
                {site.phone.display}
              </span>
              <span className="block mt-1.5 font-body text-sm text-brand-muted">
                Orders, bookings and catering — all on this one number.
              </span>
            </a>

            <div>
              <span className="flex items-center gap-2 font-body text-[10px] uppercase tracking-[0.22em] text-brand-accent mb-3">
                <Clock className="w-3.5 h-3.5" strokeWidth={2} />
                Hours
              </span>
              {openState ? (
                <span className="flex items-center gap-2.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      openState.open ? "bg-brand-green-light" : "bg-brand-muted"
                    }`}
                  />
                  <span className="font-body text-base text-brand-surface">
                    {openState.open ? "Open now" : "Closed"}
                  </span>
                </span>
              ) : (
                <span className="block font-body text-base leading-relaxed text-brand-surface/85 max-w-[38ch]">
                  Serving times vary — give us a ring and we&rsquo;ll tell you exactly
                  when the kitchen is on.
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 h-14 px-8 rounded-full
                  bg-brand-surface text-brand-base font-body text-[11px] uppercase tracking-[0.2em] font-semibold
                  hover:bg-brand-accent transition-colors duration-300"
              >
                <Navigation className="w-4 h-4" strokeWidth={2.5} />
                Get directions
              </a>

              <Link
                href={routes.reserve}
                className="inline-flex items-center justify-center h-14 px-8 rounded-full
                  border border-brand-surface/25 font-body text-[11px] uppercase tracking-[0.2em]
                  text-brand-surface hover:border-brand-accent hover:text-brand-accent
                  transition-colors duration-300"
              >
                Book a table
              </Link>
            </div>
          </motion.div>

          {/* Right: photo + at-a-glance */}
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 0.8, ease: EASE_LAHORI }}
            className="space-y-4"
          >
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden border border-brand-surface/10">
              <Image
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1400&auto=format&fit=crop"
                alt={`${site.name}, ${site.address.line1}`}
                fill
                sizes="(min-width: 1024px) 700px, 100vw"
                quality={75}
                preload
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-brand-base/85 via-transparent to-transparent" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-2xl border border-brand-surface/12 bg-brand-raise p-5">
                <Car className="w-5 h-5 text-brand-accent mb-3" strokeWidth={1.6} />
                <p className="font-heading italic text-lg text-brand-surface leading-tight">Parking</p>
                <p className="mt-1.5 font-body text-[12px] leading-relaxed text-brand-muted">
                  {site.parking}.
                </p>
              </div>

              <div className="rounded-2xl border border-brand-surface/12 bg-brand-raise p-5">
                <Train className="w-5 h-5 text-brand-accent mb-3" strokeWidth={1.6} />
                <p className="font-heading italic text-lg text-brand-surface leading-tight">Getting here</p>
                <p className="mt-1.5 font-body text-[12px] leading-relaxed text-brand-muted">
                  On London Road, a short walk from Norbury station.
                </p>
              </div>

              <div className="rounded-2xl border border-brand-surface/12 bg-brand-raise p-5">
                <Utensils className="w-5 h-5 text-brand-accent mb-3" strokeWidth={1.6} />
                <p className="font-heading italic text-lg text-brand-surface leading-tight">How we serve</p>
                <p className="mt-1.5 font-body text-[12px] leading-relaxed text-brand-muted">
                  Dine in · Takeaway · Catering
                </p>
              </div>

              <div className="rounded-2xl border border-brand-green-light/25 bg-brand-green/10 p-5">
                <ShieldCheck className="w-5 h-5 text-brand-green-light mb-3" strokeWidth={1.6} />
                <p className="font-heading italic text-lg text-brand-surface leading-tight">
                  {site.halal.body} certified
                </p>
                <p className="mt-1.5 font-body text-[12px] leading-relaxed text-brand-muted">
                  {site.halal.bodyFull}.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------- Order in + socials ---------- */}
      <section className="px-5 sm:px-8 lg:px-14 pb-20 sm:pb-28">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={inView}
          className="max-w-[1500px] mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-brand-surface/10 pt-10"
        >
          <div>
            <p className="font-body text-[10px] uppercase tracking-[0.22em] text-brand-accent mb-4">
              Order in
            </p>
            <div className="flex flex-wrap gap-2">
              {deliveryPartners.map((p) =>
                p.confirmed && !isPlaceholder(p.href) ? (
                  <a
                    key={p.id}
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-brand-surface/20 px-4 py-2.5 font-body text-[11px] uppercase tracking-[0.14em] text-brand-surface/85 hover:border-brand-accent/50 hover:text-brand-accent transition-colors"
                  >
                    {p.label}
                  </a>
                ) : (
                  // Inert until the owner supplies real storefront URLs.
                  <span
                    key={p.id}
                    className="rounded-full border border-brand-surface/15 px-4 py-2.5 font-body text-[11px] uppercase tracking-[0.14em] text-brand-muted"
                  >
                    {p.label}
                  </span>
                )
              )}
            </div>
          </div>

          {liveSocials.length > 0 && (
            <div>
              <p className="font-body text-[10px] uppercase tracking-[0.22em] text-brand-accent mb-4">
                Follow
              </p>
              <div className="flex flex-wrap gap-2.5">
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
                      className="w-12 h-12 rounded-full border border-brand-surface/15 flex items-center justify-center text-brand-muted hover:text-brand-accent hover:border-brand-accent/40 transition-colors"
                    >
                      <Icon className="w-[18px] h-[18px]" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </section>
    </div>
  );
}
