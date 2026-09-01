"use client";

import { motion } from "framer-motion";
import StackSection from "@/components/layout/StackSection";

interface FooterProps {
  index: number;
  onOpenReservation?: () => void;
}

export default function Footer({ index, onOpenReservation }: FooterProps) {
  return (
    <StackSection index={index} className="bg-[#08080A] text-[#F5EFEB] flex flex-col justify-between relative overflow-hidden select-none">
      
      {/* Background Architectural Grid Lines (Zero Cost) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex justify-between px-6 sm:px-12 md:px-20 z-0">
        <div className="w-px h-full bg-[#F5EFEB]" />
        <div className="w-px h-full bg-[#F5EFEB] hidden md:block" />
        <div className="w-px h-full bg-[#F5EFEB]" />
      </div>

      {/* Top Editorial Status Bar */}
      <div className="px-6 sm:px-12 md:px-20 pt-16 sm:pt-20 md:pt-24 z-10 flex items-center justify-between border-b border-[#F5EFEB]/10 pb-6">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#E5A93C] shadow-[0_0_12px_rgba(229,169,60,0.8)] animate-pulse" />
          <span className="font-body text-[0.6rem] sm:text-[0.65rem] uppercase tracking-[0.35em] text-[#9E988F]">
            Sanctuary Status: Reservations Active
          </span>
        </div>
        <span className="font-body text-[0.6rem] sm:text-[0.65rem] uppercase tracking-[0.35em] text-[#E5A93C] hidden sm:inline font-medium">
          Paris — Lahore Node
        </span>
      </div>

      {/* Central Immersive Typography & Booking CTA */}
      <div className="px-6 sm:px-12 md:px-20 my-auto py-10 sm:py-16 z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-6 h-[1px] bg-[#E5A93C]" />
            <span className="font-body text-[0.6rem] sm:text-xs uppercase tracking-[0.3em] text-[#E5A93C]">
              The Final Movement
            </span>
          </div>
          <h2 className="font-heading font-light italic text-[clamp(3rem,10vw,9.5rem)] leading-[0.88] tracking-tight text-[#F5EFEB]">
            Secure <br />
            <span className="font-bold not-italic tracking-tighter text-[#E5A93C]">Your Table.</span>
          </h2>
        </div>

        {/* 100% GPU-Optimized Interactive Button (Zero JS lag) */}
        <button
          onClick={() => onOpenReservation ? onOpenReservation() : alert("Opening Digital Concierge...")}
          className="group relative px-8 sm:px-10 py-5 sm:py-6 rounded-full bg-[#E5A93C] text-[#08080A] font-body text-xs uppercase tracking-[0.3em] font-bold overflow-hidden shadow-[0_0_40px_rgba(229,169,60,0.25)] cursor-pointer shrink-0 transition-transform duration-500 hover:scale-[1.02] active:scale-[0.98] transform-gpu"
        >
          <span className="relative z-10 flex items-center gap-4">
            Initialize Booking
            <span className="transform group-hover:translate-x-1.5 transition-transform duration-300">→</span>
          </span>
          <div className="absolute inset-0 bg-white/25 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 ease-out" />
        </button>
      </div>

      {/* Swiss Architectural Information Matrix */}
      <div className="px-6 sm:px-12 md:px-20 pb-12 pt-8 border-t border-[#F5EFEB]/10 z-10 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 font-body text-xs">
        
        <div className="space-y-3">
          <p className="text-[0.6rem] uppercase tracking-[0.3em] text-[#9E988F] font-bold">
            Catalog Index
          </p>
          <ul className="space-y-2.5 text-[#F5EFEB]/80 font-light">
            <li className="hover:text-[#E5A93C] cursor-pointer transition-colors">01 — The Tasting Menu</li>
            <li className="hover:text-[#E5A93C] cursor-pointer transition-colors">02 — Reserve Cellar</li>
            <li className="hover:text-[#E5A93C] cursor-pointer transition-colors">03 — Obsidian Salon</li>
          </ul>
        </div>

        <div className="space-y-3">
          <p className="text-[0.6rem] uppercase tracking-[0.3em] text-[#9E988F] font-bold">
            Sanctuary Location
          </p>
          <ul className="space-y-2.5 text-[#F5EFEB]/80 font-light">
            <li>Ghakhar Plaza, Suite 402</li>
            <li className="text-[#E5A93C] font-medium">Paris / Lahore Node</li>
            <li className="text-[#9E988F]">Tue — Sat (18:00 onwards)</li>
          </ul>
        </div>

        <div className="space-y-3">
          <p className="text-[0.6rem] uppercase tracking-[0.3em] text-[#9E988F] font-bold">
            Direct Concierge
          </p>
          <p className="text-[#F5EFEB] font-medium hover:text-[#E5A93C] cursor-pointer transition-colors">
            concierge@maisondining.com
          </p>
          <p className="text-[#9E988F] font-light">
            +92 300 0000000
          </p>
        </div>

        <div className="space-y-3 flex flex-col justify-between">
          <div>
            <p className="text-[0.6rem] uppercase tracking-[0.3em] text-[#9E988F] font-bold">
              Governance
            </p>
            <span className="text-[#F5EFEB] font-medium block mt-1 tracking-wider">
              © Maison Dining SAS
            </span>
          </div>
          <span className="text-[#9E988F] text-[0.6rem] uppercase tracking-[0.2em] block">
            Imprint · Privacy · Terms
          </span>
        </div>

      </div>

    </StackSection>
  );
}