import {
  BarChart3,
  Briefcase,
  Compass,
  DollarSign,
  Gauge,
  Rocket,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import type { AIReport } from "../../types/AIReport";
import CollapsibleSection from "./premium/CollapsibleSection";
import FinancialFlow from "./premium/FinancialFlow";
import MarketHighlightCard from "./premium/MarketHighlightCard";
import MarketingMatrix from "./premium/MarketingMatrix";
import MetricCard from "./premium/MetricCard";
import RecommendationCard from "./premium/RecommendationCard";
import RiskCard from "./premium/RiskCard";
import ScoreExplanationCard from "./premium/ScoreExplanationCard";
import Section from "./premium/Section";
import {
  buildDecisionBadge,
  buildFinancialInsights,
  buildMarketHighlight,
  buildScoreReasons,
  executiveSummaryPoints,
  rankRisks,
  recommendationImpact,
} from "./premium/reportInsights";

type Props = {
  report: AIReport;
};

function toneClasses(tone: "emerald" | "amber" | "rose"): string {
  if (tone === "emerald") {
    return "border-emerald-200 bg-emerald-50 text-emerald-900";
  }

  if (tone === "amber") {
    return "border-amber-200 bg-amber-50 text-amber-900";
  }

  return "border-rose-200 bg-rose-50 text-rose-900";
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm leading-7 text-slate-700">
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function PremiumReport({ report }: Props) {
  const decision = buildDecisionBadge(report);
  const scoreReasons = buildScoreReasons(report);
  const financialInsights = buildFinancialInsights(report);
  const rankedRisks = rankRisks(report);
  const topRisks = rankedRisks.slice(0, 3);
  const remainingRisks = rankedRisks.slice(3);
  const topRecommendations = report.recommendations.slice(0, 5);
  const remainingRecommendations = report.recommendations.slice(5);
  const summary = executiveSummaryPoints(report);

  const marketDemand = buildMarketHighlight("Demand", report);
  const marketCompetition = buildMarketHighlight("Competition", report);
  const marketGrowth = buildMarketHighlight("Growth", report);
  const marketRisk = buildMarketHighlight("Risk", report);

  const week1 = report.launch_strategy.pre_launch;
  const week2 = report.launch_strategy.launch_week;
  const week3 = report.launch_strategy.post_launch;
  const week4 = report.recommendations.slice(0, 3);

  return (
    <section className="mx-auto w-full max-w-[1200px] space-y-6 text-slate-900 print:max-w-none print:space-y-4">
      <style jsx global>{`
        @media print {
          details {
            display: block !important;
            box-shadow: none !important;
          }

          details > summary {
            display: none !important;
          }

          details > * {
            display: block !important;
          }
        }
      `}</style>

      <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_20px_55px_-32px_rgba(15,23,42,0.4)] sm:p-7">
        <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          <Sparkles size={13} />
          Executive Decision
        </p>

        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">{report.product_name}</h1>
            <p className="mt-2 text-sm text-slate-600">{report.marketplace} • {new Date(report.generated_at).toLocaleString()}</p>
          </div>

          <div className={`rounded-2xl border px-4 py-3 ${toneClasses(decision.tone)}`}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em]">Should You Launch?</p>
            <p className="mt-1 text-xl font-black tracking-tight">{decision.badge}</p>
            <p className="mt-1 text-xs leading-6">{decision.explanation}</p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
          <MetricCard
            icon={<Target size={12} />}
            label="Opportunity"
            value={`${report.opportunity_score}%`}
            helper="Overall score"
            accent="indigo"
          />
          <MetricCard
            icon={<Gauge size={12} />}
            label="Confidence"
            value={`${report.confidence_score}%`}
            helper="Model confidence"
            accent="violet"
          />
          <MetricCard
            icon={<DollarSign size={12} />}
            label="Est. Profit"
            value={`$${report.profit_estimation.gross_profit_per_unit.toFixed(2)}`}
            helper="Per unit"
            accent="emerald"
          />
          <MetricCard
            icon={<Compass size={12} />}
            label="Competition"
            value={report.competition_analysis}
            helper="Market pressure"
            accent="amber"
          />
          <MetricCard
            icon={<TrendingUp size={12} />}
            label="Demand"
            value={report.demand_analysis}
            helper="Current signal"
            accent="cyan"
          />
          <MetricCard
            icon={<Briefcase size={12} />}
            label="Verdict"
            value={decision.badge}
            helper="Executive summary"
            accent="rose"
          />
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Executive Summary</p>
          <p className="mt-2 text-sm leading-7 text-slate-700">{report.executive_summary}</p>
        </div>
      </section>

      <Section
        title="Score Explanation"
        subtitle="Why opportunity and confidence are at these levels."
        icon={<Gauge size={13} />}
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <ScoreExplanationCard
            title="Opportunity"
            scoreLabel="Opportunity Score"
            scoreValue={`${report.opportunity_score}`}
            reasons={scoreReasons.opportunityReasons}
          />
          <ScoreExplanationCard
            title="Confidence"
            scoreLabel="Confidence Score"
            scoreValue={`${report.confidence_score}`}
            reasons={scoreReasons.confidenceReasons}
          />
        </div>
      </Section>

      <Section
        title="Market Intelligence"
        subtitle="Demand, competition, growth, and risk summarized for fast scan."
        icon={<BarChart3 size={13} />}
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <MarketHighlightCard
            title="Demand"
            headline={marketDemand.headline}
            narrative={marketDemand.narrative}
            accent="indigo"
          />
          <MarketHighlightCard
            title="Competition"
            headline={marketCompetition.headline}
            narrative={marketCompetition.narrative}
            accent="amber"
          />
          <MarketHighlightCard
            title="Growth"
            headline={marketGrowth.headline}
            narrative={marketGrowth.narrative}
            accent="emerald"
          />
          <MarketHighlightCard
            title="Risk"
            headline={marketRisk.headline}
            narrative={marketRisk.narrative}
            accent="rose"
          />
        </div>

        <details className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
          <summary className="cursor-pointer text-sm font-semibold text-slate-900">SWOT Analysis</summary>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-sm font-semibold text-emerald-900">Strengths</p>
              <div className="mt-3"><List items={report.swot_analysis.strengths} /></div>
            </article>
            <article className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
              <p className="text-sm font-semibold text-rose-900">Weaknesses</p>
              <div className="mt-3"><List items={report.swot_analysis.weaknesses} /></div>
            </article>
            <article className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4">
              <p className="text-sm font-semibold text-cyan-900">Opportunities</p>
              <div className="mt-3"><List items={report.swot_analysis.opportunities} /></div>
            </article>
            <article className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-900">Threats</p>
              <div className="mt-3"><List items={report.swot_analysis.threats} /></div>
            </article>
          </div>
        </details>
      </Section>

      <Section
        title="Financial Analysis"
        subtitle="From COGS to break-even with concise operator insights."
        icon={<DollarSign size={13} />}
      >
        <FinancialFlow report={report} />

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {financialInsights.map((insight) => (
            <article key={insight} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm leading-7 text-slate-700">{insight}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        title="Customer Insights"
        subtitle="Who buys, why they buy, and what blocks conversion."
        icon={<Users size={13} />}
      >
        <div className="grid gap-4 lg:grid-cols-5">
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Who Buys</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{report.customer_persona.persona_name}</p>
            <p className="mt-2 text-sm leading-7 text-slate-700">{report.customer_persona.demographics}</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Why They Buy</p>
            <div className="mt-3"><List items={report.customer_persona.desired_outcomes} /></div>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Pain Points</p>
            <div className="mt-3"><List items={report.customer_persona.pain_points} /></div>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Buying Triggers</p>
            <div className="mt-3"><List items={report.target_audience.buying_triggers} /></div>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Decision Blockers</p>
            <div className="mt-3"><List items={report.target_audience.objections} /></div>
          </article>
        </div>

        <details className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
          <summary className="cursor-pointer text-sm font-semibold text-slate-900">Persona Context</summary>
          <article className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Psychographics</p>
            <p className="mt-2 text-sm leading-7 text-slate-700">{report.customer_persona.psychographics}</p>
          </article>
        </details>
      </Section>

      <Section
        title="Marketing Strategy"
        subtitle="Execution plan by week plus lifecycle channel playbook."
        icon={<Compass size={13} />}
      >
        <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Week 1</p>
            <div className="mt-2"><List items={week1} /></div>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Week 2</p>
            <div className="mt-2"><List items={week2} /></div>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Week 3</p>
            <div className="mt-2"><List items={week3} /></div>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Week 4</p>
            <div className="mt-2"><List items={week4} /></div>
          </article>
        </div>

        <MarketingMatrix report={report} />
      </Section>

      <CollapsibleSection
        title="Risks"
        subtitle="Top 3 risks prioritized for executive review."
      >
        <div className="space-y-3">
          {topRisks.map((risk) => (
            <RiskCard key={risk.text} text={risk.text} priority={risk.priority} />
          ))}
        </div>

        {remainingRisks.length > 0 ? (
          <details className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
            <summary className="cursor-pointer text-sm font-semibold text-slate-900">Additional risks ({remainingRisks.length})</summary>
            <div className="mt-3 space-y-2">
              {remainingRisks.map((risk) => (
                <RiskCard key={risk.text} text={risk.text} priority={risk.priority} />
              ))}
            </div>
          </details>
        ) : null}
      </CollapsibleSection>

      <Section
        title="Recommendations"
        subtitle="Prioritized roadmap with expected business impact."
        icon={<Target size={13} />}
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {topRecommendations.map((goal, index) => (
            <RecommendationCard
              key={`${index}-${goal}`}
              index={index}
              goal={goal}
              impact={recommendationImpact(goal, report)}
            />
          ))}
        </div>

        {remainingRecommendations.length > 0 ? (
          <details className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
            <summary className="cursor-pointer text-sm font-semibold text-slate-900">
              Additional recommendations ({remainingRecommendations.length})
            </summary>
            <div className="mt-3"><List items={remainingRecommendations} /></div>
          </details>
        ) : null}
      </Section>

      <Section
        title="Final Decision"
        subtitle="Executive summary card for final launch call."
        icon={<Rocket size={13} />}
      >
        <article className={`rounded-3xl border px-5 py-6 ${toneClasses(decision.tone)}`}>
          <p className="text-xs font-semibold uppercase tracking-[0.16em]">Executive Summary Card</p>
          <p className="mt-2 text-3xl font-black tracking-tight">{decision.badge}</p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/60 bg-white/60 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em]">Decision</p>
              <p className="mt-1 text-sm font-semibold">{report.business_verdict}</p>
            </div>
            <div className="rounded-2xl border border-white/60 bg-white/60 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em]">Confidence</p>
              <p className="mt-1 text-sm font-semibold">{report.confidence_score}%</p>
            </div>
            <div className="rounded-2xl border border-white/60 bg-white/60 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em]">Main Opportunity</p>
              <p className="mt-1 text-sm">{summary.mainOpportunity}</p>
            </div>
            <div className="rounded-2xl border border-white/60 bg-white/60 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em]">Main Risk</p>
              <p className="mt-1 text-sm">{summary.mainRisk}</p>
            </div>
          </div>

          <div className="mt-3 rounded-2xl border border-white/60 bg-white/60 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em]">Next Action</p>
            <p className="mt-1 text-sm leading-7">{summary.nextAction}</p>
          </div>
        </article>
      </Section>

      {(report.score_explanations || report.evidence) ? (
        <CollapsibleSection
          title="Model Detail"
          subtitle="Score explanations and evidence retained from report payload."
        >
          {report.score_explanations ? (
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Score Explanations</p>
              <p className="mt-2 text-sm leading-7 text-slate-700">{report.score_explanations.opportunity_score_reason}</p>
              <p className="mt-2 text-sm leading-7 text-slate-700">{report.score_explanations.confidence_score_reason}</p>
            </article>
          ) : null}

          {report.evidence ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Facts Used</p>
                <div className="mt-3"><List items={report.evidence.facts_used} /></div>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Calculated Values</p>
                <div className="mt-3"><List items={report.evidence.calculated_values} /></div>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Assumptions</p>
                <div className="mt-3"><List items={report.evidence.assumptions} /></div>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Missing Data</p>
                <div className="mt-3"><List items={report.evidence.missing_data} /></div>
              </article>
            </div>
          ) : null}
        </CollapsibleSection>
      ) : null}

      <footer className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500">
        Generated at {new Date(report.generated_at).toLocaleString()} • Marketplace: {report.marketplace}
      </footer>
    </section>
  );
}
