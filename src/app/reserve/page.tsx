import { img } from "@/data/images";
import type { Metadata } from "next";
import SmartImage from "@/components/shared/SmartImage";
import { MapPin, Car, Clock, ShieldCheck } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ReservationForm from "@/components/reserve/ReservationForm";
import { site, telHref, mapsHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book a Table",
  description: `Reserve a table at ${site.name}, ${site.address.line1}, ${site.address.city} ${site.address.postcode}. ${site.halal.body} certified halal. ${site.parking}.`,
};

/**
 * Single-column, full-bleed. The previous layout was a sticky two-column grid
 * whose aside ate half the viewport on laptops and stacked into a 280px dead
 * image on phones, pushing the actual form below the fold. The form is the
 * page; everything else is support underneath it.
 */
export default function ReservePage() {
  return (
    <>
      <Navbar />

      <main className="relative bg-brand-base text-brand-surface">
        {/* ---------- Hero band ---------- */}
        <section className="relative h-[46dvh] min-h-[280px] sm:min-h-[340px] overflow-hidden">
          <SmartImage
            src={img.room}
            alt={`The dining room at ${site.name}`}
            fill
            sizes="100vw"
            quality={75}
            preload
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-scrim via-scrim/70 to-scrim/45" />

          <div className="absolute inset-0 flex flex-col justify-end px-5 sm:px-8 lg:px-14 pb-8 sm:pb-12">
            <div className="max-w-[1100px] mx-auto w-full">
              <p className="font-body text-[10px] uppercase tracking-[0.34em] text-accent-on-image mb-4">
                {site.branch} · Dine in
              </p>
              <h1 className="font-heading italic font-light text-[clamp(2.5rem,11vw,6rem)] leading-[0.94] tracking-tight text-on-image text-over-image text-balance max-w-[11ch]">
                Book a table.
              </h1>
            </div>
          </div>
        </section>

        {/* ---------- Form ---------- */}
        <section className="px-5 sm:px-8 lg:px-14 pt-10 sm:pt-14 pb-16 sm:pb-20">
          <div className="max-w-[1100px] mx-auto">
            <p className="font-body text-sm sm:text-base leading-relaxed text-brand-muted max-w-[46ch] mb-10">
              Tell us when you&rsquo;re coming and how many. We&rsquo;ll ring you back to
              confirm — most tables are sorted the same day.
            </p>

            <div className="rounded-2xl border border-brand-surface/12 bg-brand-raise/60 p-5 sm:p-8 lg:p-10">
              <ReservationForm />
            </div>
          </div>
        </section>

        {/* ---------- Practical strip ---------- */}
        <section className="px-5 sm:px-8 lg:px-14 pb-16 sm:pb-24">
          <div className="max-w-[1100px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <a
              href={mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-brand-surface/12 bg-brand-raise p-5 hover:border-brand-accent/40 transition-colors"
            >
              <MapPin className="w-5 h-5 text-brand-accent mb-3" strokeWidth={1.6} />
              <p className="font-heading italic text-lg text-brand-surface leading-tight group-hover:text-brand-accent transition-colors">
                {site.address.line1}
              </p>
              <p className="mt-1 font-body text-[11px] uppercase tracking-[0.14em] text-brand-muted">
                {site.address.city} · {site.address.postcode}
              </p>
            </a>

            <a
              href={telHref}
              className="group rounded-2xl border border-brand-surface/12 bg-brand-raise p-5 hover:border-brand-accent/40 transition-colors"
            >
              <Clock className="w-5 h-5 text-brand-accent mb-3" strokeWidth={1.6} />
              <p className="font-heading italic text-lg text-brand-surface leading-tight group-hover:text-brand-accent transition-colors">
                Prefer to call?
              </p>
              <p className="mt-1 font-body text-[11px] uppercase tracking-[0.14em] text-brand-muted">
                {site.phone.display}
              </p>
            </a>

            <div className="rounded-2xl border border-brand-surface/12 bg-brand-raise p-5">
              <Car className="w-5 h-5 text-brand-accent mb-3" strokeWidth={1.6} />
              <p className="font-heading italic text-lg text-brand-surface leading-tight">Parking</p>
              <p className="mt-1 font-body text-[11px] uppercase tracking-[0.14em] text-brand-muted">
                Free, at the rear
              </p>
            </div>

            <div className="rounded-2xl border border-brand-green-light/25 bg-brand-green/10 p-5">
              <ShieldCheck className="w-5 h-5 text-brand-green-light mb-3" strokeWidth={1.6} />
              <p className="font-heading italic text-lg text-brand-surface leading-tight">
                {site.halal.body} certified
              </p>
              <p className="mt-1 font-body text-[11px] uppercase tracking-[0.14em] text-brand-muted">
                Independently monitored
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
