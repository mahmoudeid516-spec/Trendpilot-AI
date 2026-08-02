export default function OpportunitySkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3" aria-label="Loading opportunities">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-[32px] border border-white/75 bg-white/92 shadow-[0_22px_60px_-44px_rgba(15,23,42,0.45)]"
        >
          <div className="h-52 w-full animate-pulse bg-slate-200" />
          <div className="space-y-4 p-5">
            <div className="h-6 w-3/4 animate-pulse rounded-lg bg-slate-200" />
            <div className="grid grid-cols-2 gap-2.5">
              <div className="h-14 animate-pulse rounded-xl bg-slate-100" />
              <div className="h-14 animate-pulse rounded-xl bg-slate-100" />
              <div className="h-14 animate-pulse rounded-xl bg-slate-100" />
              <div className="h-14 animate-pulse rounded-xl bg-slate-100" />
            </div>
            <div className="h-10 animate-pulse rounded-xl bg-slate-100" />
            <div className="grid grid-cols-2 gap-2.5">
              <div className="h-10 animate-pulse rounded-xl bg-slate-100" />
              <div className="h-10 animate-pulse rounded-xl bg-slate-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
