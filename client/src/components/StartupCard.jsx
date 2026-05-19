import { Link } from 'react-router-dom';
import { Asterisk } from './brand.jsx';

export default function StartupCard({ startup }) {
  const detailPath = `/startups/${startup.id}`;
  const hasCalendly = Boolean(startup.calendly_url?.trim());

  return (
    <article className="card group relative flex flex-col overflow-hidden p-6 transition hover:-translate-y-0.5 hover:border-ia-ink/30 hover:shadow-card">
      <Link to={detailPath} className="flex flex-1 flex-col">
        <div className="flex items-start gap-4">
          <Logo url={startup.logo_url} name={startup.name} />
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-bold leading-tight text-ia-ink">
              {startup.name}
            </h3>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {startup.sector && <span className="badge">{startup.sector}</span>}
              {startup.stage && <span className="badge-stage">{startup.stage}</span>}
            </div>
          </div>
        </div>

        {startup.description && (
          <p className="mt-5 line-clamp-3 text-sm leading-relaxed text-ia-muted">
            {stripMd(startup.description)}
          </p>
        )}
      </Link>

      <div className="mt-6 flex items-center justify-end gap-3 border-t border-ia-line pt-4">
        {hasCalendly ? (
          <a
            href={startup.calendly_url}
            target="_blank"
            rel="noreferrer"
            className="btn-primary px-4 py-2 text-xs"
          >
            Book Now
          </a>
        ) : (
          <Link to={`${detailPath}#book`} className="btn-primary px-4 py-2 text-xs">
            Book Now
          </Link>
        )}
        <Link
          to={detailPath}
          className="inline-flex items-center gap-1 text-sm font-semibold text-ia-ink transition hover:text-ia-muted"
        >
          View →
        </Link>
      </div>

      <Asterisk
        size={14}
        className="pointer-events-none absolute right-5 top-5 text-ia-ink/25 opacity-0 transition group-hover:opacity-100"
      />
    </article>
  );
}

// Strip the lightest markdown so card previews stay readable.
function stripMd(s = '') {
  return s
    .replace(/^#+\s+/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^[-*]\s+/gm, '')
    .replace(/\n{2,}/g, ' ')
    .replace(/\n/g, ' ');
}

function Logo({ url, name }) {
  if (url) {
    return (
      <img
        src={url}
        alt={`${name} logo`}
        className="h-14 w-14 rounded-xl border border-ia-line bg-white object-contain p-1.5"
      />
    );
  }
  const initial = (name || '?').trim().charAt(0).toUpperCase();
  return (
    <div className="grid h-14 w-14 place-items-center rounded-xl border border-ia-line bg-ia-cream text-xl font-extrabold text-ia-ink">
      {initial}
    </div>
  );
}
