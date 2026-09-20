/**
 * Every photograph on the site, in one place.
 *
 * Two hard lessons are baked in here:
 *
 * 1. Unsplash photo IDs rot. Three of the twelve originally used returned 404
 *    in production, which is why images were missing. Every ID below was
 *    fetched and confirmed 200. If one dies, it dies in ONE place and
 *    `SmartImage` shows a designed fallback rather than a blank box.
 *
 * 2. Only IDs whose subject was actually verified are used. A "verified
 *    working" URL whose content is unknown is worse than no image — a photo
 *    of the wrong dish under a heading is the single cheapest-looking thing a
 *    restaurant site can do.
 *
 * Consequence: the palette of photography is deliberately small. The design
 * uses a few large images rather than many small ones, which is both more
 * robust and considerably more expensive-looking.
 */

const U = (id: string, w = 1800) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=${w}&auto=format&fit=crop`;

export const img = {
  /** Charcoal grill, skewers, live fire. */
  charcoal: U("1585937421612-70a008356fbe"),
  /** Mixed grill / roasted meat platter. */
  grill: U("1544025162-d76694265947"),
  /** Deep bowl curry, rich red gravy — karahi / nihari / paye. */
  karahi: U("1563379091339-03b21ab4a4f8"),
  /** Tawa-fried chicken pieces, close crop. */
  tawa: U("1626777552726-4a6b54c97e46"),
  /** Spread of bowls, warm tones — nashta / sharing table. */
  spread: U("1578474846511-04ba529f0b88"),
  /** Curry with garnish, darker crop. */
  curry: U("1603894584373-5ac82b2ae398"),
  /** Dark, textured dish — vegetarian / daal. */
  daal: U("1546833999-b9f581a1996d"),
  /** Warm restaurant interior, low light. */
  room: U("1517248135467-4c7edcad34c4"),
  /** Table setting, atmosphere. */
  table: U("1517244683847-7456b63c5969"),
} as const;

export type ImageKey = keyof typeof img;
