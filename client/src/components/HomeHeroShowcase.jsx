import { Link } from 'react-router-dom';

/** Stacked preview cards beside the home hero (desktop). */
export default function HomeHeroShowcase({ startups }) {
  const items = (startups ?? []).slice(0, 3);
  if (!items.length) return null;

  return (
    <div className="hero-showcase">
      {items.map((s, i) => (
          <Link
            key={s.id ?? s.name}
            to={`/startups/${s.id}`}
            className={`hero-showcase__card hero-showcase__card--${i}`}
          >
            <div className="hero-showcase__media">
              {s.logo_url ? (
                <img src={s.logo_url} alt="" className="hero-showcase__img" />
              ) : (
                <div className="hero-showcase__fallback">
                  {(s.name || '?').charAt(0)}
                </div>
              )}
            </div>
            <div className="hero-showcase__body">
              <span className="hero-showcase__name">{s.name}</span>
              {s.sector && <span className="badge-red mt-2">{s.sector}</span>}
            </div>
          </Link>
      ))}
    </div>
  );
}
