// src/components/brand/Logo.tsx

/**
 * The LAHORIWALA mark, rebuilt as SVG: the circular frame, Minar-e-Pakistan,
 * the Badshahi Mosque, and the wordmark.
 *
 * Vector rather than the supplied PNG because the mark needs to be tiny in a
 * 40px navbar, enormous in the preloader, recolourable for dark surfaces, and
 * *drawable* stroke-by-stroke on load. A raster can do none of those.
 *
 * `tone`:
 *  - "brand" — the printed colours (green ring, red mosque, silver minar)
 *  - "mono"  — single-colour via currentColor, for the navbar and footer
 *
 * Server component. No hooks, so it can render inside a Server Component and
 * also be animated by a client parent targeting the ids below.
 */

export interface LogoProps {
  className?: string;
  tone?: "brand" | "mono";
  /** Renders the wordmark under the badge. Off for small navbar use. */
  withWordmark?: boolean;
  title?: string;
}

export default function Logo({
  className = "",
  tone = "brand",
  withWordmark = true,
  title = "LAHORIWALA — Authentic Lahori Taste",
}: LogoProps) {
  const mono = tone === "mono";

  const ring = mono ? "currentColor" : "#15803d";
  const mosque = mono ? "currentColor" : "#c1282d";
  const mosqueDeep = mono ? "currentColor" : "#9c1f24";
  const dome = mono ? "none" : "#eceff1";
  const minar = mono ? "currentColor" : "#b0bec5";
  const minarDark = mono ? "currentColor" : "#90a4ae";
  const baseline = mono ? "currentColor" : "#111111";
  const word = mono ? "currentColor" : "#15803d";
  const sub = mono ? "currentColor" : "#111111";

  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label={title}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>

      {/* Circular frame */}
      <circle
        data-logo="ring"
        cx="100"
        cy="100"
        r="93"
        stroke={ring}
        strokeWidth="2.4"
        opacity={mono ? 0.5 : 1}
      />

      <g data-logo="skyline">
        {/* ---- Badshahi Mosque ---- */}
        {/* Outer minarets */}
        <g data-logo="minarets">
          <rect x="76" y="86" width="7.5" height="52" fill={mosque} />
          <rect x="75" y="84" width="9.5" height="3.5" fill={mosqueDeep} />
          <path d="M79.75 74 L83.5 84 H76 Z" fill={dome === "none" ? mosque : dome} stroke={mosque} strokeWidth="1" />
          <rect x="78.4" y="69" width="2.6" height="6" fill={mosqueDeep} />

          <rect x="141" y="86" width="7.5" height="52" fill={mosque} />
          <rect x="140" y="84" width="9.5" height="3.5" fill={mosqueDeep} />
          <path d="M144.75 74 L148.5 84 H141 Z" fill={dome === "none" ? mosque : dome} stroke={mosque} strokeWidth="1" />
          <rect x="143.4" y="69" width="2.6" height="6" fill={mosqueDeep} />
        </g>

        {/* Facade */}
        <rect x="86" y="104" width="53" height="34" fill={mosque} />

        {/* Arcade — the row of arches along the front */}
        <g fill={mosqueDeep}>
          <path d="M90 138 v-16 a4 4 0 0 1 8 0 v16 Z" />
          <path d="M101 138 v-16 a4 4 0 0 1 8 0 v16 Z" />
          <path d="M116 138 v-16 a4 4 0 0 1 8 0 v16 Z" />
          <path d="M127 138 v-16 a4 4 0 0 1 8 0 v16 Z" />
        </g>

        {/* Central iwan — the tall entrance arch */}
        <path d="M106 138 v-24 a6.5 6.5 0 0 1 13 0 v24 Z" fill={mosqueDeep} />
        <path
          d="M108.5 138 v-22 a4 4 0 0 1 8 0 v22 Z"
          fill={mono ? "none" : "#5d1216"}
          stroke={mono ? "currentColor" : "none"}
          strokeWidth="0.8"
        />

        {/* Side domes */}
        <path
          d="M89 104 q0-13 9-13 t9 13 Z"
          fill={dome === "none" ? "none" : dome}
          stroke={mosque}
          strokeWidth="1.4"
        />
        <path
          d="M118 104 q0-13 9-13 t9 13 Z"
          fill={dome === "none" ? "none" : dome}
          stroke={mosque}
          strokeWidth="1.4"
        />

        {/* Central dome, onion-profile and taller */}
        <path
          d="M101 104 q-1-14 5.5-19 q-2-7 6-9.5 q8 2.5 6 9.5 q6.5 5 5.5 19 Z"
          fill={dome === "none" ? "none" : dome}
          stroke={mosque}
          strokeWidth="1.6"
        />
        {/* Finials */}
        <g fill={mono ? "currentColor" : "#c9a227"}>
          <rect x="111.6" y="66" width="1.6" height="8" rx="0.8" />
          <rect x="97.3" y="84" width="1.3" height="6" rx="0.65" />
          <rect x="126.3" y="84" width="1.3" height="6" rx="0.65" />
        </g>

        {/* ---- Minar-e-Pakistan ---- */}
        <g data-logo="minar">
          {/* Stepped base */}
          <rect x="46" y="130" width="30" height="8" fill={minarDark} />
          <rect x="50" y="124" width="22" height="6.5" fill={minar} />
          {/* Petal flare */}
          <path d="M53 124 q3-16 8-18 h2 q5 2 8 18 Z" fill={minarDark} />
          {/* Tapering shaft */}
          <path d="M57.4 106 L59.6 58 h2.8 L64.6 106 Z" fill={minar} />
          {/* Banding */}
          <g fill={minarDark} opacity="0.85">
            <rect x="58.4" y="94" width="5.2" height="1.8" />
            <rect x="58.9" y="82" width="4.2" height="1.8" />
            <rect x="59.3" y="70" width="3.4" height="1.8" />
          </g>
          {/* Crown + finial */}
          <path d="M58.6 58 h4.8 l-2.4 -7 Z" fill={minarDark} />
          <rect x="60.4" y="44" width="1.2" height="7" rx="0.6" fill={minarDark} />
        </g>

        {/* Ground line */}
        <rect data-logo="baseline" x="40" y="138" width="120" height="2.6" fill={baseline} />
      </g>

      {withWordmark && (
        <g data-logo="wordmark">
          <text
            x="100"
            y="166"
            textAnchor="middle"
            fill={word}
            style={{
              fontFamily: "var(--font-manrope), system-ui, sans-serif",
              fontWeight: 800,
              fontSize: "27px",
              letterSpacing: "-0.5px",
            }}
          >
            LAHORIWALA
          </text>
          <text
            x="100"
            y="180"
            textAnchor="middle"
            fill={sub}
            opacity={mono ? 0.7 : 1}
            style={{
              fontFamily: "var(--font-manrope), system-ui, sans-serif",
              fontWeight: 500,
              fontSize: "8.4px",
              letterSpacing: "1.5px",
            }}
          >
            AUTHENTIC LAHORI TASTE
          </text>
        </g>
      )}
    </svg>
  );
}
