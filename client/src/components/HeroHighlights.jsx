import { Asterisk } from './brand.jsx';

export default function HeroHighlights({ items }) {
  const loopItems = [...items, ...items];

  return (
    <div className="hero-highlights" aria-label="Platform highlights">
      <ul className="hero-highlights__track">
        {loopItems.map((label, i) => (
          <li key={`${label}-${i}`} className="hero-highlights__item" aria-hidden={i >= items.length}>
            <span className="hero-trust" title={label}>
              <Asterisk size={14} className="hero-trust__icon shrink-0 text-ia-brand" />
              <span className="hero-trust__text">{label}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
