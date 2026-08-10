import type { ProductAnalysisResponse } from "../../types/analysis";

/**
 * Export builders operate ONLY on the already-returned response object --
 * no recomputation, no invented fields. If AI market analysis wasn't
 * available, the exported market_report section reflects that honestly
 * instead of being padded with fabricated text.
 */

export type ExportPayload = {
  keyword: string;
  requested_count: number;
  returned_count: number;
  exported_at: string;
  ai_available: boolean;
  summary: ProductAnalysisResponse["summary"];
  market_report: ProductAnalysisResponse["market_analysis"] | null;
  top_picks: Array<{
    category: string;
    product_id: string;
    product_name: string;
    reason: string;
  }>;
  products: Array<Record<string, unknown>>;
};

export function buildExportPayload(
  result: ProductAnalysisResponse,
  requestedCount: number
): ExportPayload {
  return {
    keyword: result.keyword,
    requested_count: requestedCount,
    returned_count: result.products_analyzed,
    exported_at: new Date().toISOString(),
    ai_available: result.ai_available,
    summary: result.summary,
    market_report: result.ai_available ? result.market_analysis : null,
    top_picks: result.top_picks.map((pick) => ({
      category: pick.category,
      product_id: pick.product.id,
      product_name: pick.product.name,
      reason: pick.reason,
    })),
    products: result.products.map((product) => ({
      id: product.id,
      name: product.name,
      platform: product.platform,
      asin: product.asin ?? "",
      product_url: product.product_url,
      buy_price: product.buy_price,
      selling_price: product.selling_price,
      profit: product.profit,
      roi: product.roi ?? "",
      reviews: product.reviews,
      sales: product.sales,
      ai_score: product.ai_score,
      trend_score: product.trend_score,
      demand_score: product.demand_score ?? "",
      risk_score: product.risk_score ?? "",
      opportunity_score: product.opportunity_score ?? "",
      winning_probability: product.winning_probability ?? "",
      competition: product.competition,
      decision: product.decision,
      analysis_why: product.analysis.why.join(" | "),
      analysis_risks: product.analysis.risks.join(" | "),
      analysis_recommendation: product.analysis.recommendation,
    })),
  };
}

export function toJson(result: ProductAnalysisResponse, requestedCount: number): string {
  return JSON.stringify(buildExportPayload(result, requestedCount), null, 2);
}

function csvEscape(value: unknown): string {
  const str = String(value ?? "");
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function toCsv(result: ProductAnalysisResponse, requestedCount: number): string {
  const payload = buildExportPayload(result, requestedCount);
  const rows = payload.products;

  if (rows.length === 0) {
    return "No products to export.";
  }

  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];

  for (const row of rows) {
    lines.push(headers.map((h) => csvEscape(row[h])).join(","));
  }

  return lines.join("\n");
}

export function downloadFile(filename: string, content: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
