import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GarmentPreview } from '../components/GarmentPreview';
import { PersonIcon } from '../components/icons';
import { getProduct } from '../data/products';
import { formatPrice } from '../data/types';
import './AccountPage.css';

type Tab = 'orders' | 'profile' | 'addresses';

const orders: { number: string; date: string; status: 'done' | 'transit'; productIds: number[]; totalCents: number }[] = [
  { number: '№ 10482', date: '3 июля 2026', status: 'done', productIds: [1, 3], totalCents: 318000 },
  { number: '№ 10417', date: '21 июня 2026', status: 'transit', productIds: [5], totalCents: 169000 },
  { number: '№ 10355', date: '2 июня 2026', status: 'done', productIds: [4, 8, 3], totalCents: 447000 },
];

const statusStyle: Record<string, { label: string; bg: string; fg: string }> = {
  done: { label: 'Доставлен', bg: 'rgba(143,226,154,.14)', fg: 'var(--pf-success)' },
  transit: { label: 'В пути', bg: 'rgba(255,92,56,.14)', fg: '#FF8B6E' },
};

const addresses = [
  { label: 'Дом', text: 'Казань, ул. Баумана, 12, кв. 45' },
  { label: 'Работа', text: 'Казань, пр. Победы, 100, офис 302' },
];

export function AccountPage() {
  const [tab, setTab] = useState<Tab>('orders');

  return (
    <div>
      <div className="catalog-header" style={{ maxWidth: 1800, margin: '0 auto', padding: '40px clamp(20px,3vw,48px) 0' }}>
        <div className="catalog-breadcrumb">
          <Link to="/">Главная</Link>
          <span>/</span>
          <span style={{ color: 'var(--pf-text-dim-75)' }}>Личный кабинет</span>
        </div>
        <h1>Личный кабинет</h1>
      </div>

      <div className="account-grid">
        <aside className="account-sidebar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 22, borderRadius: 20, background: 'var(--pf-bg-raised)', border: '1px solid var(--pf-border)' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--pf-accent-soft)', display: 'grid', placeItems: 'center', flex: 'none' }}>
              <PersonIcon size={24} color="var(--pf-accent)" />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Алина Каримова
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--pf-text-dim-5)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                a.karimova@mail.ru
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <button type="button" className={`account-menu-item ${tab === 'orders' ? 'account-menu-item--active' : ''}`} onClick={() => setTab('orders')}>
              <span>Заказы</span>
              <span style={{ fontSize: 12, color: 'var(--pf-text-dim-4)' }}>{orders.length}</span>
            </button>
            <button type="button" className={`account-menu-item ${tab === 'profile' ? 'account-menu-item--active' : ''}`} onClick={() => setTab('profile')}>
              Личные данные
            </button>
            <button type="button" className={`account-menu-item ${tab === 'addresses' ? 'account-menu-item--active' : ''}`} onClick={() => setTab('addresses')}>
              <span>Адреса доставки</span>
              <span style={{ fontSize: 12, color: 'var(--pf-text-dim-4)' }}>{addresses.length}</span>
            </button>
            <Link to="/favorites" className="account-menu-item">
              Избранное
            </Link>
            <Link to="/" className="account-menu-item" style={{ color: 'var(--pf-text-dim-65)', marginTop: 10 }}>
              Выйти
            </Link>
          </div>
        </aside>

        <div>
          {tab === 'orders' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {orders.map((order) => {
                const status = statusStyle[order.status];
                return (
                  <div className="order-card" key={order.number}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 15.5 }}>Заказ {order.number}</div>
                        <div style={{ fontSize: 12.5, color: 'var(--pf-text-dim-5)', marginTop: 3 }}>{order.date}</div>
                      </div>
                      <div style={{ padding: '6px 12px', borderRadius: 99, background: status.bg, color: status.fg, fontWeight: 600, fontSize: 12 }}>
                        {status.label}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      {order.productIds.map((id, i) => {
                        const product = getProduct(id);
                        if (!product) return null;
                        return (
                          <div className="order-thumb" key={`${id}-${i}`}>
                            <GarmentPreview
                              name={product.name}
                              tintFilter={product.tintFilter}
                              decal={product.decal}
                              decalBackground="transparent"
                            />
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, borderTop: '1px solid var(--pf-border)', paddingTop: 14 }}>
                      <div style={{ fontSize: 13.5, color: 'var(--pf-text-dim-65)' }}>{order.productIds.length} товара</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ fontWeight: 700, fontSize: 16 }}>{formatPrice(order.totalCents)}</div>
                        <button type="button" style={{ height: 38, padding: '0 18px', borderRadius: 99, border: '1px solid var(--pf-border-strong)', background: 'none', color: 'var(--pf-text)', fontWeight: 600, fontSize: 12.5, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                          Повторить
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {tab === 'profile' && (
            <div style={{ padding: 28, borderRadius: 20, background: 'var(--pf-bg-raised)', border: '1px solid var(--pf-border)', maxWidth: 520, display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div className="account-field">
                <label htmlFor="pfName">Имя</label>
                <input id="pfName" type="text" defaultValue="Алина Каримова" />
              </div>
              <div className="account-field">
                <label htmlFor="pfPhone">Телефон</label>
                <input id="pfPhone" type="text" defaultValue="+7 995 123-45-67" />
              </div>
              <div className="account-field">
                <label htmlFor="pfEmail">Email</label>
                <input id="pfEmail" type="text" defaultValue="a.karimova@mail.ru" />
              </div>
              <button type="button" style={{ alignSelf: 'flex-start', height: 48, padding: '0 26px', borderRadius: 99, border: 'none', background: 'var(--pf-accent)', color: '#0B0B0C', fontWeight: 600, fontSize: 14.5, cursor: 'pointer', marginTop: 6 }}>
                Сохранить
              </button>
            </div>
          )}

          {tab === 'addresses' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 560 }}>
              {addresses.map((a) => (
                <div key={a.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '20px 22px', borderRadius: 16, background: 'var(--pf-bg-raised)', border: '1px solid var(--pf-border)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14.5, marginBottom: 4 }}>{a.label}</div>
                    <div style={{ fontSize: 13, color: 'var(--pf-text-dim-65)' }}>{a.text}</div>
                  </div>
                  <button type="button" aria-label="Удалить" style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,.06)', color: 'var(--pf-text-dim-65)', cursor: 'pointer', flex: 'none' }}>
                    ✕
                  </button>
                </div>
              ))}
              <button type="button" style={{ alignSelf: 'flex-start', height: 46, padding: '0 20px', borderRadius: 99, border: '1.5px dashed var(--pf-border-strong)', background: 'none', color: 'var(--pf-text-dim-75)', fontWeight: 600, fontSize: 13.5, cursor: 'pointer', marginTop: 4 }}>
                + Добавить адрес
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
