// types/product.ts

export interface ProductMetrics {
  views: number;
  sales: number;
  revenue: number;
  conversionRate: number;
  rating?: number;
  reviewsCount?: number;
}

export interface ProductReport {
  id: string;
  productId: string;
  generatedAt: string;
  summary: string;
  keyInsights: string[];
  recommendations: string[];
  score: number;
}

export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  originalPrice?: number;
  currency?: string;
  category?: string;
  image: string;
  images?: string[];
  url?: string;
  inStock?: boolean;
  metrics?: ProductMetrics;
  report?: ProductReport;
  createdAt?: string;
  updatedAt?: string;
}

// تصدير الأنواع الإضافية لاستخدامها عند الحاجه
export type ProductStatus = 'active' | 'draft' | 'archived';