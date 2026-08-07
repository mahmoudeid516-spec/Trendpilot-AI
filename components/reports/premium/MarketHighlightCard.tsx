type MarketHighlightCardProps = {
  title: string;
  headline: string;
  narrative: string;
  accent: "indigo" | "amber" | "emerald" | "rose";
};

const ACCENT: Record<MarketHighlightCardProps["accent"], string> = {
  indigo: "border-indigo-200 bg-indigo-50 text-indigo-900",
  amber: "border-amber-200 bg-amber-50 text-amber-900",
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-900",
  rose: "border-rose-200 bg-rose-50 text-rose-900",
};

export default function MarketHighlightCard({ title, headline, narrative, accent }: MarketHighlightCardProps) {
  return (
    <article className={`rounded-2xl border p-4 ${ACCENT[accent]}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em]">{title}</p>
      <p className="mt-2 text-base font-semibold">{headline}</p>
      <p className="mt-2 text-sm leading-7">{narrative}</p>
    </article>
  );
}
