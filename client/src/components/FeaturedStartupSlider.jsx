import { useEffect, useRef, useState } from 'react';
import StartupCard from './StartupCard.jsx';

const GAP_REM = 1.25; /* matches Tailwind gap-5 — same as startup-grid */

function usePerView() {
  const [perView, setPerView] = useState(3);

  useEffect(() => {
    const mqLg = window.matchMedia('(min-width: 1024px)');
    const mqSm = window.matchMedia('(min-width: 640px)');

    const update = () => {
      if (mqLg.matches) setPerView(3);
      else if (mqSm.matches) setPerView(2);
      else setPerView(1);
    };

    update();
    mqLg.addEventListener('change', update);
    mqSm.addEventListener('change', update);
    return () => {
      mqLg.removeEventListener('change', update);
      mqSm.removeEventListener('change', update);
    };
  }, []);

  return perView;
}

function cardBasis(perView) {
  const gaps = (perView - 1) * GAP_REM;
  return `calc((100% - ${gaps}rem) / ${perView})`;
}

export default function FeaturedStartupSlider({ startups }) {
  const perView = usePerView();
  const viewportRef = useRef(null);
  const count = startups.length;
  const canScroll = count > perView;

  useEffect(() => {
    const viewport = viewportRef.current;
    if (viewport) viewport.scrollLeft = 0;
  }, [startups]);

  if (!count) {
    return (
      <div className="card mx-auto max-w-md p-10 text-center">
        <p className="text-ia-muted">No startups to show yet.</p>
      </div>
    );
  }

  const basis = cardBasis(perView);

  return (
    <div className="featured-carousel w-full">
      <div
        ref={viewportRef}
        className="featured-carousel__viewport w-full"
        tabIndex={canScroll ? 0 : undefined}
        aria-label={canScroll ? 'Featured startups — scroll horizontally' : undefined}
      >
        <div className="featured-carousel__track flex gap-5">
          {startups.map((s) => (
            <div
              key={s.id ?? s.name}
              className="featured-carousel__slide min-w-0 shrink-0"
              style={{ flex: `0 0 ${basis}` }}
            >
              <StartupCard startup={s} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
