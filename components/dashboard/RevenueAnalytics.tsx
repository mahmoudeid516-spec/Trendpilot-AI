type Props = {
    products: any[];
  };
  
  export default function RevenueAnalytics({ products }: Props) {
    const totalRevenue = products.reduce(
      (sum: number, p: any) => sum + Number(p.selling_price || 0),
      0
    );
  
    const totalProfit = products.reduce(
      (sum: number, p: any) => sum + Number(p.profit || 0),
      0
    );
  
    const avgPrice =
      products.length > 0
        ? totalRevenue / products.length
        : 0;
  
    const avgProfit =
      products.length > 0
        ? totalProfit / products.length
        : 0;
  
    const roi =
      totalRevenue > 0
        ? ((totalProfit / totalRevenue) * 100).toFixed(1)
        : "0";
  
    const highestProfit =
      products.length > 0
        ? Math.max(...products.map((p: any) => Number(p.profit || 0)))
        : 0;
  
    return (
      <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-lg">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">💰 Revenue Analytics</h2>
          <p className="mt-2 text-gray-500">
            Financial overview based on your latest search results.
          </p>
        </div>
  
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
          <StatCard title="Revenue" value={`$${totalRevenue.toLocaleString()}`} />
          <StatCard title="Profit" value={`$${totalProfit.toLocaleString()}`} />
          <StatCard title="Avg Price" value={`$${avgPrice.toFixed(2)}`} />
          <StatCard title="ROI" value={`${roi}%`} />
          <StatCard title="Top Profit" value={`$${highestProfit.toLocaleString()}`} />
        </div>
  
        <div className="mt-8 rounded-2xl bg-gray-50 p-6">
          <p className="text-lg font-semibold text-gray-700">
            Average Profit Per Product
          </p>
  
          <p className="mt-2 text-4xl font-bold text-green-600">
            ${avgProfit.toFixed(2)}
          </p>
        </div>
      </section>
    );
  }
  
  function StatCard({
    title,
    value,
  }: {
    title: string;
    value: string;
  }) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="mt-2 text-3xl font-bold">{value}</h3>
      </div>
    );
  }