import { CircleDollarSign, Rocket, ShieldCheck, TrendingUp } from "lucide-react";

type CardProps = {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
};

function OverviewCard({
  title,
  value,
  subtitle,
  icon,
  color,
}: CardProps) {
  const Icon = icon;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200">

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.07),transparent_42%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div
        className={`absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-gradient-to-br ${color} opacity-10`}
      />

      <div className="relative z-10 flex items-start justify-between">

        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            {title}
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
            {value}
          </h2>

          <p className="mt-3 text-sm font-medium text-slate-600">
            {subtitle}
          </p>

        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r ${color} text-white`}
        >
          <Icon className="h-6 w-6" />
        </div>

      </div>

    </div>
  );
}

export default function BusinessOverview() {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

      <OverviewCard
        title="Revenue Potential"
        value="$24,850"
        subtitle="+18.2% this month"
        icon={CircleDollarSign}
        color="from-emerald-500 to-sky-500"
      />

      <OverviewCard
        title="Winning Products"
        value="14"
        subtitle="3 products added today"
        icon={Rocket}
        color="from-indigo-500 to-violet-500"
      />

      <OverviewCard
        title="AI Confidence"
        value="96%"
        subtitle="Excellent market prediction"
        icon={ShieldCheck}
        color="from-sky-500 to-indigo-500"
      />

      <OverviewCard
        title="Success Probability"
        value="91%"
        subtitle="Average launch score"
        icon={TrendingUp}
        color="from-amber-500 to-rose-500"
      />

    </section>
  );
}