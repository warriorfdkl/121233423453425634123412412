import { useCallback } from 'react';

/**
 * The "add to cart" flourish: a small tinted shirt icon flies from the
 * button to the header's cart icon and the icon bumps on landing. Kept as
 * an isolated hook (imperative DOM, deliberately outside React's render
 * cycle — this is a one-shot visual effect, not state) rather than folded
 * into the constructor's component body.
 */
export function useFlyToCart() {
  return useCallback((fromEl: HTMLElement | null, color: string) => {
    const cartIcon = document.querySelector<HTMLElement>('[aria-label="Корзина"]');
    if (!fromEl || !cartIcon) return;

    const start = fromEl.getBoundingClientRect();
    const end = cartIcon.getBoundingClientRect();
    const size = 46;
    const startX = start.left + start.width / 2 - size / 2;
    const startY = start.top + start.height / 2 - size / 2;
    const endX = end.left + end.width / 2 - size / 2;
    const endY = end.top + end.height / 2 - size / 2;

    const el = document.createElement('div');
    el.style.cssText = `position:fixed;left:0;top:0;z-index:200;pointer-events:none;width:${size}px;height:${size}px;transform:translate(${startX}px,${startY}px) rotate(0deg) scale(1);opacity:1;transition:transform .75s cubic-bezier(.4,0,.2,1),opacity .75s ease;filter:drop-shadow(0 12px 20px rgba(0,0,0,.55))`;
    el.innerHTML = `<svg viewBox="0 0 40 40" width="100%" height="100%">
      <path d="M10 12 L2 16 L6 24 L10 20 Z" fill="${color}"></path>
      <path d="M30 12 L38 16 L34 24 L30 20 Z" fill="${color}"></path>
      <rect x="10" y="12" width="20" height="24" rx="4" fill="${color}"></rect>
    </svg>`;
    document.body.appendChild(el);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transform = `translate(${endX}px,${endY}px) rotate(340deg) scale(.15)`;
        el.style.opacity = '.2';
      });
    });

    setTimeout(() => {
      el.remove();
      cartIcon.style.transition = 'transform .3s cubic-bezier(.4,0,.2,1.5)';
      cartIcon.style.transform = 'scale(1.28)';
      setTimeout(() => {
        cartIcon.style.transform = 'scale(1)';
      }, 180);
    }, 750);
  }, []);
}
