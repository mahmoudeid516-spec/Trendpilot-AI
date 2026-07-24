"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Trophy,
  Star,
  ShoppingCart,
  DollarSign,
  Loader2,
  ExternalLink,
  RefreshCw,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

/** 
 * Types 
 */
type Competitor = {
  id: string;
  name: string;
  image: string;
  price: number;
  rating: number;
  reviews: number;
  seller: string;
  url: string;
  score: number;
};

type Props = {
  product: {
    name: string;
  };
};

/**
 * Helpers
 */
const getPrice = (item: Record<string, any>): number => {
  const val = item.price?.current ?? item.price?.value ?? item.price ?? item.sale_price ?? item.price_from ?? item.price_to ?? 0;
  return Number(val) || 0;
};

const getImage = (item: Record<string, any>): string => {
  return item.images?.[0] ?? item.image ?? item.image_url ?? item.thumbnail ?? item.thumbnail_url ?? item.main_image ?? "https://placehold.co/120x120?text=No+Image";
};

const generateKeywords = (title: string): string[] => {
  const stopWords = ["for", "with", "and", "the", "a", "an", "in", "on", "of", "to"];
  const cleanTitle = title.replace(/[^\w\s]/g, "").trim();
  const words = cleanTitle.split(/\s+/).filter(w => !stopWords.includes(w.toLowerCase()));
  
  const results = new Set<string>();
  
  // 1. Full Title
  results.add(cleanTitle.slice(0, 60));
  
  // 2. Combination of primary Nouns
  if (words.length > 3) {
    results.add(words.slice(0, 4).join(" "));
    results.add([words[0], words[1], words[words.length - 1]].join(" "));
  }
  
  // 3. Category + Product
  if (words.length > 2) {
    results.add(words.slice(0, 3).join(" "));
  }
  
  // 4. Broadest
  if (words.length > 1) {
    results.add(words.slice(0, 2).join(" "));
  }

  return Array.from(results);
};

