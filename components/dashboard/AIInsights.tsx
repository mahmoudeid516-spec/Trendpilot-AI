export default function AIInsights() {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
        <h2 className="text-2xl font-bold mb-6">
          🤖 AI Insights
        </h2>
  
        <div className="space-y-4">
  
          <div className="p-4 rounded-xl bg-green-50 border border-green-200">
            <h3 className="font-bold text-green-700">
              High Demand
            </h3>
  
            <p className="text-gray-600 mt-1">
              Search volume increased by 320% during the last 30 days.
            </p>
          </div>
  
          <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200">
            <h3 className="font-bold text-yellow-700">
              Medium Competition
            </h3>
  
            <p className="text-gray-600 mt-1">
              Few stores dominate this niche, making it a good opportunity.
            </p>
          </div>
  
          <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
            <h3 className="font-bold text-purple-700">
              AI Recommendation
            </h3>
  
            <p className="text-gray-600 mt-1">
              Import this product now before market saturation.
            </p>
          </div>
  
        </div>
      </div>
    );
  }