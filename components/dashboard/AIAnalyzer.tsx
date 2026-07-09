"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

type Props = {
  onProductSaved: () => void;
};

export default function AIAnalyzer({
  onProductSaved,
}: Props) {
  const [product, setProduct] = useState("");
  const [platform, setPlatform] = useState("AliExpress");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  async function analyzeProduct() {
    if (!product.trim()) return;

    setLoading(true);
    setResult("");

    try {
      // Search Product
      const searchRes = await fetch("/api/search-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product,
        }),
      });

      const searchData = await searchRes.json();

      if (!searchRes.ok) {
        throw new Error(searchData.error || "Search failed");
      }

      // Analyze Product
      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product: searchData.name,
        }),
      });

      const analyzeData = await analyzeRes.json();

      if (!analyzeRes.ok) {
        throw new Error(analyzeData.error || "Analyze failed");
      }

      const productData = analyzeData.result;

      if (!productData) {
        throw new Error("No product data returned.");
      }

      // Check duplicate
      const { data: existingProduct } = await supabase
        .from("products")
        .select("id")
        .eq("name", productData.name)
        .limit(1);

      if (existingProduct && existingProduct.length > 0) {
        setResult("⚠️ Product already exists.");
        return;
      }

      // Save Product
      const { error } = await supabase.from("products").insert([
        {
          name: productData.name,
          image: searchData.image || "https://picsum.photos/400",

          platform,

          category: productData.category,
          description: productData.description,

          buy_price: Number(productData.buy_price),

selling_price: Number(productData.selling_price),

profit: Number(productData.profit),

ai_score: Math.round(Number(productData.ai_score)),

trend_score: Math.round(Number(productData.trend_score)),

          supplier: searchData.source || "",
          supplier_url: searchData.link || "",

          product_url: searchData.link || "",
          competition: "Medium",
          country: "Global",
        },
      ]);

      if (error) {
        console.error(error);

        setResult(
          "❌ Supabase Error:\n" + JSON.stringify(error, null, 2)
        );

        return;
      }

      setResult("✅ Product saved successfully.");

      setTimeout(() => {
        onProductSaved();
      }, 500);
    } catch (err: any) {
      console.error(err);
      setResult(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
      <h2 className="text-3xl font-bold mb-6">
        🤖 AI Product Analyzer
      </h2>

      <div className="flex flex-col md:flex-row gap-4">
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="border rounded-xl px-4 py-4"
        >
          <option>AliExpress</option>
          <option>Amazon</option>
          <option>Shopify</option>
          <option>TikTok Shop</option>
        </select>

        <input
          type="text"
          placeholder="Enter product name..."
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          className="flex-1 border rounded-xl px-5 py-4 outline-none"
        />

        <button
          onClick={analyzeProduct}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 text-white px-8 rounded-xl"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {result && (
        <div className="mt-6 bg-gray-100 rounded-xl p-4 whitespace-pre-wrap">
          {result}
        </div>
      )}
    </div>
  );
}