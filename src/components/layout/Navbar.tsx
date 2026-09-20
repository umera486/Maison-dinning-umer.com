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
import { Phone, MapPin, ShieldCheck, UtensilsCrossed, CalendarCheck } from "lucide-react";
import Logo from "@/components/brand/Logo";
import { navLinks, site, socials, routes, telHref, mapsHref, isPlaceholder } from "@/lib/site";
import { socialIcons } from "@/components/shared/SocialIcons";
import { EASE_LAHORI, EASE_SEAL } from "@/lib/motion";

/**
 * Responsive rules this file encodes, after the previous version broke down
 * between breakpoints:
 *
 *  - Five nav links only appear at `xl` (1280px+). At `lg` they were being
 *    squeezed against the phone button and the wordmark, with the magnetic
 *    hover pushing them into each other. Between `lg` and `xl` the seal menu
 *    carries navigation instead.
 *  - The phone button degrades in three steps: icon only → "Call" → the full
 *    number. It never competes with the wordmark for width.
 *  - The overlay menu is a scrollable flex column with safe-area padding, and
 *    link sizing is clamped low enough that five items plus the header and
 *    footer fit on a 360×640 phone without clipping.
 *  - A fixed bottom action bar gives phones one-tap Menu / Call / Book, which
 *    is what people actually open a restaurant site to do.
 *
 * Performance: the scroll handler is rAF-throttled and ref-guarded, so React
 * only re-renders when a boolean flips. No backdrop-filter, no blend modes on
 * the fixed header — both force the compositor to re-read the backdrop every
 * frame while scrolling.
 */

const LINK_SPRING = { stiffness: 160, damping: 14, mass: 0.4 };

