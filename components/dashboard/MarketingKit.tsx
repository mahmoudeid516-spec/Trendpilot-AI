"use client";

import { useState } from "react";
import { Copy, Megaphone, WandSparkles } from "lucide-react";
import { supabase } from "../../lib/supabase";

type Props = {
  productName: string;
};

type MarketingResponse = {
  facebook_ad: string;
  instagram_caption: string;
  tiktok_hook: string;
  seo_title: string;
  hashtags: string;
};

export default function MarketingKit({
  productName,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [marketing, setMarketing] = useState<MarketingResponse | null>(null);
  const [error, setError] = useState("");

  async function generateMarketing() {
    setLoading(true);
    setError("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const res = await fetch("/api/marketing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({
          product: productName,
        }),
      });

      const data: MarketingResponse = await res.json();

      if (!res.ok) {
        throw new Error((data as { error?: string }).error || "Failed to generate marketing.");
      }

      setMarketing(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate marketing.");
    }

    setLoading(false);
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      setError("Unable to copy content. Please copy manually.");
    }
  }

  async function copyAll() {
    if (!marketing) return;

    try {
      await navigator.clipboard.writeText(`
Facebook Ad:
${marketing.facebook_ad}

Instagram:
${marketing.instagram_caption}

TikTok:
${marketing.tiktok_hook}

SEO:
${marketing.seo_title}

Hashtags:
${marketing.hashtags}
    `);
    } catch {
      setError("Unable to copy content. Please copy manually.");
    }
  }

  return (
    <div className="mt-8 rounded-3xl border border-white/10 bg-[rgba(17,24,39,0.72)] p-8 shadow-[0_24px_72px_-40px_rgba(124,58,237,0.88)] backdrop-blur-xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="inline-flex items-center gap-2 text-3xl font-extrabold tracking-tight text-white">
          <Megaphone className="h-7 w-7 text-violet-300" />
          AI Marketing Kit
        </h2>

        <button
          onClick={() => void copyAll()}
          className="inline-flex items-center gap-1 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:text-white"
        >
          <Copy size={14} />
          Copy All
        </button>
      </div>

      <button
        onClick={generateMarketing}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-xl border border-violet-300/35 bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-white transition hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-50"
      >
        <WandSparkles size={16} />
        {loading ? "Generating..." : "Generate Marketing Kit"}
      </button>

      {error ? (
        <p className="mt-4 rounded-xl border border-rose-300/30 bg-rose-500/10 px-4 py-2 text-sm text-rose-200">
          {error}
        </p>
      ) : null}

      {marketing ? (
        <div className="mt-8 space-y-5">
          <Block title="Facebook Ad" text={marketing.facebook_ad} onCopy={() => void copy(marketing.facebook_ad)} />
          <Block title="Instagram Caption" text={marketing.instagram_caption} onCopy={() => void copy(marketing.instagram_caption)} />
          <Block title="TikTok Hook" text={marketing.tiktok_hook} onCopy={() => void copy(marketing.tiktok_hook)} />
          <Block title="SEO Title" text={marketing.seo_title} onCopy={() => void copy(marketing.seo_title)} />
          <Block title="Hashtags" text={marketing.hashtags} onCopy={() => void copy(marketing.hashtags)} />
        </div>
      ) : null}
    </div>
  );
}

function Block({
  title,
  text,
  onCopy,
}: {
  title: string;
  text: string;
  onCopy: () => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <button
          onClick={onCopy}
          className="inline-flex items-center gap-1 rounded-lg border border-violet-300/30 bg-violet-500/15 px-3 py-1 text-xs font-semibold text-violet-100 transition hover:text-white"
        >
          <Copy size={12} />
          Copy
        </button>
      </div>
      <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">{text}</p>
    </div>
  );
}
