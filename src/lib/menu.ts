/**
 * The only way components are allowed to reach menu data.
 *
 * Right now every function reads the local array in `src/data/menu.ts`. When
 * the admin dashboard arrives, these bodies become fetches and nothing that
 * renders has to change. That is the entire point of this file — keep it thin
 * and keep components out of `data/` directly.
 */

import { menu, type Dish, type MenuCategory } from "@/data/menu";

export type { Dish, MenuCategory, DishTag } from "@/data/menu";

export function getCategories(): MenuCategory[] {
  return menu;
}

export function getCategory(id: string): MenuCategory | undefined {
  return menu.find((c) => c.id === id);
}

export function getAllDishes(): Dish[] {
  return menu.flatMap((c) => c.items);
}

/** Dishes flagged as the kitchen's own signatures — used for homepage teasers. */
export function getSignatureDishes(): Dish[] {
  return getAllDishes().filter((d) => d.tags?.includes("signature"));
}

export function getDishCount(): number {
  return getAllDishes().length;
}

/** Cheapest real price on the menu — used for honest "from £x" copy. */
export function getLowestPrice(): number {
  const priced = getAllDishes()
    .map((d) => d.price)
    .filter((p): p is number => p !== null);
  return Math.min(...priced);
}

/**
 * Formats a price for display. Returns the printed note when a dish has no
 * price on the physical menu, so the UI never renders "£null" or a guess.
 */
export function formatPrice(dish: Pick<Dish, "price" | "priceNote">): string {
  if (dish.price === null) return dish.priceNote ?? "—";
  return `£${dish.price.toFixed(2)}`;
}
