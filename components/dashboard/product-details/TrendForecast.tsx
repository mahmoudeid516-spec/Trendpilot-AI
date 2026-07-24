type Props = {
    product: any;
  };
  
  export default function TrendForecast({ product }: Props) {
    const trend = product.trend_score || 0;
  
    return (
      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-2xl font-bold">
          📈 AI Trend Forecast
        </h2>
  
        <div className="mb-4">
          <div className="mb-2 flex justify-between">
            <span>Growth Forecast</span>
            <strong>{trend}%</strong>
          </div>
  
          <div className="h-4 w-full rounded-full bg-gray-200">
            <div
              className="h-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"
              style={{ width: `${trend}%` }}
            />
          </div>
        </div>
  
        <div className="mt-6 space-y-3">
          <p>📅 Next 30 Days: High growth potential</p>
          <p>🔥 Viral Opportunity: Strong</p>
          <p>🌍 Recommended Market: USA / UK / Canada</p>
          <p>💰 Suggested Daily Budget: $50</p>
        </div>
      </div>
    );
  }