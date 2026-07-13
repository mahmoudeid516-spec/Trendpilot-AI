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