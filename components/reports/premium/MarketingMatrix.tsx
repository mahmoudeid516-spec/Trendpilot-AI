import type { AIReport } from "../../../types/AIReport";

type MarketingMatrixProps = {
  report: AIReport;
};

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function MarketingMatrix({ report }: MarketingMatrixProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Awareness</p>
          <div className="mt-3">
            <List items={report.marketing_angles.awareness} />
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Consideration</p>
          <div className="mt-3">
            <List items={report.marketing_angles.consideration} />
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Conversion</p>
          <div className="mt-3">
            <List items={report.marketing_angles.conversion} />
          </div>
        </article>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Retention</p>
          <div className="mt-3">
            <List items={report.marketing_angles.retention} />
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">SEO</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {report.seo_keywords.map((keyword) => (
              <span key={keyword} className="rounded-full border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-700">
                {keyword}
              </span>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">USP</p>
          <p className="mt-3 text-sm leading-7 text-slate-700">{report.unique_selling_proposition}</p>
        </article>
      </div>

      <details className="rounded-2xl border border-slate-200 bg-white p-4">
        <summary className="cursor-pointer text-sm font-semibold text-slate-900">Creative Assets</summary>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Shopify Description</p>
            <p className="mt-2 text-sm leading-7 text-slate-700">{report.shopify_description}</p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Product Description</p>
            <p className="mt-2 text-sm leading-7 text-slate-700">{report.product_description}</p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Facebook Ads</p>
            <div className="mt-3">
              <List items={report.ad_creative_ideas.facebook_ads} />
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">TikTok Ideas</p>
            <div className="mt-3">
              <List items={report.ad_creative_ideas.tiktok_ad_ideas} />
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Instagram Caption</p>
            <div className="mt-3">
              <List items={report.ad_creative_ideas.instagram_caption} />
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Email Campaign</p>
            <div className="mt-3">
              <List items={report.ad_creative_ideas.email_campaign} />
            </div>
          </article>
        </div>
      </details>
    </div>
  );
}
