import type { Metadata } from "next";
import { Bodoni_Moda, Manrope } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/layout/SmoothScroll";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Maison Dining | Premium Dining",
  description: "Experience culinary excellence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bodoni.variable} ${manrope.variable}`}>
      {/* overflow-x-hidden lives on body only (see globals.css) — putting it
          on any ancestor of a `position: sticky` element turns that ancestor
          into the sticky containing block in some engines, which silently
          breaks the tile-stack pin. */}
      <body className="font-body antialiased">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}