const LOADER_BARS = [28, 52, 72, 44, 86, 60, 78];

type Props = {
  progress: number;
  step: string;
  etaSeconds: number;
};

export default function ReportGenerationLoader({ progress, step, etaSeconds }: Props) {
  return (
    <div className="overflow-hidden rounded-[32px] border border-violet-400/20 bg-[linear-gradient(135deg,rgba(8,12,33,0.96),rgba(37,15,61,0.92))] p-6 text-white shadow-[0_40px_120px_-40px_rgba(76,29,149,0.75)] sm:p-7">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-violet-200/75">Generating Premium Report</p>
          <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white">{step}</h3>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200/80">
            TrendPilot AI is building a saved report from live product context. Existing reports open instantly and new reports are persisted automatically.
          </p>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/5 px-5 py-4 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Estimated remaining time</p>
          <p className="mt-2 text-3xl font-semibold text-white">~{etaSeconds}s</p>
        </div>
      </div>

      <div className="mt-8 rounded-[28px] border border-white/10 bg-black/20 p-5 backdrop-blur">
        <div className="flex items-center justify-between text-sm text-slate-200">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,#7c3aed,#8b5cf6,#c084fc)] transition-[width] duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-6 grid grid-cols-7 items-end gap-2">
          {LOADER_BARS.map((height, index) => (
            <span
              key={`${step}-${index}`}
              className="animate-pulse rounded-t-2xl bg-[linear-gradient(180deg,rgba(216,180,254,0.95),rgba(124,58,237,0.3))]"
              style={{ height: `${height}%`, animationDelay: `${index * 120}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}