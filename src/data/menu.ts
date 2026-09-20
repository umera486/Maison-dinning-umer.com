/**
 * LAHORIWALA menu — transcribed from the restaurant's printed menu, 2026-09-19.
 *
 * This file is the seam for the future admin dashboard. Components must never
 * hardcode dishes; they read from here through `src/lib/menu.ts`. When the
 * dashboard lands, only the loader changes — no component is touched.
 *
 * PRICES ARE REAL. Do not "improve" them. The previous build invented a £36
 * karahi and a £48 lamb raan for a kitchen that sells lamb karahi at £7.99.
 *
 * `description` fields are editorial copy written for the site, not printed on
 * the menu — they describe well-known dishes and should be reviewed by the
 * owner before launch.
 *
 * Images are Unsplash placeholders chosen to be plausible, pending the owner's
 * own photography. Every image lives in exactly one place so the swap is cheap.
 */

export type DishTag = "veg" | "signature" | "sharing" | "breakfast" | "spicy";

export interface Dish {
  id: string;
  name: string;
  /** In GBP. `null` when the printed menu shows no price. */
  price: number | null;
  /** Shown instead of / alongside the price when pricing is unusual. */
  priceNote?: string;
  /** Editorial. Short. Never invent provenance the kitchen hasn't claimed. */
  description?: string;
  /** What's actually in a platter or mixed grill, verbatim from the menu. */
  composition?: string;
  image?: string;
  tags?: DishTag[];
}

export interface MenuCategory {
  id: string;
  /** The number printed on the physical menu — keeps the two in step. */
  number: string;
  name: string;
  /** One line of editorial framing for the category. */
  blurb: string;
  /** Category-level note printed on the menu, e.g. spice levels. */
  note?: string;
  image: string;
  items: Dish[];
}

const IMG = {
  bbq: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1400&auto=format&fit=crop",
  karahi: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1400&auto=format&fit=crop",
  tawa: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=1400&auto=format&fit=crop",
  nihari: "https://images.unsplash.com/photo-1585932702519-f21cc028cb0c?q=80&w=1400&auto=format&fit=crop",
  biryani: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1400&auto=format&fit=crop",
  naan: "https://images.unsplash.com/photo-1626777553626-0604131584d4?q=80&w=1400&auto=format&fit=crop",
  veg: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1400&auto=format&fit=crop",
  dessert: "https://images.unsplash.com/photo-1585932702519-f21cc028cb0c?q=80&w=1400&auto=format&fit=crop",
  drinks: "https://images.unsplash.com/photo-1517244683847-7456b63c5969?q=80&w=1400&auto=format&fit=crop",
  wraps: "https://images.unsplash.com/photo-1599487488170-ded1ec92642f?q=80&w=1400&auto=format&fit=crop",
  chicken: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=1400&auto=format&fit=crop",
  nashta: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?q=80&w=1400&auto=format&fit=crop",
  peri: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=1400&auto=format&fit=crop",
} as const;

