import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // There is a stray package-lock.json in the parent Desktop folder. Without
  // this, Turbopack walks up looking for a workspace root, finds it, and warns
  // on every build. Pinning the root to this project stops the guessing.
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    // Next.js 16 changed the `images.qualities` default from "allow anything"
    // to `[75]`. Any `quality` prop not listed here is silently coerced to the
    // nearest allowed value, so the qualities we actually use must be declared
    // or they quietly stop working. See docs/01-app/02-guides/upgrading/version-16.md.
    qualities: [60, 75, 85],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
