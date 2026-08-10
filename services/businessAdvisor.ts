import { ensureUniqueProductIds, normalizeProductId } from "../lib/services/productIdentity";
import { scoreExistingProduct } from "../lib/scoring/opportunityScore";
import type { Product } from "../types/Product";

// scoreProducts() previously recomputed opportunity_score with its own,
// different formula from the one used at product-normalization time
// (lib/services/dataforseoProductSearch.ts) -- so the same product could
// show a different score depending on whether it came from the plain
// search path or the AI Copilot search path. It now re-scores through the
// same canonical formula (lib/scoring/opportunityScore.ts), which is
// idempotent: re-running it on an already-scored product yields the same
// result, so this is safe even though the products passed in are usually
// already scored.
export function scoreProducts(products: Product[]) {
  const scored = products.map((product) => {
    const mapped = normalizeProductId(product);
    const { opportunity_score, winning_probability, decision } =
      scoreExistingProduct(mapped);

    return {
      ...mapped,
      opportunity_score,
      winning_probability,
      decision,
    };
  });

  return scored.sort(
    (a, b) => (b.opportunity_score ?? 0) - (a.opportunity_score ?? 0)
  );
}

export function getBestProduct(products: Product[]) {
  if (!products.length) return null;

  return ensureUniqueProductIds([...products]).sort(
    (a, b) => (b.opportunity_score ?? 0) - (a.opportunity_score ?? 0)
  )[0];
}