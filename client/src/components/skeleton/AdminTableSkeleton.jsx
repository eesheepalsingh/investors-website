import { Shimmer } from './Shimmer.jsx';

function SkeletonRow() {
  return (
    <tr>
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <Shimmer className="h-10 w-10 shrink-0 rounded-lg" />
          <Shimmer className="h-4 w-32 rounded" />
        </div>
      </td>
      <td className="px-5 py-4">
        <Shimmer className="h-4 w-28 rounded" />
      </td>
      <td className="px-5 py-4">
        <Shimmer className="h-4 w-20 rounded" />
      </td>
      <td className="px-5 py-4">
        <Shimmer className="h-6 w-11 rounded-full" />
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center justify-end gap-2">
          <Shimmer className="h-8 w-14 rounded-full" />
          <Shimmer className="h-8 w-16 rounded-full" />
        </div>
      </td>
    </tr>
  );
}

export default function AdminTableSkeleton({ rows = 0 }) {
  return (
    <div className="card overflow-hidden" aria-busy="true" aria-label="Loading startups">
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
            {Array.from({ length: rows }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
