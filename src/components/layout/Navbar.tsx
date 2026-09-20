// src/components/layout/Navbar.tsx
"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { Phone, MapPin, ShieldCheck } from "lucide-react";
import { navLinks, site, socials, telHref, mapsHref, isPlaceholder } from "@/lib/site";
import { socialIcons } from "@/components/shared/SocialIcons";
import { EASE_LAHORI, EASE_SEAL } from "@/lib/motion";

/**
 * Performance notes for this file:
 *
 *  - The scroll handler is rAF-throttled and guarded by refs, so React only
 *    re-renders when a boolean actually flips. The previous version called
 *    two setState functions on every single scroll event.
 *  - `mixBlendMode: "difference"` was removed from the header. A blend mode on
 *    a fixed element forces the compositor to re-read backdrop pixels every
 *    frame while scrolling, and it made the wordmark's colour unpredictable
 *    over photography. A solid scrim is both faster and legible.
 *  - No `backdrop-filter`. Blur over a scrolling page is one of the most
 *    reliable ways to lose frames on a mid-range Android.
 */

const LINK_SPRING = { stiffness: 160, damping: 14, mass: 0.4 };

/** Desktop-only cursor-follow. Gated by a media query so phones never run it. */
function MagneticLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion() ?? false;
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, LINK_SPRING);
  const y = useSpring(rawY, LINK_SPRING);

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduceMotion || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      rawX.set((e.clientX - rect.left - rect.width / 2) * 0.25);
      rawY.set((e.clientY - rect.top - rect.height / 2) * 0.4);
    },
    [rawX, rawY, reduceMotion]
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
      style={{ x, y }}
      className="group relative inline-block"
    >
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className="relative inline-block py-1 px-0.5"
      >
        {/* Reserves the width of the italic serif state so the row never
            reflows when the two layers cross-fade on hover. */}
        <span aria-hidden className="invisible block font-heading italic text-sm whitespace-nowrap">
          {children}
        </span>

        <span
          className={`absolute inset-0 flex items-center justify-center font-body text-[10px] uppercase tracking-[0.2em]
            transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] transform-gpu
            group-hover:opacity-0 group-hover:scale-95
            ${active ? "text-brand-accent" : "text-brand-surface"}`}
        >
          {children}
        </span>

        <span
          aria-hidden
          className="absolute inset-0 flex items-center justify-center font-heading italic text-sm text-brand-accent
            opacity-0 scale-95 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.76,0,0.24,1)]
            transform-gpu group-hover:opacity-100 group-hover:scale-105 whitespace-nowrap"
        >
          {children}
        </span>

        {active && (
          <motion.span
            layoutId="nav-active-dot"
            className="absolute -bottom-1 left-1/2 w-1 h-1 -translate-x-1/2 rounded-full bg-brand-accent"
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
          />
        )}
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
  registerRef?: (el: HTMLButtonElement | null) => void;
  label: string;
}) {
  return (
    <button
      ref={registerRef}
      onClick={onClick}
      aria-label={label}
      aria-expanded={open}
      className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center
        text-brand-surface hover:text-brand-accent transition-colors cursor-pointer shrink-0 transform-gpu"
    >
      <motion.svg
        viewBox="0 0 48 48"
        className="absolute inset-0 w-full h-full"
        animate={{ rotate: open ? 135 : 0 }}
        transition={{ duration: 0.7, ease: EASE_SEAL }}
      >
        <circle cx="24" cy="24" r="21" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <circle cx="24" cy="24" r="16" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.3" strokeDasharray="2 3" />
        <line x1="16" y1="24" x2="32" y2="24" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <motion.line
          x1="24"
          y1="16"
          x2="24"
          y2="32"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          animate={{ opacity: open ? 0 : 1 }}
          transition={{ duration: 0.25 }}
        />
      </motion.svg>
    </button>
  );
}

/**
 * Rotating jali lattice behind the overlay. It only exists while the overlay
 * is mounted, and the rotation is a pure transform on an already-rasterised
 * SVG — the compositor handles it without repainting the pattern.
 */
