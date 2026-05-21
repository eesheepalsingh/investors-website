import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function StartupCard({ startup }) {
  const detailPath = `/startups/${startup.id}`;
  const hasCalendly = Boolean(startup.calendly_url?.trim());
  const preview = stripMd(startup.description);

  return (
    <article className="startup-card group">
      <Link
        to={detailPath}
        className="startup-card__media"
        aria-label={`View ${startup.name}`}
      >
        <CardMedia url={startup.logo_url} name={startup.name} />
      </Link>

      <div className="startup-card__content">
        <Link to={detailPath} className="startup-card__main block min-w-0 flex-1">
          <h3 className="startup-card__title">{startup.name}</h3>
          {(startup.sector || startup.stage) && (
            <div className="startup-card__tags">
              {startup.sector && (
                <span className="badge-red">{startup.sector}</span>
              )}
              {startup.stage && <span className="badge-stage">{startup.stage}</span>}
            </div>
          )}
          {preview ? (
            <p className="startup-card__desc">{preview}</p>
          ) : (
            <p className="startup-card__desc startup-card__desc--empty">
              View startup profile for full details.
            </p>
          )}
        </Link>

        <footer className="startup-card__footer">
          {hasCalendly ? (
            <a
              href={startup.calendly_url}
              target="_blank"
              rel="noreferrer"
              className="startup-card__book-btn"
            >
              Book Now
            </a>
          ) : (
            <Link to={`${detailPath}#book`} className="startup-card__book-btn">
              Book Now
            </Link>
          )}
          <Link to={detailPath} className="startup-card__view-link">
            View →
          </Link>
        </footer>
      </div>
    </article>
  );
}

function CardMedia({ url, name }) {
  const [failed, setFailed] = useState(false);

  if (url && !failed) {
    return (
      <img
        src={url}
        alt=""
        className="startup-card__img"
        onError={() => setFailed(true)}
      />
    );
  }
  const initial = (name || '?').trim().charAt(0).toUpperCase();
  return (
    <div className="startup-card__media-fallback" aria-hidden>
      {initial}
    </div>
  );
}

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

