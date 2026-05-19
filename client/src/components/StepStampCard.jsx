const STEP_ICONS = {
  browse: (
    <svg width="36" height="36" viewBox="0 0 40 40" fill="none" aria-hidden>
      <rect x="6" y="8" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
      <rect x="22" y="8" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
      <rect x="6" y="24" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
      <rect x="22" y="24" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  ),
  dive: (
    <svg width="36" height="36" viewBox="0 0 40 40" fill="none" aria-hidden>
      <path
        d="M10 8h20a2 2 0 0 1 2 2v22l-12-6-12 6V10a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path d="M14 14h12M14 18h8" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  ),
  book: (
    <svg width="36" height="36" viewBox="0 0 40 40" fill="none" aria-hidden>
      <rect x="8" y="9" width="24" height="24" rx="2" stroke="currentColor" strokeWidth="1.25" />
      <path d="M8 15h24M14 7v4M26 7v4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <circle cx="20" cy="23" r="2" fill="currentColor" />
    </svg>
  ),
};

/** Postage-stamp card — wavy scalloped edges via CSS mask (uniform on all sides). */
export default function StepStampCard({ icon, title, children }) {
  const Icon = STEP_ICONS[icon] ?? STEP_ICONS.browse;

  return (
    <article className="hiw-stamp-card">
      <div className="hiw-stamp-card__body">
        <div className="hiw-stamp-card__icon">{Icon}</div>
        <h3 className="hiw-stamp-card__title">{title}</h3>
        <p className="hiw-stamp-card__text">{children}</p>
      </div>
    </article>
  );
}
