// app/page.tsx
"use client";

import { useState } from "react";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Hero/Navbar";
import HeroText from "@/components/Hero/HeroText";
import HeroVisual from "@/components/Hero/HeroVisual";
import StackSection from "@/components/layout/StackSection";

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
          <div className="relative z-[100]">
            <Navbar />
          </div>

          <StackSection index={0}>
            <HeroText />
          </StackSection>

          <StackSection index={1}>
            <HeroVisual />
          </StackSection>

          {/* Culinary Pillars (Normal Flow) */}
          <div className="relative z-10 w-full bg-brand-base">
            <CulinaryPillars />
          </div>

          {/* Shoppable Gallery (Normal Flow) */}
          <Gallery />

          {/* Press & Footer (Retaining Stack Section Behavior) */}
          <StackSection index={2}>
            <Press />
          </StackSection>

          <StackSection index={3}>
            <Footer />
          </StackSection>
        </>
      )}
    </main>
  );
}