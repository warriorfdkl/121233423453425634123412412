export type ProductCategory =
  | 'Мемы'
  | 'Минимализм'
  | 'Для пары'
  | 'Мерч команды'
  | 'С фото'
  | 'Для неё';

export type Badge = { label: string; tone: 'accent' | 'neutral' } | null;

export type Decal =
  | { kind: 'text'; value: string; color: string }
  | { kind: 'icon'; icon: 'camera' | 'heart'; color: string };

/**
 * A single product. Price is stored as an integer in kopecks (cents) —
 * never as a formatted string — so arithmetic (sort, filter, cart totals)
 * never has to round-trip through string parsing. Format at the render
 * boundary only, via `formatPrice()`.
 */
export interface Product {
  id: number;
  name: string;
  category: ProductCategory;
  priceCents: number;
  oldPriceCents: number | null;
  badge: Badge;
  tintFilter: string;
  decal: Decal;
  swatches: string[];
}

export const formatPrice = (cents: number): string =>
  `${Math.round(cents / 100).toLocaleString('ru-RU')} ₽`;
