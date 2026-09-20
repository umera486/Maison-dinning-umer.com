// src/components/sections/FindUs.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import SmartImage from "@/components/shared/SmartImage";
import { img } from "@/data/images";
import {
  site,
  deliveryPartners,
  routes,
  telHref,
  mapsHref,
  isPlaceholder,
  getOpenState,
} from "@/lib/site";
import { stagger, fadeUp, inView, EASE_LAHORI } from "@/lib/motion";
import SplitWords from "@/components/shared/SplitWords";

/**
 * Where we are — set as a specification sheet, not a set of cards.
 *
 * The previous version was four rounded bordered tiles with an icon in each,
 * which is the most generic "contact section" shape there is. Practical
 * information reads better as a typeset table: monospace label on the left,
 * the value at size on the right, a hairline between rows. It is denser,
 * scans faster, and looks considerably more deliberate.
 *
 * NOTE ON THE MAP: this deep-links to Google/Apple Maps rather than embedding
 * an iframe. The keyless `output=embed` trick is undocumented and breaks
 * without warning, and the official Embed API needs a billed key the owner
 * hasn't provided. A deep link always works and costs nothing to load.
 */

const HEADLINE = "Come and eat.";

function Row({
  label,
  children,
  href,
  external,
}: {
  label: string;
  children: React.ReactNode;
  href?: string;
  external?: boolean;
}) {
  const body = (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-8 py-5 sm:py-6">
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-brand-muted shrink-0 sm:w-36 pt-1">
        {label}
      </span>
      <span className="font-heading italic font-light text-brand-surface
        text-[clamp(1.25rem,3.6vw,2rem)] leading-[1.2] transition-colors duration-300
        group-hover:text-brand-accent">
        {children}
      </span>
    </div>
  );

  if (!href) {
    return <li className="border-b border-brand-surface/12">{body}</li>;
  }

  return (
    <li className="group border-b border-brand-surface/12">
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="block"
      >
        {body}
      </a>
    </li>
  );
}

export default function FindUs() {
  const openState = getOpenState();

  return (
    <section className="relative bg-brand-base py-20 sm:py-28 lg:py-36 overflow-hidden">
      <div className="px-5 sm:px-10 lg:px-16 max-w-[1600px] mx-auto">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={inView}
          className="flex items-baseline justify-between gap-6 border-b border-brand-surface/15 pb-5 mb-10 sm:mb-14"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-brand-muted">
            Find us
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-brand-muted">
            {site.address.postcode}
          </span>
        </motion.div>

        <motion.h2
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={inView}
          className="font-heading italic font-light text-brand-surface
            text-[clamp(2.5rem,10vw,7.5rem)] leading-[0.9] tracking-[-0.03em]"
        >
          <SplitWords text={HEADLINE} />
        </motion.h2>

        <div className="mt-14 sm:mt-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* ---------- Spec sheet ---------- */}
          <motion.ul
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={inView}
            className="lg:col-span-7 border-t border-brand-surface/12"
          >
            <Row label="Address" href={mapsHref} external>
              {site.address.line1}
              <span className="block text-brand-muted text-[0.6em] not-italic font-body uppercase tracking-[0.16em] mt-2">
                {site.address.city} · {site.address.postcode}
              </span>
            </Row>

            <Row label="Telephone" href={telHref}>
              {site.phone.display}
            </Row>

            <Row label="Hours">
              {openState ? (
                <span className="inline-flex items-center gap-3">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      openState.open ? "bg-brand-green-light" : "bg-brand-muted"
                    }`}
                  />
                  {openState.open ? "Open now" : "Closed"}
                </span>
              ) : (
                // Hours are unconfirmed, so the site asks instead of asserting.
                <span className="text-[0.78em]">Call ahead for today&rsquo;s serving times</span>
              )}
            </Row>

            <Row label="Parking">
              <span className="text-[0.82em]">Free, at the rear</span>
            </Row>

            <Row label="Service">
              <span className="text-[0.82em]">Dine in · Takeaway · Catering</span>
            </Row>

            <Row label="Certification">
              <span className="text-[0.82em]">{site.halal.bodyFull}</span>
              <span className="block text-brand-muted text-[0.52em] not-italic font-body uppercase tracking-[0.16em] mt-2">
                Independently monitored, not self-declared
              </span>
            </Row>
          </motion.ul>

          {/* ---------- Image + actions ---------- */}
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 0.8, ease: EASE_LAHORI }}
            className="lg:col-span-5"
          >
            <div className="relative aspect-4/5 overflow-hidden bg-brand-raise">
              <SmartImage
                src={img.room}
                alt={`${site.name} in ${site.branch}, London`}
                label="The dining room"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                quality={75}
                loading="lazy"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-brand-base/70 to-transparent" />
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between border-b border-brand-surface/20 pb-3
                  font-heading italic text-2xl text-brand-surface hover:text-brand-accent transition-colors duration-300"
              >
                Get directions
                <span className="font-mono not-italic text-[10px] tracking-[0.2em] text-brand-accent">→</span>
              </a>

              <Link
                href={routes.reserve}
                className="group flex items-center justify-between border-b border-brand-surface/20 pb-3
                  font-heading italic text-2xl text-brand-surface hover:text-brand-accent transition-colors duration-300"
              >
                Book a table
                <span className="font-mono not-italic text-[10px] tracking-[0.2em] text-brand-accent">→</span>
              </Link>
            </div>

            <div className="mt-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-brand-muted mb-3">
                Also on
              </p>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {deliveryPartners.map((p) =>
                  p.confirmed && !isPlaceholder(p.href) ? (
                    <a
                      key={p.id}
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body text-[12px] uppercase tracking-[0.14em] text-brand-surface/85 hover:text-brand-accent transition-colors"
                    >
                      {p.label}
                    </a>
                  ) : (
                    // Inert until the owner supplies real storefront URLs.
                    <span
                      key={p.id}
                      className="font-body text-[12px] uppercase tracking-[0.14em] text-brand-muted"
                    >
                      {p.label}
                    </span>
                  )
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
