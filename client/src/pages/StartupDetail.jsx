import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/axios.js';
import FounderCard from '../components/FounderCard.jsx';
import CalendlyEmbed from '../components/CalendlyEmbed.jsx';
import { Asterisk, Highlight, SectionEyebrow, Spinner } from '../components/brand.jsx';

export default function StartupDetail() {
  const { id } = useParams();
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    api
      .get(`/startups/${id}`)
      .then(({ data }) => alive && setStartup(data))
      .catch((err) => alive && setError(err.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto flex max-w-5xl items-center justify-center px-6 py-32">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  if (error || !startup) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-4xl font-extrabold">Startup unavailable</h1>
        <p className="mt-3 text-ia-muted">{error || 'Not found.'}</p>
        <Link to="/startups" className="btn-primary mt-8">
          ← Back to startups
        </Link>
      </div>
    );
  }

  const founders = startup.founders || [];
  const backers = Array.isArray(startup.investor_backers) ? startup.investor_backers : [];

  return (
    <>
      {/* HEADER */}
      <section className="border-b border-ia-line bg-paper">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <Link to="/startups" className="btn-ghost -ml-3 mb-6">
            ← Back to all startups
          </Link>

          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            {startup.logo_url ? (
              <img
                src={startup.logo_url}
                alt={`${startup.name} logo`}
                className="h-24 w-24 rounded-2xl border border-ia-line bg-white object-contain p-2"
              />
            ) : (
              <div className="grid h-24 w-24 place-items-center rounded-2xl border border-ia-line bg-white text-3xl font-extrabold text-ia-ink">
                {startup.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-4xl font-extrabold tracking-tightish text-ia-ink sm:text-5xl">
                {startup.name}
              </h1>
              <div className="mt-3 flex flex-wrap gap-2">
                {startup.sector && <span className="badge">{startup.sector}</span>}
                {startup.stage && <span className="badge-orange">{startup.stage}</span>}
              </div>
            </div>
          </div>

          {startup.short_description && (
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ia-ink/85">
              {startup.short_description}
            </p>
          )}

          {/* Action links */}
          <div className="mt-7 flex flex-wrap gap-3">
            {startup.pitch_deck_url && (
              <a
                href={startup.pitch_deck_url}
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
              >
                📄 View Pitch Deck
              </a>
            )}
            {startup.website_url && (
              <a
                href={startup.website_url}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
              >
                🌐 Website
              </a>
            )}
            {startup.linkedin_url && (
              <a
                href={startup.linkedin_url}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
              >
                💼 LinkedIn
              </a>
            )}
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS + BACKERS */}
      <section className="border-b border-ia-line">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Highlight2 label="Revenue" value={startup.revenue} barColor="bg-ia-green" />
            <Highlight2 label="Ask" value={startup.ask} accent barColor="bg-ia-orange" />
          </div>

          {backers.length > 0 && (
            <div className="mt-10">
              <SectionEyebrow>Investor backers</SectionEyebrow>
              <div className="mt-4 flex flex-wrap gap-2">
                {backers.map((b) => (
                  <span key={b} className="badge">{b}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FOUNDERS */}
      {founders.length > 0 && (
        <section className="border-b border-ia-line bg-paper">
          <div className="mx-auto max-w-5xl px-6 py-14">
            <SectionEyebrow>The team</SectionEyebrow>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tightish sm:text-4xl">
              Meet the <Highlight>founders</Highlight>.
            </h2>
            <div className="mt-8 flex flex-wrap gap-4">
              {founders.map((f) => (
                <FounderCard key={f.id} founder={f} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CALENDLY */}
      <section>
        <div className="mx-auto max-w-5xl px-6 py-14">
          <SectionEyebrow>Book a meeting</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tightish sm:text-4xl">
            Pick a time that <Highlight>works for you</Highlight>.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ia-muted">
            Schedule a 1:1 directly on the founder's calendar — no back-and-forth.
          </p>
          <div className="mt-8">
            <CalendlyEmbed url={startup.calendly_url} />
          </div>
        </div>
      </section>
    </>
  );
}

function Highlight2({ label, value, accent, barColor }) {
  return (
    <div className="card p-6">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-ia-muted">
        {label}
      </div>
      <div className={`mt-2 text-3xl font-extrabold sm:text-4xl ${accent ? 'text-ia-orange' : 'text-ia-ink'}`}>
        {value || '—'}
      </div>
      <span className={`stat-bar ${barColor}`} />
    </div>
  );
}
