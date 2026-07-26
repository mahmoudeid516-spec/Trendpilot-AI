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