export const menu: MenuCategory[] = [
  {
    id: "starters-non-veg",
    number: "01",
    name: "Starters",
    blurb: "Off the coals, off the tawa — the first thing to reach the table.",
    image: IMG.bbq,
    items: [
      { id: "cheesy-poly-poly", name: "Cheesy Poly Poly", price: 1.2, priceNote: "1 piece" },
      { id: "punjabi-samosa-meat", name: "Punjabi Samosa (Meat)", price: 0.99, priceNote: "1 piece", description: "Hand-folded pastry, spiced mince." },
      {
        id: "lamb-seekh-kabab",
        name: "Lamb Seekh Kabab",
        price: 1.99,
        priceNote: "£1.20 each · 2 pieces £1.99",
        description: "Hand-minced lamb, charcoal-grilled on the skewer.",
        image: IMG.bbq,
      },
      { id: "chapli-kebab", name: "Chapli Kebab", price: 3.49, priceNote: "1 piece", description: "Flat, coarse-ground, Peshawari-style." },
      { id: "chicken-tikka-starter", name: "Chicken Tikka", price: 4.99, priceNote: "5 pieces" },
      { id: "lamb-chops", name: "Lamb Chops", price: 8.99, priceNote: "5 pieces", description: "Marinated and finished over live charcoal.", image: IMG.bbq },
      { id: "lamb-tikka", name: "Lamb Tikka", price: 5.99, priceNote: "5 pieces" },
      { id: "lahori-fish", name: "Lahori Fish", price: 4.99, priceNote: "1 piece", description: "Gram-flour batter, ajwain, fried crisp." },
      {
        id: "mix-grill-small",
        name: "Mix Grill (Small)",
        price: 15.99,
        composition: "2 Lamb Kabab · 2 Chicken Tikka · 2 Wings · 2 Lamb Chops · 2 Lamb Tikka",
        tags: ["sharing"],
        image: IMG.bbq,
      },
      {
        id: "mix-grill-large",
        name: "Mix Grill (Large)",
        price: 21.99,
        composition: "4 Lamb Kabab · 4 Chicken Tikka · 4 Wings · 4 Chops · 4 Lamb Tikka",
        tags: ["sharing", "signature"],
        image: IMG.bbq,
      },
    ],
  },

  {
    id: "starters-veg",
    number: "02",
    name: "Starters — Vegetarian",
    blurb: "The same fryer, the same spice box, none of the meat.",
    image: IMG.veg,
    items: [
      { id: "poppadums", name: "Poppadums", price: 1.29, priceNote: "2 pieces", tags: ["veg"] },
      { id: "punjabi-veg-samosa", name: "Punjabi Veg Samosa", price: 1.0, priceNote: "1 piece", description: "Spiced potato and pea.", tags: ["veg"] },
      { id: "pakoras", name: "Pakoras", price: 1.99, priceNote: "6 pieces", description: "Gram flour, onion, green chilli.", tags: ["veg"] },
      { id: "onion-bhaji", name: "Onion Bhaji", price: 2.49, priceNote: "2 pieces", tags: ["veg"] },
      { id: "paneer-tikka", name: "Paneer Tikka", price: 2.99, priceNote: "4 pieces", tags: ["veg"] },
      { id: "chilli-paneer", name: "Chilli Paneer", price: 4.99, priceNote: "4 pieces", tags: ["veg", "spicy"] },
    ],
  },

  {
    id: "lahori-dynamite",
    number: "03",
    name: "Lahori Dynamite",
    blurb: "Battered, tossed hot in a sweet-chilli glaze. The house's loudest plate.",
    image: IMG.tawa,
    items: [
      { id: "chicken-dynamite", name: "Lahori Chicken Dynamite", price: 6.99, description: "Crisp-fried chicken in a glossy chilli glaze.", tags: ["signature", "spicy"], image: IMG.tawa },
      { id: "paneer-dynamite", name: "Lahori Paneer Dynamite", price: 5.99, tags: ["veg", "spicy"] },
      { id: "prawns-dynamite", name: "Lahori Prawns Dynamite", price: 5.99, tags: ["spicy"] },
      { id: "chips-dynamite", name: "Lahori Chips Dynamite", price: 6.99, tags: ["veg", "spicy"] },
    ],
  },

  {
    id: "peri-peri",
    number: "04",
    name: "Lahori Peri Peri Chicken & Wings",
    blurb: "Whole birds, marinated and flame-grilled to order.",
    note: "Spice levels: M · H · HH · EHH · Allow 40 minutes · Add £2.00 extra",
    image: IMG.peri,
    items: [
      { id: "peri-whole", name: "Whole Peri Peri Chicken", price: 9.99, composition: "Served with rice + chips", tags: ["sharing", "spicy"], image: IMG.peri },
      { id: "peri-half", name: "Half Peri Peri Chicken", price: 5.99, composition: "Served with rice + chips", tags: ["spicy"] },
      { id: "whole-chargha", name: "Whole Chargha", price: 9.99, description: "Steamed in spice, then deep-fried whole — a Lahore institution.", tags: ["signature", "sharing"], image: IMG.peri },
    ],
  },

  {
    id: "wraps",
    number: "05",
    name: "Lahori Wraps",
    blurb: "Straight off the skewer, rolled in fresh bread.",
    image: IMG.wraps,
    items: [
      { id: "lamb-seekh-roll", name: "Lamb Seekh Kebab Roll", price: 3.99, priceNote: "2 pieces", image: IMG.wraps },
      { id: "chicken-seekh-roll", name: "Chicken Seekh Kebab Roll", price: 3.99, priceNote: "2 pieces" },
      { id: "chicken-tikka-roll", name: "Chicken Tikka Roll", price: 4.99, priceNote: "5 pieces" },
      { id: "paneer-tikka-roll", name: "Paneer Tikka Roll", price: 4.99, priceNote: "5 pieces", tags: ["veg"] },
    ],
  },

  {
    id: "chicken-mains",
    number: "06",
    name: "Chicken Mains",
    blurb: "Eleven ways with chicken. Ten of them £5.99.",
    image: IMG.chicken,
    items: [
      { id: "chicken-curry", name: "Chicken Curry", price: 5.99, description: "The everyday standard, cooked to order." },
      { id: "chicken-karahi", name: "Chicken Karahi", price: 5.99, description: "Tomato, ginger, green chilli, finished in the wok.", tags: ["signature"], image: IMG.karahi },
      { id: "chicken-korma", name: "Chicken Korma", price: 5.99, description: "Mild, fragrant, slow-simmered." },
      { id: "chicken-jalfrezi", name: "Chicken Jalfrezi", price: 5.99, tags: ["spicy"] },
      { id: "saag-chicken", name: "Saag Chicken", price: 5.99, description: "Slow-cooked mustard greens and spinach." },
      { id: "butter-chicken", name: "Butter Chicken", price: 5.99, description: "Tomato and cream, gently spiced." },
      { id: "chicken-tikka-masala", name: "Chicken Tikka Masala", price: 5.99 },
      { id: "chana-chicken", name: "Chana Chicken", price: 5.99, description: "With chickpeas." },
      { id: "methi-chicken", name: "Methi Chicken", price: 5.99, description: "Fenugreek-led, slightly bitter, deeply savoury." },
      { id: "achari-chicken", name: "Achari Chicken", price: 5.99, description: "Pickling spices — mustard seed, fennel, nigella.", tags: ["spicy"] },
      { id: "meatball-curry", name: "Meatball Curry", price: 8.0 },
    ],
  },

  {
    id: "lamb-mains",
    number: "07",
    name: "Lamb Mains",
    blurb: "On the bone, off the bone, in the karahi. All £7.99.",
    image: IMG.karahi,
    items: [
      { id: "lamb-curry", name: "Lamb Curry", price: 7.99 },
      { id: "lamb-karahi", name: "Lamb Karahi", price: 7.99, description: "Deep wok, crushed pepper, fresh ginger.", tags: ["signature"], image: IMG.karahi },
      { id: "lamb-saag", name: "Lamb Saag", price: 7.99, description: "Mustard greens, slow-cooked with lamb." },
      { id: "lamb-achari", name: "Lamb Achari", price: 7.99, tags: ["spicy"] },
      { id: "lamb-bhindi", name: "Lamb Bhindi", price: 7.99, description: "With okra." },
      { id: "lamb-aloo-gosht", name: "Lamb Aloo Gosht", price: 7.99, description: "Lamb and potato — the Sunday dish." },
      { id: "lamb-kofta-anda", name: "Lamb Kofta (Anda)", price: 7.99, description: "Meatballs with egg." },
      { id: "lamb-madras", name: "Lamb Madras", price: 7.99, tags: ["spicy"] },
      { id: "keema-karahi", name: "Keema Karahi", price: 7.99, description: "Minced lamb, dry-fried in the wok.", image: IMG.tawa },
    ],
  },

  {
    id: "nashta",
    number: "08",
    name: "Lahori Nashta",
    blurb: "Breakfast the way Lahore does it — heavy, early, unapologetic.",
    image: IMG.nashta,
    items: [
      { id: "halwa-puri", name: "Halwa Puri", price: 5.99, description: "Puffed puri, semolina halwa, chana.", tags: ["breakfast", "veg", "signature"], image: IMG.nashta },
      { id: "anda-paratha", name: "2 Anda 1 Paratha", price: 3.99, description: "Two eggs, one paratha.", tags: ["breakfast"] },
      // NEEDS-CONFIRMATION: no prices printed for these three.
      { id: "nashta-nehari", name: "Nehari", price: null, priceNote: "Ask in store", tags: ["breakfast"] },
      { id: "nashta-choolay", name: "Choolay", price: null, priceNote: "Ask in store", tags: ["breakfast", "veg"] },
      { id: "nashta-paya", name: "Paya", price: null, priceNote: "Ask in store", tags: ["breakfast"] },
    ],
  },

  {
    id: "specials",
    number: "09",
    name: "Lahoriwala Specials",
    blurb: "The slow ones. What the kitchen starts before anyone else is awake.",
    image: IMG.nihari,
    items: [
      { id: "shahi-haleem", name: "Shahi Haleem", price: 7.99, description: "Wheat, lentils and meat, pounded down to silk.", tags: ["signature"], image: IMG.nihari },
      { id: "lahori-nihari", name: "Lahori Nihari", price: 7.99, description: "Overnight shank in marrow gravy, ginger and chilli on top.", tags: ["signature"], image: IMG.nihari },
      { id: "lamb-paye", name: "Lamb Paye", price: 8.99, description: "Trotters, slow-cooked to collagen." },
      { id: "lamb-kunna-paye", name: "Lamb Kunna Paye", price: 9.99, description: "Chiniot-style, cooked in a clay pot." },
      { id: "tawa-platter", name: "Tawa Platter", price: 30.0, description: "The table's centrepiece — built for sharing.", tags: ["sharing", "signature"], image: IMG.tawa },
    ],
  },

  {
    id: "biryani",
    number: "10",
    name: "Lahori Biryani & Rice",
    blurb: "Layered, steamed, spooned from the bottom up.",
    image: IMG.biryani,
    items: [
      { id: "chicken-biryani", name: "Chicken Biryani", price: 4.99, description: "Long-grain basmati, layered and steamed.", tags: ["signature"], image: IMG.biryani },
      { id: "lamb-biryani", name: "Lamb Biryani", price: 5.99 },
      { id: "chicken-tikka-biryani", name: "Chicken Tikka Biryani", price: 5.99 },
      { id: "veg-biryani", name: "Veg Biryani", price: 3.99, tags: ["veg"] },
      { id: "prawn-biryani", name: "Prawn Biryani", price: 8.99 },
      { id: "plain-rice", name: "Plain Rice", price: 1.99, tags: ["veg"] },
      { id: "pulao-rice", name: "Pulao Rice", price: 2.49, tags: ["veg"] },
      { id: "egg-fried-rice", name: "Egg Fried Rice", price: 3.99 },
    ],
  },

  {
    id: "vegetarian-mains",
    number: "11",
    name: "Vegetarian Mains",
    blurb: "Daal, saag and everything that holds its own without meat.",
    image: IMG.veg,
    items: [
      { id: "tarka-daal", name: "Tarka Daal", price: 5.0, description: "Lentils finished with a hot ghee tempering.", tags: ["veg", "signature"], image: IMG.veg },
      { id: "mash-daal", name: "Mash Daal", price: 5.0, tags: ["veg"] },
      { id: "mix-vegetable", name: "Mix Vegetable", price: 5.0, tags: ["veg"] },
      { id: "saag", name: "Saag", price: 5.0, description: "Slow-cooked mustard greens.", tags: ["veg"] },
      { id: "okra", name: "Okra", price: 5.0, tags: ["veg"] },
      { id: "chana", name: "Chana", price: 5.0, description: "Chickpeas in a spiced gravy.", tags: ["veg"] },
      { id: "mumbai-aloo", name: "Mumbai Aloo", price: 5.0, tags: ["veg"] },
      // NEEDS-CONFIRMATION: printed as "kimamatar" in a vegetarian section —
      // if this is Keema Matar it contains lamb mince and is misfiled.
      { id: "keema-matar", name: "Keema Matar", price: 7.99, description: "Minced lamb with peas." },
      { id: "red-kidney-beans", name: "Red Kidney Beans", price: 5.0, tags: ["veg"] },
    ],
  },

  {
    id: "breads",
    number: "12",
    name: "Breads",
    blurb: "Pulled from the tandoor to order. Nothing here is over £3.",
    image: IMG.naan,
    items: [
      { id: "plain-naan", name: "Plain Naan", price: 0.8, tags: ["veg"] },
      { id: "butter-naan", name: "Butter Naan", price: 0.99, tags: ["veg"] },
      { id: "roti-tandoori", name: "Roti Tandoori", price: 0.8, tags: ["veg"] },
      { id: "garlic-naan", name: "Garlic Naan", price: 1.5, tags: ["veg"] },
      { id: "chilli-naan", name: "Chilli Naan", price: 1.5, tags: ["veg", "spicy"] },
      { id: "cheese-naan", name: "Cheese Naan", price: 2.99, tags: ["veg"] },
      { id: "peshwari-naan", name: "Peshwari Naan", price: 2.49, description: "Sweet, with coconut and sultana.", tags: ["veg"] },
      { id: "keema-naan", name: "Keema Naan", price: 2.49, description: "Stuffed with spiced mince." },
      { id: "chapati-roti", name: "Chapati Roti", price: 0.99, tags: ["veg"] },
      { id: "amritsari-kulcha-naan", name: "Amritsari Kulcha Naan", price: 2.49, tags: ["veg"] },
      { id: "plain-paratha", name: "Plain Paratha", price: 1.5, tags: ["veg"] },
      { id: "aloo-paratha", name: "Aloo Paratha", price: 1.99, description: "Stuffed with spiced potato.", tags: ["veg"] },
    ],
  },

  {
    id: "desserts",
    number: "13",
    name: "Desserts",
    blurb: "Sweet, milky, cold or warm — how the meal is meant to end.",
    image: IMG.dessert,
    items: [
      { id: "gulab-jamun", name: "Gulab Jamun", price: 1.99, description: "Warm, syrup-soaked.", tags: ["veg"] },
      { id: "lahori-kheer", name: "Lahori Kheer", price: 1.99, description: "Slow-reduced rice pudding.", tags: ["veg", "signature"] },
      { id: "gajar-halwa", name: "Gajar Halwa", price: 3.49, description: "Carrot, milk, ghee, cardamom.", tags: ["veg"] },
      { id: "ras-malai", name: "Ras Malai", price: 2.99, tags: ["veg"] },
      { id: "zarda", name: "Zarda", price: 1.99, description: "Sweet saffron rice.", tags: ["veg"] },
    ],
  },

  {
    id: "drinks",
    number: "14",
    name: "Drinks",
    blurb: "Lassi, churned and poured cold.",
    image: IMG.drinks,
    items: [
      { id: "soft-drinks", name: "Soft Drinks", price: 0.99, priceNote: "£0.99 / £1.49", tags: ["veg"] },
      { id: "mango-lassi", name: "Mango Lassi", price: 1.99, tags: ["veg", "signature"] },
      { id: "salt-lassi", name: "Salt Lassi", price: 1.99, tags: ["veg"] },
      { id: "sweet-lassi", name: "Sweet Lassi", price: 1.99, tags: ["veg"] },
    ],
  },

  {
    id: "hot-drinks",
    number: "15",
    name: "Hot Drinks",
    blurb: "To finish, or to sit with.",
    image: IMG.drinks,
    items: [
      { id: "english-tea", name: "English Tea", price: 0.99, tags: ["veg"] },
      { id: "coffee", name: "Coffee", price: 1.5, tags: ["veg"] },
      // NEEDS-CONFIRMATION: printed higher than English Tea — verify.
      { id: "green-tea", name: "Green Tea", price: 2.49, tags: ["veg"] },
    ],
  },
];
