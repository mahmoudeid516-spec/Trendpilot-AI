"use client";

import { useState } from "react";
import Image from "next/image";
import { Megaphone, PackageCheck } from "lucide-react";
import type { Product } from "./ProductsTable";
import { generateMarketing } from "../../lib/services/generateMarketing";
import AIReportExperience from "../reports/AIReportExperience";

type Props = {
  product: Product | null;
  onReportGenerated?: () => void;
};

export default function ProductDetails({ product, onReportGenerated }: Props) {
  const [marketing, setMarketing] = useState("");
  const [loading, setLoading] = useState(false);

  if (!product) return null;

  async function handleGenerateMarketing() {
    if (!product) return;

    try {
      setLoading(true);
      const result = await generateMarketing(product);
      setMarketing(result);
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Failed to generate marketing.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-8 space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
      <header className="grid gap-5 lg:grid-cols-[260px,1fr]">
        <div>
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            unoptimized
            className="h-[260px] w-full rounded-2xl border border-slate-200 object-cover"
          />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Product Intelligence</p>
          <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">{product.name}</h2>
          <p className="mt-2 text-sm text-slate-600">
            {product.category} • {product.platform} • {product.country}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Buy Price</p>
              <p className="mt-1 text-lg font-bold text-slate-900">${product.buy_price}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Selling Price</p>
              <p className="mt-1 text-lg font-bold text-slate-900">${product.selling_price}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Profit / Unit</p>
              <p className="mt-1 text-lg font-bold text-emerald-700">${product.profit}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">AI Score Seed</p>
              <p className="mt-1 text-lg font-bold text-slate-900">{product.ai_score}%</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={handleGenerateMarketing}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100 disabled:opacity-50"
            >
              <Megaphone size={14} />
              {loading ? "Generating marketing..." : "Generate Marketing Pack"}
            </button>

            <a
              href={product.product_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
            >
              <PackageCheck size={14} />
              Open Listing
            </a>
          </div>

          {marketing ? (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h4 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">AI Marketing Strategy</h4>
              <pre className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">{marketing}</pre>
            </div>
          ) : null}
        </div>
      </header>

      <AIReportExperience product={product} onPersisted={onReportGenerated} />
    </section>
  );
}
