// components/Hero/Navbar.tsx
"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, type Variants } from "framer-motion";
import ReservationModal from "./ReservationModal";

const navLinks = [
  { title: "The Shahi Reserve", href: "#shahi-reserve" },
  { title: "Culinary Heritage", href: "#heritage" },
  { title: "Private Dastarkhwan", href: "#dastarkhwan" },
  { title: "Concierge", href: "#concierge" },
];

const LINK_SPRING = { stiffness: 160, damping: 14, mass: 0.4 };

function MagneticLink({ href, children }: { href: string; children: ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, LINK_SPRING);
  const y = useSpring(rawY, LINK_SPRING);

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      rawX.set((e.clientX - rect.left - rect.width / 2) * 0.25);
      rawY.set((e.clientY - rect.top - rect.height / 2) * 0.4);
    },
    [rawX, rawY]
  );
  const reset = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x, y, willChange: "transform" }}
      className="group relative inline-block"
    >
      <span aria-hidden className="invisible block font-heading italic text-sm py-1">{children}</span>
      <span
        className="absolute inset-0 flex items-center font-body text-[10px] uppercase tracking-[0.2em] text-white
          opacity-100 scale-100 transition-[opacity,transform] duration-400 ease-[cubic-bezier(0.76,0,0.24,1)]
          group-hover:opacity-0 group-hover:scale-95 transform-gpu"
        style={{ willChange: "opacity, transform" }}
      >
        {children}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 flex items-center font-heading italic text-sm text-[#E5A93C]
          opacity-0 scale-95 transition-[opacity,transform] duration-400 ease-[cubic-bezier(0.76,0,0.24,1)]
          group-hover:opacity-100 group-hover:scale-105 transform-gpu"
        style={{ willChange: "opacity, transform" }}
      >
        {children}
      </span>
    </motion.a>
  );
}

function SealButton({
  open,
  onClick,
  registerRef,
  label,
}: {
  open: boolean;
  onClick: () => void;
  registerRef: (el: HTMLButtonElement | null) => void;
  label: string;
}) {
  return (
    <button
      ref={registerRef}
      onClick={onClick}
      aria-label={label}
      aria-expanded={open}
      className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center cursor-pointer text-white transform-gpu"
      style={{ willChange: "transform" }}
    >
      <motion.svg
        viewBox="0 0 48 48"
        className="absolute inset-0 w-full h-full"
        animate={{ rotate: open ? 135 : 0 }}
        transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        style={{ willChange: "transform" }}
      >
        <circle cx="24" cy="24" r="21" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        <circle cx="24" cy="24" r="16" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.3" strokeDasharray="2 3" />
        <line x1="16" y1="24" x2="32" y2="24" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="24" y1="16" x2="24" y2="32" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity={open ? 0 : 1} className="transition-opacity duration-300" />
      </motion.svg>
    </button>
  );
}

