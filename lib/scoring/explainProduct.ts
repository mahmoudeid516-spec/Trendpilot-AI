import type { Product } from "../../types/Product";
import type { Decision } from "./opportunityScore";

/**
 * Per-product "AI Analysis" (why / risks / recommendation) is generated
 * deterministically from the product's own real fields -- not via a
 * separate AI call per product. This keeps cost bounded (one AI call per
 * search, not one per product) and guarantees nothing here is invented:
 * every bullet is a direct, traceable read of a real field against a
 * fixed, documented threshold.
 */

export type ProductExplanation = {
  verdict: Decision;
  why: string[];
  risks: string[];
  recommendation: string;
};

export function explainProduct(product: Product): ProductExplanation {
  const roi = Number(product.roi ?? 0);
  const reviews = Number(product.reviews ?? 0);
  const sales = Number(product.sales ?? 0);
  const demand = Number(product.demand_score ?? 0);
  const risk = Number(product.risk_score ?? 0);
  const trend = Number(product.trend_score ?? 0);
  const opportunity = Number(product.opportunity_score ?? 0);
  const decision = (product.decision as Decision) ?? "Watch";

  const why: string[] = [];
  const risks: string[] = [];

  if (roi >= 60) why.push(`Strong margin (${roi}% ROI)`);
  else if (roi >= 30) why.push(`Reasonable margin (${roi}% ROI)`);

  if (product.competition === "Low") why.push("Low competition among returned results");
  if (demand >= 70) why.push("Good demand signal (reviews/sales volume)");
  if (trend >= 80) why.push("Strong trend signal");
  if (product.best_seller) why.push("Marked as Amazon Best Seller");
  if (product.amazon_choice) why.push("Marked as Amazon's Choice");

  if (roi < 20) risks.push(`Thin margin (${roi}% ROI) -- limited room for ad spend`);
  if (product.competition === "High") risks.push("High competition in this result set");
  if (reviews < 20) risks.push("Low review volume -- limited sales history to validate demand");
  if (sales < 10) risks.push("Low estimated sales volume so far");
  if (risk >= 70) risks.push("Elevated overall risk score");

  if (why.length === 0) why.push("Insufficient data to identify a clear strength");
  if (risks.length === 0) risks.push("No major risk signals identified in the available data");

  let recommendation: string;
  if (decision === "Strong Buy") {
    recommendation = "Strong candidate -- worth testing with a real ad budget.";
  } else if (decision === "Buy") {
    recommendation = "Good candidate -- test with a small initial budget.";
  } else if (decision === "Test") {
    recommendation = "Worth a small, low-risk test before committing further budget.";
  } else if (decision === "Watch") {
    recommendation = "Not ready yet -- monitor for improving demand or lower competition.";
  } else {
    recommendation = `Avoid for now -- opportunity score (${opportunity}) is too low relative to the risks above.`;
  }

  return { verdict: decision, why, risks, recommendation };
}
