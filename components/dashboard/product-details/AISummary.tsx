type Props = {
    product: any;
  };
  
  export default function AISummary({ product }: Props) {
    return (
      <div className="rounded-3xl bg-white p-6 shadow-sm border">
        <h2 className="mb-6 text-2xl font-bold">
          🤖 AI Executive Summary
        </h2>
  
        <div className="grid grid-cols-2 gap-4">
  
          <div className="rounded-xl bg-green-50 p-4">
            <p className="text-sm text-gray-500">AI Score</p>
            <h3 className="text-3xl font-bold text-green-600">
              {product.ai_score}%
            </h3>
          </div>
  
          <div className="rounded-xl bg-blue-50 p-4">
            <p className="text-sm text-gray-500">Trend Score</p>
            <h3 className="text-3xl font-bold text-blue-600">
              {product.trend_score}%
            </h3>
          </div>
  
          <div className="rounded-xl bg-purple-50 p-4">
            <p className="text-sm text-gray-500">Profit</p>
            <h3 className="text-2xl font-bold text-purple-600">
              ${product.profit}
            </h3>
          </div>
  
          <div className="rounded-xl bg-orange-50 p-4">
            <p className="text-sm text-gray-500">Competition</p>
            <h3 className="text-xl font-bold">
              {product.competition}
            </h3>
          </div>
  
        </div>
  
        <div className="mt-6 rounded-xl bg-gray-50 p-5">
          <h3 className="mb-2 font-bold">
            AI Recommendation
          </h3>
  
          <p className="text-gray-700">
            {product.recommendation}
          </p>
        </div>
      </div>
    );
  type Props = {
    product: any;
  };
}