import type { AIReport } from "../../../types/AIReport";

export type DecisionBadge = {
  badge: "✅ Launch" | "⚠ Launch Carefully" | "❌ Do Not Launch";
  tone: "emerald" | "amber" | "rose";
  explanation: string;
};

export type RankedRisk = {
  text: string;
  priority: "High" | "Medium" | "Low";
};

function splitSentences(value: string): string[] {
  return value
    .split(/[.!?]\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function buildDecisionBadge(report: AIReport): DecisionBadge {
  const verdict = report.business_verdict.toLowerCase();
  const highOpportunity = report.opportunity_score >= 75;
  const highConfidence = report.confidence_score >= 70;

  if (verdict.includes("do not") || verdict.includes("avoid") || report.opportunity_score < 45) {
    return {
      badge: "❌ Do Not Launch",
      tone: "rose",
      explanation: `Risk-adjusted outlook is weak. Opportunity is ${report.opportunity_score}% with confidence at ${report.confidence_score}%.`,
    };
  }

  if ((highOpportunity && highConfidence) || verdict.includes("launch") || verdict.includes("strong")) {
    return {
      badge: "✅ Launch",
      tone: "emerald",
      explanation: `Signal quality is favorable with ${report.opportunity_score}% opportunity and ${report.confidence_score}% confidence.`,
    };
  }

  return {
    badge: "⚠ Launch Carefully",
    tone: "amber",
    explanation: `Upside exists, but execution risk remains. Opportunity is ${report.opportunity_score}% and confidence is ${report.confidence_score}%.`,
  };
}

export function buildScoreReasons(report: AIReport): {
  opportunityReasons: string[];
  confidenceReasons: string[];
} {
  const opportunityReasons: string[] = [];
  const confidenceReasons: string[] = [];

  if (report.profit_estimation.gross_margin_percent >= 35) {
    opportunityReasons.push("Strong margin profile supports profitable paid and organic growth.");
  } else {
    opportunityReasons.push("Margin headroom is limited, so execution discipline is required.");
  }

  if (report.market_potential) {
    opportunityReasons.push(report.market_potential);
  }

  if (report.competition_analysis) {
    opportunityReasons.push(report.competition_analysis);
  }

  if (report.score_explanations?.opportunity_score_reason) {
    opportunityReasons.push(report.score_explanations.opportunity_score_reason);
  }

  if (report.evidence?.missing_data?.length) {
    confidenceReasons.push(...report.evidence.missing_data.slice(0, 2).map((item) => `Missing data: ${item}`));
  }

  if (report.evidence?.assumptions?.length) {
    confidenceReasons.push(...report.evidence.assumptions.slice(0, 2).map((item) => `Assumption used: ${item}`));
  }

  if (report.score_explanations?.confidence_score_reason) {
    confidenceReasons.push(report.score_explanations.confidence_score_reason);
  }

  if (confidenceReasons.length === 0) {
    if (report.confidence_score >= 80) {
      confidenceReasons.push("Input consistency and report coherence support higher confidence.");
    } else {
      confidenceReasons.push("Confidence is moderate due to limited observable market inputs.");
    }
  }

  return {
    opportunityReasons: opportunityReasons.slice(0, 4),
    confidenceReasons: confidenceReasons.slice(0, 4),
  };
}

export function buildFinancialInsights(report: AIReport): string[] {
  const insights: string[] = [];
  const margin = report.profit_estimation.gross_margin_percent;
  const breakEven = report.profit_estimation.break_even_units;

  if (margin >= 40) {
    insights.push("Current margin leaves room for paid acquisition while protecting contribution margin.");
  } else if (margin >= 25) {
    insights.push("Margin profile is workable, but CAC and discounting must be monitored closely.");
  } else {
    insights.push("Margin cushion is thin; profitability depends on disciplined spend and pricing control.");
  }

  if (breakEven <= 100) {
    insights.push("Break-even target appears realistic for an early launch test phase.");
  } else {
    insights.push("Break-even target is material and may require stronger conversion efficiency.");
  }

  if (report.profit_estimation.estimated_cogs > 0 && report.profit_estimation.suggested_selling_price > 0) {
    insights.push("Pricing flexibility is moderate if fulfillment and shipping stay near estimated COGS.");
  }

  insights.push("Margin may compress if operating costs exceed current assumptions.");

  return insights.slice(0, 4);
}

export function buildMarketHighlight(
  title: "Demand" | "Competition" | "Growth" | "Risk",
  report: AIReport,
): { headline: string; narrative: string } {
  if (title === "Demand") {
    return {
      headline: `Demand Signal: ${report.opportunity_score >= 70 ? "Attractive" : "Mixed"}`,
      narrative: `${report.demand_analysis} ${report.market_potential}`,
    };
  }

  if (title === "Competition") {
    return {
      headline: "Competitive Pressure",
      narrative: `${report.competition_analysis} Differentiation strength should align with the current positioning and offer architecture.`,
    };
  }

  if (title === "Growth") {
    return {
      headline: `Growth Outlook: ${report.opportunity_score >= 75 ? "Expansion-Ready" : "Selective"}`,
      narrative: `${report.market_potential} Launch sequencing should prioritize faster-learning channels before budget scaling.`,
    };
  }

  return {
    headline: `Risk Profile: ${report.confidence_score >= 75 ? "Controlled" : "Elevated"}`,
    narrative: report.risks[0] ? `${report.risks[0]} Execution controls should be set before aggressive scale.` : "Primary risk not specified.",
  };
}

export function rankRisks(report: AIReport): RankedRisk[] {
  const keywordHigh = /(compliance|legal|cash|loss|high|severe|critical|policy|ban|refund|chargeback)/i;
  const keywordMedium = /(competition|pricing|margin|supply|volatility|delay|quality|seasonal)/i;

  return report.risks.map((text, index) => {
    if (keywordHigh.test(text) || index === 0) {
      return { text, priority: "High" };
    }

    if (keywordMedium.test(text) || index <= 2) {
      return { text, priority: "Medium" };
    }

    return { text, priority: "Low" };
  });
}

export function recommendationImpact(text: string, report: AIReport): string {
  const lowered = text.toLowerCase();

  if (lowered.includes("price") || lowered.includes("offer") || lowered.includes("margin")) {
    return `Expected impact: protects gross margin around ${report.profit_estimation.gross_margin_percent}% and improves pricing control.`;
  }

  if (lowered.includes("ad") || lowered.includes("creative") || lowered.includes("tiktok") || lowered.includes("facebook")) {
    return "Expected impact: accelerates paid-media learning velocity and conversion signal quality.";
  }

  if (lowered.includes("launch") || lowered.includes("test") || lowered.includes("week")) {
    return "Expected impact: reduces execution risk by sequencing launch into measurable stages.";
  }

  if (lowered.includes("seo") || lowered.includes("content")) {
    return "Expected impact: compounds discoverability and lowers blended acquisition dependency over time.";
  }

  return `Expected impact: improves commercial execution against the current ${report.opportunity_score}% opportunity profile.`;
}

export function executiveSummaryPoints(report: AIReport): {
  mainOpportunity: string;
  mainRisk: string;
  nextAction: string;
} {
  const mainOpportunity =
    splitSentences(report.market_potential)[0] ||
    splitSentences(report.demand_analysis)[0] ||
    "Primary growth opportunity identified in current market context.";

  const mainRisk = report.risks[0] || "Primary risk not specified.";
  const nextAction = report.recommendations[0] || report.business_verdict;

  return {
    mainOpportunity,
    mainRisk,
    nextAction,
  };
}
