type Props = {
    totalProducts: number;
    winningProducts: number;
  };
  
  export default function DashboardStats({
    totalProducts,
    winningProducts,
  }: Props) {
    return (
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
  
        <StatCard
          title="Business Health"
          value="92%"
          subtitle="Excellent"
          color="text-green-400"
        />
  
        <StatCard
          title="AI Reports"
          value={totalProducts.toString()}
          subtitle="Generated"
          color="text-yellow-400"
        />
  
        <StatCard
          title="Winning Products"
          value={winningProducts.toString()}
          subtitle="Available"
          color="text-cyan-400"
        />
  
        <StatCard
          title="Estimated Profit"
          value="$12.8K"
          subtitle="This Month"
          color="text-emerald-400"
        />
  
      </div>
    );
  }
  
  function StatCard({
    title,
    value,
    subtitle,
    color,
  }: {
    title: string;
    value: string;
    subtitle: string;
    color: string;
  }) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
  
        <p className="text-sm text-gray-500">
          {title}
        </p>
  
        <h2 className="mt-3 text-4xl font-bold">
          {value}
        </h2>
  
        <p className={`mt-2 font-semibold ${color}`}>
          {subtitle}
        </p>
  
      </div>
    );
  }