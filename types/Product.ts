export interface Product {
  // Identity
  id: number;
  source: "AliExpress" | "Amazon" | "Shopify";
  platform: string;

  // Basic Info
  name: string;
  description: string;
  image: string;
  category: string;
  brand?: string;

  // Links
  product_url: string;
  supplier: string;
  supplier_url: string;

  // Store
  store_name?: string;
  store_rating?: number;
  supplier_rating?: number;

  // Pricing
  currency: string;
  buy_price: number;
  selling_price: number;
  profit: number;
  roi?: number;

  // Market
  sales: number;
  orders?: number;
  reviews: number;
  country: string;

  // Shipping
  shipping_days?: number;

  // AI Scores
  ai_score: number;
  trend_score: number;
  viral_score: number;
  opportunity_score?: number;

  // New AI Scores
  demand_score?: number;
  confidence_score?: number;
  risk_score?: number;
  winning_probability?: number;

  // Decision
  decision: string;
  ai_reason?: string;

  // Competition
  competition: "Low" | "Medium" | "High";
  trend_direction?: "Rising" | "Stable" | "Falling";
  seasonality?: "Evergreen" | "Seasonal";

  // Ads
  cpm?: number;
  cpa?: number;
}