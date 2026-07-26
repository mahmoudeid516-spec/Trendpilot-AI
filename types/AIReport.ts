export type CompetitionLevel = "Low" | "Medium" | "High";

export interface ReportProductInput {
  id?: number;
  name: string;
  category?: string;
  marketplace?: string;
  platform?: string;
  country?: string;
  buy_price?: number;
  selling_price?: number;
  profit?: number;
  ai_score?: number;
  trend_score?: number;
  competition?: CompetitionLevel | string;
  description?: string;
  ai_reason?: string;
  image?: string;
  supplier?: string;
  supplier_url?: string;
  product_url?: string;
}

export interface SWOTAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface PricingStrategy {
  recommended_price_range: string;
  psychological_price_point: string;
  launch_offer_strategy: string[];
  margin_outlook: string;
}

export interface ProfitEstimation {
  estimated_cogs: number;
  suggested_selling_price: number;
  gross_profit_per_unit: number;
  gross_margin_percent: number;
  break_even_units: number;
  first_90_day_profit_potential: string;
}

export interface TargetAudienceProfile {
  primary_segments: string[];
  buying_triggers: string[];
  objections: string[];
}

export interface CustomerPersona {
  persona_name: string;
  demographics: string;
  psychographics: string;
  pain_points: string[];
  desired_outcomes: string[];
}

export interface MarketingAngles {
  awareness: string[];
  consideration: string[];
  conversion: string[];
  retention: string[];
}

export interface AdCreativeIdeas {
  facebook_ads: string[];
  tiktok_ad_ideas: string[];
  instagram_caption: string[];
  email_campaign: string[];
}

export interface LaunchStrategy {
  pre_launch: string[];
  launch_week: string[];
  post_launch: string[];
}

export interface AIReport {
  generated_at: string;
  product_name: string;
  marketplace: string;
  executive_summary: string;
  opportunity_score: number;
  market_potential: string;
  demand_analysis: string;
  competition_analysis: string;
  pricing_strategy: PricingStrategy;
  profit_estimation: ProfitEstimation;
  target_audience: TargetAudienceProfile;
  customer_persona: CustomerPersona;
  marketing_angles: MarketingAngles;
  unique_selling_proposition: string;
  seo_keywords: string[];
  shopify_description: string;
  product_description: string;
  ad_creative_ideas: AdCreativeIdeas;
  launch_strategy: LaunchStrategy;
  swot_analysis: SWOTAnalysis;
  risks: string[];
  recommendations: string[];
  business_verdict: string;
  confidence_score: number;
}

export interface StoredReportRecord {
  id: number;
  user_id: string;
  product_id: number | null;
  product_name: string;
  marketplace: string | null;
  report_json: AIReport;
  opportunity_score: number;
  confidence_score: number;
  created_at: string;
  updated_at: string;
}

export interface GenerateReportResponse {
  reportId: number;
  report: AIReport;
  reusedExisting: boolean;
}

export interface ReportHistoryItem {
  id: number;
  product_id: number | null;
  product_name: string;
  marketplace: string | null;
  opportunity_score: number;
  confidence_score: number;
  created_at: string;
  updated_at: string;
}

export interface ReportHistoryResponse {
  reports: ReportHistoryItem[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ReportDetailResponse {
  reportId: number;
  report: AIReport;
  metadata: ReportHistoryItem;
}