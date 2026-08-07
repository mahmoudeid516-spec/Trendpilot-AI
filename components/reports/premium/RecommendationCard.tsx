import { CheckCircle2 } from "lucide-react";

type RecommendationCardProps = {
  index: number;
  goal: string;
  impact: string;
};

export default function RecommendationCard({ index, goal, impact }: RecommendationCardProps) {
  return (
    <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-700">Priority {index + 1}</p>
      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">Goal</p>
      <p className="mt-1 inline-flex items-start gap-2 text-sm leading-7 text-emerald-900">
        <CheckCircle2 size={16} className="mt-1 shrink-0" />
        {goal}
      </p>
      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">Expected Business Impact</p>
      <p className="mt-1 text-sm leading-7 text-emerald-900">{impact}</p>
    </article>
  );
}
