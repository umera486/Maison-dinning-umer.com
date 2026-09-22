import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CateringView from "@/components/catering/CateringView";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Catering",
  description: `Lahori catering across South London from ${site.name} in ${site.branch}. Charcoal grills, platters, biryani and slow-cooked nihari for parties, Eid and family gatherings. ${site.halal.body} certified halal.`,
};

export default function CateringPage() {
  return (
    <>
      <Navbar onDarkHero />
      <main className="relative bg-brand-base text-brand-surface">
        <CateringView />
      </main>
      <Footer />
    </>
  );
}
