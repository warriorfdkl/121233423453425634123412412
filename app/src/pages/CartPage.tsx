import { Link } from 'react-router-dom';
import { useAppState } from '../context/AppStateContext';
import { getProduct } from '../data/products';
import { formatPrice } from '../data/types';
import { GarmentPreview } from '../components/GarmentPreview';
import { BagIcon } from '../components/icons';
import './CartPage.css';

const FREE_DELIVERY_THRESHOLD_CENTS = 300000;
const DELIVERY_FEE_CENTS = 30000;

function itemsWord(n: number): string {
  if (n === 1) return 'товар';
  if (n >= 2 && n <= 4) return 'товара';
  return 'товаров';
}

export function CartPage() {
  const { cart, cartCount, cartSubtotalCents, removeFromCart, setQty } = useAppState();

  const freeDelivery = cartSubtotalCents >= FREE_DELIVERY_THRESHOLD_CENTS;
  const deliveryCents = cart.length === 0 ? 0 : freeDelivery ? 0 : DELIVERY_FEE_CENTS;

  return (
    <div>
      <div className="catalog-header" style={{ maxWidth: 1800, margin: '0 auto', padding: '40px clamp(20px,3vw,48px) 0' }}>
        <div className="catalog-breadcrumb">
          <Link to="/">Главная</Link>
          <span>/</span>
          <span style={{ color: 'var(--pf-text-dim-75)' }}>Корзина</span>
        </div>
        <div className="catalog-title-row">
          <h1>Корзина</h1>
          <div style={{ fontSize: 14, color: 'var(--pf-text-dim-5)' }}>
            {cartCount} {itemsWord(cartCount)}
          </div>
        </div>
      </div>

      <div className="cart-grid">
        {cart.length > 0 ? (
          <div className="cart-grid__inner">
            <div>
              {cart.map((line) => {
                const product = getProduct(line.productId);
                if (!product) return null;
                return (
                  <div className="cart-line" key={`${line.productId}-${line.size}-${line.colorName}`}>
                    <div className="cart-line__thumb">
                      <GarmentPreview
                        name={product.name}
                        tintFilter={product.tintFilter}
                        decal={product.decal}
                        decalBackground={product.decal.kind === 'text' ? 'rgba(255,92,56,.92)' : 'rgba(11,11,12,.85)'}
                      />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>{product.name}</div>
                          <div style={{ fontSize: 13, color: 'var(--pf-text-dim-5)' }}>
                            Размер {line.size} · Цвет {line.colorName}
                          </div>
                        </div>
                        <button
                          type="button"
                          aria-label="Удалить"
                          onClick={() => removeFromCart(line.productId)}
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: '50%',
                            border: 'none',
                            background: 'rgba(255,255,255,.06)',
                            color: 'var(--pf-text-dim-75)',
                            cursor: 'pointer',
                            flex: 'none',
                          }}
                        >
                          ✕
                        </button>
                      </div>
                      <div style={{ flex: 1 }} />
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                        <div className="cart-stepper">
                          <button
                            type="button"
                            aria-label="Меньше"
                            disabled={line.qty <= 1}
                            style={{ color: line.qty <= 1 ? 'var(--pf-text-dim-4)' : 'var(--pf-text)' }}
                            onClick={() => setQty(line.productId, line.qty - 1)}
                          >
                            −
                          </button>
                          <span style={{ minWidth: 16, textAlign: 'center', fontWeight: 600, fontSize: 14 }}>{line.qty}</span>
                          <button
                            type="button"
                            aria-label="Больше"
                            disabled={line.qty >= 9}
                            style={{ color: line.qty >= 9 ? 'var(--pf-text-dim-4)' : 'var(--pf-text)' }}
                            onClick={() => setQty(line.productId, line.qty + 1)}
                          >
                            +
                          </button>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: 17 }}>{formatPrice(product.priceCents * line.qty)}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="cart-summary">
              <div style={{ fontWeight: 600, fontSize: 17 }}>Итого</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14.5, color: 'var(--pf-text-dim-65)' }}>
                <span>Товары ({cartCount})</span>
                <span>{formatPrice(cartSubtotalCents)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14.5, color: 'var(--pf-text-dim-65)' }}>
                <span>Доставка</span>
                <span style={{ color: freeDelivery ? 'var(--pf-success)' : undefined }}>
                  {freeDelivery ? 'Бесплатно' : formatPrice(DELIVERY_FEE_CENTS)}
                </span>
              </div>
              {!freeDelivery && (
                <div
                  style={{
                    fontSize: 12.5,
                    color: '#FF8B6E',
                    background: 'rgba(255,92,56,.1)',
                    borderRadius: 10,
                    padding: '9px 12px',
                    lineHeight: 1.5,
                  }}
                >
                  Добавь товаров ещё на {formatPrice(FREE_DELIVERY_THRESHOLD_CENTS - cartSubtotalCents)}, чтобы доставка была
                  бесплатной
                </div>
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  placeholder="Промокод"
                  aria-label="Промокод"
                  style={{
                    flex: 1,
                    height: 42,
                    borderRadius: 10,
                    border: '1px solid var(--pf-border-strong)',
                    background: 'var(--pf-bg)',
                    color: 'var(--pf-text)',
                    fontSize: 13,
                    padding: '0 12px',
                  }}
                />
                <button
                  type="button"
                  style={{
                    height: 42,
                    padding: '0 18px',
                    borderRadius: 10,
                    border: '1px solid var(--pf-border-strong)',
                    background: 'none',
                    color: 'var(--pf-text)',
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  Ок
                </button>
              </div>
              <div style={{ height: 1, background: 'var(--pf-border)', margin: '4px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600, fontSize: 15 }}>К оплате</span>
                <span style={{ fontWeight: 700, fontSize: 24 }}>{formatPrice(cartSubtotalCents + deliveryCents)}</span>
              </div>
              <button
                type="button"
                style={{
                  height: 56,
                  borderRadius: 99,
                  border: 'none',
                  background: 'var(--pf-accent)',
                  color: '#0B0B0C',
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: 'pointer',
                  marginTop: 6,
                }}
              >
                Оформить заказ
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: '120px 20px', textAlign: 'center' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--pf-bg-raised)', border: '1px solid var(--pf-border)', display: 'grid', placeItems: 'center' }}>
              <BagIcon size={30} color="var(--pf-text-dim-5)" />
            </div>
            <div style={{ fontWeight: 600, fontSize: 19 }}>В корзине пока пусто</div>
            <div style={{ fontSize: 14.5, color: 'var(--pf-text-dim-5)', maxWidth: '36ch', lineHeight: 1.6 }}>
              Выбери готовый дизайн из каталога или собери свой принт в конструкторе.
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <Link
                to="/catalog"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 50, padding: '0 26px', borderRadius: 99, background: 'var(--pf-accent)', color: '#0B0B0C', fontWeight: 600, fontSize: 15, textDecoration: 'none' }}
              >
                <span className="cart-empty-cta__full">Смотреть каталог</span>
                <span className="cart-empty-cta__short">Каталог</span>
              </Link>
              <Link
                to="/constructor"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 50, padding: '0 26px', borderRadius: 99, border: '1px solid var(--pf-border-strong)', color: 'var(--pf-text)', fontWeight: 600, fontSize: 15, textDecoration: 'none' }}
              >
                <span className="cart-empty-cta__full">Открыть конструктор</span>
                <span className="cart-empty-cta__short">Конструктор</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
