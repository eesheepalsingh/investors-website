import { Shimmer } from './Shimmer.jsx';
import { StartupCardSkeletonGrid } from './StartupCardSkeleton.jsx';

function FilterFieldSkeleton({ labelWidth = 'w-14' }) {
  return (
    <div>
      <Shimmer className={`mb-2 h-3 ${labelWidth} rounded`} />
      <Shimmer className="h-10 w-full rounded-xl" />
    </div>
  );
}

export default function StartupsPageSkeleton() {
  return (
    <>
      <section className="border-b border-ia-line bg-[#f3f3f3]">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <Shimmer className="h-3 w-28 rounded" />
          <Shimmer className="mt-4 h-11 w-full max-w-2xl rounded-lg" />
          <Shimmer className="mt-3 h-11 w-full max-w-xl rounded-lg" />
          <Shimmer className="mt-5 h-5 w-64 rounded" />
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="card mb-8 p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_220px_220px] sm:items-end">
            <FilterFieldSkeleton labelWidth="w-14" />
            <FilterFieldSkeleton labelWidth="w-12" />
            <FilterFieldSkeleton labelWidth="w-11" />
          </div>
        </div>

        <StartupCardSkeletonGrid count={6} />
      </div>
    </>
  );
}
