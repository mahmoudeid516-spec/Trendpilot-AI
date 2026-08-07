import type {
  Opportunity,
  OpportunityStats,
  OpportunitySummary,
  Marketplace,
} from "../types/opportunity";
import { normalizeDiscoverProducts } from "../lib/normalizeDiscoverProducts";
import {
  rankOpportunities,
  type CompetitionLevel,
  type RankedOpportunity,
} from "../lib/services/opportunityEngine";

const QUICK_TIPS = [
  "Prioritize products above 90 opportunity score with confidence above 92%.",
  "Test low-competition categories first to shorten time-to-profit.",
  "Use marketplace-native creatives before scaling cross-channel.",
];

const ALLOWED_MARKETPLACES: ReadonlyArray<Marketplace> = [
  "Amazon",
  "Shopify",
  "TikTok Shop",
  "Etsy",
  "Walmart",
];

function toMarketplace(value: string): Marketplace {
  const match = ALLOWED_MARKETPLACES.find(
    (marketplace) => marketplace.toLowerCase() === value.toLowerCase()
  );

  return match ?? "Amazon";
}

function mapCompetition(level: CompetitionLevel): Opportunity["competition"] {
  return level;
}

function toOpportunity(item: RankedOpportunity): Opportunity {
  return {
    id: item.id ?? 0,
    name: item.name,
    image:
      item.image ||
      "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=1200&auto=format&fit=crop",

    marketplace: toMarketplace(item.marketplace),
    category: item.category || "General",

    sellingPrice: item.sellingPrice ?? 0,
    buyPrice: item.buyPrice,
    rating: item.rating,
    reviews: item.reviews,
    sales: item.sales,
    productUrl: item.source,
    isAmazonChoice: item.isAmazonChoice ?? false,
    isBestSeller: item.isBestSeller ?? false,

    opportunityScore: item.opportunityScore,
    trendScore: item.trendScore,
    competition: mapCompetition(item.competition),
    estimatedProfit: item.estimatedProfit,
    confidence: item.confidence,
    aiExplanation: item.aiReasons.join(" "),
  };
}

export function calculateOpportunityStats(
  items: Opportunity[]
): OpportunityStats {
  const productsScanned = items.length;

  if (productsScanned === 0) {
    return {
      productsScanned,
      averageOpportunity: 0,
      highConfidencePicks: 0,
      averageProfit: 0,
    };
  }

  const totalOpportunity = items.reduce(
    (sum, item) => sum + item.opportunityScore,
    0
  );

  const totalProfit = items.reduce(
    (sum, item) => sum + item.estimatedProfit,
    0
  );

  const highConfidencePicks = items.filter(
    (item) => item.confidence >= 92
  ).length;

  return {
    productsScanned,
    averageOpportunity: Math.round(
      totalOpportunity / productsScanned
    ),
    highConfidencePicks,
    averageProfit: totalProfit / productsScanned,
  };
}


export async function getTodaysOpportunities(): Promise<Opportunity[]> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  const response = await fetch(
    `${baseUrl}/api/discover?search=${encodeURIComponent("winning products")}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to load opportunities");
  }

  const data = await response.json();

  const normalized = normalizeDiscoverProducts(data);

  const ranked = rankOpportunities(normalized);

  return ranked.map(toOpportunity);
}

export async function getOpportunitySummary(
  items: Opportunity[]
): Promise<OpportunitySummary> {
  if (items.length === 0) {
    return {
      topCategories: [],
      bestMarketplaceToday: "No data",
      highestMarginProduct: null,
      highestConfidenceProduct: null,
      aiSummary:
        "No products currently match these filters. Expand filters to unlock the strongest opportunities.",
      quickTips: QUICK_TIPS,
    };
  }

  const categoryCounts = items.reduce<Record<string, number>>(
    (acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    },
    {}
  );

  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, count]) => ({ name, count }));

  const marketplaceCounts = items.reduce<Record<string, number>>(
    (acc, item) => {
      acc[item.marketplace] =
        (acc[item.marketplace] || 0) + 1;
      return acc;
    },
    {}
  );

  const bestMarketplaceEntry = Object.entries(
    marketplaceCounts
  ).sort((a, b) => b[1] - a[1])[0];

  const highestMarginProduct =
    items
      .slice()
      .sort(
        (a, b) =>
          b.estimatedProfit - a.estimatedProfit
      )[0] ?? null;

  const highestConfidenceProduct =
    items
      .slice()
      .sort(
        (a, b) => b.confidence - a.confidence
      )[0] ?? null;

  const bestMarketplaceToday =
    (bestMarketplaceEntry?.[0] as Marketplace | undefined) ??
    "No data";

  const avgScore = Math.round(
    items.reduce(
      (sum, item) => sum + item.opportunityScore,
      0
    ) / items.length
  );

  const aiSummary = `AI ranking indicates strongest upside in ${bestMarketplaceToday} with an average opportunity score of ${avgScore} across current filtered products.`;

  return {
    topCategories,
    bestMarketplaceToday,
    highestMarginProduct,
    highestConfidenceProduct,
    aiSummary,
    quickTips: QUICK_TIPS,
  };
}

export async function getOpportunityById(
  id: number
): Promise<Opportunity | null> {
  const products = await getTodaysOpportunities();

  return (
    products.find((item) => item.id === id) ?? null
  );
}