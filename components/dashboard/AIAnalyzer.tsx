"use client";

import { useState } from "react";

import { calculateAIScore } from "../../lib/ai/score";
import { predictSuccess } from "../../lib/ai/prediction";
import { analyzeCompetition } from "../../lib/ai/competition";
import { generateMarketing } from "../../lib/ai/marketing";

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

  async function handleAnalyzeProduct() {
    if (!product.trim()) return;

    setLoading(true);
    setResult("");

    try {
      // Search Product

      const searchData = await searchProduct(product);

      // Analyze Product

      const productData = await analyzeProduct(
        searchData.name
      );

      if (!productData) {
        throw new Error(
          "No product data returned."
        );
      }

      // AI Engine

      const aiScore =
        calculateAIScore(productData);

      const prediction =
        predictSuccess(productData);

      const competition =
        analyzeCompetition(productData);

      const marketing =
        generateMarketing(productData);

      // Check duplicate

      const { data: existingProduct } =
        await supabase
          .from("products")
          .select("id")
          .eq("name", productData.name)
          .limit(1);

      if (
        existingProduct &&
        existingProduct.length > 0
      ) {
        setResult(
          "⚠️ Product already exists."
        );

        return;
      }

      // Build Product Object

      const productObject = {
        name: productData.name,

        image:
          searchData.image ??
          "https://picsum.photos/400",

        platform,

        category:
          productData.category ?? "General",

        description:
          productData.description ?? "",

        buy_price: Number(
          productData.buy_price
        ),

        selling_price: Number(
          productData.selling_price
        ),

        profit: Number(
          productData.profit
        ),

        ai_score: aiScore,

        trend_score: Number(
          productData.market_score ??
            productData.trend_score ??
            80
        ),

        supplier:
          searchData.source ?? "",

        supplier_url:
          searchData.link ?? "",

        product_url:
          searchData.link ?? "",

        competition:
          productData.competition ??
          "Medium",

        country:
          productData.country ??
          "Worldwide",

        recommendation:
          competition.recommendation,

        pros:
          productData.pros ?? [],

        cons:
          productData.cons ?? [],

        success_probability:
          prediction.success_probability,

        trend_stage:
          prediction.trend_stage,

        market_saturation:
          prediction.market_saturation,

        difficulty:
          prediction.difficulty,

        marketing_json: marketing,
      };

      await saveProduct(productObject);

      setResult(
        "✅ Product saved successfully."
      );

      setTimeout(() => {
        onProductSaved();
      }, 500);

    } catch (err: any) {
      console.error(err);

      setResult(
        err.message ??
          "Something went wrong."
      );

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
          onClick={handleAnalyzeProduct}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-8 py-4 rounded-xl transition"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>

      </div>

      {loading && (
        <div className="mt-6">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-2 bg-purple-600 animate-pulse w-full"></div>
          </div>

          <p className="text-sm text-gray-500 mt-2">
            AI is analyzing the product...
          </p>
        </div>
      )}

      {result && (
        <div
          className={`mt-6 rounded-xl p-4 whitespace-pre-wrap ${
            result.startsWith("✅")
              ? "bg-green-100 text-green-700"
              : result.startsWith("⚠️")
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {result}
        </div>
      )}

    </div>
  );
}