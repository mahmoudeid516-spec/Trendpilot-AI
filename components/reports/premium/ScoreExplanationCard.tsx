type ScoreExplanationCardProps = {
  title: string;
  scoreLabel: string;
  scoreValue: string;
  reasons: string[];
};

export default function ScoreExplanationCard({
  title,
  scoreLabel,
  scoreValue,
  reasons,
}: ScoreExplanationCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{title}</p>
      <p className="mt-2 text-sm font-semibold text-slate-900">{scoreLabel}</p>
      <p className="mt-1 text-2xl font-black tracking-tight text-slate-900">{scoreValue}</p>
      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Why</p>
      <ul className="mt-2 space-y-2">
        {reasons.map((reason) => (
          <li key={reason} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
            {reason}
          </li>
        ))}
      </ul>
    </article>
  );
}
