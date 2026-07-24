import { useMemo } from "react";
import { ProductReport } from "../types/report";
import { Product } from "../types/product";
import { generateProductReport, ProductScore } from "../report/generateProductReport";

interface UseProductReportOptions {
  product: Partial<Product> & { id: string | number };
  score: ProductScore;
  aiInsight?: Partial<ProductReport>;
}

/**
 * Custom React hook providing a memoized single source of truth for the ProductReport.
 * 
 * Ensures all UI components consume a stable, unified report object without
 * triggering re-computations or memory allocations on every render cycle.
 *
 * @param options Object containing product entity, score engine output, and optional AI insights
 * @returns Memoized ProductReport object
 */
export function useProductReport({
  product,
  score,
  aiInsight,
}: UseProductReportOptions): ProductReport {
  return useMemo(() => {
    return generateProductReport(product, score, aiInsight);
  }, [
    product.id,
    product.buy_price,
    product.selling_price,
    product.profit,
    product.currency,
    product.competition,
    product.country,
    product.category,
    product.name,
    product.title,
    product.ai_reason,
    score.winningProbability,
    score.aiScore,
    score.trendScore,
    score.launchStatus,
    score.riskLevel,
    aiInsight,
  ]);
}