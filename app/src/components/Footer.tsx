import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SupportChat } from './SupportChat';

const columns: { title: string; links: { label: string; to?: string; action?: 'chat' }[] }[] = [
  {
    title: 'Сервис',
    links: [
      { label: 'Конструктор', to: '/constructor' },
      { label: 'Каталог', to: '/catalog' },
    ],
  },
  {
    title: 'Компания',
    links: [
      { label: 'О нас', to: '/#footer' },
      { label: 'Отзывы', to: '/#footer' },
      { label: 'Блог', to: '/#news' },
    ],
  },
  {
    title: 'Поддержка',
    links: [
      { label: 'Связаться с нами', action: 'chat' },
      { label: 'Документация', to: '/#footer' },
      { label: 'Политика конфиденциальности', to: '/#footer' },
      { label: 'Условия обслуживания', to: '/#footer' },
    ],
  },
];

const linkStyle = { color: 'var(--pf-text-dim-75)', textDecoration: 'none' } as const;

export function Footer() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <footer id="footer" className="pf-footer">
      <div className="pf-footer__grid">
        <div className="pf-footer__brand">
          <img src="/assets/logo-white-coral.svg" alt="Printfee" style={{ height: 20, alignSelf: 'flex-start' }} />
          <p style={{ fontSize: 14.5, fontWeight: 300, lineHeight: 1.6, color: 'var(--pf-text-dim-65)', maxWidth: '28ch' }}>
            Печать футболок с твоим дизайном. Казань, доставка по всей России.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <a href="#footer" className="pf-social pf-social--accent">
              TG
            </a>
            <a href="#footer" className="pf-social">
              VK
            </a>
          </div>
        </div>
        <div className="pf-footer__links">
          {columns.map((col) => (
            <div key={col.title} style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 14.5 }}>
              <div style={{ color: 'var(--pf-text-dim-4)' }}>{col.title}</div>
              {col.links.map((link) =>
                link.action === 'chat' ? (
                  <button
                    key={link.label}
                    type="button"
                    onClick={() => setChatOpen(true)}
                    style={{ ...linkStyle, background: 'none', border: 'none', padding: 0, font: 'inherit', textAlign: 'left', cursor: 'pointer' }}
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link key={link.label} to={link.to!} style={linkStyle}>
                    {link.label}
                  </Link>
                ),
              )}
            </div>
          ))}
        </div>
      </div>
      <SupportChat open={chatOpen} onClose={() => setChatOpen(false)} />
    </footer>
  );
}
