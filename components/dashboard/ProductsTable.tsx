"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";

type Product = {
  id: number;
  image: string;
  name: string;
  platform: string;
  ai_score: number;
  trend_score: number;
  viral_score?: number;
  profit: number;
  buy_price: number;
  selling_price: number;
  supplier: string;
  supplier_url: string;
  product_url: string;
  competition: string;
  country: string;
  category: string;
  orders?: number;
  reviews?: number;
  description?: string;
  ai_reason?: string;
};

type Props = {
  products?: Product[];
  search: string;
  platform: string;
  refreshKey: number;
  onSelectProduct: (product: Product) => void;
  subscription?: string; // أضفنا هذا الـ Prop لاستقبال نوع الاشتراك ('free' | 'pro' | 'premium')
};

export default function ProductsTable({
  products: searchResults = [],
  search,
  platform,
  refreshKey,
  onSelectProduct,
  subscription = "free", // القيمة الافتراضية مجاني للأمان
}: Props) {

  const [savedProducts, setSavedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const isFree = subscription === "free";

  useEffect(() => {
    loadProducts();
  }, [refreshKey]);

  async function loadProducts() {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("ai_score", { ascending: false });

    if (error) {
      console.error(error);
    }

    setSavedProducts(data || []);
    setLoading(false);
  }

  const displayProducts =
    searchResults.length > 0
      ? searchResults
      : savedProducts;

  const filtered = useMemo(() => {
    return displayProducts
      .filter((p) => {
        const matchSearch =
          search.trim() === "" ||
          p.name.toLowerCase().includes(search.toLowerCase());

        const matchPlatform =
          platform === "All" ||
          p.platform === platform;

        return matchSearch && matchPlatform;
      })
      .sort((a, b) => b.ai_score - a.ai_score);
  }, [displayProducts, search, platform]);

  // تحديد المنتجات المعروضة حسب خطة الاشتراك (الخطة المجانية تعرض 3 منتجات فقط)
  const displayedProducts = isFree ? filtered.slice(0, 3) : filtered;

  function badgeColor(level: string) {
    switch (level) {
      case "Low":
        return "bg-green-100 text-green-700";

      case "Medium":
        return "bg-yellow-100 text-yellow-700";

      case "High":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  if (loading) {
    return (
      <div className="rounded-3xl bg-white p-12 shadow-xl text-center font-semibold text-gray-600 animate-pulse">
        Loading Winning Products...
      </div>
    );
  }

  return (
    <section className="mt-10">

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-extrabold">
            🔥 Today's Winning Products
          </h2>
          <p className="mt-2 text-gray-500">
            AI selected today's best opportunities.
          </p>
        </div>

        <div className="rounded-2xl bg-indigo-600 px-6 py-4 text-white">
          <p className="text-sm opacity-80">
            Products
          </p>
          <h2 className="text-3xl font-bold">
            {displayedProducts.length}
          </h2>
        </div>
      </div>

      {displayedProducts.length === 0 && (
        <div className="rounded-3xl bg-white p-16 text-center shadow-xl">
          No Winning Products Found
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
        {displayedProducts.map((product) => (
          <div
            key={product.id}
            className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="relative">
                <img
                  src={product.image || "https://picsum.photos/600"}
                  alt={product.name}
                  className="h-72 w-full object-cover"
                />

                <div className="absolute left-4 top-4 rounded-full bg-green-500 px-4 py-2 font-bold text-white shadow-lg">
                  🏆 AI Pick
                </div>

                <div className="absolute right-4 top-4 rounded-full bg-black/70 px-4 py-2 font-bold text-white">
                  {product.ai_score}%
                </div>
              </div>

              <div className="p-6">
                <h3 className="line-clamp-2 text-2xl font-bold">
                  {product.name}
                </h3>

                <p className="mt-2 text-gray-500">
                  {product.category}
                </p>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Buy Price</p>
                    <h3 className="mt-1 text-2xl font-bold">${product.buy_price}</h3>
                  </div>

                  <div className="rounded-2xl bg-green-50 p-4">
                    <p className="text-sm text-gray-500">Sell Price</p>
                    <h3 className="mt-1 text-2xl font-bold text-green-700">${product.selling_price}</h3>
                  </div>

                  <div className="rounded-2xl bg-purple-50 p-4">
                    <p className="text-sm text-gray-500">Profit</p>
                    <h3 className="mt-1 text-2xl font-bold text-purple-700">${product.profit}</h3>
                  </div>

                  <div className="rounded-2xl bg-blue-50 p-4">
                    <p className="text-sm text-gray-500">Trend Score</p>
                    <h3 className="mt-1 text-2xl font-bold text-blue-700">{product.trend_score}%</h3>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="mb-2 flex justify-between">
                    <span>AI Confidence</span>
                    <strong>{product.ai_score}%</strong>
                  </div>

                  <div className="h-3 w-full rounded-full bg-gray-200">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-green-500 via-lime-400 to-emerald-500"
                      style={{ width: `${product.ai_score}%` }}
                    />
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  <span className={`rounded-full px-3 py-2 text-sm font-bold ${badgeColor(product.competition)}`}>
                    {product.competition}
                  </span>

                  <span className="rounded-full bg-indigo-100 px-3 py-2 text-sm font-bold text-indigo-700">
                    {product.platform}
                  </span>

                  <span className="rounded-full bg-gray-100 px-3 py-2 text-sm font-bold text-gray-700">
                    🌍 {product.country}
                  </span>
                </div>

                {product.ai_reason && (
                  <div className="mt-6 rounded-2xl border border-purple-200 bg-purple-50 p-4">
                    <h4 className="mb-2 font-bold text-purple-700">🤖 AI Insight</h4>
                    <p className="text-sm leading-6 text-gray-700">{product.ai_reason}</p>
                  </div>
                )}
              </div>
            </div>

            {/* الأزرار بالأسفل - حماية الروابط والتقارير للحسابات المجانية */}
            <div className="p-6 pt-0 mt-auto">
              <div className="grid grid-cols-3 gap-3">
                <a
                  href={product.product_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-blue-600 py-3 text-center font-bold text-white hover:bg-blue-700 text-sm flex items-center justify-center transition"
                >
                  View
                </a>

                {/* زر المورد: مشروط بالاشتراك */}
                {isFree ? (
                  <button
                    onClick={() => alert("🔒 Upgrade your subscription to unlock verified supplier contacts!")}
                    className="rounded-xl bg-gray-200 py-3 text-center font-bold text-gray-500 text-sm flex items-center justify-center gap-1 cursor-pointer hover:bg-gray-300 transition"
                  >
                    🔒 Supplier
                  </button>
                ) : (
                  <a
                    href={product.supplier_url || product.product_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl bg-green-600 py-3 text-center font-bold text-white hover:bg-green-700 text-sm flex items-center justify-center transition"
                  >
                    Supplier
                  </a>
                )}

                {/* زر تقرير الذكاء الاصطناعي: مشروط بالاشتراك */}
                {isFree ? (
                  <button
                    onClick={() => alert("🔒 Unlock AI Reports and deep insights by upgrading to Pro/Premium!")}
                    className="rounded-xl bg-gray-200 py-3 text-center font-bold text-gray-500 text-sm flex items-center justify-center gap-1 cursor-pointer hover:bg-gray-300 transition"
                  >
                    🔒 Report
                  </button>
                ) : (
                  <button
                    onClick={() => onSelectProduct(product)}
                    className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3 font-bold text-white hover:opacity-90 text-sm flex items-center justify-center transition"
                  >
                    AI Report
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* كارت التشويق (Teaser Card) لحث المستخدمين المجانيين على الترقية */}
        {isFree && filtered.length > 3 && (
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-indigo-300 bg-indigo-50/40 p-8 text-center shadow-lg min-h-[400px]">
            <span className="text-5xl mb-4 animate-bounce">🔒</span>
            <h3 className="text-2xl font-bold text-indigo-950">
              Unlock {filtered.length - 3}+ More Hot Products
            </h3>
            <p className="mt-3 text-sm text-indigo-700 max-w-xs leading-relaxed">
              We have found more trending winning products for today! Upgrade to Pro or Premium to view them all and start scaling your dropshipping store.
            </p>
            <a
              href="/pricing"
              className="mt-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3.5 font-bold text-white hover:opacity-95 shadow-lg shadow-indigo-500/20 transition-all text-center"
            >
              🚀 Upgrade Now
            </a>
          </div>
        )}
      </div>
    </section>
  );
}