function JaliBackdrop() {
  const reduceMotion = useReducedMotion() ?? false;
  return (
    <motion.svg
      aria-hidden
      className="absolute -inset-[20%] w-[140%] h-[140%] pointer-events-none opacity-[0.07] transform-gpu"
      animate={reduceMotion ? undefined : { rotate: 360 }}
      transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
    >
      <defs>
        <pattern id="jali" width="56" height="56" patternUnits="userSpaceOnUse">
          <path d="M0 28 L28 0 L56 28 L28 56 Z" fill="none" stroke="currentColor" strokeWidth="0.8" />
          <circle cx="28" cy="28" r="7" fill="none" stroke="currentColor" strokeWidth="0.6" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#jali)" className="text-brand-accent" />
    </motion.svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [origin, setOrigin] = useState({ x: 0, y: 0, radius: 0 });
  const [visible, setVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const sealRef = useRef<HTMLButtonElement | null>(null);

  // Refs mirror the state so the scroll handler can compare without
  // re-subscribing, and only calls setState on an actual change.
  const lastScrollY = useRef(0);
  const visibleRef = useRef(true);
  const scrolledRef = useRef(false);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const read = () => {
      frame.current = null;
      const y = window.scrollY;

      const nextScrolled = y > 40;
      if (nextScrolled !== scrolledRef.current) {
        scrolledRef.current = nextScrolled;
        setIsScrolled(nextScrolled);
      }

      // Ignore sub-pixel jitter and iOS rubber-banding past the top.
      const delta = y - lastScrollY.current;
      if (Math.abs(delta) > 6) {
        const nextVisible = delta < 0 || y < 100;
        if (nextVisible !== visibleRef.current) {
          visibleRef.current = nextVisible;
          setVisible(nextVisible);
        }
        lastScrollY.current = y;
      }
    };

    const onScroll = () => {
      if (frame.current === null) frame.current = requestAnimationFrame(read);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    read();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, []);

  const openMenu = useCallback(() => {
    const rect = sealRef.current?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth - 40;
    const y = rect ? rect.top + rect.height / 2 : 40;
    setOrigin({ x, y, radius: Math.hypot(window.innerWidth, window.innerHeight) });
    setMenuOpen(true);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Close on navigation — otherwise the overlay survives a route change.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen, closeMenu]);

  const listVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07, delayChildren: 0.3 } },
  };
  const linkVariants: Variants = {
    hidden: { y: "105%" },
    visible: { y: "0%", transition: { duration: 0.7, ease: EASE_LAHORI } },
  };
  const fadeUpVariant: Variants = {
    hidden: { y: 16, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: EASE_LAHORI } },
  };

  const liveSocials = socials.filter((s) => s.confirmed && !isPlaceholder(s.href));

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: visible ? 0 : "-130%" }}
        transition={{ duration: 0.4, ease: EASE_SEAL }}
        className={`fixed top-0 left-0 right-0 z-100 transform-gpu transition-colors duration-500 ${
          isScrolled
            ? "bg-brand-base/95 border-b border-brand-accent/15 shadow-[0_8px_30px_rgb(0_0_0/0.4)]"
            : "bg-linear-to-b from-brand-base/80 to-transparent"
        }`}
      >
        <div className="flex items-center justify-between gap-3 px-4 sm:px-8 lg:px-12 h-14 sm:h-16 lg:h-20">
          {/* Wordmark */}
          <Link
            href="/"
            className="group flex items-baseline gap-1.5 shrink-0"
            aria-label={`${site.name} — home`}
          >
            <span className="font-heading text-[15px] sm:text-lg lg:text-xl tracking-[0.14em] text-brand-surface">
              {site.name}
            </span>
            <span className="w-1 h-1 rounded-full bg-brand-accent translate-y-[-2px] transition-transform duration-500 group-hover:scale-150" />
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
            {navLinks.map((link) => (
              <MagneticLink key={link.href} href={link.href} active={pathname === link.href}>
                {link.title}
              </MagneticLink>
            ))}
          </nav>

          {/* Actions. Calling is the single highest-value action for a
              takeaway, so it stays visible at every breakpoint. */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <a
              href={telHref}
              className="group flex items-center gap-2 rounded-full border border-brand-accent/45 bg-brand-accent/10
                px-3 sm:px-5 h-9 sm:h-10 text-brand-accent hover:bg-brand-accent hover:text-brand-base
                transition-colors duration-300 transform-gpu"
            >
              <Phone className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
              <span className="hidden sm:inline font-body text-[10px] uppercase tracking-[0.2em] font-semibold whitespace-nowrap">
                {site.phone.display}
              </span>
              <span className="sm:hidden font-body text-[10px] uppercase tracking-[0.15em] font-semibold">
                Call
              </span>
            </a>

            <SealButton
              open={menuOpen}
              onClick={() => (menuOpen ? closeMenu() : openMenu())}
              registerRef={(el) => (sealRef.current = el)}
              label={menuOpen ? "Close navigation" : "Open navigation"}
            />
          </div>
        </div>
      </motion.header>

      {/* Fullscreen overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            initial={{ clipPath: `circle(0px at ${origin.x}px ${origin.y}px)` }}
            animate={{ clipPath: `circle(${origin.radius}px at ${origin.x}px ${origin.y}px)` }}
            exit={{ clipPath: `circle(0px at ${origin.x}px ${origin.y}px)` }}
            transition={{ duration: 0.85, ease: EASE_SEAL }}
            className="fixed inset-0 z-110 overflow-y-auto bg-brand-base transform-gpu"
            data-lenis-prevent
          >
            <JaliBackdrop />

            {/* Decorative Urdu wordmark. aria-hidden because it is texture,
                not content — a screen reader announcing it adds nothing. */}
            <span
              dir="rtl"
              lang="ur"
              aria-hidden
              className="pointer-events-none select-none absolute -bottom-[6vw] -right-[3vw]
                text-[34vw] sm:text-[20vw] leading-none text-brand-surface/[0.035] whitespace-nowrap"
              style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}
            >
              لاہوری والا
            </span>

            <div className="relative z-10 min-h-full flex flex-col justify-between px-5 sm:px-10 lg:px-14 py-4 sm:py-6">
              {/* Overlay header mirrors the bar height so the seal doesn't jump */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUpVariant}
                className="flex items-center justify-between h-10 sm:h-12"
              >
                <span className="font-body text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-brand-muted">
                  {site.branch} · {site.tagline}
                </span>
                <SealButton open onClick={closeMenu} label="Close navigation" />
              </motion.div>

              <motion.nav
                variants={listVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col items-start gap-1 sm:gap-2 py-8 sm:py-10"
              >
                {navLinks.map((link, i) => (
                  <div key={link.href} className="reveal-mask w-full group/item">
                    <motion.div variants={linkVariants} className="transform-gpu">
                      <Link
                        href={link.href}
                        onClick={closeMenu}
                        className="flex items-baseline gap-3 sm:gap-6 py-1.5 font-heading italic font-light
                          text-[clamp(2.75rem,13vw,6rem)] leading-[1.05] text-brand-surface
                          hover:text-brand-accent transition-colors duration-300"
                      >
                        <span className="font-body not-italic text-[10px] sm:text-xs text-brand-accent/70 tracking-[0.2em] shrink-0">
                          0{i + 1}
                        </span>
                        <span className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/item:translate-x-2 transform-gpu">
                          {link.title}
                        </span>
                      </Link>
                    </motion.div>
                  </div>
                ))}
              </motion.nav>

              <motion.div
                variants={fadeUpVariant}
                initial="hidden"
                animate="visible"
                className="border-t border-brand-surface/10 pt-5 sm:pt-6 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <a
                    href={mapsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-2.5 text-brand-muted hover:text-brand-accent transition-colors"
                  >
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-brand-accent" strokeWidth={1.6} />
                    <span className="font-body text-[11px] sm:text-xs tracking-[0.12em] uppercase leading-relaxed">
                      {site.address.line1}
                      <br />
                      {site.address.city} {site.address.postcode}
                    </span>
                  </a>

                  <a
                    href={telHref}
                    className="font-heading italic text-xl sm:text-2xl text-brand-surface hover:text-brand-accent transition-colors"
                  >
                    {site.phone.display}
                  </a>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <span className="inline-flex items-center gap-2 rounded-full border border-brand-green-light/30
                    bg-brand-green/15 px-3 py-1.5 text-brand-green-light">
                    <ShieldCheck className="w-3.5 h-3.5" strokeWidth={1.8} />
                    <span className="font-body text-[9px] uppercase tracking-[0.2em] font-semibold">
                      {site.halal.body} Certified Halal
                    </span>
                  </span>

                  {liveSocials.length > 0 && (
                    <div className="flex items-center gap-2">
                      {liveSocials.map((s) => {
                        const Icon = socialIcons[s.id];
                        if (!Icon) return null;
                        return (
                          <a
                            key={s.id}
                            href={s.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={s.label}
                            className="w-9 h-9 rounded-full border border-brand-surface/15 flex items-center justify-center
                              text-brand-muted hover:text-brand-accent hover:border-brand-accent/40 transition-colors"
                          >
                            <Icon className="w-4 h-4" />
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
