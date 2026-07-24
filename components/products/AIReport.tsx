"use client"

import type { Product } from "../../types/Product";
import { useEffect, useState } from "react";

type Props = {
  product: Product;
};
type AIReportData = {
  executive_summary: string;
  strengths: string[];
  weaknesses: string[];
  target_audience: string;
  best_countries: string[];
  marketing_strategy: string;
  facebook_ad: string;
  tiktok_hook: string;
  instagram_caption: string;
  shopify_description: string;
  call_to_action: string;
  recommended_budget: string;
  risk_level: string;
 
  launch_decision: string;
  best_selling_price: string;
best_markets: string[];
keywords: string[];
};

export default function AIReport({ product }: Props) {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<AIReportData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReport() {
      try {
        setLoading(true);
  
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product,
          }),
        });
  
        if (!res.ok) {
          throw new Error("Failed to generate report");
        }
  
        const data = await res.json();
      

        setReport({
          executive_summary: data.result.recommendation,
          strengths: data.result.pros,
          weaknesses: data.result.cons,
          target_audience: "",
          best_countries: [data.result.country],
          marketing_strategy: "",
          facebook_ad: data.result.marketing.facebook_ad,
          tiktok_hook: data.result.marketing.tiktok_hook,
          instagram_caption: "",
          shopify_description: "",
          call_to_action: "",
          recommended_budget: "",
          risk_level: data.result.competition,
          launch_decision: data.result.recommendation,

          best_selling_price: `$${data.result.selling_price}`,
best_markets: [data.result.country],
keywords: [],
        });
      } catch (err) {
        console.error(err);
        setError("Unable to generate AI report.");
      } finally {
        setLoading(false);
      }
    }
  
    loadReport();
  }, [product]);

  if (loading) {
    return (
      <section className="mt-12 rounded-3xl bg-white p-8 shadow-xl">
        <h2 className="text-3xl font-bold">
          🤖 AI Business Report
        </h2>
  
        <p className="mt-6">
          Generating AI report...
        </p>
      </section>
    );
  }
  
  if (error || !report) {
    return (
      <section className="mt-12 rounded-3xl bg-white p-8 shadow-xl">
        <h2 className="text-3xl font-bold">
          🤖 AI Business Report
        </h2>
  
        <p className="mt-6 text-red-600">
          {error}
        </p>
      </section>
    );
  }

  return (
    <section className="mt-12 rounded-3xl bg-white p-8 shadow-xl border border-gray-100">

      <h2 className="mb-8 text-3xl font-bold">
        🤖 AI Business Report
      </h2>

      {/* AI Summary */}

      <div className="mb-10 rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 p-8 text-white shadow-xl">

        <p className="text-sm uppercase tracking-[0.25em] text-white/80">
          AI RECOMMENDATION
        </p>

        <h3 className="mt-3 text-3xl font-bold">
          TrendPilot AI Analysis
        </h3>

        <p className="mt-5 text-lg leading-8 text-white/90">
          {report.executive_summary }
        </p>

      </div>

      <div className="grid gap-8 lg:grid-cols-2">

        {/* Strengths */}

        <div className="rounded-3xl border border-green-200 bg-green-50 p-6">

          <h3 className="mb-6 text-2xl font-bold text-green-700">
            ✅ Key Strengths
          </h3>

          <ul className="space-y-4">

            {report.strengths.map((item) => (

              <li
                key={item}
                className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm"
              >
                <span className="text-xl">🟢</span>

                <span className="font-medium text-gray-700">
                  {item}
                </span>

              </li>

            ))}

          </ul>

        </div>

        {/* Risks */}

        <div className="rounded-3xl border border-red-200 bg-red-50 p-6">

          <h3 className="mb-6 text-2xl font-bold text-red-600">
            ⚠️ Potential Risks
          </h3>

          <ul className="space-y-4">

            {report.weaknesses.map((item) => (

              <li
                key={item}
                className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm"
              >
                <span className="text-xl">🔴</span>

                <span className="font-medium text-gray-700">
                  {item}
                </span>

              </li>

            ))}

          </ul>

        </div>

      </div>
    
    {/* Best Markets */}

<div className="mt-10 rounded-3xl border border-blue-200 bg-blue-50 p-6">

<h3 className="text-2xl font-bold text-blue-700">
  🌍 Best Markets & Selling Price
</h3>

<div className="mt-6 grid gap-4 md:grid-cols-2">

  <div className="rounded-2xl bg-white p-5 shadow">
    <p className="text-sm text-gray-500">
      Suggested Selling Price
    </p>

    <p className="mt-2 text-3xl font-bold text-green-600">
      {report.best_selling_price}
    </p>
  </div>

  <div className="rounded-2xl bg-white p-5 shadow">
    <p className="text-sm text-gray-500">
      Best Market
    </p>

    <div className="mt-2 flex flex-wrap gap-2">

      {report.best_markets.map((country) => (

        <span
          key={country}
          className="rounded-full bg-blue-100 px-4 py-2 text-blue-700 font-semibold"
        >
          🌎 {country}
        </span>

      ))}

    </div>

  </div>

</div>

</div>


      {/* Final Decision */}

      <div className="mt-10 rounded-3xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 p-8 text-white shadow-xl">

        <h3 className="text-3xl font-bold">
          🚀 Final AI Decision
        </h3>

        <p className="mt-5 text-lg leading-8 text-white/95">
          {report.launch_decision}
        </p>

      </div>

    </section>
  );
}