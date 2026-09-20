/**
 * Brand marks as inline SVG.
 *
 * lucide-react removed Instagram/Facebook/TikTok in v1 (trademark), so these
 * cannot be imported. Inline is also cheaper — no extra module, and they
 * inherit `currentColor` so the palette drives them.
 *
 * Server-safe: no hooks, no client directive needed.
 */

export type SocialIconProps = {
  className?: string;
};

export function InstagramIcon({ className = "w-4 h-4" }: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon({ className = "w-4 h-4" }: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function TikTokIcon({ className = "w-4 h-4" }: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M15 3v10.5a3.5 3.5 0 1 1-3.5-3.5" />
      <path d="M15 3a5 5 0 0 0 5 5" />
    </svg>
  );
}

export function WhatsAppIcon({ className = "w-4 h-4" }: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M3 21l1.7-5A8.4 8.4 0 1 1 8 19.3z" />
      <path d="M8.6 8.3c.3-.7.6-.7.9-.7h.7c.2 0 .5 0 .8.6l.9 2.1c.1.3 0 .5-.1.7l-.5.6c-.2.2-.3.4-.1.7a7 7 0 0 0 3.2 2.8c.3.1.5.1.7-.1l.6-.7c.2-.2.4-.2.7-.1l2 1c.3.1.5.3.5.5v.7c0 .3-.2.7-.9 1a3 3 0 0 1-2 .3 11 11 0 0 1-6.9-5.6 4 4 0 0 1-.5-2.3z" />
    </svg>
  );
}

/** Maps a `socials[].id` from site.ts to its mark. */
export const socialIcons: Record<string, (p: SocialIconProps) => React.ReactElement> = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  tiktok: TikTokIcon,
  whatsapp: WhatsAppIcon,
};
