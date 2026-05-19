import { Link } from 'react-router-dom';
import { Asterisk } from './brand.jsx';

export default function StartupCard({ startup }) {
  return (
    <Link
      to={`/startups/${startup.id}`}
      className="card group relative flex flex-col overflow-hidden p-6 transition hover:-translate-y-0.5 hover:border-ia-ink/30 hover:shadow-card"
    >
      <div className="flex items-start gap-4">
        <Logo url={startup.logo_url} name={startup.name} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-bold leading-tight text-ia-ink">
            {startup.name}
          </h3>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {startup.sector && <span className="badge">{startup.sector}</span>}
            {startup.stage && <span className="badge-orange">{startup.stage}</span>}
          </div>
        </div>
      </div>

      {startup.description && (
        <p className="mt-5 line-clamp-3 text-sm leading-relaxed text-ia-muted">
          {stripMd(startup.description)}
        </p>
      )}

      <div className="mt-6 flex items-end justify-end border-t border-ia-line pt-4">
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-ia-orange transition group-hover:gap-2">
          View →
        </span>
      </div>

      <Asterisk
        size={14}
        className="absolute right-5 top-5 opacity-0 transition group-hover:opacity-100"
      />
    </Link>
  );
}

// Strip the lightest markdown so card previews stay readable.
function stripMd(s = '') {
  return s
    .replace(/^#+\s+/gm, '')           // headings
    .replace(/\*\*(.+?)\*\*/g, '$1')   // bold
    .replace(/\*(.+?)\*/g, '$1')       // italic
    .replace(/`([^`]+)`/g, '$1')       // inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links
    .replace(/^[-*]\s+/gm, '')         // bullets
    .replace(/\n{2,}/g, ' ')           // collapse blank lines
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
