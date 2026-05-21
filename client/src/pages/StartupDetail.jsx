import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/axios.js';
import CalendlyEmbed from '../components/CalendlyEmbed.jsx';
import MarkdownView from '../components/MarkdownView.jsx';
import { Highlight } from '../components/brand.jsx';
import { STARTUP_LABELS } from '../data/startupLabels.js';
import StartupDetailSkeleton from '../components/skeleton/StartupDetailSkeleton.jsx';

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
    return <StartupDetailSkeleton />;
  }

  if (error || !startup) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-4xl font-extrabold">Startup unavailable</h1>
        <p className="mt-3 text-ia-muted">{error || 'Not found.'}</p>
        <Link to="/" className="btn-primary mt-8">
          ← Back to home
        </Link>
      </div>
    );
  }

  const founders = startup.founders || [];
  const backers = Array.isArray(startup.investor_backers) ? startup.investor_backers : [];

  return (
    <>
      {/* HEADER */}
      <section className="border-b border-ia-line bg-[#f3f3f3]">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <Link to="/#featured" className="btn-ghost -ml-3 mb-6">
            ← Back to startups
          </Link>

          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            {startup.logo_url ? (
              <img
                src={startup.logo_url}
                alt={`${startup.name} logo`}
                className="h-24 w-24 rounded-2xl border border-ia-line bg-white object-cover"
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
                {startup.stage && <span className="badge-stage">{startup.stage}</span>}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {startup.website_url && (
                <a href={startup.website_url} target="_blank" rel="noreferrer" className="btn-secondary">
                  🌐 Website
                </a>
              )}
              {startup.linkedin_url && (
                <a href={startup.linkedin_url} target="_blank" rel="noreferrer" className="btn-secondary">
                  💼 LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* MAIN — two-column layout: founders left, content right */}
      <section className="border-b border-ia-line">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[280px_1fr]">
            {/* Left: founders */}
            <aside>
              <h2 className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-ia-muted">
                {STARTUP_LABELS.founders}
              </h2>
              {founders.length === 0 ? (
                <p className="text-sm text-ia-muted">No founders listed yet.</p>
              ) : (
                <div className="space-y-7">
                  {founders.map((f) => (
                    <FounderRow key={f.id} founder={f} />
                  ))}
                </div>
              )}
            </aside>

            {/* Right: content */}
            <div className="space-y-10">
              {startup.sector && (
                <DetailBlock heading={STARTUP_LABELS.sector} value={startup.sector} />
              )}

              <DetailBlock heading={STARTUP_LABELS.description}>
                <MarkdownView md={startup.description} empty="No description provided." />
              </DetailBlock>

              {startup.stage && (
                <DetailBlock heading={STARTUP_LABELS.stage} value={startup.stage} />
              )}

              <DetailBlock heading={STARTUP_LABELS.metrics}>
                <MarkdownView md={metricsMarkdown(startup)} empty="—" />
              </DetailBlock>

              <DetailBlock heading={STARTUP_LABELS.moat}>
                <MarkdownView md={startup.moat} empty="—" />
              </DetailBlock>

              <DetailBlock heading={STARTUP_LABELS.traction}>
                <MarkdownView md={startup.traction} empty="—" />
              </DetailBlock>

              {backers.length > 0 && (
                <DetailBlock heading={STARTUP_LABELS.investorBackers}>
                  <div className="flex flex-wrap gap-2">
                    {backers.map((b) => (
                      <span key={b} className="badge">{b}</span>
                    ))}
                  </div>
                </DetailBlock>
              )}

              {/* Pitch deck CTA — matches "Want to see our pitch deck? Click here →" */}
              {startup.pitch_deck_url && (
                <p className="text-base">
                  Want to see our pitch deck?{' '}
                  <a
                    href={startup.pitch_deck_url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-ia-ink underline underline-offset-2 hover:text-ia-muted"
                  >
                    Click here →
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CALENDLY */}
      <section id="book">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <h2 className="text-3xl font-extrabold tracking-tightish sm:text-4xl">
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

function DetailBlock({ heading, value, children }) {
  return (
    <div>
      <h3 className="text-base font-bold text-ia-ink">
        {heading}
        {value != null && value !== '' && (
          <>
            <span className="text-ia-muted"> : </span>
            <span className="text-ia-ink">{value}</span>
          </>
        )}
      </h3>
      {children != null && <div className="mt-3">{children}</div>}
    </div>
  );
}

// Use the markdown `metrics` field when present; otherwise fall back to building
// a bullet list from legacy revenue/valuation/ask columns so existing data
// keeps rendering until the admin re-saves it.
function metricsMarkdown(s) {
  if (s.metrics && s.metrics.trim()) return s.metrics;
  const lines = [];
  if (s.revenue) lines.push(`- Revenue: ${s.revenue}`);
  if (s.valuation) lines.push(`- Valuation: ${s.valuation}`);
  if (s.ask) lines.push(`- Ask: ${s.ask}`);
  return lines.join('\n');
}

function FounderRow({ founder }) {
  return (
    <div>
      {founder.photo_url ? (
        <img
          src={founder.photo_url}
          alt={founder.name}
          className="aspect-[3/4] w-full rounded-2xl border border-ia-line bg-[#f3f3f3] object-cover"
        />
      ) : (
        <div className="grid aspect-[3/4] w-full place-items-center rounded-2xl border border-ia-line bg-[#f3f3f3] text-4xl font-extrabold text-ia-ink">
          {(founder.name || '?').trim().charAt(0).toUpperCase()}
        </div>
      )}
      <h4 className="mt-4 text-base font-bold uppercase tracking-wide text-ia-ink">
        {founder.name}
      </h4>
      {founder.title && (
        <p className="mt-1 text-sm text-ia-muted">{founder.title}</p>
      )}
      {founder.linkedin_url && (
        <a
          href={founder.linkedin_url}
          target="_blank"
          rel="noreferrer"
          aria-label={`${founder.name} on LinkedIn`}
          className="mt-3 inline-grid h-7 w-7 place-items-center rounded bg-[#0a66c2] text-white hover:opacity-90"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56v14H.22V8zm7.51 0h4.37v1.91h.06c.61-1.15 2.1-2.36 4.32-2.36 4.62 0 5.47 3.04 5.47 7v7.45h-4.56v-6.6c0-1.58-.03-3.6-2.2-3.6-2.2 0-2.54 1.72-2.54 3.49V22H7.73V8z" />
          </svg>
        </a>
      )}
    </div>
  );
}
