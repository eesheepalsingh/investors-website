import { useEffect, useState } from 'react';
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

function slideStep(perView) {
  const gaps = (perView - 1) * GAP_REM;
  return `calc((100% - ${gaps}rem) / ${perView} + ${GAP_REM}rem)`;
}

export default function FeaturedStartupSlider({ startups }) {
  const perView = usePerView();
  const [offset, setOffset] = useState(0);
  const count = startups.length;
  const maxOffset = Math.max(0, count - perView);
  const canSlide = count > perView;

  useEffect(() => {
    setOffset((o) => Math.min(o, maxOffset));
  }, [maxOffset, perView]);

  useEffect(() => {
    setOffset(0);
  }, [startups]);

  if (!count) {
    return (
      <div className="card mx-auto max-w-md p-10 text-center">
        <p className="text-ia-muted">No startups to show yet.</p>
      </div>
    );
  }

  const goPrev = () => setOffset((o) => Math.max(0, o - 1));
  const goNext = () => setOffset((o) => Math.min(maxOffset, o + 1));
  const basis = cardBasis(perView);
  const step = slideStep(perView);

  return (
    <div className="featured-carousel w-full">
      <div className="featured-carousel__viewport w-full overflow-hidden">
        <div
          className="flex gap-5 transition-transform duration-500 ease-out"
          style={{
            transform: offset === 0 ? undefined : `translateX(calc(-${offset} * ${step}))`,
          }}
        >
          {startups.map((s) => (
            <div
              key={s.id ?? s.name}
              className="min-w-0 shrink-0"
              style={{ flex: `0 0 ${basis}` }}
            >
              <StartupCard startup={s} />
            </div>
          ))}
        </div>
      </div>

      {canSlide && (
        <div className="featured-carousel__controls mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <CarouselArrow direction="prev" onClick={goPrev} disabled={offset === 0} />
            <span className="min-w-[5rem] text-center text-sm font-medium tabular-nums text-ia-muted">
              {offset + 1} – {Math.min(offset + perView, count)} of {count}
            </span>
            <CarouselArrow direction="next" onClick={goNext} disabled={offset === maxOffset} />
          </div>

          <div className="flex items-center gap-2" role="tablist" aria-label="Featured startups">
            {Array.from({ length: maxOffset + 1 }, (_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === offset}
                aria-label={`Show startups ${i + 1} to ${Math.min(i + perView, count)}`}
                onClick={() => setOffset(i)}
                className={`featured-carousel__dot ${i === offset ? 'featured-carousel__dot--active' : ''}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CarouselArrow({ direction, onClick, disabled }) {
  const isPrev = direction === 'prev';
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isPrev ? 'Previous startups' : 'Next startups'}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ia-line bg-white text-ia-ink shadow-soft transition hover:border-ia-ink disabled:cursor-not-allowed disabled:opacity-35"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d={isPrev ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
