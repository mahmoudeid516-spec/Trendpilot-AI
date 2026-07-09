type Props = {
    aiScore: number;
    trendScore: number;
    competition: string;
    recommendation: string;
  };
  
  export default function AIReport({
    aiScore,
    trendScore,
    competition,
    recommendation,
  }: Props) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-8 mt-8">
  
        <h2 className="text-3xl font-bold mb-8">
          🤖 AI Product Report
        </h2>
  
        <div className="grid md:grid-cols-3 gap-6">
  
          <div className="bg-green-50 rounded-2xl p-5">
            <p>AI Score</p>
            <h2 className="text-4xl font-bold text-green-600">
              {aiScore}%
            </h2>
          </div>
  
          <div className="bg-purple-50 rounded-2xl p-5">
            <p>Trend Score</p>
            <h2 className="text-4xl font-bold text-purple-600">
              {trendScore}%
            </h2>
          </div>
  
          <div className="bg-blue-50 rounded-2xl p-5">
            <p>Competition</p>
            <h2 className="text-3xl font-bold">
              {competition}
            </h2>
          </div>
  
        </div>
  
        <div className="mt-8 bg-gray-100 rounded-2xl p-6">
  
          <h3 className="font-bold text-xl mb-3">
            AI Recommendation
          </h3>
  
          <p>
            {recommendation}
          </p>
  
        </div>
  
      </div>
    );
  }