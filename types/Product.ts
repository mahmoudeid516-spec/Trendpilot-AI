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
  opportunity_score?: number;

  // Competition
  competition: "Low" | "Medium" | "High";
  trend_direction?: "Rising" | "Stable" | "Falling";
  seasonality?: "Evergreen" | "Seasonal";

  // Ads
  cpm?: number;
  cpa?: number;

  // AI
  ai_reason?: string;
}