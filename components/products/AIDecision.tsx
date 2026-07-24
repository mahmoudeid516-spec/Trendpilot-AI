type Props = {
    product: any;
  };
  
  export default function AIDecision({ product }: Props) {
    const score = Number(product.ai_score ?? 0);
    const trend = Number(product.trend_score ?? 0);
  
    const decision =
      score >= 90
        ? {
            title: "🟢 SELL NOW",
            color: "from-emerald-500 to-green-600",
            text: "Excellent opportunity with high AI confidence.",
          }
        : score >= 75
        ? {
            title: "🟡 WATCH",
            color: "from-yellow-400 to-orange-500",
            text: "Good potential, monitor before scaling.",
          }
        : {
            title: "🔴 AVOID",
            color: "from-red-500 to-red-700",
            text: "High risk based on current signals.",
          };
  
    return (
      <section
        className={`rounded-3xl bg-gradient-to-r ${decision.color} p-8 text-white shadow-2xl`}
      >
        <div className="flex flex-col lg:flex-row justify-between gap-8">
  
          <div className="flex-1">
  
            <h2 className="text-4xl font-bold">
              {decision.title}
            </h2>
  
            <p className="mt-3 text-lg opacity-90">
              {decision.text}
            </p>
  
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-8">
  
              <div className="rounded-2xl bg-white/15 p-4">
                <p className="text-sm opacity-80">Profit</p>
                <p className="text-2xl font-bold">
                  ${product.profit}
                </p>
              </div>
  
              <div className="rounded-2xl bg-white/15 p-4">
                <p className="text-sm opacity-80">Trend</p>
                <p className="text-2xl font-bold">
                  {trend}%
                </p>
              </div>
  
              <div className="rounded-2xl bg-white/15 p-4">
                <p className="text-sm opacity-80">Competition</p>
                <p className="text-2xl font-bold">
                  {product.competition}
                </p>
              </div>
  
              <div className="rounded-2xl bg-white/15 p-4">
                <p className="text-sm opacity-80">Platform</p>
                <p className="text-2xl font-bold">
                  {product.platform}
                </p>
              </div>
  
            </div>
  
          </div>
  
          <div className="flex flex-col items-center justify-center">
  
            <div className="h-40 w-40 rounded-full border-8 border-white flex items-center justify-center bg-white/10">
              <div className="text-center">
                <p className="text-5xl font-black">
                  {score}
                </p>
                <p className="text-sm opacity-80">
                  AI Score
                </p>
              </div>
            </div>
  
            <p className="mt-5 text-lg font-semibold">
              Confidence: {score}%
            </p>
  
          </div>
  
        </div>
      </section>
    );
  }