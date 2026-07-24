type Props = {
    product: {
      buy_price: number;
      selling_price: number;
      profit: number;
    };
    roi: {
      roi: number;
    };
  };
  
  export default function ProductStats({ product, roi }: Props) {
    return (
      <div className="grid grid-cols-2 gap-4 mt-6">
  
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm">
          <p className="text-sm text-gray-500">💰 Buy Price</p>
          <h3 className="mt-2 text-3xl font-bold">
            ${product.buy_price}
          </h3>
        </div>
  
        <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">💵 Selling Price</p>
          <h3 className="mt-2 text-3xl font-bold text-emerald-600">
            ${product.selling_price}
          </h3>
        </div>
  
        <div className="rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">📈 Estimated Profit</p>
          <h3 className="mt-2 text-3xl font-bold text-violet-700">
            ${product.profit}
          </h3>
        </div>
  
        <div className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">🤖 ROI</p>
          <h3 className="mt-2 text-3xl font-bold text-blue-600">
            {roi.roi}%
          </h3>
        </div>
  
      </div>
    );
  }