import { Link } from 'react-router-dom';
import { useProductFilters } from '../hooks/useProductFilters';
import { pluralizeDesign } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import './CatalogPage.css';

const sortOptions: { key: 'pop' | 'cheap' | 'exp'; label: string }[] = [
  { key: 'pop', label: 'По популярности' },
  { key: 'cheap', label: 'Сначала дешевле' },
  { key: 'exp', label: 'Сначала дороже' },
];

const sizeLabels = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const colorSwatches = ['#EDEDEE', '#141416', '#FF5C38', '#C9A377', '#7C8B6F', '#8E86D6', '#8C8C90'];

export function CatalogPage() {
  const f = useProductFilters();

  return (
    <div>
      <div className="catalog-header">
        <div className="catalog-breadcrumb">
          <Link to="/">Главная</Link>
          <span>/</span>
          <span style={{ color: 'var(--pf-text-dim-75)' }}>Готовые дизайны</span>
        </div>
        <div className="catalog-title-row">
          <h1>Готовые дизайны</h1>
          <p>
            Принты уже придуманы и проверены на печати — выбирай футболку, подставь своё фото или текст, если хочется, и
            оформляй за пару минут.
          </p>
        </div>
      </div>

      <div className="catalog-pills">
        <div className="catalog-pills__row">
          <button
            type="button"
            className={`pf-pill ${f.category === 'Все' ? 'pf-pill--active' : ''}`}
            onClick={() => f.setCategory('Все')}
          >
            Все
          </button>
          {f.categories.map((c) => (
            <button
              key={c}
              type="button"
              className={`pf-pill ${f.category === c ? 'pf-pill--active' : ''}`}
              onClick={() => f.setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="catalog-body">
        <aside className="catalog-sidebar">
          <div className="catalog-sidebar__head">
            <div className="catalog-sidebar__label">Фильтры</div>
            <button type="button" className="catalog-reset" onClick={f.reset}>
              Сбросить
            </button>
          </div>

          <div>
            <div className="catalog-section-title">Категория</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {f.categories.map((c) => {
                const checked = f.category === c;
                return (
                  <div key={c} className="catalog-category-row" onClick={() => f.setCategory(checked ? 'Все' : c)}>
                    <span className={`catalog-category-check ${checked ? 'catalog-category-check--checked' : ''}`}>
                      {checked ? '✓' : ''}
                    </span>
                    <span style={{ flex: 1 }}>{c}</span>
                    <span style={{ color: 'var(--pf-text-dim-4)', fontSize: 12 }}>{f.categoryCounts[c] ?? 0}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <div className="catalog-section-title">Размер</div>
            <div className="catalog-size-grid">
              {sizeLabels.map((s) => (
                <div
                  key={s}
                  className={`catalog-size-pill ${f.sizes.has(s) ? 'catalog-size-pill--active' : ''}`}
                  onClick={() => f.toggleSize(s)}
                >
                  {s}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="catalog-section-title">Цвет</div>
            <div className="catalog-swatch-row">
              {colorSwatches.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  className={`catalog-swatch ${f.color === hex ? 'catalog-swatch--active' : ''}`}
                  style={{ background: hex }}
                  aria-label={`Цвет ${hex}`}
                  onClick={() => f.setColor(f.color === hex ? null : hex)}
                />
              ))}
            </div>
          </div>

        </aside>

        <div>
          <div className="catalog-toolbar">
            <div style={{ fontSize: 14, color: 'var(--pf-text-dim-5)' }}>
              {f.filtered.length} {pluralizeDesign(f.filtered.length)}
            </div>
            <div className="catalog-toolbar__sorts">
              {sortOptions.map((o) => (
                <button
                  key={o.key}
                  type="button"
                  className={`pf-pill ${f.sort === o.key ? 'pf-pill--active' : ''}`}
                  style={{ height: 36 }}
                  onClick={() => f.setSort(o.key)}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          {f.filtered.length > 0 ? (
            <div className="product-grid">
              {f.filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div style={{ padding: '80px 20px', textAlign: 'center', color: 'var(--pf-text-dim-5)', fontSize: 15 }}>
              По этому фильтру пока ничего нет — попробуй выбрать другую категорию.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
