import type { Product } from "../../types/Product";

/**
 * Single source of truth for opportunity_score / winning_probability /
 * decision. Previously these were computed twice with two different
 * formulas -- once in lib/services/dataforseoProductSearch.ts at
 * normalization time, and again in services/businessAdvisor.ts whenever the
 * AI Copilot search path ran -- so the same product could show a different
 * score depending on which search path found it. Everything now goes
 * through this module instead.
 *
 * Formula (documented, not tunable via magic numbers elsewhere):
 *
 *   opportunity_score =
 *       demand_score        * 0.20
 *     + trend_score          * 0.15
 *     + viral_score           * 0.10
 *     + profitability_score(min(roi, 100)) * 0.20
 *     + ai_score              * 0.15
 *     + competition_score(competition)     * 0.20
 *
 *   (weights sum to 1.0; every input is a real field already derived from
 *   the DataForSEO response -- nothing here is invented)
 *
 *   winning_probability = clamp(0, 100,
 *       opportunity_score * 0.60
 *     + demand_score        * 0.25
 *     - risk_score            * 0.15
 *   )
 *   (computed AFTER opportunity_score, from it, to avoid the circular
 *   "opportunity depends on winning_probability which depends on
 *   opportunity" trap)
 *
 *   decision:
 *     >= 90 -> "Strong Buy"
 *     >= 75 -> "Buy"
 *     >= 60 -> "Test"
 *     >= 40 -> "Watch"
 *     else  -> "Avoid"
 *
 * Note: risk_score is currently derived purely from `competition`
 * (see dataforseoProductSearch.ts), so it is intentionally NOT also
 * subtracted inside opportunity_score itself -- that would double-count
 * the same signal via competition_score. It's still used in
 * winning_probability, and is available on the Product for the Risk
 * Analysis report section. If risk_score gains independent signals in the
 * future (brand dominance, price compression, etc.), it should be folded
 * into opportunity_score directly at that point.
 */

export type Decision = "Strong Buy" | "Buy" | "Test" | "Watch" | "Avoid";

export type ScoringInput = {
  ai_score: number;
  trend_score: number;
  viral_score: number;
  demand_score: number;
  risk_score: number;
  roi: number;
  competition: Product["competition"];
};

export type ScoringResult = {
  opportunity_score: number;
  winning_probability: number;
  decision: Decision;
};

function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}

export function competitionScore(level: Product["competition"]): number {
  switch (level) {
    case "Low":
      return 100;
    case "Medium":
      return 70;
    case "High":
      return 30;
    default:
      return 50;
  }
}

function profitabilityScore(roi: number): number {
  return clamp(roi);
}

export function computeDecision(opportunityScore: number): Decision {
  if (opportunityScore >= 90) return "Strong Buy";
  if (opportunityScore >= 75) return "Buy";
  if (opportunityScore >= 60) return "Test";
  if (opportunityScore >= 40) return "Watch";
  return "Avoid";
}

export function scoreProduct(input: ScoringInput): ScoringResult {
  const opportunityScore = clamp(
    Math.round(
      input.demand_score * 0.2 +
        input.trend_score * 0.15 +
        input.viral_score * 0.1 +
        profitabilityScore(input.roi) * 0.2 +
        input.ai_score * 0.15 +
        competitionScore(input.competition) * 0.2
    )
  );

  const winningProbability = clamp(
    Math.round(
      opportunityScore * 0.6 + input.demand_score * 0.25 - input.risk_score * 0.15
    )
  );

  return {
    opportunity_score: opportunityScore,
    winning_probability: winningProbability,
    decision: computeDecision(opportunityScore),
  };
}

/**
 * Re-scores an already-normalized Product using its own existing fields.
 * Use this instead of re-deriving opportunity_score with a different
 * formula (that's the bug this module fixes) -- it always produces the
 * same result for the same input fields, regardless of which code path
 * calls it.
 */
export function scoreExistingProduct(product: Product): ScoringResult {
  return scoreProduct({
    ai_score: Number(product.ai_score ?? 0),
    trend_score: Number(product.trend_score ?? 0),
    viral_score: Number(product.viral_score ?? 0),
    demand_score: Number(product.demand_score ?? 0),
    risk_score: Number(product.risk_score ?? 0),
    roi: Number(product.roi ?? 0),
    competition: product.competition,
  });
}
