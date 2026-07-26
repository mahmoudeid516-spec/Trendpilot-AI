export interface Product {
  id: number;

  name: string;
  image: string;

  category: string;
  platform: string;

  supplier: string;
  supplier_url: string;

  product_url: string;

  buy_price: number;
  selling_price: number;
  profit: number;

  sales: number;
  reviews: number;

  country: string;

  competition: string;

  ai_score: number;
  trend_score: number;

  description: string;

  opportunity_score?: number;
}

export interface ProductLike {
  id?: number;
  name?: string;
  image?: string;
  category?: string;
  platform?: string;
  supplier?: string;
  supplier_url?: string;
  product_url?: string;
  buy_price?: number;
  selling_price?: number;
  profit?: number;
  sales?: number;
  reviews?: number;
  country?: string;
  competition?: string;
  ai_score?: number;
  trend_score?: number;
  market_score?: number;
  description?: string;
  opportunity_score?: number;
  pros?: string[];
  cons?: string[];
  recommendation?: string;
  source?: string;
  link?: string;
  success_probability?: number;
  trend_stage?: string;
  market_saturation?: string;
  difficulty?: string;
  marketing_json?: Record<string, unknown>;
  business_advisor?: Record<string, unknown>;
}

export interface SearchProductResult {
  name: string;
  image?: string;
  source?: string;
  link?: string;
}