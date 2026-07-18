import type { Product, ProductCategory } from './types';

/**
 * The single source of truth for the product catalog.
 *
 * In the static prototype this same list (with the same id: 1 "Просто вайб"
 * entry) was hand-copied into catalog.html, favorites.html and cart.html —
 * twice as a formatted ruble string, once as a bare number. Every page here
 * imports this one module instead, so there is exactly one place to edit
 * a price and nothing can drift out of sync.
 */
export const products: Product[] = [
  {
    id: 1,
    name: 'Просто вайб',
    category: 'Мемы',
    priceCents: 149000,
    oldPriceCents: null,
    badge: { label: 'Хит', tone: 'accent' },
    tintFilter: 'brightness(0.22) contrast(1.1)',
    decal: { kind: 'text', value: 'VIBE', color: '#0B0B0C' },
    swatches: ['#141416', '#EDEDEE', '#FF5C38'],
  },
  {
    id: 2,
    name: 'На созвоне',
    category: 'Мемы',
    priceCents: 139000,
    oldPriceCents: null,
    badge: null,
    tintFilter: 'sepia(1) saturate(3.4) hue-rotate(-45deg) brightness(1.05)',
    decal: { kind: 'text', value: 'LOL', color: '#EDEDEE' },
    swatches: ['#C9A377', '#141416', '#EDEDEE'],
  },
  {
    id: 3,
    name: 'Меньше — лучше',
    category: 'Минимализм',
    priceCents: 159000,
    oldPriceCents: null,
    badge: null,
    tintFilter: 'none',
    decal: { kind: 'text', value: 'MONO', color: '#EDEDEE' },
    swatches: ['#EDEDEE', '#141416', '#8C8C90'],
  },
  {
    id: 4,
    name: 'Линия',
    category: 'Минимализм',
    priceCents: 149000,
    oldPriceCents: null,
    badge: { label: 'Новинка', tone: 'neutral' },
    tintFilter: 'brightness(0.42) contrast(1.05) saturate(.3)',
    decal: { kind: 'text', value: 'LESS', color: '#0B0B0C' },
    swatches: ['#8C8C90', '#EDEDEE', '#C9A377'],
  },
  {
    id: 5,
    name: 'Он & Она',
    category: 'Для пары',
    priceCents: 169000,
    oldPriceCents: null,
    badge: { label: 'Хит', tone: 'accent' },
    tintFilter: 'sepia(1) saturate(6) hue-rotate(-15deg) brightness(0.9)',
    decal: { kind: 'text', value: 'US', color: '#0B0B0C' },
    swatches: ['#FF5C38', '#EDEDEE', '#141416'],
  },
  {
    id: 6,
    name: 'Половинки',
    category: 'Для пары',
    priceCents: 169000,
    oldPriceCents: null,
    badge: null,
    tintFilter: 'sepia(1) saturate(3.5) hue-rotate(200deg) brightness(0.95)',
    decal: { kind: 'text', value: 'TWO', color: '#0B0B0C' },
    swatches: ['#8E86D6', '#EDEDEE', '#141416'],
  },
  {
    id: 7,
    name: 'Команда 2026',
    category: 'Мерч команды',
    priceCents: 179000,
    oldPriceCents: null,
    badge: { label: 'Хит', tone: 'accent' },
    tintFilter: 'brightness(0.22) contrast(1.1)',
    decal: { kind: 'text', value: 'TEAM', color: '#0B0B0C' },
    swatches: ['#141416', '#FF5C38', '#8C8C90'],
  },
  {
    id: 8,
    name: 'Свой номер',
    category: 'Мерч команды',
    priceCents: 179000,
    oldPriceCents: null,
    badge: null,
    tintFilter: 'sepia(1) saturate(3.2) hue-rotate(55deg) brightness(0.82)',
    decal: { kind: 'text', value: '07', color: '#0B0B0C' },
    swatches: ['#7C8B6F', '#141416', '#EDEDEE'],
  },
  {
    id: 9,
    name: 'Твой кадр',
    category: 'С фото',
    priceCents: 199000,
    oldPriceCents: 234000,
    badge: { label: '-15%', tone: 'accent' },
    tintFilter: 'none',
    decal: { kind: 'icon', icon: 'camera', color: '#EDEDEE' },
    swatches: ['#EDEDEE', '#141416', '#C9A377'],
  },
  {
    id: 10,
    name: 'Momento',
    category: 'С фото',
    priceCents: 199000,
    oldPriceCents: null,
    badge: null,
    tintFilter: 'sepia(1) saturate(3.4) hue-rotate(-45deg) brightness(1.05)',
    decal: { kind: 'icon', icon: 'camera', color: '#EDEDEE' },
    swatches: ['#C9A377', '#EDEDEE', '#141416'],
  },
  {
    id: 11,
    name: 'Нежность',
    category: 'Для неё',
    priceCents: 159000,
    oldPriceCents: null,
    badge: null,
    tintFilter: 'sepia(1) saturate(3.5) hue-rotate(200deg) brightness(0.95)',
    decal: { kind: 'icon', icon: 'heart', color: '#FF5C38' },
    swatches: ['#8E86D6', '#EDEDEE', '#FF5C38'],
  },
  {
    id: 12,
    name: 'Для мамы',
    category: 'Для неё',
    priceCents: 159000,
    oldPriceCents: null,
    badge: { label: 'Хит', tone: 'accent' },
    tintFilter: 'sepia(1) saturate(6) hue-rotate(-15deg) brightness(0.9)',
    decal: { kind: 'icon', icon: 'heart', color: '#FF5C38' },
    swatches: ['#FF5C38', '#EDEDEE', '#141416'],
  },
];

export const getProduct = (id: number): Product | undefined =>
  products.find((p) => p.id === id);

export const categories: ProductCategory[] = [
  'Мемы',
  'Минимализм',
  'Для пары',
  'Мерч команды',
  'С фото',
  'Для неё',
];

export const pluralizeDesign = (n: number): string => {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'дизайн';
  if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return 'дизайна';
  return 'дизайнов';
};
