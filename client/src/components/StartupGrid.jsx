import StartupCard from './StartupCard.jsx';

/** 3 cards per row on large screens. */
export function startupGridClass() {
  return 'startup-grid grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3';
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
    <div className={startupGridClass()}>
      {startups.map((s) => (
        <StartupCard key={s.id ?? s.name} startup={s} />
      ))}
    </div>
  );
}
