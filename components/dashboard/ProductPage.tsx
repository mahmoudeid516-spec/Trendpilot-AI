"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Product = {
  id: number;
  image: string;
  name: string;
  platform: string;
  ai_score: number;
  trend_score: number;
  profit: number;
  buy_price: number;
  selling_price: number;
  supplier: string;
  supplier_url: string;
  product_url: string;
  competition: string;
  country: string;
  category: string;
  description?: string;
  ai_reason?: string;
};

type Props = {
  id: string;
};

export default function ProductPage({ id }: Props) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduct();
  }, [id]);

  async function loadProduct() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", Number(id))
      .single();

    if (!error) {
      setProduct(data);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="p-10 text-2xl font-bold">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-10 text-red-500 text-2xl">
        Product not found.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-10">

      <div className="grid lg:grid-cols-2 gap-10">

        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-3xl object-cover shadow-xl"
          />
        </div>

        <div>

          <h1 className="text-5xl font-bold">
            {product.name}
          </h1>

          <p className="text-gray-500 mt-4 text-lg">
            {product.description ||
              "AI analyzed this product and found strong selling potential."}
          </p>

          <div className="grid grid-cols-2 gap-5 mt-8">

            <div className="bg-gray-100 rounded-2xl p-5">
              <p className="text-gray-500">AI Score</p>
              <h2 className="text-4xl font-bold text-green-600">
                {product.ai_score}%
              </h2>
            </div>

            <div className="bg-gray-100 rounded-2xl p-5">
              <p className="text-gray-500">Trend Score</p>
              <h2 className="text-4xl font-bold text-purple-600">
                {product.trend_score}%
              </h2>
            </div>

            <div className="bg-gray-100 rounded-2xl p-5">
              <p className="text-gray-500">Buy Price</p>
              <h2 className="text-3xl font-bold">
                ${product.buy_price}
              </h2>
            </div>

            <div className="bg-gray-100 rounded-2xl p-5">
              <p className="text-gray-500">Selling Price</p>
              <h2 className="text-3xl font-bold">
                ${product.selling_price}
              </h2>
            </div>

            <div className="bg-gray-100 rounded-2xl p-5">
              <p className="text-gray-500">Expected Profit</p>
              <h2 className="text-3xl font-bold text-green-600">
                ${product.profit}
              </h2>
            </div>

            <div className="bg-gray-100 rounded-2xl p-5">
              <p className="text-gray-500">Competition</p>
              <h2 className="text-2xl font-bold">
                {product.competition}
              </h2>
            </div>

          </div>

          <div className="mt-8 bg-purple-50 rounded-2xl p-6">

            <h3 className="text-2xl font-bold mb-3">
              🤖 AI Recommendation
            </h3>

            <p className="text-gray-700 leading-8">
              {product.ai_reason ||
                "This product has a high demand, strong profit margin and excellent viral potential. TrendPilot AI recommends launching it as soon as possible before competition increases."}
            </p>

          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">

            <a
              href={product.supplier_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black text-white py-4 rounded-xl text-center font-bold hover:bg-gray-800 transition"
            >
              View Supplier
            </a>

            <a
              href={product.product_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-purple-600 text-white py-4 rounded-xl text-center font-bold hover:bg-purple-700 transition"
            >
              Launch Product
            </a>

          </div>

        </div>

      </div>

    </div>
  );
}