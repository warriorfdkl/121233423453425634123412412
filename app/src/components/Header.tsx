import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAppState } from '../context/AppStateContext';
import { BagIcon, BurgerIcon, PersonIcon, StarIcon } from './icons';
import { asset } from '../lib/asset';

// Real routes get NavLink's active-highlight; same-page hash anchors
// (Новости/Контакты just scroll within the home page) never should — they
// aren't distinct locations, so they render as plain links.
const routeLinks = [
  { to: '/constructor', label: 'Конструктор' },
  { to: '/catalog', label: 'Каталог' },
];
const anchorLinks = [
  { to: '/#news', label: 'Новости' },
  { to: '/#footer', label: 'Контакты' },
];

const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
  color: isActive ? 'var(--pf-accent)' : 'inherit',
  textDecoration: 'none',
});

/**
 * The one real header component. The static prototype pasted this same
 * markup (nav links + icon row + mobile drawer) into six separate HTML
 * files by hand — this is why, mid-session, a single missing `!important`
 * broke the mobile layout on some pages and not others: there was no
 * single place to fix it. Here there's exactly one.
 */
export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount } = useAppState();

  return (
    <header className="pf-header">
      <div className="pf-header__row">
        <div className="pf-header__left">
          <Link to="/" style={{ display: 'flex', flex: 'none' }}>
            <img src={asset('assets/logo-white-coral.svg')} alt="Printfee" style={{ height: 24, display: 'block' }} />
          </Link>
          <nav className="pf-nav-links">
            {routeLinks.map((link) => (
              <NavLink key={link.to} to={link.to} style={navLinkStyle}>
                {link.label}
              </NavLink>
            ))}
            {anchorLinks.map((link) => (
              <Link key={link.to} to={link.to}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="pf-header__right">
          <NavLink to="/favorites" aria-label="Избранное" className="pf-icon-btn">
            {({ isActive }) => <StarIcon size={26} filled={isActive} color={isActive ? 'var(--pf-accent)' : undefined} />}
          </NavLink>
          <NavLink to="/cart" aria-label="Корзина" className="pf-icon-btn pf-icon-btn--relative">
            {({ isActive }) => (
              <>
                <BagIcon size={26} color={isActive ? 'var(--pf-accent)' : undefined} />
                {cartCount > 0 && <span className="pf-badge">{cartCount}</span>}
              </>
            )}
          </NavLink>
          <NavLink to="/account" aria-label="Личный кабинет: Алина" className="pf-icon-btn pf-icon-btn--wide">
            {({ isActive }) => (
              <>
                <PersonIcon size={26} filled={isActive} color={isActive ? 'var(--pf-accent)' : undefined} />
                <span className="pf-nav-name" style={{ color: isActive ? 'var(--pf-accent)' : undefined }}>
                  Алина
                </span>
              </>
            )}
          </NavLink>
          <button type="button" className="pf-burger" aria-label="Меню" aria-expanded={menuOpen} onClick={() => setMenuOpen((v) => !v)}>
            <BurgerIcon size={22} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="pf-nav-drawer" onClick={() => setMenuOpen(false)}>
          {routeLinks.map((link) => (
            <NavLink key={link.to} to={link.to} style={navLinkStyle}>
              {link.label}
            </NavLink>
          ))}
          {anchorLinks.map((link) => (
            <Link key={link.to} to={link.to}>
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
