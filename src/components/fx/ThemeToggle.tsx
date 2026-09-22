// src/components/fx/ThemeToggle.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { THEME_KEY, DEFAULT_THEME, type Theme } from "@/lib/theme";

/**
 * Dark / light switch.
 *
 * Reads the attribute the inline head script already set, rather than deciding
 * the theme itself — so there is one source of truth and no second opinion
 * arriving after hydration.
 *
 * The button renders its icons at a fixed size and swaps them with a rotate +
 * fade, so the control never changes width and the header can't shift when the
 * theme flips.
 */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  // Matches the server-rendered default; corrected on mount from the DOM
  // attribute, which the head script has already written.
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "light" ? "light" : "dark");
    setReady(true);
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {
        // Private mode / blocked storage: the switch still works for this
        // page view, it just won't be remembered.
      }
      return next;
    });
  }, []);

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      // aria-pressed would be wrong here: this isn't a toggle that stays
      // "on", it swaps between two equal states.
      title={isDark ? "Light mode" : "Dark mode"}
      className={`relative w-10 h-10 rounded-full flex items-center justify-center shrink-0
        text-brand-surface hover:text-brand-accent transition-colors cursor-pointer
        ${className}`}
    >
      {/* Both icons are stacked and cross-faded, so no layout ever moves. */}
      <motion.span
        animate={{ opacity: ready && isDark ? 1 : 0, rotate: isDark ? 0 : -75, scale: isDark ? 1 : 0.6 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 flex items-center justify-center transform-gpu"
      >
        <Moon className="w-[18px] h-[18px]" strokeWidth={1.7} />
      </motion.span>

      <motion.span
        animate={{ opacity: ready && !isDark ? 1 : 0, rotate: isDark ? 75 : 0, scale: isDark ? 0.6 : 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 flex items-center justify-center transform-gpu"
      >
        <Sun className="w-[18px] h-[18px]" strokeWidth={1.7} />
      </motion.span>
    </button>
  );
}
