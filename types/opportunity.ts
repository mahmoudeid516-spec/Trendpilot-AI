export type Marketplace =
  | "Amazon"
  | "Shopify"
  | "TikTok Shop"
  | "Etsy"
  | "Walmart";

export type Competition = "Low" | "Medium" | "High";

export interface Opportunity {
  id: number;

  name: string;
  image: string;

  marketplace: Marketplace;
  category: string;

  // Amazon
  sellingPrice: number;
  buyPrice?: number;
  rating?: number;
 reviews?: number;
  sales?: number;
  productUrl?: string;

  isAmazonChoice?: boolean;
  isBestSeller?: boolean;

  // AI
  opportunityScore: number;
  trendScore: number;
  competition: Competition;
  estimatedProfit: number;
  confidence: number;
  aiExplanation: string;
}

export interface OpportunityStats {
  productsScanned: number;
  averageOpportunity: number;
  highConfidencePicks: number;
  averageProfit: number;
}

export interface SummaryCategory {
  name: string;
  count: number;
}

export interface OpportunitySummary {
  topCategories: SummaryCategory[];
  bestMarketplaceToday: Marketplace | "No data";
  highestMarginProduct: Opportunity | null;
  highestConfidenceProduct: Opportunity | null;
  aiSummary: string;
  quickTips: string[];
}

export interface OpportunityFiltersState {
  marketplace: "All" | Marketplace;
  category: "All" | string;
  competition: "All" | Competition;
  minScore: number;
  search: string;
}