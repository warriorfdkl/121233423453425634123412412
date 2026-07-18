import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { getProduct } from '../data/products';

export interface CartLine {
  productId: number;
  size: string;
  colorName: string;
  qty: number;
}

interface AppState {
  cart: CartLine[];
  favorites: Set<number>;
  addToCart: (productId: number, size: string, colorName: string) => void;
  removeFromCart: (productId: number) => void;
  setQty: (productId: number, qty: number) => void;
  toggleFavorite: (productId: number) => void;
  cartCount: number;
  cartSubtotalCents: number;
}

const AppStateContext = createContext<AppState | null>(null);

/**
 * Cart + favorites live here, above the router, instead of inside each
 * page's own component state. In the static prototype cart.html and
 * favorites.html were separate HTML documents with no shared JS runtime —
 * "adding to cart" from the catalog could never actually show up in
 * cart.html, because there was no process boundary they both lived in.
 * A context provider mounted once in <App> is what makes that a real,
 * working feature instead of a page-local illusion of one.
 */
export function AppStateProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const addToCart = useCallback((productId: number, size: string, colorName: string) => {
    setCart((prev) => {
      const existing = prev.find((l) => l.productId === productId && l.size === size && l.colorName === colorName);
      if (existing) {
        return prev.map((l) => (l === existing ? { ...l, qty: Math.min(l.qty + 1, 9) } : l));
      }
      return [...prev, { productId, size, colorName, qty: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setCart((prev) => prev.filter((l) => l.productId !== productId));
  }, []);

  const setQty = useCallback((productId: number, qty: number) => {
    setCart((prev) => prev.map((l) => (l.productId === productId ? { ...l, qty: Math.max(1, Math.min(9, qty)) } : l)));
  }, []);

  const toggleFavorite = useCallback((productId: number) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  }, []);

  const cartCount = useMemo(() => cart.reduce((sum, l) => sum + l.qty, 0), [cart]);

  const cartSubtotalCents = useMemo(
    () =>
      cart.reduce((sum, l) => {
        const product = getProduct(l.productId);
        return sum + (product ? product.priceCents * l.qty : 0);
      }, 0),
    [cart],
  );

  const value = useMemo(
    () => ({ cart, favorites, addToCart, removeFromCart, setQty, toggleFavorite, cartCount, cartSubtotalCents }),
    [cart, favorites, addToCart, removeFromCart, setQty, toggleFavorite, cartCount, cartSubtotalCents],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppState {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used inside <AppStateProvider>');
  return ctx;
}
