const DECISION_STYLES: Record<string, string> = {
  "Strong Buy": "bg-green-600 text-white",
  Buy: "bg-emerald-500 text-white",
  Test: "bg-yellow-500 text-white",
  Watch: "bg-orange-500 text-white",
  Avoid: "bg-red-600 text-white",
};

export default function DecisionBadge({ decision }: { decision?: string }) {
  const style = (decision && DECISION_STYLES[decision]) || "bg-gray-400 text-white";

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${style}`}>
      {decision ?? "N/A"}
    </span>
  );
}
