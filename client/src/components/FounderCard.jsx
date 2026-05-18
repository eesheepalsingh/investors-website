export default function FounderCard({ founder }) {
  return (
    <div className="card flex w-full flex-col items-center p-6 text-center sm:w-56">
      {founder.photo_url ? (
        <img
          src={founder.photo_url}
          alt={founder.name}
          className="h-24 w-24 rounded-full border border-ia-line object-cover"
        />
      ) : (
        <div className="grid h-24 w-24 place-items-center rounded-full bg-ia-cream text-2xl font-extrabold text-ia-ink">
          {(founder.name || '?').trim().charAt(0).toUpperCase()}
        </div>
      )}
      <h4 className="mt-4 text-base font-bold text-ia-ink">{founder.name}</h4>
      {founder.title && (
        <p className="mt-1 text-xs text-ia-muted">{founder.title}</p>
      )}
      {founder.linkedin_url && (
        <a
          href={founder.linkedin_url}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-ia-orange hover:text-ia-orange-2"
        >
          <LinkedInIcon /> LinkedIn
        </a>
      )}
    </div>
  );
}

function LinkedInIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56v14H.22V8zm7.51 0h4.37v1.91h.06c.61-1.15 2.1-2.36 4.32-2.36 4.62 0 5.47 3.04 5.47 7v7.45h-4.56v-6.6c0-1.58-.03-3.6-2.2-3.6-2.2 0-2.54 1.72-2.54 3.49V22H7.73V8z" />
    </svg>
  );
}
