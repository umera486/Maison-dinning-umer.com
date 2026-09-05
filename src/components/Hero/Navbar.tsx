// src/components/Hero/Navbar.tsx
"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useMotionValue, useSpring, type Variants } from "framer-motion";
import MagneticButton from "@/components/shared/MagneticButton";

// Digital Menu-Centric Navigation Routes
const navLinks = [
  { title: "The Menu", href: "/private-dining" },
  { title: "Pre-Order Feasts", href: "/shahi-reserve" },
  { title: "Our Story", href: "/heritage" },
  { title: "Dispatch & Track", href: "/contact" },
];

const LINK_SPRING = { stiffness: 160, damping: 14, mass: 0.4 };

function MagneticLink({ href, children }: { href: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, LINK_SPRING);
  const y = useSpring(rawY, LINK_SPRING);

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
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
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x, y, willChange: "transform" }}
      className="group relative inline-block"
    >
      <Link href={href} className="relative inline-block py-1">
        <span aria-hidden className="invisible block font-heading italic text-sm">
          {children}
        </span>
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
      </Link>
    </motion.div>
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
      className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center cursor-pointer text-white transform-gpu hover:text-[#E5A93C] transition-colors"
      style={{ willChange: "transform" }}
    >
      <motion.svg
        viewBox="0 0 48 48"
        className="absolute inset-0 w-full h-full"
        animate={{ rotate: open ? 135 : 0 }}
        transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        style={{ willChange: "transform" }}
      >
        <circle cx="24" cy="24" r="21" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <circle cx="24" cy="24" r="16" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.3" strokeDasharray="2 3" />
        <line x1="16" y1="24" x2="32" y2="24" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <line
          x1="24"
          y1="16"
          x2="24"
          y2="32"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity={open ? 0 : 1}
          className="transition-opacity duration-300"
        />
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
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [origin, setOrigin] = useState({ x: 0, y: 0, radius: 0 });
  const [visible, setVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const sealRef = useRef<HTMLButtonElement | null>(null);

  // Real-time Cart synchronization bridge
  useEffect(() => {
    const handleCartUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ count: number }>;
      if (typeof customEvent.detail?.count === "number") {
        setCartCount(customEvent.detail.count);
      }
    };

    window.addEventListener("cart:update", handleCartUpdate);

    try {
      const stored = localStorage.getItem("lw-cart-store");
      if (stored) {
        const parsed = JSON.parse(stored);
        const items = parsed?.state?.items || [];
        const count = items.reduce((acc: number, item: { quantity?: number }) => acc + (item.quantity || 1), 0);
        setCartCount(count);
      }
    } catch {
      // Graceful fallback
    }

    return () => window.removeEventListener("cart:update", handleCartUpdate);
  }, []);

  const handleOpenCart = useCallback(() => {
    window.dispatchEvent(new CustomEvent("cart:open"));
  }, []);

  const handleOrderNow = useCallback(() => {
    if (window.location.pathname === "/") {
      const menuSection = document.getElementById("menu");
      if (menuSection) {
        menuSection.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    router.push("/#menu");
  }, [router]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);

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
    return () => { document.body.style.overflow = ""; };
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
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: visible ? 0 : "-120%" }}
        transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
        className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between
          px-4 sm:px-8 md:px-16 py-3.5 sm:py-5 transform-gpu transition-colors duration-500 ${
            isScrolled ? "bg-[#140805] border-b border-[#E5A93C]/15 shadow-2xl" : "bg-transparent"
          }`}
        style={{ mixBlendMode: isScrolled ? "normal" : "difference" }}
      >
        {/* Brand Monogram: Compact on mobile */}
        <Link href="/" className="font-heading text-sm sm:text-base lg:text-xl tracking-[0.12em] lg:tracking-[0.15em] text-white shrink-0">
          LAHORI WALA
        </Link>

        {/* Center Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-9">
          {navLinks.map((link) => (
            <MagneticLink key={link.href} href={link.href}>
              {link.title}
            </MagneticLink>
          ))}
        </nav>

        {/* Action Controls Cluster: Tighter mobile spacing */}
        <div className="flex items-center gap-2 sm:gap-4 isolate" style={{ mixBlendMode: "normal" }}>
          
          {/* Order Now Trigger: Hidden on extremely small screens (<360px), compact otherwise */}
          <MagneticButton
            onClick={handleOrderNow}
            className="hidden min-[360px]:inline-flex px-3.5 sm:px-6 py-1.5 sm:py-2 rounded-full border border-[#E5A93C]/50 bg-[#120604] text-white font-body text-[9px] sm:text-xs uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(229,169,60,0.12)]"
          >
            <span className="hidden sm:inline">Order Now</span>
            <span className="inline sm:hidden">Order</span>
          </MagneticButton>

          {/* Luxury Cart Trigger: Crisp and completely solid, no blur */}
          <button
            onClick={handleOpenCart}
            className="group relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/20 bg-[#120604] text-white hover:border-[#E5A93C] transition-all duration-300 cursor-pointer transform-gpu shrink-0"
            aria-label={`Open Cart with ${cartCount} items`}
          >
            <svg
              viewBox="0 0 24 24"
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-current fill-none stroke-[1.8] group-hover:text-[#E5A93C] transition-colors"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <span className="hidden sm:inline font-body text-[10px] uppercase tracking-[0.2em] font-semibold">
              Cart
            </span>
            <span className="font-mono text-[10px] sm:text-xs font-bold text-[#E5A93C] tracking-wider">
              [{cartCount}]
            </span>
          </button>

          {/* Architectural Seal Menu Toggle */}
          <SealButton
            open={menuOpen}
            onClick={() => (menuOpen ? closeMenu() : openMenu())}
            registerRef={(el) => (sealRef.current = el)}
            label={menuOpen ? "Close navigation" : "Open navigation"}
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
            style={{ willChange: "clip-path", backgroundColor: "#140805" }}
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
                  The Culinary Index // London
                </span>
                <SealButton open={menuOpen} onClick={closeMenu} registerRef={() => {}} label="Close menu" />
              </motion.div>

              <motion.nav
                variants={listVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col items-start gap-3 sm:gap-4 md:gap-5 my-auto py-6"
              >
                {navLinks.map((link, i) => (
                  <div key={link.href} className="overflow-hidden w-full group/item">
                    <motion.div variants={linkVariants}>
                      <Link
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
                      </Link>
                    </motion.div>
                  </div>
                ))}
              </motion.nav>

              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 border-t border-[#F5EFEB]/10 pt-5 sm:pt-6 text-[#9E988F] font-body text-[10px] sm:text-xs tracking-widest uppercase"
              >
                <p>Ghakhar Plaza, Suite 402 — Central London</p>
                <div className="flex gap-5 sm:gap-6 items-center flex-wrap">
                  <button
                    onClick={() => {
                      closeMenu();
                      handleOpenCart();
                    }}
                    className="hover:text-[#E5A93C] transition-colors uppercase cursor-pointer"
                  >
                    View Cart [{cartCount}]
                  </button>
                  <Link
                    href="/#menu"
                    onClick={closeMenu}
                    className="hover:text-[#E5A93C] transition-colors uppercase text-[#E5A93C]"
                  >
                    Order Online
                  </Link>
                  <Link href="/contact" onClick={closeMenu} className="hover:text-[#E5A93C] transition-colors">
                    Dispatch Hotline
                  </Link>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}