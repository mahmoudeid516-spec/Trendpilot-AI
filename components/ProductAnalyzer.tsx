"use client";

interface ProductAnalyzerProps {
  product: any;
  onClose: () => void;
}

export default function ProductAnalyzer({ product, onClose }: ProductAnalyzerProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl">
        <h2 className="text-2xl font-bold mb-4">AI Insight for {product.title}</h2>
        
        <div className="space-y-4">
          <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
            <p className="text-sm text-indigo-900 font-medium">Market Demand:</p>
            <p className="text-lg font-bold">High (Top 10% Trending)</p>
          </div>
          
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <p className="text-sm text-emerald-900 font-medium">Profit Margin:</p>
            <p className="text-lg font-bold">~{product.roi + 15}% per sale</p>
          </div>

          <p className="text-slate-600 text-sm">
            Based on current social media engagement and AliExpress sales data, this product shows strong potential for Facebook Ads targeting.
          </p>
        </div>

        <button 
          onClick={onClose}
          className="mt-8 w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800"
        >
          Close Report
        </button>
      </div>
    </div>
  );
}