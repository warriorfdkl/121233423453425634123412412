import type { Product } from '../data/types';
import { formatPrice } from '../data/types';
import { useAppState } from '../context/AppStateContext';
import { GarmentPreview } from './GarmentPreview';
import { BagIcon, StarIcon } from './icons';

/** Product tile used by both the catalog and favorites pages — one component instead of two near-identical copies. */
export function ProductCard({ product }: { product: Product }) {
  const { favorites, toggleFavorite, addToCart } = useAppState();
  const isFavorite = favorites.has(product.id);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div
        style={{
          position: 'relative',
          aspectRatio: '4 / 5',
          borderRadius: 20,
          background: 'var(--pf-bg-raised)',
          border: '1px solid var(--pf-border)',
          overflow: 'hidden',
        }}
      >
        {product.badge && (
          <div
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
              zIndex: 2,
              padding: '5px 10px',
              borderRadius: 99,
              background: product.badge.tone === 'accent' ? 'var(--pf-accent)' : 'var(--pf-text)',
              color: '#0B0B0C',
              fontWeight: 700,
              fontSize: 10.5,
              letterSpacing: '.02em',
            }}
          >
            {product.badge.label}
          </div>
        )}

        <button
          type="button"
          onClick={() => toggleFavorite(product.id)}
          aria-label={isFavorite ? 'Убрать из избранного' : 'В избранное'}
          aria-pressed={isFavorite}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 2,
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: 'none',
            background: 'rgba(11,11,12,.55)',
            backdropFilter: 'blur(6px)',
            display: 'grid',
            placeItems: 'center',
            cursor: 'pointer',
            color: isFavorite ? 'var(--pf-accent)' : '#EDEDEE',
          }}
        >
          <StarIcon size={16} filled={isFavorite} />
        </button>

        <GarmentPreview
          name={product.name}
          tintFilter={product.tintFilter}
          decal={product.decal}
          decalBackground={product.decal.kind === 'text' ? 'rgba(255,92,56,.92)' : 'rgba(11,11,12,.85)'}
        />

        <button
          type="button"
          onClick={() => addToCart(product.id, 'M', 'Как на фото')}
          aria-label="В корзину"
          style={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            zIndex: 2,
            width: 38,
            height: 38,
            borderRadius: '50%',
            border: 'none',
            background: 'var(--pf-accent)',
            display: 'grid',
            placeItems: 'center',
            cursor: 'pointer',
          }}
        >
          <BagIcon size={17} color="#0B0B0C" strokeWidth={2} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {product.swatches.map((hex) => (
            <span
              key={hex}
              style={{ width: 13, height: 13, borderRadius: '50%', background: hex, border: '1px solid rgba(255,255,255,.2)' }}
            />
          ))}
        </div>
        <div
          style={{
            fontWeight: 600,
            fontSize: 14.5,
            letterSpacing: '-.005em',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 700, fontSize: 15.5 }}>{formatPrice(product.priceCents)}</span>
          {product.oldPriceCents && (
            <span style={{ fontSize: 13, color: 'var(--pf-text-dim-4)', textDecoration: 'line-through' }}>
              {formatPrice(product.oldPriceCents)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
