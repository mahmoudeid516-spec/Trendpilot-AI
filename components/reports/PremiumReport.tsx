import {
  AlertTriangle,
  BarChart3,
  Bolt,
  Briefcase,
  CheckCircle2,
  Compass,
  DollarSign,
  FileSearch,
  Gauge,
  Globe,
  Layers3,
  Megaphone,
  Search,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { AIReport } from "../../types/AIReport";

type Props = {
  report: AIReport;
};

function formatCurrency(value: number): string {
  return `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

function Surface({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`rounded-[32px] border border-white/70 bg-white/90 p-5 shadow-[0_26px_70px_-46px_rgba(15,23,42,0.42)] backdrop-blur-xl sm:p-6 ${className}`}
    >
      {children}
    </motion.article>
  );
}

function SectionTitle({
  icon,
  title,
  subtitle,
}: {
  icon: ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-cyan-100 text-indigo-700 shadow-sm">
        {icon}
      </span>
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm leading-6 text-slate-600">{subtitle}</p> : null}
      </div>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-700">
          {item}
        </li>
      ))}
    </ul>
  );
}

function KpiCard({
  label,
  value,
  tone,
  icon,
  sub,
}: {
  label: string;
  value: string;
  tone: string;
  icon: ReactNode;
  sub: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className={`rounded-2xl bg-gradient-to-br ${tone} p-[1px] shadow-xl`}
    >
      <div className="rounded-2xl border border-white/65 bg-white/90 p-4">
        <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">
          {icon}
          {label}
        </p>
        <p className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">{value}</p>
        <p className="mt-1 text-xs font-medium text-slate-500">{sub}</p>
      </div>
    </motion.div>
  );
}

function TimelineBlock({
  title,
  icon,
  items,
  tone,
}: {
  title: string;
  icon: ReactNode;
  items: string[];
  tone: string;
}) {
  return (
    <div className="relative pl-6">
      <div className={`absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b ${tone}`} />
      <div className="absolute -left-[10px] top-2 h-5 w-5 rounded-full border-2 border-white bg-slate-900" />
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
          {icon}
          {title}
        </p>
        <div className="mt-3">
          <BulletList items={items} />
        </div>
      </div>
    </div>
  );
}

export default function PremiumReport({ report }: Props) {
  const reportCountry = (report as AIReport & { country?: string }).country;

  return (
    <section className="mx-auto w-full max-w-[1400px] space-y-6 text-slate-900">
      <motion.div
        className="relative overflow-hidden rounded-[32px] border border-white/70 bg-gradient-to-br from-white via-slate-50/95 to-indigo-50/70 p-6 shadow-[0_45px_120px_-72px_rgba(15,23,42,0.46)] sm:p-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-cyan-500/14 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-6 h-72 w-72 rounded-full bg-violet-500/14 blur-3xl" />

        <div className="relative z-10">
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
            <Sparkles size={13} />
            Executive Intelligence Report
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">{report.product_name}</h1>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
              <Gauge size={13} />
              AI Confidence {report.confidence_score}%
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700">
              <Globe size={13} />
              {report.marketplace}
            </span>
            {reportCountry ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-700">
                <Compass size={13} />
                {reportCountry}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
              <FileSearch size={13} />
              {new Date(report.generated_at).toLocaleString()}
            </span>
          </div>

          <div className="mt-6 rounded-3xl border border-white/80 bg-white/85 p-5 shadow-sm sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Executive Summary</p>
            <p className="mt-3 text-sm leading-8 text-slate-700">{report.executive_summary}</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.07,
            },
          },
        }}
      >
        <motion.div variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}>
          <KpiCard
            label="Opportunity"
            value={`${report.opportunity_score}%`}
            tone="from-emerald-500 to-teal-600"
            icon={<TrendingUp size={13} />}
            sub="Opportunity score"
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}>
          <KpiCard
            label="Confidence"
            value={`${report.confidence_score}%`}
            tone="from-purple-500 to-violet-600"
            icon={<ShieldAlert size={13} />}
            sub="Model confidence"
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}>
          <KpiCard
            label="Trend"
            value="Demand"
            tone="from-blue-500 to-cyan-600"
            icon={<BarChart3 size={13} />}
            sub={report.demand_analysis}
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}>
          <KpiCard
            label="Competition"
            value="Market"
            tone="from-amber-500 to-orange-600"
            icon={<AlertTriangle size={13} />}
            sub={report.competition_analysis}
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}>
          <KpiCard
            label="Profit Margin"
            value={`${report.profit_estimation.gross_margin_percent}%`}
            tone="from-rose-500 to-pink-600"
            icon={<DollarSign size={13} />}
            sub="Projected gross margin"
          />
        </motion.div>
      </motion.div>

      <Surface>
        <SectionTitle
          icon={<Gauge size={18} />}
          title="Market Intelligence"
          subtitle="Demand, competition, growth and pricing observations."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <InsightTile title="Demand" text={report.demand_analysis} tone="from-cyan-500/20 to-blue-500/10" icon={<TrendingUp size={15} className="text-cyan-700" />} />
          <InsightTile title="Competition" text={report.competition_analysis} tone="from-rose-500/20 to-orange-500/10" icon={<AlertTriangle size={15} className="text-rose-700" />} />
          <InsightTile title="Growth" text={report.market_potential} tone="from-emerald-500/20 to-teal-500/10" icon={<Bolt size={15} className="text-emerald-700" />} />
          <InsightTile title="Pricing" text={report.pricing_strategy.margin_outlook} tone="from-violet-500/20 to-indigo-500/10" icon={<DollarSign size={15} className="text-violet-700" />} />
        </div>
      </Surface>

      <Surface>
        <SectionTitle icon={<Compass size={18} />} title="SWOT" subtitle="Strategic posture across strengths, weaknesses, opportunities and threats." />
        <div className="grid gap-4 md:grid-cols-2">
          <SwotQuadrant title="Strengths" items={report.swot_analysis.strengths} tone="border-emerald-200 bg-emerald-50/75 text-emerald-900" icon={<CheckCircle2 size={15} className="text-emerald-700" />} />
          <SwotQuadrant title="Weaknesses" items={report.swot_analysis.weaknesses} tone="border-rose-200 bg-rose-50/75 text-rose-900" icon={<AlertTriangle size={15} className="text-rose-700" />} />
          <SwotQuadrant title="Opportunities" items={report.swot_analysis.opportunities} tone="border-sky-200 bg-sky-50/75 text-sky-900" icon={<TrendingUp size={15} className="text-sky-700" />} />
          <SwotQuadrant title="Threats" items={report.swot_analysis.threats} tone="border-amber-200 bg-amber-50/75 text-amber-900" icon={<ShieldAlert size={15} className="text-amber-700" />} />
        </div>
      </Surface>

      <div className="grid gap-6 xl:grid-cols-2">
        <Surface>
          <SectionTitle icon={<Users size={18} />} title="Target Audience" subtitle="Persona, triggers, pain points and desired outcomes." />

          <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-cyan-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-600">Persona</p>
            <p className="mt-2 text-lg font-bold text-slate-900">{report.customer_persona.persona_name}</p>
            <p className="mt-2 text-sm leading-7 text-slate-700">{report.customer_persona.demographics}</p>
            <p className="mt-2 text-sm leading-7 text-slate-700">{report.customer_persona.psychographics}</p>
          </div>

          <div className="mt-4 space-y-4">
            <AudienceBlock title="Buying Triggers" items={report.target_audience.buying_triggers} tone="border-emerald-200 bg-emerald-50/70" />
            <AudienceBlock title="Pain Points" items={report.customer_persona.pain_points} tone="border-rose-200 bg-rose-50/70" />
            <AudienceBlock title="Desired Outcomes" items={report.customer_persona.desired_outcomes} tone="border-cyan-200 bg-cyan-50/70" />
          </div>
        </Surface>

        <Surface>
          <SectionTitle icon={<Megaphone size={18} />} title="Marketing Angles" subtitle="Message strategy for each customer journey stage." />
          <div className="grid gap-4 sm:grid-cols-2">
            <AngleCard title="Awareness" items={report.marketing_angles.awareness} tone="from-cyan-500/18 to-blue-500/10" />
            <AngleCard title="Consideration" items={report.marketing_angles.consideration} tone="from-violet-500/18 to-indigo-500/10" />
            <AngleCard title="Conversion" items={report.marketing_angles.conversion} tone="from-emerald-500/18 to-teal-500/10" />
            <AngleCard title="Retention" items={report.marketing_angles.retention} tone="from-amber-500/18 to-orange-500/10" />
          </div>
        </Surface>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Surface>
          <SectionTitle icon={<DollarSign size={18} />} title="Pricing Strategy" subtitle="Timeline-oriented rollout with highlighted pricing recommendation." />

          <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">Recommended Pricing</p>
            <p className="mt-2 text-xl font-black text-emerald-900">{report.pricing_strategy.recommended_price_range}</p>
            <p className="mt-2 text-sm text-emerald-800">Psychological point: {report.pricing_strategy.psychological_price_point}</p>
          </div>

          <div className="mt-4 space-y-4">
            <TimelineBlock
              title="Week 1"
              icon={<Compass size={14} className="text-slate-600" />}
              items={[report.pricing_strategy.margin_outlook]}
              tone="from-indigo-500 to-violet-600"
            />
            <TimelineBlock
              title="Week 2"
              icon={<Target size={14} className="text-slate-600" />}
              items={report.pricing_strategy.launch_offer_strategy.slice(0, 2)}
              tone="from-cyan-500 to-blue-600"
            />
            <TimelineBlock
              title="Week 3"
              icon={<TrendingUp size={14} className="text-slate-600" />}
              items={report.pricing_strategy.launch_offer_strategy.slice(2)}
              tone="from-emerald-500 to-teal-600"
            />
            <TimelineBlock
              title="Scaling"
              icon={<Bolt size={14} className="text-slate-600" />}
              items={report.recommendations.slice(0, 2)}
              tone="from-amber-500 to-orange-600"
            />
          </div>
        </Surface>

        <Surface>
          <SectionTitle icon={<TrendingUp size={18} />} title="Launch Strategy" subtitle="Execution pathway from preparation to scale." />
          <div className="space-y-4">
            <TimelineBlock
              title="Week 1"
              icon={<Compass size={14} className="text-slate-600" />}
              items={report.launch_strategy.pre_launch}
              tone="from-violet-500 to-indigo-600"
            />
            <TimelineBlock
              title="Week 2"
              icon={<Target size={14} className="text-slate-600" />}
              items={report.launch_strategy.launch_week}
              tone="from-cyan-500 to-blue-600"
            />
            <TimelineBlock
              title="Week 3"
              icon={<Bolt size={14} className="text-slate-600" />}
              items={report.launch_strategy.post_launch}
              tone="from-emerald-500 to-teal-600"
            />
            <TimelineBlock
              title="Scaling"
              icon={<BarChart3 size={14} className="text-slate-600" />}
              items={report.recommendations.slice(2)}
              tone="from-amber-500 to-orange-600"
            />
          </div>
        </Surface>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Surface>
          <SectionTitle icon={<ShieldAlert size={18} />} title="Risks" subtitle="Critical watchouts requiring mitigation." />
          <div className="space-y-3">
            {report.risks.map((risk) => (
              <div key={risk} className="rounded-2xl border border-rose-200 bg-rose-50/85 p-4 shadow-sm">
                <p className="inline-flex items-start gap-2 text-sm leading-7 text-rose-800">
                  <AlertTriangle size={16} className="mt-1 shrink-0" />
                  {risk}
                </p>
              </div>
            ))}
          </div>
        </Surface>

        <Surface>
          <SectionTitle icon={<Briefcase size={18} />} title="Recommendations" subtitle="Prioritized checklist for execution." />
          <div className="space-y-2.5">
            {report.recommendations.map((item) => (
              <div key={item} className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4">
                <p className="inline-flex items-start gap-2 text-sm leading-7 text-emerald-900">
                  <CheckCircle2 size={16} className="mt-1 shrink-0" />
                  {item}
                </p>
              </div>
            ))}
          </div>
        </Surface>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Surface className="xl:col-span-2">
          <SectionTitle icon={<Search size={18} />} title="Creative And SEO Assets" subtitle="Ready-to-publish messaging and keyword support." />

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Unique Selling Proposition</p>
              <p className="mt-2 text-sm leading-7 text-slate-700">{report.unique_selling_proposition}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">SEO Keywords</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {report.seo_keywords.map((keyword) => (
                  <span key={keyword} className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  <FileSearch size={13} />
                  Shopify Description
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-700">{report.shopify_description}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  <Layers3 size={13} />
                  Product Description
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-700">{report.product_description}</p>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <AssetList title="Facebook Ads" items={report.ad_creative_ideas.facebook_ads} />
              <AssetList title="TikTok Ad Ideas" items={report.ad_creative_ideas.tiktok_ad_ideas} />
              <AssetList title="Instagram Caption" items={report.ad_creative_ideas.instagram_caption} />
              <AssetList title="Email Campaign" items={report.ad_creative_ideas.email_campaign} />
            </div>
          </div>
        </Surface>

        <Surface>
          <SectionTitle icon={<Gauge size={18} />} title="Business Verdict" subtitle="Final executive decision signal." />
          <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Verdict</p>
            <p className="mt-3 text-lg font-bold leading-8 text-emerald-900">{report.business_verdict}</p>
            <div className="mt-5 grid gap-3">
              <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-700">Confidence</p>
                <p className="mt-1 text-xl font-black text-cyan-900">{report.confidence_score}%</p>
              </div>
              <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-indigo-700">Recommended Action</p>
                <p className="mt-1 text-sm leading-6 text-indigo-900">{report.recommendations[0] || report.business_verdict}</p>
              </div>
            </div>
          </div>

          {report.score_explanations ? (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Score Explanations</p>
              <p className="mt-2 text-sm leading-7 text-slate-700">{report.score_explanations.opportunity_score_reason}</p>
              <p className="mt-2 text-sm leading-7 text-slate-700">{report.score_explanations.confidence_score_reason}</p>
            </div>
          ) : null}
        </Surface>
      </div>
    </section>
  );
}

function InsightTile({
  title,
  text,
  tone,
  icon,
}: {
  title: string;
  text: string;
  tone: string;
  icon: ReactNode;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`rounded-2xl border border-slate-200 bg-gradient-to-br ${tone} p-4 shadow-sm`}
    >
      <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
        {icon}
        {title}
      </p>
      <p className="mt-2 text-sm leading-7 text-slate-700">{text}</p>
    </motion.div>
  );
}

function SwotQuadrant({
  title,
  items,
  tone,
  icon,
}: {
  title: string;
  items: string[];
  tone: string;
  icon: ReactNode;
}) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className={`rounded-3xl border p-4 shadow-sm ${tone}`}>
      <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em]">
        {icon}
        {title}
      </p>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="rounded-2xl border border-white/70 bg-white/65 px-4 py-3 text-sm leading-7">
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function AudienceBlock({ title, items, tone }: { title: string; items: string[]; tone: string }) {
  return (
    <div className={`rounded-2xl border p-4 ${tone}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">{title}</p>
      <div className="mt-3">
        <BulletList items={items} />
      </div>
    </div>
  );
}

function AngleCard({ title, items, tone }: { title: string; items: string[]; tone: string }) {
  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }} className={`rounded-2xl border border-slate-200 bg-gradient-to-br ${tone} p-4`}>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">{title}</p>
      <div className="mt-3">
        <BulletList items={items} />
      </div>
    </motion.div>
  );
}

function AssetList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{title}</p>
      <div className="mt-3">
        <BulletList items={items} />
      </div>
    </div>
  );
}
