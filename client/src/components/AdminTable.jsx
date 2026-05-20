import { Link } from 'react-router-dom';

export default function AdminTable({ startups, onToggleVisible, onDelete }) {
  if (!startups?.length) {
    return (
      <div className="card p-12 text-center text-ia-muted">
        No startups yet. Click <span className="font-semibold text-ia-ink">"Add new startup"</span> to create your first one.
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-ia-line text-sm">
          <thead className="bg-ia-ink-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-white/75">
            <tr>
              <th className="px-5 py-3.5">Startup</th>
              <th className="px-5 py-3.5">Sector</th>
              <th className="px-5 py-3.5">Stage</th>
              <th className="px-5 py-3.5">Visible</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ia-line">
            {startups.map((s) => (
              <tr key={s.id} className="transition hover:bg-ia-cream/40">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    {s.logo_url ? (
                      <img
                        src={s.logo_url}
                        alt=""
                        className="h-10 w-10 rounded-lg border border-ia-line bg-white object-contain p-0.5"
                      />
                    ) : (
                      <div className="grid h-10 w-10 place-items-center rounded-lg bg-ia-cream text-xs font-extrabold text-ia-ink">
                        {(s.name || '?').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="font-semibold text-ia-ink">{s.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-ia-muted">{s.sector || '—'}</td>
                <td className="px-5 py-4 text-ia-muted">{s.stage || '—'}</td>
                <td className="px-5 py-4">
                  <button
                    onClick={() => onToggleVisible(s)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      s.is_visible ? 'bg-ia-ink' : 'bg-ia-line-2'
                    }`}
                    aria-label="Toggle visibility"
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                        s.is_visible ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to={`/admin/startups/${s.id}/edit`}
                      className="rounded-full border border-ia-ink bg-white px-3.5 py-1.5 text-xs font-semibold text-ia-ink transition hover:bg-ia-ink hover:text-white"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => onDelete(s)}
                      className="rounded-full border border-red-300 bg-red-50 px-3.5 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
