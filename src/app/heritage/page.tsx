import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeritageView from "@/components/heritage/HeritageView";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Story",
  description: `Where the cooking at ${site.name} comes from — Lahori street food, the overnight nihari pot, live charcoal and proper nashta, now in ${site.branch}, London.`,
};

export default function HeritagePage() {
  return (
    <>
      <Navbar onDarkHero />
      <main className="relative bg-brand-base text-brand-surface">
        <HeritageView />
      </main>
      <Footer />
    </>
  );
}
