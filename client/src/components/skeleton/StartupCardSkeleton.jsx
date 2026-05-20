import { Shimmer } from './Shimmer.jsx';
import { startupGridClass } from '../StartupGrid.jsx';

export default function StartupCardSkeleton() {
  return (
    <article className="startup-card overflow-hidden" aria-hidden="true">
      <Shimmer className="aspect-[5/3] w-full rounded-none" />
      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
        <Shimmer className="h-6 w-3/4 max-w-[200px] rounded-md" />
        <div className="mt-2.5 flex gap-1.5">
          <Shimmer className="h-6 w-16 rounded-full" />
          <Shimmer className="h-6 w-20 rounded-full" />
        </div>
        <div className="mt-3 space-y-2">
          <Shimmer className="h-3.5 w-full rounded" />
          <Shimmer className="h-3.5 w-full rounded" />
          <Shimmer className="h-3.5 w-4/5 rounded" />
        </div>
        <div className="mt-4 flex gap-3 border-t border-ia-line pt-4">
          <Shimmer className="h-10 min-w-0 flex-1 rounded-full" />
          <Shimmer className="h-4 w-12 shrink-0 self-center rounded" />
        </div>
      </div>
    </article>
  );
}

export function StartupCardSkeletonGrid({ count = 1 }) {
  const n = Math.max(1, count);
  return (
    <div className={startupGridClass()}>
      {Array.from({ length: n }).map((_, i) => (
        <StartupCardSkeleton key={i} />
      ))}
    </div>
  );
}

