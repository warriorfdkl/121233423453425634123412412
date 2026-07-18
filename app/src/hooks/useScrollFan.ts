import { useEffect, useRef, useState } from 'react';

/**
 * Ported from the static prototype's desktop.html: a scroll-driven "card
 * fan" reveal (news section). Measures how far the wrapped element has
 * scrolled past the viewport top and flips each threshold's boolean once
 * that distance exceeds it. A plain window-scroll listener + rect math,
 * not IntersectionObserver — the prototype prototyped both (see
 * drafts/news-animation-variants.html) and shipped this one.
 */
export function useScrollFan(thresholds: number[]) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState<boolean[]>(() => thresholds.map(() => false));
  const visibleRef = useRef(visible);
  visibleRef.current = visible;

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrolledIntoWrap = -rect.top;
      let changed = false;
      const next = thresholds.map((t, i) => {
        const shouldShow = scrolledIntoWrap > t;
        if (shouldShow !== visibleRef.current[i]) changed = true;
        return shouldShow;
      });
      if (changed) setVisible(next);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- thresholds is a stable literal from the caller
  }, []);

  return { ref, visible };
}
