import { z } from "zod";
import type {
  AIReport,
  AdCreativeIdeas,
  CustomerPersona,
  LaunchStrategy,
  MarketingAngles,
  PricingStrategy,
  ProfitEstimation,
  ReportEvidence,
  ReportProductInput,
  ScoreExplanations,
  SWOTAnalysis,
  TargetAudienceProfile,
} from "../../types/AIReport";

const trimmedString = z.string().trim().min(1);
const stringList = z.array(trimmedString).min(1);
const score = z.number().int().min(0).max(100);
const money = z.number().nonnegative();

export const reportProductInputSchema: z.ZodType<ReportProductInput> = z.object({
  id: z.number().int().positive().optional(),
  name: trimmedString,
  category: trimmedString.optional(),
  marketplace: trimmedString.optional(),
  platform: trimmedString.optional(),
  country: trimmedString.optional(),
  buy_price: z.number().nonnegative().optional(),
  selling_price: z.number().nonnegative().optional(),
  profit: z.number().nonnegative().optional(),
  ai_score: score.optional(),
  trend_score: score.optional(),
  competition: trimmedString.optional(),
  description: trimmedString.optional(),
  ai_reason: trimmedString.optional(),
  image: trimmedString.optional(),
  supplier: trimmedString.optional(),
  supplier_url: trimmedString.optional(),
  product_url: trimmedString.optional(),
});

const pricingStrategySchema: z.ZodType<PricingStrategy> = z.object({
  recommended_price_range: trimmedString,
  psychological_price_point: trimmedString,
  launch_offer_strategy: stringList,
  margin_outlook: trimmedString,
});

const profitEstimationSchema: z.ZodType<ProfitEstimation> = z.object({
  estimated_cogs: money,
  suggested_selling_price: z.number().positive(),
  gross_profit_per_unit: money,
  gross_margin_percent: score,
  break_even_units: z.number().int().positive(),
  first_90_day_profit_potential: trimmedString,
});

const targetAudienceProfileSchema: z.ZodType<TargetAudienceProfile> = z.object({
  primary_segments: stringList,
  buying_triggers: stringList,
  objections: stringList,
});

const customerPersonaSchema: z.ZodType<CustomerPersona> = z.object({
  persona_name: trimmedString,
  demographics: trimmedString,
  psychographics: trimmedString,
  pain_points: stringList,
  desired_outcomes: stringList,
});

const marketingAnglesSchema: z.ZodType<MarketingAngles> = z.object({
  awareness: stringList,
  consideration: stringList,
  conversion: stringList,
  retention: stringList,
});

const adCreativeIdeasSchema: z.ZodType<AdCreativeIdeas> = z.object({
  facebook_ads: stringList,
  tiktok_ad_ideas: stringList,
  instagram_caption: stringList,
  email_campaign: stringList,
});

const launchStrategySchema: z.ZodType<LaunchStrategy> = z.object({
  pre_launch: stringList,
  launch_week: stringList,
  post_launch: stringList,
});

const swotAnalysisSchema: z.ZodType<SWOTAnalysis> = z.object({
  strengths: stringList,
  weaknesses: stringList,
  opportunities: stringList,
  threats: stringList,
});

const scoreExplanationsSchema: z.ZodType<ScoreExplanations> = z.object({
  opportunity_score_reason: trimmedString,
  confidence_score_reason: trimmedString,
});

const reportEvidenceSchema: z.ZodType<ReportEvidence> = z.object({
  facts_used: z.array(trimmedString),
  calculated_values: z.array(trimmedString),
  assumptions: z.array(trimmedString),
  missing_data: z.array(trimmedString),
});

export const aiReportSchema: z.ZodType<AIReport> = z.object({
  generated_at: z.string().datetime(),

  // أصبح اختياريًا
  ai_score: score.default(50),

  product_name: trimmedString,
  marketplace: trimmedString,
  executive_summary: trimmedString,
  opportunity_score: score,
  market_potential: trimmedString,
  demand_analysis: trimmedString,
  competition_analysis: trimmedString,

  pricing_strategy: pricingStrategySchema,
  profit_estimation: profitEstimationSchema,

  target_audience: targetAudienceProfileSchema,
  customer_persona: customerPersonaSchema,
  marketing_angles: marketingAnglesSchema,

  unique_selling_proposition: trimmedString,
  seo_keywords: stringList,
  shopify_description: trimmedString,
  product_description: trimmedString,

  ad_creative_ideas: adCreativeIdeasSchema,
  launch_strategy: launchStrategySchema,
  swot_analysis: swotAnalysisSchema,

  risks: stringList,
  recommendations: stringList,

  business_verdict: trimmedString,

  confidence_score: score,

  score_explanations: scoreExplanationsSchema.optional(),
  evidence: reportEvidenceSchema.optional(),
});

export const generateReportRequestSchema = z.object({
  product: reportProductInputSchema,
  forceRegenerate: z.boolean().optional(),
});

export const reportHistoryQuerySchema = z.object({
  query: z.string().trim().max(120).optional(),
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().min(1).max(50).default(10),
});