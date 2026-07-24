"use client";

import type { Product } from "../../../types/Product";

type Props = {
  product: Product;
  roi: {
    roi: number;
  };
};

export default function ImageGallery({
  product,
  roi,
}: Props) {
  return (
    <div className="mb-8">

      <img
        src={product.image}
        alt={product.name}
        className="w-full h-[420px] rounded-3xl object-cover border border-gray-200 shadow-2xl"
      />

      <div className="grid grid-cols-2 gap-4 mt-6">

        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            💰 Buy Price
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            ${product.buy_price}
          </h3>
        </div>

        <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            💵 Selling Price
          </p>

          <h3 className="mt-2 text-3xl font-bold text-emerald-600">
            ${product.selling_price}
          </h3>
        </div>

        <div className="rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            📈 Estimated Profit
          </p>

          <h3 className="mt-2 text-3xl font-bold text-violet-700">
            ${product.profit}
          </h3>
        </div>

        <div className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            🤖 ROI
          </p>

          <h3 className="mt-2 text-3xl font-bold text-blue-600">
            {roi.roi}%
          </h3>
        </div>

        <div className="rounded-3xl border border-purple-200 bg-purple-50 p-5 col-span-2">
          <p className="text-sm text-gray-500">
            🛒 Platform
          </p>

          <h3 className="mt-2 text-xl font-bold">
            {product.platform}
          </h3>
        </div>

      </div>

    </div>
  );
}