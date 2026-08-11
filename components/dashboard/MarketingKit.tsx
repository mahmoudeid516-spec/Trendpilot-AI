"use client";

import { useState } from "react";
import Pill from "../ui/Pill";
import { buttonClass } from "../ui/button";

type Props = {
  productName: string;
};

type MarketingResponse = {
  facebook_ad?: string;
  instagram_caption?: string;
  tiktok_hook?: string;
  seo_title?: string;
  seo_description?: string;
  email_marketing?: string;
  hashtags?: string[];
};

const SECTIONS: Array<{ key: keyof MarketingResponse; icon: string; title: string }> = [
  { key: "facebook_ad", icon: "📘", title: "Facebook Ad" },
  { key: "instagram_caption", icon: "📷", title: "Instagram Caption" },
  { key: "tiktok_hook", icon: "🎬", title: "TikTok Hook" },
  { key: "seo_title", icon: "🔍", title: "SEO Title" },
  { key: "seo_description", icon: "🧩", title: "SEO Description" },
  { key: "email_marketing", icon: "📧", title: "Email Marketing" },
];

export default function MarketingKit({
  productName,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [marketing, setMarketing] = useState<MarketingResponse | null>(null);

  async function generateMarketing() {
    setLoading(true);

    try {
      const res = await fetch("/api/marketing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product: productName,
        }),
      });

      const data = await res.json();

      setMarketing(data);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text);
  }

  function copyAll() {
    if (!marketing) return;

    const hashtagsText = (marketing.hashtags ?? []).join(" ");

    navigator.clipboard.writeText(`
Facebook Ad:
${marketing.facebook_ad}

Instagram:
${marketing.instagram_caption}

TikTok:
${marketing.tiktok_hook}

SEO:
${marketing.seo_title}

SEO Description:
${marketing.seo_description}

Email Marketing:
${marketing.email_marketing}

Hashtags:
${hashtagsText}
    `);
  }

  return (
    <div className="border-t border-[var(--border-subtle)] p-6 sm:p-8">

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-[var(--ink-900)]">AI Marketing Kit</h2>
          <Pill tone="ai">AI-Generated</Pill>
        </div>

        {marketing && (
          <button onClick={copyAll} className={buttonClass({ tone: "neutral", size: "sm" })}>
            Copy All
          </button>
        )}
      </div>

      <button
        onClick={generateMarketing}
        disabled={loading}
        className={buttonClass({ tone: "ai" })}
      >
        {loading ? "Generating..." : "Generate Marketing Kit"}
      </button>

      {marketing && (
        <div className="mt-6 space-y-4">
          {SECTIONS.map(({ key, icon, title }) => (
            <div key={key} className="rounded-xl bg-[var(--surface-muted)] p-5">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-bold text-[var(--ink-900)]">
                  {icon} {title}
                </h3>

                <button
                  onClick={() => copy(marketing[key] as string ?? "")}
                  className={buttonClass({ tone: "ai", variant: "outline", size: "sm" })}
                >
                  Copy
                </button>
              </div>

              <p className="text-sm leading-6 text-[var(--ink-700)]">{marketing[key] as string}</p>
            </div>
          ))}

          <div className="rounded-xl bg-[var(--surface-muted)] p-5">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-bold text-[var(--ink-900)]">🏷️ Hashtags</h3>

              <button
                onClick={() => copy((marketing.hashtags ?? []).join(" "))}
                className={buttonClass({ tone: "ai", variant: "outline", size: "sm" })}
              >
                Copy
              </button>
            </div>

            <p className="text-sm leading-6 text-[var(--ink-700)]">{(marketing.hashtags ?? []).join(" ")}</p>
          </div>
        </div>
      )}

    </div>
  );
}