export default function CompetitorIntelligence({ product }: Props) {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentSearch, setCurrentSearch] = useState("");
  const [status, setStatus] = useState("");

  const loadCompetitors = useCallback(async () => {
    if (!product?.name) return;

    setLoading(true);
    setStatus("Initializing search...");
    setCompetitors([]);

    const keywords = generateKeywords(product.name);
    const uniqueCompetitors = new Map<string, Competitor>();

    for (const keyword of keywords) {
      if (uniqueCompetitors.size >= 8) break;

      setCurrentSearch(keyword);
      setStatus(`Searching: ${keyword}...`);
      
      try {
        const res = await fetch(`/api/aliexpress?q=${encodeURIComponent(keyword)}`);
        const data = await res.json();
        const rawProducts: Record<string, any>[] = data.products || [];

        for (const item of rawProducts) {
          const asin = item.asin ?? item.id ?? item.product_url;
          if (!asin || uniqueCompetitors.has(asin)) continue;

          const price = getPrice(item);
          const rating = Number(item.rating || 0);
          const reviews = Number(item.reviews_count || 0);

          // Ranking Algorithm
          // Score = (rating * 25) + (log10(reviews+1) * 18) + (price > 0 ? 5 : 0)
          const score = (rating * 25) + (Math.log10(reviews + 1) * 18) + (price > 0 ? 5 : 0);

          uniqueCompetitors.set(asin, {
            id: asin,
            name: item.title || "Unknown Product",
            image: getImage(item),
            price,
            rating,
            reviews,
            seller: item.seller || "N/A",
            url: item.product_url || "#",
            score,
          });
        }
        
        setStatus(`Found ${uniqueCompetitors.size} potential competitors...`);
      } catch (err) {
        console.error(`Error searching ${keyword}:`, err);
      }
    }

    const sorted = Array.from(uniqueCompetitors.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);

    setCompetitors(sorted);
    setLoading(false);
  }, [product]);

  useEffect(() => {
    loadCompetitors();
  }, [loadCompetitors]);

  const insights = useMemo(() => {
    if (competitors.length === 0) return null;

    const prices = competitors.map(c => c.price).filter(p => p > 0);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / (prices.length || 1);
    const avgRating = competitors.reduce((a, b) => a + b.rating, 0) / competitors.length;
    const maxReviews = Math.max(...competitors.map(c => c.reviews));
    
    return {
      avgPrice: avgPrice.toFixed(2),
      avgRating: avgRating.toFixed(1),
      maxReviews: maxReviews.toLocaleString(),
      competition: competitors.length > 5 ? "High" : "Medium",
    };
  }, [competitors]);

  return (
    <div className="mt-10 rounded-3xl bg-white border border-slate-200 shadow-sm p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-yellow-100 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Competitor Intelligence</h2>
            <p className="text-slate-500">Market analysis for {product.name}</p>
          </div>
        </div>
        
        {!loading && (
          <button 
            onClick={loadCompetitors}
            className="p-2 text-slate-400 hover:text-indigo-600 transition"
            title="Retry Search"
          >
            <RefreshCw size={20} />
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mb-6" />
          <p className="text-slate-900 font-medium mb-1">{status}</p>
          <p className="text-slate-500 text-sm">Searching Amazon for {currentSearch}...</p>
        </div>
      ) : competitors.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <AlertCircle className="mx-auto w-12 h-12 text-slate-300 mb-4" />
          <h3 className="text-xl font-bold">No competitors found</h3>
          <p className="text-slate-500 mt-2 mb-6">We couldn't find close matches. Try broadening your keywords.</p>
          <button 
            onClick={loadCompetitors}
            className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition"
          >
            Retry Analysis
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {competitors.map((item, index) => (
            <div key={item.id} className="group rounded-2xl border p-5 hover:shadow-xl transition-all duration-300">
              <div className="flex gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 rounded-xl object-cover border bg-slate-50"
                  onError={(e) => (e.currentTarget.src = "https://placehold.co/120x120?text=No+Image")}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold">
                      Rank #{index + 1}
                    </span>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>
                  <h3 className="font-bold mt-1.5 text-sm text-slate-900 line-clamp-2 leading-tight">
                    {item.name}
                  </h3>
                  
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {item.rating >= 4.6 && <span className="bg-green-50 text-green-700 text-[10px] px-1.5 py-0.5 rounded font-bold">High Rating</span>}
                    {item.reviews > 500 && <span className="bg-blue-50 text-blue-700 text-[10px] px-1.5 py-0.5 rounded font-bold">Popular</span>}
                    {item.price < 25 && <span className="bg-yellow-50 text-yellow-700 text-[10px] px-1.5 py-0.5 rounded font-bold">Value</span>}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-5 border-t pt-4">
                <div className="text-center">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Price</p>
                  <p className="text-sm font-bold text-slate-900">${item.price}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Rating</p>
                  <p className="text-sm font-bold text-slate-900">{item.rating}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Reviews</p>
                  <p className="text-sm font-bold text-slate-900">{item.reviews >= 1000 ? (item.reviews / 1000).toFixed(1) + 'K' : item.reviews}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {insights && (
        <div className="mt-8 rounded-2xl bg-indigo-900 p-8 text-white">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-indigo-400" />
            <h3 className="font-bold text-xl">AI Market Analysis</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 border-b border-indigo-800 pb-6">
            {[
              { label: "Avg. Price", value: `$${insights.avgPrice}` },
              { label: "Avg. Rating", value: insights.avgRating },
              { label: "Max Reviews", value: insights.maxReviews },
              { label: "Competition", value: insights.competition },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-indigo-300 text-[10px] uppercase tracking-wider mb-1">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <p className="text-indigo-200">
              <span className="text-white font-bold">Recommendation:</span> Products exceeding 4.6 stars significantly dominate the search visibility.
            </p>
            <p className="text-indigo-200">
              <span className="text-white font-bold">Pricing Strategy:</span> To remain competitive, target a price point within 5-10% of the market average (${insights.avgPrice}).
            </p>
          </div>
        </div>
      )}
    </div>
  );
}