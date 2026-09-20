import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MenuView from "@/components/menu/MenuView";
import { site } from "@/lib/site";
import { getDishCount, getLowestPrice } from "@/lib/menu";

// A Server Component, so the page can export metadata and ship the menu in the
// initial HTML. The interactive parts live in MenuView behind "use client".
export const metadata: Metadata = {
  title: "Menu",
  description: `${getDishCount()} dishes — karahi, BBQ, nihari, paye, biryani and Lahori street food in ${site.branch}, London. ${site.halal.body} certified halal. From £${getLowestPrice().toFixed(2)}.`,
};

export default function MenuPage() {
  return (
    <>
      <Navbar />
      <main className="relative bg-brand-base text-brand-surface">
        <MenuView />
      </main>
      <Footer />
    </>
  );
}
