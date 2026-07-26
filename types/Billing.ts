export type PlanTier = "Free" | "Pro" | "Premium";

export type BillingInterval = "month" | "year";

export interface BillingPlan {
  id: string;
  code: string;
  name: PlanTier;
  price_cents: number;
  currency: string;
  interval: BillingInterval;
  monthly_report_limit: number | null;
  monthly_search_limit: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "incomplete"
  | "inactive";

export interface SubscriptionRecord {
  id: string;
  user_id: string;
  plan_id: string;
  status: SubscriptionStatus;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

export interface UsageRecord {
  id: string;
  user_id: string;
  feature_key: UsageFeatureKey;
  usage_count: number;
  period_start: string;
  period_end: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export type UsageFeatureKey = "ai_search" | "ai_report" | "export";

export interface UsageLimitRecord {
  id: string;
  plan_id: string;
  feature_key: UsageFeatureKey;
  period: "day" | "month";
  limit_count: number | null;
  created_at: string;
  updated_at: string;
}

export interface UsageAllowance {
  feature_key: UsageFeatureKey;
  limit: number | null;
  used: number;
  remaining: number | null;
  allowed: boolean;
}

export interface BillingEventRecord {
  id: string;
  user_id: string;
  subscription_id: string | null;
  event_type: string;
  payload: Record<string, unknown> | null;
  created_at: string;
}