function JaliBackdrop() {
  return (
    <motion.svg
      aria-hidden
      className="absolute -inset-[20%] w-[140%] h-[140%] pointer-events-none opacity-[0.06]"
      animate={{ rotate: 360 }}
      transition={{ duration: 160, repeat: Infinity, ease: "linear" }}
      style={{ willChange: "transform" }}
    >
      <defs>
        <pattern id="jali" width="10%" height="10%" patternUnits="userSpaceOnUse">
          <path d="M0 5 L5 0 L10 5 L5 10 Z" fill="none" stroke="#E5A93C" strokeWidth="0.5" />
          <circle cx="5" cy="5" r="1.4" fill="none" stroke="#E5A93C" strokeWidth="0.4" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#jali)" />
    </motion.svg>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [origin, setOrigin] = useState({ x: 0, y: 0, radius: 0 });
  const [visible, setVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const sealRef = useRef<HTMLButtonElement | null>(null);

  // Optimized Scroll Direction & Solid Background Tracker
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Toggle hard background trigger after 50px of scrolling
      setIsScrolled(currentScrollY > 50);

      // Hide navbar on scroll down, show immediately on scroll up
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openMenu = useCallback(() => {
    const rect = sealRef.current?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth - 40;
    const y = rect ? rect.top + rect.height / 2 : 40;
    setOrigin({ x, y, radius: Math.hypot(window.innerWidth, window.innerHeight) });
    setMenuOpen(true);
  }, []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeMenu();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, closeMenu]);

  const listVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.35 } },
  };
  const linkVariants: Variants = {
    hidden: { y: "40px", opacity: 0 },
    visible: { y: "0px", opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };
  const fadeUp: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <>
      {/* Scroll-clash blur mask */}
      <div
        aria-hidden
        className="fixed top-0 left-0 right-0 z-[90] h-32 sm:h-36 pointer-events-none"
        style={{
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          maskImage: "linear-gradient(to bottom, black 35%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 35%, transparent 100%)",
        }}
      />

      <motion.header
        initial={{ y: 0 }}
        animate={{ y: visible ? 0 : "-120%" }}
        transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
        className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between
          px-5 sm:px-8 md:px-16 py-4 sm:py-5 transform-gpu transition-colors duration-500 ${
            isScrolled ? "bg-[#1A0B08]/90 backdrop-blur-md border-b border-[#E5A93C]/15 shadow-2xl" : "bg-transparent"
          }`}
        style={{ mixBlendMode: isScrolled ? "normal" : "difference" }}
      >
        <a href="#" className="font-heading text-lg sm:text-xl tracking-[0.15em] text-white">
          LAHORI WALA
        </a>

        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <MagneticLink key={link.href} href={link.href}>
              {link.title}
            </MagneticLink>
          ))}
        </nav>

        <div className="flex items-center gap-4 sm:gap-5">
          <div className="isolate" style={{ mixBlendMode: "normal" }}>
            <button
              onClick={() => setOrderModalOpen(true)}
              className="relative group px-4 sm:px-5 py-2 overflow-hidden rounded-full bg-[#E5A93C]/10 border border-[#E5A93C] text-[#E5A93C] font-body text-[10px] sm:text-xs uppercase tracking-[0.2em] transition-all duration-500 hover:bg-[#E5A93C] hover:text-[#0D0D0F] shadow-[0_0_15px_rgba(229,169,60,0.15)] cursor-pointer transform-gpu"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-[#E5A93C]/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 transform-gpu" />
              <span className="relative z-10 font-medium">Reserve</span>
            </button>
          </div>

          <SealButton
            open={menuOpen}
            onClick={() => (menuOpen ? closeMenu() : openMenu())}
            registerRef={(el) => (sealRef.current = el)}
            label={menuOpen ? "Close menu" : "Open menu"}
          />
        </div>
      </motion.header>

      {/* The Farmaan Unfurl Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            initial={{ clipPath: `circle(0px at ${origin.x}px ${origin.y}px)` }}
            animate={{ clipPath: `circle(${origin.radius}px at ${origin.x}px ${origin.y}px)` }}
            exit={{ clipPath: `circle(0px at ${origin.x}px ${origin.y}px)` }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
            style={{ willChange: "clip-path", backgroundColor: "#1A0B08" }}
            className="fixed inset-0 z-[110] overflow-hidden transform-gpu"
          >
            <JaliBackdrop />

            <span
              dir="rtl"
              lang="ur"
              aria-hidden
              className="pointer-events-none select-none absolute -bottom-[8vw] -right-[4vw]
                text-[38vw] sm:text-[22vw] leading-none text-[#F5EFEB]/[0.045] whitespace-nowrap"
              style={{ fontFamily: "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif" }}
            >
              لاہوری والا
            </span>

            <div className="relative z-10 h-full w-full flex flex-col justify-between px-6 sm:px-10 md:px-16 py-8 sm:py-10 md:py-14">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="flex items-center justify-between"
              >
                <span className="font-body text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#9E988F]">
                  The Royal Index
                </span>
                <SealButton open={menuOpen} onClick={closeMenu} registerRef={() => {}} label="Close menu" />
              </motion.div>

              {/* Refined Responsive Navigation Links Container */}
              <motion.nav
                variants={listVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col items-start gap-3 sm:gap-4 md:gap-5 my-auto py-6"
              >
                {navLinks.map((link, i) => (
                  <div key={link.href} className="overflow-hidden w-full group/item">
                    <motion.a
                      variants={linkVariants}
                      href={link.href}
                      onClick={closeMenu}
                      className="flex items-center gap-4 sm:gap-6 font-heading text-3xl sm:text-5xl md:text-7xl text-[#F5EFEB] hover:text-[#E5A93C] transition-colors duration-300 italic font-light transform-gpu py-1 cursor-pointer"
                    >
                      <span className="font-body not-italic text-xs sm:text-sm text-[#E5A93C]/70 tracking-widest group-hover/item:text-[#E5A93C] transition-colors">
                        0{i + 1}
                      </span>
                      <span className="relative inline-block group-hover/item:translate-x-2 transition-transform duration-500">
                        {link.title}
                      </span>
                    </motion.a>
                  </div>
                ))}
              </motion.nav>

              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 border-t border-[#F5EFEB]/10 pt-5 sm:pt-6 text-[#9E988F] font-body text-[10px] sm:text-xs tracking-widest uppercase"
              >
                <p>Ghakhar Plaza, Suite 402 — London / Lahore</p>
                <div className="flex gap-5 sm:gap-6">
                  <a href="#" className="hover:text-[#E5A93C] transition-colors">Instagram</a>
                  <a href="#" className="hover:text-[#E5A93C] transition-colors">Reservations</a>
                  <a href="#" className="hover:text-[#E5A93C] transition-colors">Press</a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ReservationModal isOpen={orderModalOpen} onClose={() => setOrderModalOpen(false)} />
    </>
  );
}