function MagneticLink({ href, active, children }: { href: string; active: boolean; children: ReactNode }) {
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
      rawX.set((e.clientX - rect.left - rect.width / 2) * 0.2);
      rawY.set((e.clientY - rect.top - rect.height / 2) * 0.3);
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
      className="group relative"
    >
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className="relative block py-1.5 px-1"
      >
        {/* Reserves the italic state's width so the row never reflows on hover. */}
        <span aria-hidden className="invisible block font-heading italic text-sm whitespace-nowrap">
          {children}
        </span>

        <span
          className={`absolute inset-0 flex items-center justify-center font-body text-[10px] uppercase tracking-[0.18em]
            whitespace-nowrap transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.76,0,0.24,1)]
            transform-gpu group-hover:opacity-0 group-hover:scale-95
            ${active ? "text-brand-accent" : "text-brand-surface"}`}
        >
          {children}
        </span>

        <span
          aria-hidden
          className="absolute inset-0 flex items-center justify-center font-heading italic text-sm text-brand-accent
            whitespace-nowrap opacity-0 scale-95 transition-[opacity,transform] duration-300
            ease-[cubic-bezier(0.76,0,0.24,1)] transform-gpu group-hover:opacity-100 group-hover:scale-105"
        >
          {children}
        </span>

        {active && (
          <motion.span
            layoutId="nav-active-dot"
            className="absolute -bottom-0.5 left-1/2 w-1 h-1 -translate-x-1/2 rounded-full bg-brand-accent"
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
      className="relative w-11 h-11 rounded-full flex items-center justify-center shrink-0
        text-brand-surface hover:text-brand-accent transition-colors cursor-pointer transform-gpu"
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
          x1="24" y1="16" x2="24" y2="32"
          stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"
          animate={{ opacity: open ? 0 : 1 }}
          transition={{ duration: 0.25 }}
        />
      </motion.svg>
    </button>
  );
}

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
    visible: { transition: { staggerChildren: 0.06, delayChildren: 0.28 } },
  };
  const linkVariants: Variants = {
    hidden: { y: "105%" },
    visible: { y: "0%", transition: { duration: 0.65, ease: EASE_LAHORI } },
  };
  const fadeUpVariant: Variants = {
    hidden: { y: 16, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.55, ease: EASE_LAHORI } },
  };

  const liveSocials = socials.filter((s) => s.confirmed && !isPlaceholder(s.href));

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: visible ? 0 : "-130%" }}
        transition={{ duration: 0.4, ease: EASE_SEAL }}
        className={`fixed top-0 inset-x-0 z-100 transform-gpu transition-colors duration-500 ${
          isScrolled
            ? "bg-brand-base/95 border-b border-brand-accent/15 shadow-[0_8px_30px_rgb(0_0_0/0.4)]"
            : "bg-linear-to-b from-brand-base/85 to-transparent"
        }`}
      >
        <div className="flex items-center justify-between gap-2 sm:gap-4 px-3.5 sm:px-6 lg:px-10 h-16 lg:h-20">
          {/* Brand */}
          <Link href="/" className="group flex items-center gap-2.5 shrink-0 min-w-0" aria-label={`${site.name} — home`}>
            <Logo
              className="w-9 h-9 lg:w-11 lg:h-11 shrink-0 transition-transform duration-500 group-hover:rotate-6"
              tone="brand"
              withWordmark={false}
            />
            <span className="flex flex-col min-w-0">
              <span className="font-heading text-[13px] sm:text-[15px] lg:text-lg tracking-[0.13em] text-brand-surface leading-none truncate">
                {site.name}
              </span>
              <span className="hidden sm:block font-body text-[7.5px] lg:text-[8px] uppercase tracking-[0.26em] text-brand-accent/80 mt-1 leading-none truncate">
                {site.tagline}
              </span>
            </span>
          </Link>

          {/* Desktop nav — xl only, so it never fights the brand for width */}
          <nav className="hidden xl:flex items-center gap-7 2xl:gap-9">
            {navLinks.map((link) => (
              <MagneticLink key={link.href} href={link.href} active={pathname === link.href}>
                {link.title}
              </MagneticLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <Link
              href={routes.reserve}
              className="hidden md:inline-flex items-center justify-center h-10 px-5 rounded-full
                border border-brand-surface/25 font-body text-[10px] uppercase tracking-[0.18em]
                text-brand-surface hover:border-brand-accent hover:text-brand-accent
                transition-colors duration-300 whitespace-nowrap"
            >
              Book
            </Link>

            <a
              href={telHref}
              aria-label={`Call ${site.phone.display}`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-accent/45
                bg-brand-accent/10 text-brand-accent hover:bg-brand-accent hover:text-brand-base
                transition-colors duration-300 transform-gpu
                w-10 h-10 sm:w-auto sm:h-10 sm:px-4 lg:px-5"
            >
              <Phone className="w-4 h-4 shrink-0" strokeWidth={2} />
              <span className="hidden sm:inline lg:hidden font-body text-[10px] uppercase tracking-[0.18em] font-semibold">
                Call
              </span>
              <span className="hidden lg:inline font-body text-[10px] uppercase tracking-[0.18em] font-semibold whitespace-nowrap">
                {site.phone.display}
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

      {/* ---------------- Overlay ---------------- */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            initial={{ clipPath: `circle(0px at ${origin.x}px ${origin.y}px)` }}
            animate={{ clipPath: `circle(${origin.radius}px at ${origin.x}px ${origin.y}px)` }}
            exit={{ clipPath: `circle(0px at ${origin.x}px ${origin.y}px)` }}
            transition={{ duration: 0.8, ease: EASE_SEAL }}
            className="fixed inset-0 z-110 bg-brand-base transform-gpu overflow-y-auto overscroll-contain"
            data-lenis-prevent
          >
            <JaliBackdrop />

            <span
              dir="rtl"
              lang="ur"
              aria-hidden
              className="pointer-events-none select-none absolute -bottom-[5vw] -right-[3vw]
                text-[30vw] sm:text-[18vw] leading-none text-brand-surface/[0.035] whitespace-nowrap"
              style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}
            >
              لاہوری والا
            </span>

            {/* min-h-dvh + flex-col keeps the footer pinned to the bottom on
                tall screens while still scrolling on short ones. */}
            <div
              className="relative z-10 min-h-dvh flex flex-col px-5 sm:px-8 lg:px-12"
              style={{
                paddingTop: "max(0.75rem, env(safe-area-inset-top))",
                paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))",
              }}
            >
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUpVariant}
                className="flex items-center justify-between h-16 lg:h-20 shrink-0"
              >
                <Link href="/" onClick={closeMenu} className="flex items-center gap-2.5" aria-label={`${site.name} — home`}>
                  <Logo className="w-9 h-9 lg:w-11 lg:h-11" tone="brand" withWordmark={false} />
                  <span className="font-heading text-[13px] sm:text-[15px] lg:text-lg tracking-[0.13em] text-brand-surface">
                    {site.name}
                  </span>
                </Link>
                <SealButton open onClick={closeMenu} label="Close navigation" />
              </motion.div>

              <motion.nav
                variants={listVariants}
                initial="hidden"
                animate="visible"
                className="flex-1 flex flex-col justify-center gap-0.5 py-6 min-h-0"
              >
                {navLinks.map((link, i) => {
                  const active = pathname === link.href;
                  return (
                    <div key={link.href} className="reveal-mask group/item">
                      <motion.div variants={linkVariants} className="transform-gpu">
                        <Link
                          href={link.href}
                          onClick={closeMenu}
                          aria-current={active ? "page" : undefined}
                          className={`flex items-baseline gap-3 sm:gap-5 py-1.5 font-heading italic font-light
                            text-[clamp(1.9rem,8.5vw,4.5rem)] leading-[1.14] transition-colors duration-300
                            ${active ? "text-brand-accent" : "text-brand-surface hover:text-brand-accent"}`}
                        >
                          <span className="font-body not-italic text-[9px] sm:text-[11px] text-brand-accent/70 tracking-[0.2em] shrink-0 tabular-nums">
                            0{i + 1}
                          </span>
                          <span className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/item:translate-x-2 transform-gpu">
                            {link.title}
                          </span>
                        </Link>
                      </motion.div>
                    </div>
                  );
                })}
              </motion.nav>

              <motion.div
                variants={fadeUpVariant}
                initial="hidden"
                animate="visible"
                className="shrink-0 border-t border-brand-surface/10 pt-5 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                  <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-brand-accent" strokeWidth={1.6} />
                    <span className="font-body text-[10.5px] sm:text-xs tracking-[0.1em] uppercase leading-relaxed text-brand-muted group-hover:text-brand-accent transition-colors">
                      {site.address.line1}
                      <br />
                      {site.address.city} {site.address.postcode}
                    </span>
                  </a>

                  <a href={telHref} className="font-heading italic text-xl sm:text-2xl text-brand-surface hover:text-brand-accent transition-colors">
                    {site.phone.display}
                  </a>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-brand-green-light/30 bg-brand-green/15 px-3 py-1.5 text-brand-green-light">
                    <ShieldCheck className="w-3.5 h-3.5" strokeWidth={1.8} />
                    <span className="font-body text-[9px] uppercase tracking-[0.18em] font-semibold">
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
                            className="w-10 h-10 rounded-full border border-brand-surface/15 flex items-center justify-center
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

      {/* ---------------- Mobile action bar ----------------
          What people actually open a restaurant site for, one tap away,
          without hunting through a menu. Hidden once the overlay is open so
          it can't sit on top of it. */}
      <AnimatePresence>
        {!menuOpen && (
          <motion.nav
            aria-label="Quick actions"
            initial={{ y: "120%" }}
            animate={{ y: 0 }}
            exit={{ y: "120%" }}
            transition={{ duration: 0.4, ease: EASE_SEAL }}
            className="md:hidden fixed inset-x-0 bottom-0 z-90 transform-gpu
              border-t border-brand-surface/12 bg-brand-base/97"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            <div className="grid grid-cols-3">
              <Link
                href={routes.menu}
                className={`flex flex-col items-center justify-center gap-1 h-16 transition-colors ${
                  pathname === routes.menu ? "text-brand-accent" : "text-brand-surface/75"
                }`}
              >
                <UtensilsCrossed className="w-[18px] h-[18px]" strokeWidth={1.7} />
                <span className="font-body text-[9px] uppercase tracking-[0.16em]">Menu</span>
              </Link>

              <a
                href={telHref}
                className="flex flex-col items-center justify-center gap-1 h-16 text-brand-accent
                  border-x border-brand-surface/12"
              >
                <Phone className="w-[18px] h-[18px]" strokeWidth={2} />
                <span className="font-body text-[9px] uppercase tracking-[0.16em] font-semibold">Call</span>
              </a>

              <Link
                href={routes.reserve}
                className={`flex flex-col items-center justify-center gap-1 h-16 transition-colors ${
                  pathname === routes.reserve ? "text-brand-accent" : "text-brand-surface/75"
                }`}
              >
                <CalendarCheck className="w-[18px] h-[18px]" strokeWidth={1.7} />
                <span className="font-body text-[9px] uppercase tracking-[0.16em]">Book</span>
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
