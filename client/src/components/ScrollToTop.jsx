import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Scroll window to top on route change; honor hash anchors when present. */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    const id = hash.replace('#', '');
    let cancelled = false;
    let attempts = 0;

    const tryScrollToHash = () => {
      if (cancelled) return;
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      if (attempts++ < 24) {
        requestAnimationFrame(tryScrollToHash);
      } else {
        window.scrollTo(0, 0);
      }
    };

    tryScrollToHash();
    return () => {
      cancelled = true;
    };
  }, [pathname, hash]);

  return null;
}
