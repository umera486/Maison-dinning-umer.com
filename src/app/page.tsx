// app/page.tsx
import Preloader from "@/components/layout/Preloader";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StackSection from "@/components/layout/StackSection";
import HeroText from "@/components/Hero/HeroText";
import Disciplines from "@/components/sections/Disciplines";
import SignatureRail from "@/components/sections/SignatureRail";
import PriceStatement from "@/components/sections/PriceStatement";
import StoryTeaser from "@/components/sections/StoryTeaser";
import FindUs from "@/components/sections/FindUs";

/**
 * A Server Component. The page previously read:
 *
 *   {!isLoaded && <Preloader onComplete={...} />}
 *   {isLoaded && <>...the entire site...</>}
 *
 * which meant nothing existed in the server HTML until a client timer fired.
 * The homepage shipped 20KB while /menu shipped 222KB. Now the preloader is a
 * self-contained overlay and everything below is prerendered.
 *
 * Section order is an argument, not a list:
 *   who we are → what we cook → what we're known for → what it costs →
 *   where it came from → how to reach us.
 *
 * The old homepage ran CulinaryPillars, Gallery and Press back to back — three
 * flip-card grids listing overlapping dishes, with the same dish in all three.
 * Those are gone; the menu lives at /menu and each section here does one job.
 */
export default function Home() {
  return (
    <>
      <Preloader />
      <Navbar />

      <main className="relative bg-brand-base text-brand-surface">
        {/* Two pinned panels. Sticky + z-index only — no per-frame scale or
            filter work, which is what made this cheap enough to keep. */}
        <StackSection index={0}>
          <HeroText />
        </StackSection>

        <StackSection index={1}>
          <Disciplines />
        </StackSection>

        {/* Normal flow from here. `relative z-10` lifts these above the pinned
            panels so they scroll over the top of them rather than under. */}
        <div className="relative z-10 bg-brand-base">
          <SignatureRail />
          <PriceStatement />
          <StoryTeaser />
          <FindUs />
        </div>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </>
  );
}
