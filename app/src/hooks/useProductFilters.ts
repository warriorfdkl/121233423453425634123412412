import { useMemo, useState } from 'react';
import { products, categories } from '../data/products';
import type { ProductCategory } from '../data/types';

type SortKey = 'pop' | 'cheap' | 'exp';

const priceOf = (id: number) => products.find((p) => p.id === id)!.priceCents;

/**
 * All catalog filter/sort state and the derived, filtered product list.
 * In the prototype this logic lived inline inside a 150-line renderVals()
 * method mixed with markup-binding code; pulling it into a hook makes it
 * independently testable and reusable (e.g. a future "search" page could
 * reuse the same filtering rules without re-implementing them).
 */
export function useProductFilters() {
  const allPrices = products.map((p) => p.priceCents);
  const priceBoundMin = Math.min(...allPrices);
  const priceBoundMax = Math.max(...allPrices);

  const [category, setCategory] = useState<ProductCategory | 'Все'>('Все');
  const [sort, setSort] = useState<SortKey>('pop');
  const [color, setColor] = useState<string | null>(null);
  const [sizes, setSizes] = useState<Set<string>>(new Set());
  const [priceMin, setPriceMin] = useState(priceBoundMin);
  const [priceMax, setPriceMax] = useState(priceBoundMax);

  const toggleSize = (label: string) =>
    setSizes((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });

  const reset = () => {
    setCategory('Все');
    setSort('pop');
    setColor(null);
    setSizes(new Set());
    setPriceMin(priceBoundMin);
    setPriceMax(priceBoundMax);
  };

  const filtered = useMemo(() => {
    let list = category === 'Все' ? products : products.filter((p) => p.category === category);
    if (color) list = list.filter((p) => p.swatches.includes(color));
    list = list.filter((p) => p.priceCents >= priceMin && p.priceCents <= priceMax);
    return [...list].sort((a, b) => {
      if (sort === 'cheap') return priceOf(a.id) - priceOf(b.id);
      if (sort === 'exp') return priceOf(b.id) - priceOf(a.id);
      return 0;
    });
  }, [category, color, priceMin, priceMax, sort]);

  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<ProductCategory, number>> = {};
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] ?? 0) + 1;
    });
    return counts;
  }, []);

  return {
    categories,
    category,
    setCategory,
    sort,
    setSort,
    color,
    setColor,
    sizes,
    toggleSize,
    priceMin,
    priceMax,
    setPriceMin,
    setPriceMax,
    priceBoundMin,
    priceBoundMax,
    reset,
    filtered,
    categoryCounts,
  };
}
