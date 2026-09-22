import type { Metadata } from "next";
import { Bodoni_Moda, Manrope } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/layout/SmoothScroll";
import GrainOverlay from "@/components/fx/GrainOverlay";
import CustomCursor from "@/components/fx/CustomCursor";
import { site } from "@/lib/site";
import { THEME_INIT_SCRIPT, DEFAULT_THEME } from "@/lib/theme";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} — ${site.tagline} in ${site.branch}, London`,
    template: `%s · ${site.name}`,
  },
  description: `Karahi, BBQ, nihari, paye and Lahori street food in ${site.branch}, London. ${site.halal.bodyFull} certified halal. Dine in, takeaway and catering. ${site.address.line1}, ${site.address.city} ${site.address.postcode}.`,
  keywords: [
    "Lahori food London",
    "Pakistani restaurant Norbury",
    "halal restaurant Thornton Heath",
    "karahi London",
    "nihari London",
    "HMC halal",
  ],
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: `Karahi, BBQ, nihari and paye in ${site.branch}, London. ${site.halal.body} certified halal.`,
    locale: "en_GB",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // `data-scroll-behavior="smooth"` restores the pre-16 behaviour where
    // Next.js neutralises smooth scrolling during route transitions. Without
    // it, navigating between pages eases all the way down the document
    // instead of jumping, which fights Lenis. See the Next.js 16 upgrade guide.
    <html
      lang="en-GB"
      data-scroll-behavior="smooth"
      // Server-rendered default. The inline script below corrects it before
      // first paint if the visitor has chosen the other theme, and
      // suppressHydrationWarning stops React complaining that the attribute
      // it finds on the client differs from the one it rendered.
      data-theme={DEFAULT_THEME}
      suppressHydrationWarning
      className={`${bodoni.variable} ${manrope.variable}`}
    >
      {/* overflow-x-hidden lives on body only (see globals.css) — putting it
          on any ancestor of a `position: sticky` element turns that ancestor
          into the sticky containing block in some engines, which silently
          breaks the tile-stack pin. */}
      <head>
        {/* Blocking, before first paint: applies the stored theme so there is
            no flash of the wrong colours on load. Must stay inline — a
            bundled module would arrive too late to prevent the flash. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="font-body antialiased">
        <SmoothScroll>{children}</SmoothScroll>

        {/* Ambient layers, above the page and outside the transition curtain
            so they never flicker on navigation. Grain is a static server
            component; the cursor renders nothing on touch devices. */}
        <GrainOverlay />
        <CustomCursor />
      </body>
    </html>
  );
}
