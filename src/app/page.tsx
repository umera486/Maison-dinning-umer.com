"use client";

import { useState } from "react";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Hero/Navbar";
import HeroText from "@/components/Hero/HeroText";
import HeroVisual from "@/components/Hero/HeroVisual";
import StackSection from "@/components/layout/StackSection";

// Naye generated components imports
import CulinaryPillars from "@/components/sections/CulinaryPillars";
import Gallery from "@/components/sections/Gallery";
import Press from "@/components/sections/Press";
import Footer from "@/components/sections/Footer";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <main className="relative bg-brand-base text-brand-surface">
      {!isLoaded && <Preloader onComplete={() => setIsLoaded(true)} />}

      {isLoaded && (
        <>
          {/* Navbar wrapper z-[100] lazmi dena taake stacking cards iske upar se na guzrein */}
          <div className="relative z-[100]">
            <Navbar />
          </div>

          {/* TILE 0: Tumhara Original HeroText */}
          <StackSection index={0} first>
            <HeroText />
          </StackSection>

          {/* TILE 1: Tumhara Original HeroVisual / Showcase */}
          <StackSection index={1}>
            <HeroVisual />
          </StackSection>

          {/* TILES 2, 3, 4: Culinary Pillars (Internal loop takes 3 indices) */}
          <CulinaryPillars startIndex={2} />

          {/* TILE 5: The Gallery */}
          <Gallery index={5} />

          {/* TILE 6: Press & Recognition */}
          <Press index={6} />

          {/* TILE 7: Footer & Reservations */}
          <Footer index={7} />
        </>
      )}
    </main>
  );
}