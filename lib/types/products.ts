export interface Product {

    id?: number;
  
    name: string;
  
    image: string;
  
    platform: string;
  
    category: string;
  
    description: string;
  
    buy_price: number;
  
    selling_price: number;
  
    profit: number;
  
    ai_score: number;
  
    trend_score: number;
  
    supplier: string;
  
    supplier_url: string;
  
    product_url: string;
  
    competition: string;
  
    country: string;
  
    recommendation?: string;
  
    pros?: string[];
  
    cons?: string[];
  
  }