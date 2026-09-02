// components/sections/Footer.tsx
"use client";

import { useCallback } from "react";
import StackSection from "@/components/layout/StackSection";
import MagneticButton from "@/components/shared/MagneticButton";

export default function Footer({ index }: { index: number }) {
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <StackSection 
      index={index} 
      className="bg-[#1A0B08] text-[#F5EFEB] flex flex-col justify-between overflow-y-auto relative selection:bg-[#E5A93C] selection:text-[#1A0B08]"
    >
      {/* Precision Matrix Table Grid Background */}
      <div 
        aria-hidden 
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(229, 169, 60, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(229, 169, 60, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: "36px 36px"
        }}
      />

      {/* Slim Integrated Marquee */}
      <div className="relative z-10 w-full bg-[#E5A93C] text-[#1A0B08] py-2.5 overflow-hidden select-none border-y border-[#1A0B08]/20 shadow-md shrink-0">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 mx-4 font-body text-[10px] sm:text-xs uppercase tracking-[0.25em] font-bold">
              <span>✦ New Arrivals: Royal Lahori Nihari</span>
              <span>•</span>
              <span>Smoked Charcoal Lamb Chops</span>
              <span>•</span>
              <span>Artisanal Khoya Kheer</span>
              <span>•</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Container - Compact Spacing to Fit Viewport */}
      <div className="relative z-10 px-4 sm:px-8 md:px-16 py-6 sm:py-8 flex flex-col gap-4 sm:gap-6 my-auto max-w-5xl mx-auto w-full">
        
        {/* Two Fused Square Blocks in a Single Row (Even on Mobile) */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4 w-full border border-[#E5A93C]/40 bg-[#1A0B08]">
          
          {/* Block 1 */}
          <div className="bg-[#24100C] p-4 sm:p-6 flex flex-col justify-between border-r border-[#E5A93C]/30 min-h-[160px] sm:min-h-[200px]">
            <div>
              <span className="font-body text-[8px] sm:text-[10px] uppercase tracking-[0.25em] text-[#E5A93C] block mb-1">
                The Reserve
              </span>
              <h3 className="font-heading italic text-lg sm:text-2xl text-[#F5EFEB] font-light leading-tight">
                Private Dining &amp; Darbar Hall
              </h3>
            </div>
            <div className="pt-4">
              <MagneticButton
                onClick={() => alert("Opening reservation gateway...")}
                className="px-4 py-2 rounded-none bg-[#E5A93C] text-[#1A0B08] font-body text-[10px] uppercase tracking-[0.2em] font-bold cursor-pointer"
              >
                Reserve
              </MagneticButton>
            </div>
          </div>

          {/* Block 2 */}
          <div className="bg-[#1F0D0A] p-4 sm:p-6 flex flex-col justify-between min-h-[160px] sm:min-h-[200px]">
            <div>
              <span className="font-body text-[8px] sm:text-[10px] uppercase tracking-[0.25em] text-[#E5A93C] block mb-1">
                Authenticity
              </span>
              <h3 className="font-heading italic text-lg sm:text-2xl text-[#F5EFEB] font-light leading-tight">
                100% Halal Certified Punjab Spices
              </h3>
            </div>
            <div className="pt-4">
              <a 
                href="#menu" 
                className="inline-flex items-center gap-1.5 font-heading italic text-xs sm:text-sm text-[#E5A93C] hover:text-[#F5EFEB] transition-colors"
              >
                <span>View Menu</span>
                <span>→</span>
              </a>
            </div>
          </div>

        </div>

        {/* Single Horizontal Block for Links, Info & Return Button */}
        <div className="w-full bg-[#1F0D0A]/95 backdrop-blur-md border border-[#E5A93C]/40 p-4 sm:p-6 flex flex-col gap-4 shadow-xl">
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-body text-[11px] sm:text-xs">
            <div className="space-y-1.5">
              <p className="text-[9px] uppercase tracking-[0.25em] text-[#E5A93C] font-bold">Navigation</p>
              <ul className="space-y-1 text-[#9E988F]">
                <li><a href="#shahi-reserve" className="hover:text-[#F5EFEB] transition-colors">The Reserve</a></li>
                <li><a href="#heritage" className="hover:text-[#F5EFEB] transition-colors">Heritage</a></li>
                <li><a href="#concierge" className="hover:text-[#F5EFEB] transition-colors">Concierge</a></li>
              </ul>
            </div>

            <div className="space-y-1.5">
              <p className="text-[9px] uppercase tracking-[0.25em] text-[#E5A93C] font-bold">Location</p>
              <p className="text-[#F5EFEB]">142 Green Street</p>
              <p className="text-[#9E988F]">London E7 8JQ</p>
            </div>

            <div className="space-y-1.5">
              <p className="text-[9px] uppercase tracking-[0.25em] text-[#E5A93C] font-bold">Contact</p>
              <p><a href="mailto:concierge@lahoriwala.co.uk" className="text-[#9E988F] hover:text-[#F5EFEB]">Concierge Email</a></p>
              <p className="text-[#F5EFEB]">+44 20 7946 0000</p>
            </div>

            <div className="space-y-1.5">
              <p className="text-[9px] uppercase tracking-[0.25em] text-[#E5A93C] font-bold">Social &amp; Legal</p>
              <ul className="space-y-1 text-[#9E988F]">
                <li><a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#F5EFEB]">Instagram</a></li>
                <li><a href="#privacy" className="hover:text-[#F5EFEB]">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          {/* Compact Return-to-Top Button */}
          <div className="pt-3 border-t border-[#F5EFEB]/10 flex justify-center">
            <button
              onClick={scrollToTop}
              className="w-full sm:w-auto px-6 py-2.5 rounded-none border border-[#E5A93C] bg-[#24100C] text-[#F5EFEB] font-body text-[10px] uppercase tracking-[0.25em] flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 hover:bg-[#E5A93C] hover:text-[#1A0B08]"
            >
              <span>Return to Top</span>
              <span className="text-sm">↑</span>
            </button>
          </div>

        </div>

      </div>

      {/* Minimal Footer Bottom Bar */}
      <div className="relative z-10 px-4 sm:px-8 md:px-16 py-3 border-t border-[#E5A93C]/30 flex flex-col sm:flex-row items-center justify-between gap-2 font-body text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-[#9E988F] shrink-0 bg-[#1A0B08]">
        <span>© {new Date().getFullYear()} Lahori Wala Ltd. All Rights Reserved.</span>
        <span className="font-heading italic text-[#E5A93C]">Lahori Wala.</span>
      </div>
    </StackSection>
  );
}