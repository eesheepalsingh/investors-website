import { useEffect, useMemo, useState } from 'react';
import { api } from '../lib/axios.js';
import StartupGrid from '../components/StartupGrid.jsx';
import StartupsPageSkeleton from '../components/skeleton/StartupsPageSkeleton.jsx';
import { Highlight, SectionEyebrow } from '../components/brand.jsx';

export default function Startups() {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sector, setSector] = useState('');
  const [stage, setStage] = useState('');
  const [q, setQ] = useState('');

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

  const sectors = useMemo(
    () => Array.from(new Set(startups.map((s) => s.sector).filter(Boolean))).sort(),
    [startups]
  );
  const stages = useMemo(
    () => Array.from(new Set(startups.map((s) => s.stage).filter(Boolean))).sort(),
    [startups]
  );

  const filtered = startups.filter((s) => {
    if (sector && s.sector !== sector) return false;
    if (stage && s.stage !== stage) return false;
    if (q) {
      const text = `${s.name} ${s.short_description || ''}`.toLowerCase();
      if (!text.includes(q.toLowerCase())) return false;
    }
    return true;
  });

  const reset = () => {
    setSector('');
    setStage('');
    setQ('');
  };

  if (loading) {
    return <StartupsPageSkeleton />;
  }

  return (
    <>
      {/* Page header */}
      <section className="border-b border-ia-line bg-[#f3f3f3]">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <SectionEyebrow>The cohort</SectionEyebrow>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tighter-2 sm:text-6xl">
            Every startup we're <Highlight>proud to back</Highlight>.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ia-muted sm:text-lg">
            {filtered.length} of {startups.length} startups · filter by sector and
            stage, or search by name.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="card mb-8 p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_220px_220px_auto] sm:items-end">
            <div>
              <label className="label">Search</label>
              <input
                className="input"
                placeholder="Search by name or description…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <div>
              <label className="label">Sector</label>
              <select className="input" value={sector} onChange={(e) => setSector(e.target.value)}>
                <option value="">All sectors</option>
                {sectors.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Stage</label>
              <select className="input" value={stage} onChange={(e) => setStage(e.target.value)}>
                <option value="">All stages</option>
                {stages.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            {(sector || stage || q) && (
              <button onClick={reset} className="btn-ghost h-10">
                Clear
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="card border-red-200 bg-red-50 p-6 text-sm text-red-700">
            Failed to load: {error}
          </div>
        )}
        {!error && <StartupGrid startups={filtered} />}
      </div>
    </>
  );
}
