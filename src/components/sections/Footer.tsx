// components/sections/Footer.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, ArrowUpRight, Zap, ChevronUp } from "lucide-react";
import Link from "next/link";

const footerLinks = [
  { name: "The Menu", href: "#menu" },
  { name: "Pre-Order Feasts", href: "#pre-order" },
  { name: "Our Story", href: "#story" },
  { name: "Dispatch & Track", href: "#dispatch" }
];

export default function Footer() {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative w-full bg-brand-base text-brand-surface overflow-hidden">
      {/* 1. THE SMOOTH LAHORI RIBBON (Marquee without block dividers) */}
      <div className="relative bg-[#E5A93C] py-5 md:py-6 border-y-[6px] border-brand-base overflow-hidden skew-y-[-1deg] z-30 shadow-xl">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-brand-base via-brand-base/40 to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-brand-base via-brand-base/40 to-transparent z-20 pointer-events-none" />
        
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap items-center"
        >
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-10 md:gap-16 px-6">
              <span className="font-heading italic text-2xl md:text-5xl font-light text-brand-base tracking-wide uppercase">
                MUGHAL HERITAGE &amp; LAHORI STREET MASTERY
              </span>
              <span className="text-[#B91C1C] text-xl">✦</span>
              <span className="font-heading italic text-2xl md:text-5xl font-bold text-brand-base tracking-wide uppercase">
                100% ZABIHA HALAL
              </span>
              <span className="text-[#B91C1C] text-xl">✦</span>
              <span className="font-heading italic text-2xl md:text-5xl font-light text-brand-base tracking-wide uppercase">
                900°C LIVE FIRE CHARCOAL
              </span>
              <span className="text-[#B91C1C] text-xl">✦</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* 2. MAIN FOOTER CONTENT SECTION */}
      <div className="bg-brand-base px-6 md:px-12 lg:px-24 py-16 md:py-20 relative overflow-hidden border-t border-brand-surface/10">
        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#FAF7F2_1px,transparent_1px),linear-gradient(to_bottom,#FAF7F2_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        <div className="max-w-[1700px] mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24">
            
            {/* BRANDING & CONTACT */}
            <div className="md:col-span-5 space-y-8">
              <h2 className="font-heading italic text-4xl md:text-6xl font-light text-brand-surface leading-none tracking-tighter">
                LAHORI <br />
                WALA <span className="text-brand-accent not-italic font-bold">LONDON.</span>
              </h2>
              
              <div className="space-y-5 font-body">
                <div className="flex items-start gap-4">
                  <MapPin size={20} className="text-brand-accent shrink-0 mt-1" />
                  <p className="text-brand-surface/80 font-light uppercase text-xs md:text-sm tracking-widest leading-relaxed">
                    Central London Kitchens <br /> 
                    Mayfair &amp; Whitechapel, London, UK
                  </p>
                </div>
                
                <a href="tel:442079460921" className="flex items-center gap-4 group w-fit">
                  <Phone size={20} className="text-brand-accent shrink-0" />
                  <p className="text-brand-surface font-heading italic text-lg tracking-wider group-hover:text-brand-accent transition-colors">
                    +44 20 7946 0921
                  </p>
                </a>

                <a href="mailto:orders@lahoriwala.co.uk" className="flex items-center gap-4 group w-fit">
                  <Mail size={20} className="text-brand-accent shrink-0" />
                  <p className="text-brand-surface/80 font-body text-xs tracking-widest group-hover:translate-x-1 transition-transform">
                    orders@lahoriwala.co.uk
                  </p>
                </a>
              </div>
            </div>

            {/* NAV LINKS */}
            <div className="md:col-span-3 space-y-6">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-brand-accent border-b border-brand-surface/15 pb-2">
                Navigation_Index
              </p>
              <ul className="space-y-3.5">
                {footerLinks.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="font-body font-medium uppercase text-xs tracking-[0.2em] text-brand-surface/80 hover:text-brand-accent transition-all flex items-center gap-3 group"
                    >
                      <ArrowUpRight size={14} className="text-brand-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> 
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* STATUS & CLEAN RETURN BUTTON AREA (Minimal Text with Negative Space) */}
            <div className="md:col-span-4 space-y-8 bg-brand-surface/[0.03] p-6 md:p-8 border border-brand-surface/10 rounded-2xl backdrop-blur-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Zap size={16} className="text-brand-accent fill-brand-accent" />
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-brand-accent">
                    Kitchen_Status: Fully Operational
                  </span>
                </div>
              </div>
              
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={scrollToTop}
                className="w-full bg-brand-surface text-brand-base py-4 flex justify-center items-center gap-3 font-bold uppercase tracking-[0.3em] text-[10px] rounded-full hover:bg-brand-accent transition-all group relative overflow-hidden cursor-pointer"
              >
                <span className="relative z-10">Return to Top</span>
                <ChevronUp size={16} className="relative z-10 group-hover:-translate-y-1 transition-transform" />
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-base/10 to-transparent -translate-x-full"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
              </motion.button>
            </div>
          </div>

          {/* FINAL LEGAL BAR */}
          <div className="mt-16 pt-8 border-t border-brand-surface/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-brand-surface/40">
              © 2026 Lahori Wala London // ALL RIGHTS RESERVED // CRAFTED FOR CULINARY EXCELLENCE
            </p>
            <div className="flex gap-6 items-center">
               <a href="mailto:orders@lahoriwala.co.uk" aria-label="Email Us">
                 <Mail size={18} className="text-brand-surface/60 hover:text-brand-accent transition-colors" />
               </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}