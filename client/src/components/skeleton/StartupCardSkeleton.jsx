import { Shimmer } from './Shimmer.jsx';
import { startupGridClass } from '../StartupGrid.jsx';

export default function StartupCardSkeleton() {
  return (
    <article className="card flex flex-col p-6" aria-hidden="true">
      <div className="flex items-start gap-4">
        <Shimmer className="h-14 w-14 shrink-0 rounded-xl" />
        <div className="min-w-0 flex-1 space-y-2.5">
          <Shimmer className="h-5 w-3/4 max-w-[180px] rounded-md" />
          <div className="flex flex-wrap gap-1.5">
            <Shimmer className="h-6 w-16 rounded-full" />
            <Shimmer className="h-6 w-20 rounded-full" />
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <Shimmer className="h-3.5 w-full rounded" />
        <Shimmer className="h-3.5 w-full rounded" />
        <Shimmer className="h-3.5 w-4/5 rounded" />
      </div>

      <div className="mt-6 flex items-center justify-end gap-3 border-t border-ia-line pt-4">
        <Shimmer className="h-9 w-24 rounded-full" />
        <Shimmer className="h-4 w-14 rounded" />
      </div>
    </article>
  );
}

export function StartupCardSkeletonGrid({ count = 1 }) {
  const n = Math.max(1, count);
  return (
    <div className={startupGridClass(n)}>
      {Array.from({ length: n }).map((_, i) => (
        <StartupCardSkeleton key={i} />
      ))}
    </div>
  );
}
