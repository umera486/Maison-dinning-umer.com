import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ReservationForm from "@/components/reserve/ReservationForm";
import { site, telHref, mapsHref } from "@/lib/site";
import { MapPin, Car } from "lucide-react";

export const metadata: Metadata = {
  title: "Book a Table",
  description: `Reserve a table at ${site.name}, ${site.address.line1}, ${site.address.city} ${site.address.postcode}. Dine in, takeaway and catering. ${site.halal.body} certified halal.`,
};

export default function ReservePage() {
  return (
    <>
      <Navbar />

      <main className="relative bg-brand-base text-brand-surface min-h-dvh">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:min-h-dvh">
          {/* Form */}
          <div className="px-5 sm:px-8 lg:px-14 pt-28 sm:pt-36 lg:pt-40 pb-16 lg:pb-24">
            <p className="font-body text-[10px] uppercase tracking-[0.34em] text-brand-accent mb-5">
              {site.branch} · Dine in
            </p>

            <h1 className="font-heading italic font-light text-[clamp(2.5rem,10vw,5rem)] leading-[0.95] tracking-tight text-balance max-w-[11ch]">
              Book a table.
            </h1>

            <p className="mt-6 mb-12 font-body text-sm sm:text-base leading-relaxed text-brand-muted max-w-[46ch]">
              Tell us when you&rsquo;re coming and how many. We&rsquo;ll ring you back to
              confirm — most tables are sorted the same day.
            </p>

            <ReservationForm />
          </div>

          {/* Context panel. Sticky on desktop, a normal block on mobile where a
              sticky side rail would just eat the screen. */}
          <aside className="relative lg:sticky lg:top-0 lg:h-dvh">
            <div className="relative h-[280px] sm:h-[360px] lg:h-full overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1400&auto=format&fit=crop"
                alt={`The dining room at ${site.name}`}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                quality={75}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-brand-base via-brand-base/40 to-brand-base/10 lg:bg-linear-to-r lg:from-brand-base lg:via-brand-base/30 lg:to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10 space-y-4">
                <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-3 w-fit">
                  <MapPin className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" strokeWidth={1.6} />
                  <span>
                    <span className="block font-heading italic text-xl text-brand-surface group-hover:text-brand-accent transition-colors">
                      {site.address.line1}
                    </span>
                    <span className="block font-body text-[11px] uppercase tracking-[0.16em] text-brand-muted mt-0.5">
                      {site.address.city} · {site.address.postcode}
                    </span>
                  </span>
                </a>

                <div className="flex items-center gap-3">
                  <Car className="w-5 h-5 text-brand-accent shrink-0" strokeWidth={1.6} />
                  <span className="font-body text-[11px] uppercase tracking-[0.16em] text-brand-surface/80">
                    {site.parking}
                  </span>
                </div>

                <a
                  href={telHref}
                  className="inline-flex items-center justify-center h-12 px-6 rounded-full border border-brand-surface/25
                    font-body text-[11px] uppercase tracking-[0.2em] text-brand-surface
                    hover:border-brand-accent hover:text-brand-accent transition-colors duration-300"
                >
                  Or call {site.phone.display}
                </a>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
}
