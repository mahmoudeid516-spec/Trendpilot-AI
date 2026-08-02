export type CompetitionLevel = "Low" | "Medium" | "High";

export interface DiscoveredProductInput {
  id?: number;

  name: string;
  image?: string;

  platform?: string;
  source?: string;

  category?: string;
  country?: string;

  buy_price?: number;
  selling_price?: number;
  profit?: number;

  ai_score?: number;
  trend_score?: number;
  opportunity_score?: number;

  competition?: string;

  rating?: number;
  reviews?: number;
  sales?: number;

  is_amazon_choice?: boolean;
  is_best_seller?: boolean;

  success_probability?: number;
  trend_stage?: string;
  market_saturation?: string;
}

export interface RankedOpportunity {
    id?: number;

    name: string;
    image?: string;

    marketplace: string;
    category: string;
    country: string;

    source?: string;

    sellingPrice?: number;
    buyPrice?: number;

    rating?: number;
    reviews?: number;
    sales?: number;

    isAmazonChoice?: boolean;
    isBestSeller?: boolean;

    opportunityScore: number;
    trendScore: number;
    confidence: number;
    estimatedProfit: number;

    competition: CompetitionLevel;

    aiReasons: [string,string,string];
}

export interface OpportunityEngineOptions {
	defaultMarginRate?: number;
	minOpportunityScore?: number;
}

const DEFAULT_MARGIN_RATE = 0.28;
const DEFAULT_MIN_SCORE = 0;

function clamp(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, value));
}

function roundScore(value: number): number {
	return Math.round(clamp(value, 0, 99));
}

function isFiniteNumber(value: unknown): value is number {
	return typeof value === "number" && Number.isFinite(value);
}

function normalizeCompetition(raw?: string): CompetitionLevel | null {
	if (!raw) {
		return null;
	}

	const value = raw.toLowerCase();
	if (value.includes("low")) return "Low";
	if (value.includes("high")) return "High";
	if (value.includes("medium") || value.includes("med")) return "Medium";

	return null;
}

function inferCompetition(product: DiscoveredProductInput): CompetitionLevel {
	const explicit = normalizeCompetition(product.competition);
	if (explicit) {
		return explicit;
	}

	const saturation = normalizeCompetition(product.market_saturation);
	if (saturation) {
		return saturation;
	}

	const reviews = isFiniteNumber(product.reviews) ? product.reviews : 0;
	if (reviews >= 2000) return "High";
	if (reviews >= 600) return "Medium";
	return "Low";
}

function competitionToPenalty(level: CompetitionLevel): number {
	if (level === "Low") return 15;
	if (level === "Medium") return 7;
	return -6;
}

function estimateProfit(
	product: DiscoveredProductInput,
	defaultMarginRate: number
): number {
	if (isFiniteNumber(product.profit) && product.profit > 0) {
		return Number(product.profit.toFixed(2));
	}

	if (
		isFiniteNumber(product.selling_price) &&
		isFiniteNumber(product.buy_price) &&
		product.selling_price > product.buy_price
	) {
		return Number((product.selling_price - product.buy_price).toFixed(2));
	}

	if (isFiniteNumber(product.selling_price) && product.selling_price > 0) {
		return Number((product.selling_price * defaultMarginRate).toFixed(2));
	}

	return 0;
}

function computeMarginScore(
	product: DiscoveredProductInput,
	estimatedProfit: number
): number {
	if (isFiniteNumber(product.selling_price) && product.selling_price > 0) {
		const marginPercent = (estimatedProfit / product.selling_price) * 100;
		return clamp(marginPercent, 0, 99);
	}

	return clamp(estimatedProfit * 2.2, 0, 99);
}

function trendStageBonus(trendStage?: string): number {
	if (!trendStage) {
		return 0;
	}

	const value = trendStage.toLowerCase();
	if (value.includes("growing") || value.includes("rising")) return 8;
	if (value.includes("stable")) return 3;
	if (value.includes("declin")) return -8;
	return 0;
}

function computeTrendScore(product: DiscoveredProductInput): number {
	if (isFiniteNumber(product.trend_score)) {
		return roundScore(product.trend_score);
	}

	const sales = isFiniteNumber(product.sales) ? product.sales : 0;
	const reviews = isFiniteNumber(product.reviews) ? product.reviews : 0;
	const salesSignal = clamp(sales / 40, 0, 45);
	const reviewSignal = clamp(reviews / 120, 0, 32);
	const stageSignal = trendStageBonus(product.trend_stage);

	return roundScore(35 + salesSignal + reviewSignal + stageSignal);
}

