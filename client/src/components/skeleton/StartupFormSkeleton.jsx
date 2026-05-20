import { Shimmer } from './Shimmer.jsx';

function SkeletonSection({ titleWidth = 'w-24', children }) {
  return (
    <section className="card mb-6 p-6 sm:p-7" aria-hidden="true">
      <Shimmer className={`mb-5 h-6 ${titleWidth} rounded-md`} />
      {children}
    </section>
  );
}

function SkeletonField({ labelWidth = 'w-28' }) {
  return (
    <div>
      <Shimmer className={`mb-1.5 h-3 ${labelWidth} rounded`} />
      <Shimmer className="h-11 w-full rounded-xl" />
    </div>
  );
}

function SkeletonEditor({ height = 'h-48' }) {
  return (
    <div className="overflow-hidden rounded-xl border border-ia-line bg-white">
      <div className="flex items-center gap-2 border-b border-ia-line px-3 py-2.5">
        <Shimmer className="h-7 w-7 rounded-md" />
        <Shimmer className="h-7 w-7 rounded-md" />
        <Shimmer className="h-7 w-7 rounded-md" />
        <Shimmer className="ml-auto h-7 w-24 rounded-full" />
      </div>
      <Shimmer className={`w-full rounded-none ${height}`} />
    </div>
  );
}

function SkeletonFounderCard() {
  return (
    <div className="card p-5">
      <div className="mb-4 flex items-center justify-between">
        <Shimmer className="h-4 w-24 rounded" />
        <Shimmer className="h-8 w-20 rounded-full" />
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <SkeletonField labelWidth="w-16" />
        <SkeletonField labelWidth="w-12" />
        <SkeletonField labelWidth="w-24" />
        <div className="flex items-end gap-3">
          <Shimmer className="h-14 w-14 shrink-0 rounded-full" />
          <Shimmer className="mb-2 h-10 flex-1 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function StartupFormSkeleton({ founderCount = 1 }) {
  const founders = Math.max(1, founderCount);

  return (
    <div className="bg-[#f3f3f3]" aria-busy="true" aria-label="Loading startup form">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div className="flex-1">
            <Shimmer className="h-3 w-12 rounded" />
            <Shimmer className="mt-3 h-10 w-72 max-w-full rounded-md sm:h-12" />
            <Shimmer className="mt-3 h-4 w-full max-w-lg rounded" />
            <Shimmer className="mt-2 h-4 w-4/5 max-w-md rounded" />
          </div>
          <Shimmer className="hidden h-10 w-20 shrink-0 rounded-full sm:block" />
        </div>

        <SkeletonSection titleWidth="w-20">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <SkeletonField labelWidth="w-28" />
            <SkeletonField labelWidth="w-16" />
            <SkeletonField labelWidth="w-14" />
            <div>
              <Shimmer className="mb-1.5 h-3 w-36 rounded" />
              <div className="flex h-11 items-center gap-3">
                <Shimmer className="h-6 w-11 rounded-full" />
                <Shimmer className="h-4 w-14 rounded" />
              </div>
            </div>
          </div>
        </SkeletonSection>

        <SkeletonSection titleWidth="w-28">
          <Shimmer className="mb-3 h-3 w-full max-w-md rounded" />
          <SkeletonEditor height="h-52" />
        </SkeletonSection>

        <SkeletonSection titleWidth="w-20">
          <Shimmer className="mb-3 h-3 w-full max-w-lg rounded" />
          <SkeletonEditor height="h-36" />
        </SkeletonSection>

        <SkeletonSection titleWidth="w-16">
          <Shimmer className="mb-3 h-3 w-full max-w-sm rounded" />
          <SkeletonEditor height="h-36" />
        </SkeletonSection>

        <SkeletonSection titleWidth="w-20">
          <Shimmer className="mb-3 h-3 w-full max-w-md rounded" />
          <SkeletonEditor height="h-36" />
        </SkeletonSection>

        <SkeletonSection titleWidth="w-32">
          <div className="flex flex-wrap gap-2">
            <Shimmer className="h-7 w-24 rounded-full" />
            <Shimmer className="h-7 w-28 rounded-full" />
          </div>
          <div className="mt-3 flex gap-2">
            <Shimmer className="h-11 flex-1 rounded-xl" />
            <Shimmer className="h-11 w-16 rounded-full" />
          </div>
        </SkeletonSection>

        <SkeletonSection titleWidth="w-16">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <SkeletonField labelWidth="w-24" />
            <SkeletonField labelWidth="w-36" />
            <SkeletonField labelWidth="w-24" />
          </div>
        </SkeletonSection>

        <SkeletonSection titleWidth="w-16">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Shimmer className="mb-1.5 h-3 w-10 rounded" />
              <div className="flex items-center gap-4">
                <Shimmer className="h-16 w-16 shrink-0 rounded-xl" />
                <Shimmer className="h-10 w-28 rounded-full" />
              </div>
            </div>
            <div>
              <Shimmer className="mb-1.5 h-3 w-28 rounded" />
              <div className="flex items-center gap-4">
                <Shimmer className="h-4 w-32 rounded" />
                <Shimmer className="h-10 w-28 rounded-full" />
              </div>
            </div>
          </div>
        </SkeletonSection>

        <SkeletonSection titleWidth="w-20">
          <div className="mb-4 flex justify-end">
            <Shimmer className="h-10 w-32 rounded-full" />
          </div>
          <div className="space-y-4">
            {Array.from({ length: founders }).map((_, i) => (
              <SkeletonFounderCard key={i} />
            ))}
          </div>
        </SkeletonSection>

        <div className="sticky bottom-0 mt-10 flex justify-end gap-2 border-t border-ia-line bg-white/95 py-4 backdrop-blur">
          <Shimmer className="h-11 w-24 rounded-full" />
          <Shimmer className="h-11 w-36 rounded-full" />
        </div>
      </div>
    </div>
  );
}
