export type Theme = "dark" | "light";

export const THEME_KEY = "lw-theme";

/**
 * Dark ships as the default rather than following `prefers-color-scheme`.
 *
 * That is a brand decision, not an oversight: the dark hero *is* LAHORIWALA's
 * identity, and a visitor whose laptop happens to be in light mode would
 * otherwise never see it. An explicit choice is remembered from then on.
 *
 * To follow the operating system on first visit instead, change this to read
 * `window.matchMedia("(prefers-color-scheme: light)")` — it is deliberately a
 * single constant so the decision is easy to reverse.
 */
export const DEFAULT_THEME: Theme = "dark";

/**
 * Runs as a blocking inline script in <head>, before first paint.
 *
 * Without this the server renders the default theme and the client corrects it
 * after hydration, which is a visible flash of the wrong colours on every load
 * — the single most common bug in theme switchers. Reading localStorage and
 * setting the attribute synchronously avoids it entirely.
 *
 * Kept as a string so it can be inlined verbatim; it must not depend on any
 * bundled module.
 */
export const THEME_INIT_SCRIPT = `
(function(){
  try {
    var stored = localStorage.getItem("${THEME_KEY}");
    var theme = (stored === "light" || stored === "dark") ? stored : "${DEFAULT_THEME}";
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "${DEFAULT_THEME}");
  }
})();
`.trim();