function computeConfidence(
	product: DiscoveredProductInput,
	trendScore: number,
	estimatedProfit: number,
	competition: CompetitionLevel
): number {
	const fields: Array<unknown> = [
		product.buy_price,
		product.selling_price,
		product.profit,
		product.ai_score,
		product.trend_score,
		product.sales,
		product.reviews,
		product.market_saturation,
		product.trend_stage,
	];

	const completeness = fields.filter(
		(value) => value !== undefined && value !== null && value !== ""
	).length;

	const completenessScore = (completeness / fields.length) * 34;
	const trendSignal = trendScore * 0.33;
	const profitSignal = clamp(estimatedProfit * 1.3, 0, 24);
	const competitionSignal =
		competition === "Low" ? 8 : competition === "Medium" ? 4 : 1;

	const successProbability =
		isFiniteNumber(product.success_probability) && product.success_probability > 0
			? clamp(product.success_probability, 0, 99) * 0.2
			: 0;

	return roundScore(
		20 + completenessScore + trendSignal + profitSignal + competitionSignal + successProbability
	);
}

function computeOpportunityScore(
	product: DiscoveredProductInput,
	trendScore: number,
	confidence: number,
	estimatedProfit: number,
	competition: CompetitionLevel
): number {
	if (isFiniteNumber(product.opportunity_score)) {
		return roundScore(product.opportunity_score);
	}

	const aiScore = isFiniteNumber(product.ai_score)
		? clamp(product.ai_score, 0, 99)
		: 62;

	const marginScore = computeMarginScore(product, estimatedProfit);
	const competitionAdjustment = competitionToPenalty(competition);

	const weighted =
		aiScore * 0.31 +
		trendScore * 0.26 +
		marginScore * 0.24 +
		confidence * 0.15 +
		competitionAdjustment;

	return roundScore(weighted);
}

function buildAiReasons(
	product: DiscoveredProductInput,
	opportunityScore: number,
	trendScore: number,
	confidence: number,
	estimatedProfit: number,
	competition: CompetitionLevel
): [string, string, string] {
	const marginReason =
		isFiniteNumber(product.selling_price) && product.selling_price > 0
			? `Estimated margin signal: ${Math.round((estimatedProfit / product.selling_price) * 100)}%.`
			: `Estimated profit signal: $${estimatedProfit.toFixed(2)} per sale.`;

	const trendReason = `Trend momentum scores ${trendScore}/99 with ${competition.toLowerCase()} competition pressure.`;

	const confidenceReason =
		confidence >= 90
			? `High model confidence (${confidence}%) supports fast testing decisions.`
			: `Confidence at ${confidence}% suggests validating with small-budget tests first.`;

	const opportunityReason = `Overall opportunity score is ${opportunityScore}/99 based on price, trend, and market signals.`;

	return [opportunityReason, marginReason, trendReason || confidenceReason].map((r, idx) => {
		if (idx === 2) {
			return confidenceReason;
		}
		return r;
	}) as [string, string, string];
}

export function evaluateOpportunity(
	product: DiscoveredProductInput,
	options: OpportunityEngineOptions = {}
): RankedOpportunity {
	const marginRate = options.defaultMarginRate ?? DEFAULT_MARGIN_RATE;

	const marketplace = "Amazon";
	const category = product.category || "Uncategorized";
	const country = product.country || "Global";
	const competition = inferCompetition(product);
	const estimatedProfit = estimateProfit(product, marginRate);
	const trendScore = computeTrendScore(product);
	const confidence = computeConfidence(
		product,
		trendScore,
		estimatedProfit,
		competition
	);
	const opportunityScore = computeOpportunityScore(
		product,
		trendScore,
		confidence,
		estimatedProfit,
		competition
	);

	return {
		id: product.id,
		name: product.name,
		image: product.image,
		marketplace,
		category,
		country,
        source: product.source,

sellingPrice: product.selling_price,
buyPrice: product.buy_price,

rating: product.rating,

reviews: product.reviews,

sales: product.sales,

isAmazonChoice: product.is_amazon_choice,

isBestSeller: product.is_best_seller,
		opportunityScore,
		trendScore,
		confidence,
		estimatedProfit: Number(estimatedProfit.toFixed(2)),
		competition,
		aiReasons: buildAiReasons(
			product,
			opportunityScore,
			trendScore,
			confidence,
			estimatedProfit,
			competition
		),
	};
}

export function rankOpportunities(
	products: DiscoveredProductInput[],
	options: OpportunityEngineOptions = {}
): RankedOpportunity[] {
	const minScore = options.minOpportunityScore ?? DEFAULT_MIN_SCORE;

	return products
		.map((product) => evaluateOpportunity(product, options))
		.filter((item) => item.opportunityScore >= minScore)
		.sort((a, b) => {
			if (b.opportunityScore !== a.opportunityScore) {
				return b.opportunityScore - a.opportunityScore;
			}

			if (b.confidence !== a.confidence) {
				return b.confidence - a.confidence;
			}

			return b.estimatedProfit - a.estimatedProfit;
		});
}
