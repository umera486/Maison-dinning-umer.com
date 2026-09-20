/**
 * Single source of truth for every real-world fact about the business.
 *
 * Nothing else in the app may hardcode an address, phone number, or link.
 * The previous build had two different addresses and two different phone
 * numbers live at the same time, because each component carried its own copy.
 *
 * Values marked NEEDS-CONFIRMATION are placeholders the owner has not yet
 * supplied. They are deliberately obvious so they cannot ship unnoticed —
 * `isPlaceholder()` lets the UI degrade gracefully rather than print a lie.
 */

export interface SocialLink {
  id: string;
  label: string;
  href: string;
  confirmed: boolean;
}

export interface DeliveryPartner {
  id: string;
  label: string;
  href: string;
  confirmed: boolean;
}

/** Day index matches `Date.getDay()` — 0 is Sunday. */
export interface OpeningHours {
  day: number;
  label: string;
  /** Minutes from midnight. `null`/`null` means closed that day. */
  opens: number | null;
  closes: number | null;
}

const PLACEHOLDER = "#";

export function isPlaceholder(href: string): boolean {
  return href === PLACEHOLDER;
}

export const site = {
  /** One word. The printed logo, flyer and shopfront all read LAHORIWALA. */
  name: "LAHORIWALA",
  /** Used where the name sits inside a sentence. */
  nameSpaced: "Lahoriwala",
  tagline: "Authentic Lahori Taste",
  strapline: "Taste of Pakistan & Lahori",
  /** The restaurant's own description of what it does, from the flyer. */
  disciplines: ["Karahi", "BBQ", "Nihari", "Paye", "Street Food"],

  branch: "Norbury",
  address: {
    line1: "1075 London Road",
    city: "Thornton Heath",
    postcode: "CR7 6JG",
    country: "United Kingdom",
  },
  /** Pre-formatted for a maps deep link. */
  mapsQuery: "1075 London Road, Thornton Heath, CR7 6JG",

  phone: {
    display: "020 3010 7391",
    /** E.164, for `tel:` and WhatsApp. */
    e164: "+442030107391",
  },

  /** NEEDS-CONFIRMATION — owner has not supplied an email address. */
  email: null as string | null,

  parking: "Free parking at rear",

  /** Halal Monitoring Committee UK — a real, verifiable certification. */
  halal: {
    certified: true,
    body: "HMC",
    bodyFull: "Halal Monitoring Committee UK",
  },

  services: {
    dineIn: true,
    takeaway: true,
    catering: true,
    delivery: true,
  },
} as const;

/**
 * NEEDS-CONFIRMATION — every href below is a placeholder until the owner
 * sends real profile links. Components must check `confirmed` and hide
 * rather than render a dead link.
 */
export const socials: SocialLink[] = [
  { id: "instagram", label: "Instagram", href: PLACEHOLDER, confirmed: false },
  { id: "facebook", label: "Facebook", href: PLACEHOLDER, confirmed: false },
  { id: "tiktok", label: "TikTok", href: PLACEHOLDER, confirmed: false },
  {
    id: "whatsapp",
    label: "WhatsApp",
    // This one we can build from the real phone number, so it genuinely works.
    href: `https://wa.me/${site.phone.e164.replace("+", "")}`,
    confirmed: true,
  },
];

/**
 * The flyer advertises all three. Deep links are the generic search URLs
 * until the owner sends their actual storefront links.
 */
export const deliveryPartners: DeliveryPartner[] = [
  { id: "deliveroo", label: "Deliveroo", href: PLACEHOLDER, confirmed: false },
  { id: "ubereats", label: "Uber Eats", href: PLACEHOLDER, confirmed: false },
  { id: "justeat", label: "Just Eat", href: PLACEHOLDER, confirmed: false },
];

/**
 * NEEDS-CONFIRMATION — invented placeholder hours. The owner has not yet
 * supplied real opening times. Typical for the area, but NOT verified.
 * `hoursConfirmed` gates the "open now" badge so the site never asserts
 * it is open when we genuinely do not know.
 */
export const hoursConfirmed = false;

const NOON = 12 * 60;
const MIDNIGHT_ISH = 23 * 60 + 30;

export const openingHours: OpeningHours[] = [
  { day: 1, label: "Monday", opens: NOON, closes: MIDNIGHT_ISH },
  { day: 2, label: "Tuesday", opens: NOON, closes: MIDNIGHT_ISH },
  { day: 3, label: "Wednesday", opens: NOON, closes: MIDNIGHT_ISH },
  { day: 4, label: "Thursday", opens: NOON, closes: MIDNIGHT_ISH },
  { day: 5, label: "Friday", opens: NOON, closes: MIDNIGHT_ISH },
  { day: 6, label: "Saturday", opens: NOON, closes: MIDNIGHT_ISH },
  { day: 0, label: "Sunday", opens: NOON, closes: MIDNIGHT_ISH },
];

export function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/**
 * Returns null when hours are unconfirmed, so callers render nothing rather
 * than a confident guess.
 *
 * Note this reads the *visitor's* clock, not London's. That is close enough
 * for a local restaurant whose customers are local, and avoids shipping a
 * timezone library for one badge.
 */
export function getOpenState(now: Date = new Date()): { open: boolean; today: OpeningHours } | null {
  if (!hoursConfirmed) return null;
  const today = openingHours.find((h) => h.day === now.getDay());
  if (!today || today.opens === null || today.closes === null) return null;
  const mins = now.getHours() * 60 + now.getMinutes();
  return { open: mins >= today.opens && mins < today.closes, today };
}

/** Routes, in the order they appear in navigation. */
export const routes = {
  home: "/",
  menu: "/menu",
  heritage: "/heritage",
  reserve: "/reserve",
  catering: "/catering",
  contact: "/contact",
} as const;

/**
 * Only routes that actually exist belong here. The previous navigation linked
 * "The Menu" to /private-dining and pointed four footer links at anchors
 * (#menu, #pre-order, #story, #dispatch) that were never in the document.
 */
export const navLinks = [
  { title: "Menu", href: routes.menu },
  { title: "Our Story", href: routes.heritage },
  { title: "Catering", href: routes.catering },
  { title: "Book a Table", href: routes.reserve },
  { title: "Find Us", href: routes.contact },
] as const;

export const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  site.mapsQuery
)}`;

export const telHref = `tel:${site.phone.e164}`;
