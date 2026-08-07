import { AlertTriangle } from "lucide-react";

type RiskCardProps = {
  text: string;
  priority: "High" | "Medium" | "Low";
};

function toneByPriority(priority: RiskCardProps["priority"]): string {
  if (priority === "High") {
    return "border-rose-300 bg-rose-50 text-rose-900";
  }

  if (priority === "Medium") {
    return "border-amber-300 bg-amber-50 text-amber-900";
  }

  return "border-cyan-300 bg-cyan-50 text-cyan-900";
}

export default function RiskCard({ text, priority }: RiskCardProps) {
  return (
    <article className={`rounded-2xl border p-4 ${toneByPriority(priority)}`}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em]">{priority} Priority</p>
      <p className="mt-2 inline-flex items-start gap-2 text-sm leading-7">
        <AlertTriangle size={16} className="mt-1 shrink-0" />
        {text}
      </p>
    </article>
  );
}
