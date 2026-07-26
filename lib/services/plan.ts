import { supabaseAdmin } from "../supabaseAdmin";
import type { PlanTier } from "../../types/Billing";

export const PLAN_PRIORITY: Record<PlanTier, number> = {
  Free: 1,
  Pro: 2,
  Premium: 3,
};

export function normalizePlanName(value: string | null | undefined): PlanTier {
  if (!value) {
    return "Free";
  }

  const lowered = value.toLowerCase();

  if (lowered === "pro") {
    return "Pro";
  }

  if (lowered === "premium" || lowered === "business") {
    return "Premium";
  }

  return "Free";
}

export function isPaidPlan(plan: PlanTier): boolean {
  return plan === "Pro" || plan === "Premium";
}

export function planLabel(plan: PlanTier): string {
  return `${plan} Plan`;
}

export async function getUserCurrentPlanFromProfile(userId: string): Promise<PlanTier> {
  const { data: activeSubscription, error: subscriptionError } = await supabaseAdmin
    .from("subscriptions")
    .select("plan_id")
    .eq("user_id", userId)
    .in("status", ["trialing", "active", "past_due"])
    .order("current_period_end", { ascending: false })
    .maybeSingle<{ plan_id: string | null }>();

  if (!subscriptionError && activeSubscription?.plan_id) {
    const { data: planRecord, error: planError } = await supabaseAdmin
      .from("plans")
      .select("code, name")
      .eq("id", activeSubscription.plan_id)
      .maybeSingle<{ code: string; name: string | null }>();

    if (!planError && planRecord) {
      if (planRecord.code === "pro-monthly") {
        return "Pro";
      }

      if (planRecord.code === "premium-monthly") {
        return "Premium";
      }

      return normalizePlanName(planRecord.name);
    }
  }

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("plan")
    .eq("id", userId)
    .maybeSingle<{ plan: string | null }>();

  if (error) {
    return "Free";
  }

  return normalizePlanName(data?.plan);
}
