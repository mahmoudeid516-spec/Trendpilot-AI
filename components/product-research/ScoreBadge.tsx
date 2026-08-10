type Props = {
  label: string;
  value: number | undefined;
  suffix?: string;
  /** "higher-is-better" (default, e.g. Opportunity) or "lower-is-better" (e.g. Risk) */
  direction?: "higher-is-better" | "lower-is-better";
};

function colorClasses(value: number, direction: "higher-is-better" | "lower-is-better") {
  const good = direction === "higher-is-better" ? value >= 75 : value <= 30;
  const bad = direction === "higher-is-better" ? value < 45 : value > 65;

  if (good) return "bg-green-100 text-green-700";
  if (bad) return "bg-red-100 text-red-700";
  return "bg-yellow-100 text-yellow-700";
}

export default function ScoreBadge({ label, value, suffix = "", direction = "higher-is-better" }: Props) {
  const hasValue = typeof value === "number" && Number.isFinite(value);

  return (
    <div className={`rounded-xl px-3 py-2 text-center ${hasValue ? colorClasses(value, direction) : "bg-gray-100 text-gray-400"}`}>
      <p className="text-[11px] font-medium uppercase tracking-wide opacity-80">{label}</p>
      <p className="text-lg font-bold">{hasValue ? `${value}${suffix}` : "N/A"}</p>
    </div>
  );
}
