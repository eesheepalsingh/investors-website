import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/axios.js';
import StartupGrid from '../components/StartupGrid.jsx';
import {
  Asterisk,
  Highlight,
  NumberCircle,
  SectionEyebrow,
  Spinner,
} from '../components/brand.jsx';

const STAT_BAR_COLORS = ['bg-ia-orange', 'bg-ia-green', 'bg-ia-yellow', 'bg-ia-blue'];

export default function Home() {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    api
      .get('/startups')
      .then(({ data }) => alive && setStartups(data))
      .catch((err) => alive && setError(err.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const sectors = new Set(startups.map((s) => s.sector).filter(Boolean));
  const featured = startups.slice(0, 6);

  const stats = [
    { value: startups.length || '—', label: 'Startups in Cohort' },
    { value: sectors.size || '—', label: 'Sectors Represented' },
    { value: '2025', label: 'Demo Day Edition' },
    { value: 'Live', label: 'Now Open' },
  ];

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-ia-line">
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-16 sm:pt-24">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tighter-2 text-ia-ink sm:text-6xl md:text-7xl">
              Meet the next wave of{' '}
              <Highlight>India's boldest founders</Highlight>.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ia-muted sm:text-lg">
              Curated startups from India Accelerator's latest cohort. Explore
              traction, view pitch decks, and book 1:1 time with founders —
              all in one place.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link to="/startups" className="btn-primary">
                Explore Startups →
              </Link>
              <a
                href="https://indiaaccelerator.co"
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
              >
                About India Accelerator
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR — numbers with colored underline accents */}
      <section className="border-b border-ia-line bg-paper">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-10 px-6 py-16 md:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.label} className="flex flex-col items-center text-center">
              <div className="text-5xl font-extrabold tracking-tighter-2 text-ia-ink sm:text-6xl">
                {s.value}
              </div>
              <span className={`stat-bar ${STAT_BAR_COLORS[i % STAT_BAR_COLORS.length]}`} />
              <div className="mt-3 text-sm text-ia-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT YOU GET — value props with asterisks (brand pattern) */}
      <section className="border-b border-ia-line">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <SectionEyebrow>What investors get</SectionEyebrow>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tightish sm:text-5xl">
                Everything you need to make an{' '}
                <Highlight>informed call</Highlight>.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-ia-muted">
                From day one of diligence to your first founder call — every
                resource curated, every founder vetted.
              </p>
            </div>

            <div className="space-y-8">
              <ValueProp
                title="Traction at a glance"
                desc="Revenue, stage, ask, and current backers — surfaced upfront on every startup card. No deck downloads required."
              />
              <ValueProp
                title="Direct founder access"
                desc="One click to view pitch decks. One more to book a 1:1 directly on the founder's calendar via Calendly."
              />
              <ValueProp
                title="Curated, not crowded"
                desc="Every startup is hand-picked by IA's investment team. Quality over quantity, always."
              />
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — numbered list, brand style */}
      <section className="border-b border-ia-line bg-paper">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="text-center">
            <SectionEyebrow>How it works</SectionEyebrow>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tightish sm:text-5xl">
              Three steps to your next <Highlight>great investment</Highlight>.
            </h2>
          </div>

          <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
            <Step n={1} title="Browse the cohort">
              Explore startups by sector and stage. Filter to what matters to you.
            </Step>
            <Step n={2} title="Dive into a startup">
              Read the story, see the team, scan the pitch deck — all on one page.
            </Step>
            <Step n={3} title="Book a 1:1">
              Pick a time that works on the founder's live Calendly. Done.
            </Step>
          </div>
        </div>
      </section>

      {/* FEATURED STARTUPS */}
      <section className="border-b border-ia-line">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <SectionEyebrow>Featured</SectionEyebrow>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tightish sm:text-5xl">
                Startups we're <Highlight>proud to back</Highlight>.
              </h2>
            </div>
            <Link
              to="/startups"
              className="hidden text-sm font-semibold text-ia-orange hover:text-ia-orange-2 sm:inline-flex"
            >
              View all →
            </Link>
          </div>

          {loading && <SkeletonGrid />}
          {error && <ErrorBlock message={error} />}
          {!loading && !error && <StartupGrid startups={featured} />}

          <div className="mt-8 flex justify-center sm:hidden">
            <Link to="/startups" className="btn-secondary">
              View all startups →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="bg-ia-ink">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 py-14 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-2xl font-extrabold text-white sm:text-3xl">
              Ready to meet the cohort?
            </h3>
            <p className="mt-2 text-sm text-white/70">
              Browse all startups and book your first founder call.
            </p>
          </div>
          <Link
            to="/startups"
            className="inline-flex items-center gap-2 rounded-full bg-ia-orange px-7 py-3 text-sm font-semibold text-white shadow-cta transition hover:bg-ia-orange-2"
          >
            Explore Startups →
          </Link>
        </div>
      </section>
    </>
  );
}

function ValueProp({ title, desc }) {
  return (
    <div className="flex gap-4">
      <Asterisk size={28} className="mt-1 shrink-0" />
      <div>
        <h3 className="text-2xl font-bold text-ia-ink">{title}</h3>
        <p className="mt-2 text-base leading-relaxed text-ia-muted">{desc}</p>
      </div>
    </div>
  );
}

function Step({ n, title, children }) {
  return (
    <div className="card p-6">
      <NumberCircle n={n} />
      <h3 className="mt-4 text-xl font-bold text-ia-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ia-muted">{children}</p>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="card h-44 animate-pulse bg-ia-cream" />
      ))}
    </div>
  );
}

function ErrorBlock({ message }) {
  return (
    <div className="card border-red-200 bg-red-50 p-6 text-sm text-red-700">
      Failed to load startups: {message}
    </div>
  );
}
