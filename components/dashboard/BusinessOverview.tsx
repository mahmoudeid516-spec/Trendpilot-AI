import type { Product } from "../../types/Product";

type CardProps = {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  color: string;
};

function OverviewCard({
  title,
  value,
  subtitle,
  icon,
  color,
}: CardProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-7 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">

      <div
        className={`absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-gradient-to-br ${color} opacity-10`}
      />

      <div className="relative z-10 flex items-start justify-between">

        <div>

          <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
            {title}
          </p>

          <h2 className="mt-3 text-4xl font-extrabold text-gray-900">
            {value}
          </h2>

          <p className="mt-3 text-sm font-semibold text-gray-500">
            {subtitle}
          </p>

        </div>

        <div
          className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r ${color} text-3xl shadow-lg`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}

type Props = {
  products: Product[];
};

export default function BusinessOverview({ products }: Props) {
  const hasProducts = products.length > 0;

  const totalProfitPotential = products.reduce(
    (sum, p) => sum + (p.profit ?? 0),
    0
  );

  const winningProducts = products.filter(
    (p) => (p.opportunity_score ?? 0) >= 90
  );

  const avgOpportunityScore = hasProducts
    ? Math.round(
        products.reduce((sum, p) => sum + (p.opportunity_score ?? 0), 0) /
          products.length
      )
    : null;

  const avgWinningProbability = hasProducts
    ? Math.round(
        products.reduce((sum, p) => sum + (p.winning_probability ?? 0), 0) /
          products.length
      )
    : null;

  return (
    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mb-10">

      <OverviewCard
        title="Profit Potential"
        value={hasProducts ? `$${totalProfitPotential.toFixed(2)}` : "$0"}
        subtitle={
          hasProducts
            ? `Across ${products.length} saved product${products.length === 1 ? "" : "s"}`
            : "No data available"
        }
        icon="💰"
        color="from-green-500 to-emerald-500"
      />

      <OverviewCard
        title="Winning Products"
        value={String(winningProducts.length)}
        subtitle={
          winningProducts.length > 0
            ? "Opportunity Score ≥ 90"
            : "No data available"
        }
        icon="🚀"
        color="from-purple-500 to-indigo-500"
      />

      <OverviewCard
        title="Avg Opportunity Score"
        value={avgOpportunityScore === null ? "N/A" : `${avgOpportunityScore}%`}
        subtitle={avgOpportunityScore === null ? "No data available" : "Across saved products"}
        icon="🤖"
        color="from-blue-500 to-cyan-500"
      />

      <OverviewCard
        title="Avg Win Probability"
        value={avgWinningProbability === null ? "N/A" : `${avgWinningProbability}%`}
        subtitle={avgWinningProbability === null ? "No data available" : "Across saved products"}
        icon="📈"
        color="from-orange-500 to-red-500"
      />

    </section>
  );
}
