// src/components/shared/SmartImage.tsx
"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";

/**
 * next/image with a designed failure state.
 *
 * A remote image that 404s renders as an empty box — which is exactly what
 * happened here when three Unsplash IDs rotted. A blank rectangle mid-layout
 * reads as "broken site". This falls back to a warm charcoal gradient with
 * the dish name set in the brand face, so a dead URL still looks deliberate.
 *
 * Always `fill`; every usage on this site is a cropped fill.
 */
export default function SmartImage({
  alt,
  label,
  className = "",
  ...props
}: Omit<ImageProps, "onError"> & { label?: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        // Uses the always-dark scrim rather than `to-black`, so the fallback
        // is consistent in both themes and any text placed over it (which is
        // `on-image` cream everywhere) stays legible.
        className={`absolute inset-0 flex items-end bg-linear-to-br from-brand-raise via-scrim to-scrim ${className}`}
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, #E5A93C 0 1px, transparent 1px 14px)",
          }}
        />
        {label && (
          <span className="relative p-5 font-heading italic text-on-image/45 text-xl leading-tight">
            {label}
          </span>
        )}
      </div>
    );
  }

  return (
    <Image
      {...props}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
