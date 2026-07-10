"use client";

import { calculateAIScore } from "../../lib/ai/score";
import { predictSuccess } from "../../lib/ai/prediction";
import { analyzeCompetition } from "../../lib/ai/competition";
import { generateMarketing } from "../../lib/ai/marketing";
import { useState } from "react";
import { searchProduct } from "../../lib/services/searchProduct";
import { analyzeProduct } from "../../lib/services/analyzeProduct";
import { saveProduct } from "../../lib/services/saveProduct";
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
      const aiScore = calculateAIScore(productData);

      const prediction = predictSuccess(productData);

      const competition = analyzeCompetition(productData);

      const marketing = generateMarketing(productData);

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
      await saveProduct({
        name: productData.name,
      
        image: searchData.image || "https://picsum.photos/400",
      
        platform,
      
        category: productData.category,
      
        description: productData.description,
      
        buy_price: Number(productData.buy_price),
      
        selling_price: Number(productData.selling_price),
      
        profit: Number(productData.profit),
      
        ai_score: aiScore,
      
        trend_score: Number(productData.market_score ?? productData.trend_score),
      
        supplier: searchData.source || "",
      
        supplier_url: searchData.link || "",
      
        product_url: searchData.link || "",
      
        competition,
      
        country: productData.country ?? "Worldwide",
      
        recommendation: productData.recommendation ?? "",
      
        pros: productData.pros ?? [],
      
        cons: productData.cons ?? [],
      
        success_probability: prediction.success_probability,
      
        trend_stage: prediction.trend_stage,
      
        market_saturation: prediction.market_saturation,
      
        difficulty: prediction.difficulty,
      
        marketing_json: marketing,
      });
      
      setResult("✅ Product saved successfully.");
      
      setTimeout(() => {
        onProductSaved();
      }, 500);

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
          className="flex-1 border rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-purple-500"
        />

        <button
          onClick={analyzeProduct}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-8 rounded-xl transition"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>

      </div>

      {result && (
        <div className="mt-6 rounded-xl bg-gray-100 p-4 whitespace-pre-wrap">
          {result}
        </div>
      )}
    </div>
  );
}