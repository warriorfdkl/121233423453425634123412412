import { Link } from 'react-router-dom';
import { useAppState } from '../context/AppStateContext';
import { getProduct, pluralizeDesign } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { StarIcon } from '../components/icons';
import './CatalogPage.css';

export function FavoritesPage() {
  const { favorites } = useAppState();
  const items = [...favorites].map((id) => getProduct(id)).filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div>
      <div className="catalog-header">
        <div className="catalog-breadcrumb">
          <Link to="/">Главная</Link>
          <span>/</span>
          <span style={{ color: 'var(--pf-text-dim-75)' }}>Избранное</span>
        </div>
        <div className="catalog-title-row">
          <h1>Избранное</h1>
          <div style={{ fontSize: 14, color: 'var(--pf-text-dim-5)' }}>
            {items.length} {pluralizeDesign(items.length)}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1800, margin: '0 auto', padding: '40px clamp(20px,3vw,48px) 140px' }}>
        {items.length > 0 ? (
          <div className="product-grid">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: '120px 20px', textAlign: 'center' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--pf-bg-raised)', border: '1px solid var(--pf-border)', display: 'grid', placeItems: 'center' }}>
              <StarIcon size={30} color="var(--pf-text-dim-5)" />
            </div>
            <div style={{ fontWeight: 600, fontSize: 19 }}>В избранном пока пусто</div>
            <div style={{ fontSize: 14.5, color: 'var(--pf-text-dim-5)', maxWidth: '36ch', lineHeight: 1.6 }}>
              Сохраняй понравившиеся дизайны иконкой звезды на карточке — соберём их здесь.
            </div>
            <Link
              to="/catalog"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                height: 50,
                padding: '0 26px',
                borderRadius: 99,
                background: 'var(--pf-accent)',
                color: '#0B0B0C',
                fontWeight: 600,
                fontSize: 15,
                textDecoration: 'none',
                marginTop: 8,
              }}
            >
              Смотреть каталог
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
