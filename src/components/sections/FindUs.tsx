// src/components/sections/FindUs.tsx
"use client";

import { img } from "@/data/images";
import SmartImage from "@/components/shared/SmartImage";
import { motion } from "framer-motion";
import { MapPin, Phone, Car, Clock, ShieldCheck, Navigation, Utensils } from "lucide-react";
import {
  site,
  deliveryPartners,
  telHref,
  mapsHref,
  isPlaceholder,
  getOpenState,
} from "@/lib/site";
import { stagger, fadeUp, inView, EASE_LAHORI } from "@/lib/motion";
import SplitWords from "@/components/shared/SplitWords";

/**
 * Where we are, how to reach us, and why to trust the kitchen.
 *
 * NOTE ON THE MAP: this deliberately deep-links to Google/Apple Maps rather
 * than embedding an iframe. The keyless `output=embed` trick is undocumented
 * and breaks without warning, and the official Embed API needs a billed key
 * the owner hasn't provided. A deep link always works, opens the app the
 * visitor already has, and costs nothing to load. Swap in a real embed once
 * there's an API key.
 */

const HEADLINE = "Come and eat.";

const services = [
  { id: "dinein", label: "Dine in", enabled: site.services.dineIn },
  { id: "takeaway", label: "Takeaway", enabled: site.services.takeaway },
  { id: "catering", label: "Catering", enabled: site.services.catering },
];

export default function FindUs() {
  const openState = getOpenState();

  return (
    <section className="relative w-full bg-brand-base py-16 sm:py-24 lg:py-28 overflow-hidden">
      <div className="px-5 sm:px-8 lg:px-14 max-w-[1500px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* ---------- Details ---------- */}
          <div>
            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={inView}
              className="font-body text-[10px] uppercase tracking-[0.3em] text-brand-accent mb-5"
            >
              {site.branch}, South London
            </motion.p>

            <motion.h2
              variants={stagger(0.08)}
              initial="hidden"
              whileInView="visible"
              viewport={inView}
              className="font-heading italic font-light text-[clamp(2.25rem,8vw,4.5rem)] leading-[1] tracking-tight text-brand-surface"
            >
              <SplitWords text={HEADLINE} />
            </motion.h2>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={inView}
              className="mt-8 space-y-5"
            >
              <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-4 w-fit">
                <MapPin className="w-5 h-5 text-brand-accent shrink-0 mt-1" strokeWidth={1.6} />
                <span>
                  <span className="block font-heading italic text-2xl sm:text-3xl text-brand-surface group-hover:text-brand-accent transition-colors leading-tight">
                    {site.address.line1}
                  </span>
                  <span className="block mt-1 font-body text-xs uppercase tracking-[0.18em] text-brand-muted">
                    {site.address.city} · {site.address.postcode}
                  </span>
                </span>
              </a>

              <a href={telHref} className="group flex items-center gap-4 w-fit">
                <Phone className="w-5 h-5 text-brand-accent shrink-0" strokeWidth={1.6} />
                <span className="font-heading italic text-2xl sm:text-3xl text-brand-surface group-hover:text-brand-accent transition-colors">
                  {site.phone.display}
                </span>
              </a>

              <div className="flex items-center gap-4">
                <Car className="w-5 h-5 text-brand-accent shrink-0" strokeWidth={1.6} />
                <span className="font-body text-xs uppercase tracking-[0.16em] text-brand-surface/80">
                  {site.parking}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <Clock className="w-5 h-5 text-brand-accent shrink-0" strokeWidth={1.6} />
                {openState ? (
                  <span className="flex items-center gap-2.5">
                    <span className={`w-2 h-2 rounded-full ${openState.open ? "bg-brand-green-light" : "bg-brand-muted"}`} />
                    <span className="font-body text-xs uppercase tracking-[0.16em] text-brand-surface/80">
                      {openState.open ? "Open now" : "Closed"}
                    </span>
                  </span>
                ) : (
                  // Hours are unconfirmed, so we ask rather than assert.
                  <span className="font-body text-xs uppercase tracking-[0.16em] text-brand-surface/80">
                    Call ahead for today&rsquo;s serving times
                  </span>
                )}
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={inView}
              className="mt-9 flex flex-wrap gap-2.5"
            >
              <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 rounded-full bg-brand-surface text-brand-base
                  px-7 h-12 font-body text-[11px] uppercase tracking-[0.2em] font-semibold
                  hover:bg-brand-accent transition-colors duration-300"
              >
                <Navigation className="w-4 h-4" strokeWidth={2} />
                Get directions
              </a>

              <a
                href={telHref}
                className="inline-flex items-center gap-2.5 rounded-full border border-brand-surface/25
                  px-7 h-12 font-body text-[11px] uppercase tracking-[0.2em] text-brand-surface
                  hover:border-brand-accent hover:text-brand-accent transition-colors duration-300"
              >
                <Phone className="w-4 h-4" strokeWidth={2} />
                Call the kitchen
              </a>
            </motion.div>
          </div>

          {/* ---------- Visual + trust ---------- */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 0.8, ease: EASE_LAHORI }}
            className="space-y-4"
          >
            <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden border border-brand-surface/10">
              <SmartImage
                src={img.room}
                alt={`${site.name} in ${site.branch}, London`}
                fill
                sizes="(min-width: 1024px) 700px, 100vw"
                quality={75}
                loading="lazy"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-brand-base/80 via-transparent to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center gap-2">
                {services
                  .filter((s) => s.enabled)
                  .map((s) => (
                    <span
                      key={s.id}
                      className="inline-flex items-center gap-1.5 rounded-full bg-brand-base/80 border border-brand-surface/15
                        px-3 py-1.5 font-body text-[9.5px] uppercase tracking-[0.16em] text-brand-surface"
                    >
                      <Utensils className="w-3 h-3 text-brand-accent" strokeWidth={2} />
                      {s.label}
                    </span>
                  ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* HMC is a genuine, verifiable certification — for this audience
                  it is the single strongest trust signal on the page. */}
              <div className="rounded-2xl border border-brand-green-light/25 bg-brand-green/10 p-5">
                <ShieldCheck className="w-6 h-6 text-brand-green-light mb-3" strokeWidth={1.6} />
                <p className="font-heading italic text-xl text-brand-surface leading-tight">
                  {site.halal.body} Certified
                </p>
                <p className="mt-1.5 font-body text-[11px] leading-relaxed text-brand-muted">
                  {site.halal.bodyFull}. Independently monitored, not self-declared.
                </p>
              </div>

              <div className="rounded-2xl border border-brand-surface/12 bg-brand-raise p-5">
                <p className="font-body text-[10px] uppercase tracking-[0.2em] text-brand-accent mb-3">
                  Also on
                </p>
                <div className="flex flex-wrap gap-2">
                  {deliveryPartners.map((p) =>
                    p.confirmed && !isPlaceholder(p.href) ? (
                      <a
                        key={p.id}
                        href={p.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-brand-surface/20 px-3 py-1.5 font-body text-[10px] uppercase tracking-[0.14em] text-brand-surface/85 hover:border-brand-accent/50 hover:text-brand-accent transition-colors"
                      >
                        {p.label}
                      </a>
                    ) : (
                      <span
                        key={p.id}
                        className="rounded-full border border-brand-surface/15 px-3 py-1.5 font-body text-[10px] uppercase tracking-[0.14em] text-brand-muted"
                      >
                        {p.label}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
