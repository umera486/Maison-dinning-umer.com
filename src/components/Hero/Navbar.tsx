"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import ReservationModal from "./ReservationModal";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  const menuVariants: Variants = {
    hidden: { opacity: 0, y: "-100%" },
    visible: {
      opacity: 1,
      y: "0%",
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
    },
    exit: {
      opacity: 0,
      y: "-100%",
      transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] },
    },
  };

  const linkVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: 0.3 + i * 0.1, ease: [0.6, 0.01, -0.05, 0.95] },
    }),
  };

  const navLinks = [
    { title: "The Menu", href: "#menu" },
    { title: "Philosophy", href: "#story" },
    { title: "Chef's Table", href: "#chef" },
    { title: "Private Dining", href: "#private" },
    { title: "Contact", href: "#contact" },
  ];

  return (
    <>
      {/* Compact, Non-Collapsing Fixed Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-5 sm:px-8 md:px-16 py-3.5 sm:py-4 backdrop-blur-xl bg-[#0D0D0F]/80 border-b border-[#F5EFEB]/10 transform-gpu"
      >
        <div className="flex items-center gap-4 sm:gap-6">
          <a href="#" className="font-heading text-xl sm:text-2xl tracking-wider text-[#F5EFEB]">
            MAISON
          </a>
          
          <button
            onClick={() => setOrderModalOpen(true)}
            className="relative group px-4 sm:px-5 py-2 overflow-hidden rounded-full bg-[#E5A93C]/10 border border-[#E5A93C] text-[#E5A93C] font-body text-[10px] sm:text-xs uppercase tracking-[0.2em] transition-all duration-500 hover:bg-[#E5A93C] hover:text-[#0D0D0F] shadow-[0_0_15px_rgba(229,169,60,0.15)] cursor-pointer"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-[#E5A93C]/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
            <span className="relative z-10 font-medium">Reserve</span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2.5 text-[#F5EFEB] font-body text-[10px] sm:text-xs uppercase tracking-[0.2em] group py-1.5 px-2.5 rounded-full hover:bg-[#F5EFEB]/5 transition-colors cursor-pointer"
          >
            <span className="text-[#9E988F] group-hover:text-[#F5EFEB] transition-colors">
              {menuOpen ? "Close" : "Menu"}
            </span>
            <div className="w-7 h-5 flex flex-col justify-between items-end">
              <span className={`h-[1.5px] w-full bg-[#F5EFEB] transition-transform duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`h-[1.5px] w-3/4 bg-[#E5A93C] transition-opacity duration-300 ${menuOpen ? "opacity-0" : "opacity-100"}`} />
              <span className={`h-[1.5px] w-full bg-[#F5EFEB] transition-transform duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </div>
          </button>
        </div>
      </motion.header>

      {/* Fullscreen Navigation Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[110] bg-[#0D0D0F] flex flex-col justify-between px-6 md:px-20 py-10 overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-[#F5EFEB]/10 pb-6">
              <span className="font-heading text-2xl tracking-wider text-[#F5EFEB]">MAISON DINING</span>
              <button 
                onClick={() => setMenuOpen(false)}
                className="font-body text-xs uppercase tracking-widest text-[#9E988F] hover:text-[#E5A93C] transition-colors cursor-pointer"
              >
                [ Close ]
              </button>
            </div>

            <nav className="flex flex-col gap-4 md:gap-6 my-auto">
              {navLinks.map((link, i) => (
                <div key={i} className="overflow-hidden">
                  <motion.a
                    custom={i}
                    variants={linkVariants}
                    initial="hidden"
                    animate="visible"
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="font-heading text-4xl sm:text-6xl md:text-7xl text-[#F5EFEB] hover:text-[#E5A93C] transition-colors duration-300 italic font-light inline-block"
                  >
                    {link.title}
                  </motion.a>
                </div>
              ))}
            </nav>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-[#F5EFEB]/10 pt-6 text-[#9E988F] font-body text-xs tracking-widest uppercase">
              <p>Ghakhar Plaza, Suite 402 — Paris / Lahore</p>
              <div className="flex gap-6">
                <a href="#" className="hover:text-[#E5A93C] transition-colors">Instagram</a>
                <a href="#" className="hover:text-[#E5A93C] transition-colors">Reservations</a>
                <a href="#" className="hover:text-[#E5A93C] transition-colors">Press</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ReservationModal 
        isOpen={orderModalOpen} 
        onClose={() => setOrderModalOpen(false)} 
      />
    </>
  );
}