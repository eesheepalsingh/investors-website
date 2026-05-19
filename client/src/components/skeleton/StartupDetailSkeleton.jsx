import { Shimmer } from './Shimmer.jsx';

function TextBlockSkeleton({ lines = 4 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Shimmer
          key={i}
          className={`h-3.5 rounded ${i === lines - 1 ? 'w-4/5' : 'w-full'}`}
        />
      ))}
    </div>
  );
}

export default function StartupDetailSkeleton() {
  return (
    <>
      <section className="border-b border-ia-line bg-[#f3f3f3]">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <Shimmer className="h-9 w-44 rounded-md" />
          <div className="mt-6 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <Shimmer className="h-24 w-24 shrink-0 rounded-2xl" />
            <div className="flex-1 space-y-3">
              <Shimmer className="h-10 w-full max-w-md rounded-lg" />
              <div className="flex flex-wrap gap-2">
                <Shimmer className="h-7 w-20 rounded-full" />
                <Shimmer className="h-7 w-24 rounded-full" />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Shimmer className="h-10 w-28 rounded-full" />
              <Shimmer className="h-10 w-28 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-ia-line">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[280px_1fr]">
            <aside>
              <Shimmer className="mb-5 h-3 w-12 rounded" />
              <Shimmer className="aspect-[3/4] w-full rounded-2xl" />
              <Shimmer className="mt-4 h-4 w-32 rounded" />
              <Shimmer className="mt-2 h-3 w-24 rounded" />
            </aside>

            <div className="space-y-10">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i}>
                  <Shimmer className="h-5 w-40 rounded" />
                  <div className="mt-3">
                    <TextBlockSkeleton lines={i === 0 ? 5 : 3} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-6 py-14">
          <Shimmer className="h-9 w-full max-w-lg rounded-lg" />
          <Shimmer className="mt-4 h-5 w-full max-w-xl rounded" />
          <Shimmer className="mt-8 h-[480px] w-full rounded-2xl" />
        </div>
      </section>
    </>
  );
}
