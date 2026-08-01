import { supabaseAdmin } from "../supabaseAdmin";
import type {
  BillingEventRecord,
  BillingPlan,
  SubscriptionRecord,
  UsageAllowance,
  UsageFeatureKey,
  UsageLimitRecord,
  UsageRecord,
} from "../../types/Billing";

const BILLING_TABLES = {
  plans: "plans",
  subscriptions: "subscriptions",
  usageLimits: "usage_limits",
  usageTracking: "usage_tracking",
  billingEvents: "billing_events",
} as const;

const DEFAULT_FREE_LIMITS: Record<UsageFeatureKey, number | null> = {
  ai_search: 5,
  ai_report: 3,
  export: 0,
};

function toUsageDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function getCurrentUsageWindow(): { periodStart: string; periodEnd: string } {
  const now = new Date();
  const periodStart = toUsageDateString(now);
  const periodEnd = toUsageDateString(now);

  return { periodStart, periodEnd };
}

export async function listActivePlans(): Promise<BillingPlan[]> {
  const { data, error } = await supabaseAdmin
    .from(BILLING_TABLES.plans)
    .select("*")
    .eq("is_active", true)
    .order("price_cents", { ascending: true });

  if (error) {
    throw new Error("Failed to load billing plans.");
  }

  return (data ?? []) as BillingPlan[];
}

export async function getActiveSubscription(userId: string): Promise<SubscriptionRecord | null> {
  const { data, error } = await supabaseAdmin
    .from(BILLING_TABLES.subscriptions)
    .select("*")
    .eq("user_id", userId)
    .in("status", ["trialing", "active", "past_due"])
    .order("current_period_end", { ascending: false })
    .maybeSingle<SubscriptionRecord>();

  if (error) {
    throw new Error("Failed to load user subscription.");
  }

  return data;
}

export async function getUsageRecord(
  userId: string,
  featureKey: UsageFeatureKey,
  periodStart: string,
  periodEnd: string,
): Promise<UsageRecord | null> {
  const { data, error } = await supabaseAdmin
    .from(BILLING_TABLES.usageTracking)
    .select("*")
    .eq("user_id", userId)
    .eq("feature_key", featureKey)
    .eq("period_start", periodStart)
    .eq("period_end", periodEnd)
    .maybeSingle<UsageRecord>();

  if (error) {
  console.error("SUPABASE USAGE ERROR:", error);

  throw new Error(
    `Failed to load usage record: ${error.message}`
  );
}

  return data;
}

export async function incrementUsage(
  userId: string,
  featureKey: UsageFeatureKey,
  periodStart: string,
  periodEnd: string,
  incrementBy = 1,
  metadata?: Record<string, unknown>,
): Promise<UsageRecord | null> {
  const existing = await getUsageRecord(userId, featureKey, periodStart, periodEnd);

  if (!existing) {
    const { data, error } = await supabaseAdmin
      .from(BILLING_TABLES.usageTracking)
      .insert({
        user_id: userId,
        feature_key: featureKey,
        usage_count: incrementBy,
        period_start: periodStart,
        period_end: periodEnd,
        metadata: metadata ?? null,
      })
      .select("*")
      .maybeSingle<UsageRecord>();

    if (error) {
      throw new Error("Failed to create usage record.");
    }

    return data;
  }

  const { data, error } = await supabaseAdmin
    .from(BILLING_TABLES.usageTracking)
    .update({
      usage_count: existing.usage_count + incrementBy,
      metadata: metadata ?? existing.metadata,
    })
    .eq("id", existing.id)
    .select("*")
    .maybeSingle<UsageRecord>();

  if (error) {
    throw new Error("Failed to update usage record.");
  }

  return data;
}

export async function listUsageLimitsForPlan(planId: string): Promise<UsageLimitRecord[]> {
  const { data, error } = await supabaseAdmin
    .from(BILLING_TABLES.usageLimits)
    .select("*")
    .eq("plan_id", planId)
    .eq("period", "day");

  if (error) {
    throw new Error("Failed to load usage limits for plan.");
  }

  return (data ?? []) as UsageLimitRecord[];
}

export async function getUserPlan(userId: string): Promise<BillingPlan | null> {
  const subscription = await getActiveSubscription(userId);

  if (!subscription?.plan_id) {
    const { data: freePlan, error: freePlanError } = await supabaseAdmin
      .from(BILLING_TABLES.plans)
      .select("*")
      .eq("code", "free-monthly")
      .maybeSingle<BillingPlan>();

    if (freePlanError) {
      throw new Error("Failed to load default plan.");
    }

    return freePlan;
  }

  const { data: plan, error: planError } = await supabaseAdmin
    .from(BILLING_TABLES.plans)
    .select("*")
    .eq("id", subscription.plan_id)
    .maybeSingle<BillingPlan>();

  if (planError) {
    throw new Error("Failed to load user plan.");
  }

  return plan;
}

export async function getPlanLimitForFeature(
  planId: string | null,
  featureKey: UsageFeatureKey,
): Promise<number | null> {
  if (!planId) {
    return DEFAULT_FREE_LIMITS[featureKey];
  }

  const { data, error } = await supabaseAdmin
    .from(BILLING_TABLES.usageLimits)
    .select("limit_count")
    .eq("plan_id", planId)
    .eq("feature_key", featureKey)
    .eq("period", "day")
    .maybeSingle<{ limit_count: number | null }>();

  if (error) {
    throw new Error("Failed to load feature usage limit.");
  }

  if (!data) {
    return DEFAULT_FREE_LIMITS[featureKey];
  }

  return data.limit_count;
}

export async function getUsageAllowance(
  userId: string,
  featureKey: UsageFeatureKey,
  periodStart?: string,
  periodEnd?: string,
): Promise<UsageAllowance> {
  const window = getCurrentUsageWindow();
  const start = periodStart ?? window.periodStart;
  const end = periodEnd ?? window.periodEnd;

  const [subscription, usage] = await Promise.all([
    getActiveSubscription(userId),
    getUsageRecord(userId, featureKey, start, end),
  ]);

  const planId = subscription?.plan_id;
  const limit = await getPlanLimitForFeature(planId ?? null, featureKey);

  const used = usage?.usage_count ?? 0;
  const remaining = limit === null ? null : Math.max(0, limit - used);

  return {
    feature_key: featureKey,
    limit,
    used,
    remaining,
    allowed: remaining === null ? true : remaining > 0,
  };
}

export async function consumeUsage(
  userId: string,
  featureKey: UsageFeatureKey,
  metadata?: Record<string, unknown>,
): Promise<UsageAllowance> {
  const window = getCurrentUsageWindow();
  const allowance = await getUsageAllowance(userId, featureKey, window.periodStart, window.periodEnd);

  if (!allowance.allowed) {
    return allowance;
  }

  await incrementUsage(userId, featureKey, window.periodStart, window.periodEnd, 1, metadata);

  const updated = await getUsageAllowance(userId, featureKey, window.periodStart, window.periodEnd);
  return updated;
}

export async function recordBillingEvent(input: {
  userId: string;
  eventType: string;
  subscriptionId?: string | null;
  payload?: Record<string, unknown>;
}): Promise<BillingEventRecord | null> {
  const { data, error } = await supabaseAdmin
    .from(BILLING_TABLES.billingEvents)
    .insert({
      user_id: input.userId,
      subscription_id: input.subscriptionId ?? null,
      event_type: input.eventType,
      payload: input.payload ?? null,
    })
    .select("*")
    .maybeSingle<BillingEventRecord>();

  if (error) {
    throw new Error("Failed to record billing event.");
  }

  return data;
}
