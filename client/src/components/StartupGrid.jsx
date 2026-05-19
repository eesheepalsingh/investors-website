import StartupCard from './StartupCard.jsx';

/** Grid columns match visible card count (no empty column slots). */
export function startupGridClass(count) {
  const n = Math.max(1, count);
  if (n === 1) return 'grid max-w-md grid-cols-1 gap-5';
  if (n === 2) return 'grid grid-cols-1 gap-5 sm:grid-cols-2';
  return 'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3';
}

export default function StartupGrid({ startups }) {
  if (!startups?.length) {
    return (
      <div className="card mx-auto max-w-md p-10 text-center">
        <p className="text-ia-muted">No startups to show yet.</p>
      </div>
    );
  }
  return (
    <div className={startupGridClass(startups.length)}>
      {startups.map((s) => (
        <StartupCard key={s.id} startup={s} />
      ))}
    </div>
  );
}
