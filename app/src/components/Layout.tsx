import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

// Anchor links (Новости/Контакты) target sections that only exist on the
// home page. Navigating there from another route re-mounts HomePage in the
// same commit as the location update, but we still wait a frame so images/
// layout have settled before measuring where to scroll.
function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    const raf = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    return () => cancelAnimationFrame(raf);
  }, [location]);

  return null;
}

export function AppLayout() {
  return (
    <>
      <ScrollToHash />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
