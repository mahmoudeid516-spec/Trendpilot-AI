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

export default function BusinessOverview() {
  return (
    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mb-10">

      <OverviewCard
        title="Revenue Potential"
        value="$24,850"
        subtitle="+18.2% this month"
        icon="💰"
        color="from-green-500 to-emerald-500"
      />

      <OverviewCard
        title="Winning Products"
        value="14"
        subtitle="3 products added today"
        icon="🚀"
        color="from-purple-500 to-indigo-500"
      />

      <OverviewCard
        title="AI Confidence"
        value="96%"
        subtitle="Excellent market prediction"
        icon="🤖"
        color="from-blue-500 to-cyan-500"
      />

      <OverviewCard
        title="Success Probability"
        value="91%"
        subtitle="Average launch score"
        icon="📈"
        color="from-orange-500 to-red-500"
      />

    </section>
  );
}