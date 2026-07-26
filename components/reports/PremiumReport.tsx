import {
  BarChart3,
  Briefcase,
  Compass,
  DollarSign,
  FileSearch,
  Gauge,
  Layers3,
  Megaphone,
  Search,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import type { AIReport } from "../../types/AIReport";

type Props = {
  report: AIReport;
};

function SectionCard({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <article className="rounded-[28px] border border-white/10 bg-white/5 p-5 text-slate-100 shadow-[0_30px_80px_-40px_rgba(124,58,237,0.7)] backdrop-blur">
      <h3 className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-200/80">
        {icon}
        {title}
      </h3>
      <div className="mt-4 text-sm leading-7 text-slate-200/85">{children}</div>
    </article>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3 text-sm leading-6 text-slate-100/85">
          {item}
        </li>
      ))}
    </ul>
  );
}

function ScorePill({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-300">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
    </div>
  );
}

function formatCurrency(value: number): string {
  return `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

export default function PremiumReport({ report }: Props) {
  return (
    <section className="space-y-5 text-white">
      <div className="overflow-hidden rounded-[32px] border border-violet-400/20 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.28),rgba(15,23,42,0.94)_45%,rgba(36,14,68,0.96))] p-6 shadow-[0_40px_140px_-55px_rgba(124,58,237,0.95)] sm:p-7">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-200/80">Premium AI Report</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{report.product_name}</h1>
            <p className="mt-2 text-sm text-violet-100/75">{report.marketplace}</p>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-100/80">{report.executive_summary}</p>
            <div className="mt-5 rounded-[24px] border border-emerald-400/20 bg-emerald-500/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200/80">Business Verdict</p>
              <p className="mt-2 text-sm leading-7 text-emerald-50">{report.business_verdict}</p>
            </div>
          </div>

          <div className="grid min-w-[280px] gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <ScorePill label="Opportunity Score" value={report.opportunity_score} />
            <ScorePill label="Confidence Score" value={report.confidence_score} />
            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 sm:col-span-2 xl:col-span-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-300">Generated</p>
              <p className="mt-2 text-sm leading-6 text-white">{new Date(report.generated_at).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <SectionCard title="Market Potential" icon={<TrendingUp size={14} />}><p>{report.market_potential}</p></SectionCard>
        <SectionCard title="Demand Analysis" icon={<Gauge size={14} />}><p>{report.demand_analysis}</p></SectionCard>
        <SectionCard title="Competition Analysis" icon={<BarChart3 size={14} />}><p>{report.competition_analysis}</p></SectionCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard title="Pricing Strategy" icon={<DollarSign size={14} />}>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-300">Recommended Range</p>
              <p className="mt-2 text-sm text-white">{report.pricing_strategy.recommended_price_range}</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-300">Psychological Price</p>
              <p className="mt-2 text-sm text-white">{report.pricing_strategy.psychological_price_point}</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-black/20 p-4 md:col-span-2">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-300">Margin Outlook</p>
              <p className="mt-2 text-sm text-white">{report.pricing_strategy.margin_outlook}</p>
            </div>
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-violet-200/80">Launch Offer Strategy</p>
          <div className="mt-3"><BulletList items={report.pricing_strategy.launch_offer_strategy} /></div>
        </SectionCard>

        <SectionCard title="Profit Estimation" icon={<Briefcase size={14} />}>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/8 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.14em] text-slate-300">Estimated COGS</p><p className="mt-2 text-xl font-semibold text-white">{formatCurrency(report.profit_estimation.estimated_cogs)}</p></div>
            <div className="rounded-2xl border border-white/8 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.14em] text-slate-300">Suggested Price</p><p className="mt-2 text-xl font-semibold text-white">{formatCurrency(report.profit_estimation.suggested_selling_price)}</p></div>
            <div className="rounded-2xl border border-white/8 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.14em] text-slate-300">Gross Profit / Unit</p><p className="mt-2 text-xl font-semibold text-white">{formatCurrency(report.profit_estimation.gross_profit_per_unit)}</p></div>
            <div className="rounded-2xl border border-white/8 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.14em] text-slate-300">Gross Margin</p><p className="mt-2 text-xl font-semibold text-white">{report.profit_estimation.gross_margin_percent}%</p></div>
            <div className="rounded-2xl border border-white/8 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.14em] text-slate-300">Break-even Units</p><p className="mt-2 text-xl font-semibold text-white">{report.profit_estimation.break_even_units}</p></div>
            <div className="rounded-2xl border border-white/8 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.14em] text-slate-300">90-Day Profit Potential</p><p className="mt-2 text-sm leading-6 text-white">{report.profit_estimation.first_90_day_profit_potential}</p></div>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard title="Target Audience" icon={<Users size={14} />}>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-200/80">Primary Segments</p>
          <div className="mt-3"><BulletList items={report.target_audience.primary_segments} /></div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-violet-200/80">Buying Triggers</p>
          <div className="mt-3"><BulletList items={report.target_audience.buying_triggers} /></div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-violet-200/80">Objections</p>
          <div className="mt-3"><BulletList items={report.target_audience.objections} /></div>
        </SectionCard>

        <SectionCard title="Customer Persona" icon={<Compass size={14} />}>
          <div className="rounded-2xl border border-white/8 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.14em] text-slate-300">Persona</p><p className="mt-2 text-lg font-semibold text-white">{report.customer_persona.persona_name}</p></div>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-white/8 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.14em] text-slate-300">Demographics</p><p className="mt-2 text-sm leading-6 text-white">{report.customer_persona.demographics}</p></div>
            <div className="rounded-2xl border border-white/8 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.14em] text-slate-300">Psychographics</p><p className="mt-2 text-sm leading-6 text-white">{report.customer_persona.psychographics}</p></div>
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-violet-200/80">Pain Points</p>
          <div className="mt-3"><BulletList items={report.customer_persona.pain_points} /></div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-violet-200/80">Desired Outcomes</p>
          <div className="mt-3"><BulletList items={report.customer_persona.desired_outcomes} /></div>
        </SectionCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <SectionCard title="Marketing Angles" icon={<Megaphone size={14} />}>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-200/80">Awareness</p><div className="mt-3"><BulletList items={report.marketing_angles.awareness} /></div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-violet-200/80">Consideration</p><div className="mt-3"><BulletList items={report.marketing_angles.consideration} /></div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-violet-200/80">Conversion</p><div className="mt-3"><BulletList items={report.marketing_angles.conversion} /></div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-violet-200/80">Retention</p><div className="mt-3"><BulletList items={report.marketing_angles.retention} /></div>
        </SectionCard>
        <SectionCard title="Unique Selling Proposition" icon={<Sparkles size={14} />}><p>{report.unique_selling_proposition}</p></SectionCard>
        <SectionCard title="SEO Keywords" icon={<Search size={14} />}>
          <div className="flex flex-wrap gap-2">
            {report.seo_keywords.map((keyword) => (
              <span key={keyword} className="rounded-full border border-violet-300/15 bg-violet-400/10 px-3 py-1.5 text-xs font-semibold text-violet-100">{keyword}</span>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard title="Shopify Description" icon={<FileSearch size={14} />}><p>{report.shopify_description}</p></SectionCard>
        <SectionCard title="Product Description" icon={<Layers3 size={14} />}><p>{report.product_description}</p></SectionCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard title="Ad Creative Ideas" icon={<Target size={14} />}>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-200/80">Facebook Ads</p><div className="mt-3"><BulletList items={report.ad_creative_ideas.facebook_ads} /></div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-violet-200/80">TikTok Ad Ideas</p><div className="mt-3"><BulletList items={report.ad_creative_ideas.tiktok_ad_ideas} /></div>
        </SectionCard>
        <SectionCard title="Retention & Social Copy" icon={<Megaphone size={14} />}>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-200/80">Instagram Caption</p><div className="mt-3"><BulletList items={report.ad_creative_ideas.instagram_caption} /></div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-violet-200/80">Email Campaign</p><div className="mt-3"><BulletList items={report.ad_creative_ideas.email_campaign} /></div>
        </SectionCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard title="Launch Strategy" icon={<TrendingUp size={14} />}>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-200/80">Pre-Launch</p><div className="mt-3"><BulletList items={report.launch_strategy.pre_launch} /></div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-violet-200/80">Launch Week</p><div className="mt-3"><BulletList items={report.launch_strategy.launch_week} /></div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-violet-200/80">Post-Launch</p><div className="mt-3"><BulletList items={report.launch_strategy.post_launch} /></div>
        </SectionCard>
        <SectionCard title="SWOT Analysis" icon={<Compass size={14} />}>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200/80">Strengths</p><div className="mt-3"><BulletList items={report.swot_analysis.strengths} /></div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-rose-200/80">Weaknesses</p><div className="mt-3"><BulletList items={report.swot_analysis.weaknesses} /></div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-sky-200/80">Opportunities</p><div className="mt-3"><BulletList items={report.swot_analysis.opportunities} /></div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-amber-200/80">Threats</p><div className="mt-3"><BulletList items={report.swot_analysis.threats} /></div>
        </SectionCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard title="Risks" icon={<ShieldAlert size={14} />}><BulletList items={report.risks} /></SectionCard>
        <SectionCard title="Recommendations" icon={<Briefcase size={14} />}><BulletList items={report.recommendations} /></SectionCard>
      </div>
    </section>
  );
}