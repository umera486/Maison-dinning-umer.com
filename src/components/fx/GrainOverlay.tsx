// src/components/fx/GrainOverlay.tsx

/**
 * Film grain + vignette.
 *
 * PERFORMANCE HISTORY — do not reintroduce `mix-blend-mode` here.
 *
 * This previously used `mix-blend-overlay` on a fixed, full-viewport element.
 * A blend mode makes the compositor read the backdrop — i.e. the entire
 * scrolling page beneath it — and re-blend the whole viewport on every single
 * frame. It is one of the most expensive things you can put on a scrolling
 * site, and it was the main cause of the jank. The earlier comment here
 * claimed static grain was cheap; that was wrong. Static grain IS cheap. A
 * blend mode is not, animated or otherwise.
 *
 * Plain alpha compositing over a dark base looks near-identical and costs one
 * static layer that never repaints.
 *
 * `pointer-events-none` + `contain: strict` keep it out of hit-testing and
 * isolate it from layout entirely.
 *
 * Server component — zero JavaScript.
 */
export default function GrainOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-200"
      style={{ contain: "strict" }}
    >
      {/* Vignette — pulls the eye inward and softens the edges of full-bleed
          photography. One gradient, painted once.

          Driven by `--vignette` / `--vignette-alpha` so it follows the theme:
          a heavy black vignette over a cream page reads as grime rather than
          atmosphere, so light mode uses a much softer, warmer edge. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 125% 85% at 50% 50%, transparent 42%, rgb(var(--vignette) / var(--vignette-alpha)) 100%)",
        }}
      />

      {/* Grain. Normal compositing, low alpha. Reads as film on a dark base. */}
      <div
        className="absolute inset-0 opacity-[0.055]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
        }}
      />
    </div>
  );
}
