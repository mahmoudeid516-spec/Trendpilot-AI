type Props = {
    product: any;
  };
  
  function Card({
    title,
    value,
    color,
  }: {
    title: string;
    value: string | number;
    color: string;
  }) {
    return (
      <div className={`rounded-2xl p-5 shadow-sm border ${color}`}>
        <p className="text-sm text-gray-500">{title}</p>
  
        <h3 className="mt-2 text-3xl font-bold">
          {value}
        </h3>
      </div>
    );
  }
  
  export default function PerformanceCards({
    product,
  }: Props) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
  
        <Card
          title="AI Score"
          value={`${product.ai_score}%`}
          color="bg-purple-50"
        />
  
        <Card
          title="Trend Score"
          value={`${product.trend_score}%`}
          color="bg-blue-50"
        />
  
        <Card
          title="Profit"
          value={`$${product.profit}`}
          color="bg-green-50"
        />
  
        <Card
          title="Selling Price"
          value={`$${product.selling_price}`}
          color="bg-yellow-50"
        />
  
        <Card
          title="Platform"
          value={product.platform}
          color="bg-pink-50"
        />
  
        <Card
          title="Country"
          value={product.country}
          color="bg-orange-50"
        />
  
      </div>
    );
  }