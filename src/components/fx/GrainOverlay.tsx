// src/components/fx/GrainOverlay.tsx

/**
 * Film grain + vignette, sitting above everything.
 *
 * This is the cheapest premium signal available: photography stops looking
 * like stock and starts looking graded. One fixed element, one inline SVG
 * turbulence texture rasterised once by the browser, zero JavaScript, zero
 * per-frame work.
 *
 * Deliberately NOT animated. Animated grain means re-rasterising a
 * full-viewport texture every frame, which is a guaranteed way to lose the
 * 55fps floor on a phone. Static grain reads as film; jittering grain reads
 * as a broken screen.
 *
 * Server component — no "use client" needed.
 */
export default function GrainOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[200]"
      style={{ contain: "strict" }}
    >
      {/* Vignette: pulls the eye to the centre and hides the hard edges of
          full-bleed photography. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 80% at 50% 50%, transparent 40%, rgba(13,13,15,0.42) 100%)",
        }}
      />

      {/* Grain. `fractalNoise` at a high base frequency gives fine film grain;
          a low opacity keeps it as texture rather than dirt. */}
      <div
        className="absolute inset-0 opacity-[0.16] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
        }}
      />
    </div>
  );
}
