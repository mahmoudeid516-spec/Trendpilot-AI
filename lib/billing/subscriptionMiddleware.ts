import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { consumeUsage } from "../services/billing";
import { getUserCurrentPlanFromProfile, normalizePlanName, PLAN_PRIORITY } from "../services/plan";
import { getAuthenticatedUserId } from "../reports/auth";

export class SubscriptionGuardError extends Error {
  status: number;
  code: string;

  constructor(message: string, status: number, code: string) {
    super(message);
    this.name = "SubscriptionGuardError";
    this.status = status;
    this.code = code;
  }
}

export async function requireUserIdOrThrow(req: NextRequest): Promise<string> {
  const userId = await getAuthenticatedUserId(req);

  if (!userId) {
    throw new SubscriptionGuardError("Authentication required.", 401, "auth_required");
  }

  return userId;
}

export async function consumeUsageOrThrow(
  userId: string,
  featureKey: "ai_search" | "ai_report" | "export",
  metadata?: Record<string, unknown>,
): Promise<void> {
  const allowance = await consumeUsage(userId, featureKey, metadata);

  if (!allowance.allowed) {
    throw new SubscriptionGuardError("Daily usage limit reached for your current plan.", 429, "usage_limit_reached");
  }
}

export async function requirePlanOrThrow(
  userId: string,
  minimumPlan: "Free" | "Pro" | "Premium",
): Promise<"Free" | "Pro" | "Premium"> {
  const currentPlanRaw = await getUserCurrentPlanFromProfile(userId);
  const currentPlan = normalizePlanName(currentPlanRaw);

  if (PLAN_PRIORITY[currentPlan] < PLAN_PRIORITY[minimumPlan]) {
    throw new SubscriptionGuardError(
      `${minimumPlan} plan is required for this feature.`,
      403,
      "plan_upgrade_required",
    );
  }

  return currentPlan;
}

export function toSubscriptionGuardResponse(error: unknown): NextResponse {
  if (error instanceof SubscriptionGuardError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
      },
      { status: error.status },
    );
  }

  return NextResponse.json(
    {
      error: "Subscription validation failed.",
      code: "subscription_validation_failed",
    },
    { status: 500 },
  );
}
