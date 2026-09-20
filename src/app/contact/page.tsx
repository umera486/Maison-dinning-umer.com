import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactView from "@/components/contact/ContactView";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Find Us",
  description: `${site.name} — ${site.address.line1}, ${site.address.city} ${site.address.postcode}. Call ${site.phone.display}. ${site.parking}. Dine in, takeaway and catering in ${site.branch}, London.`,
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="relative bg-brand-base text-brand-surface">
        <ContactView />
      </main>
      <Footer />
    </>
  );
}
