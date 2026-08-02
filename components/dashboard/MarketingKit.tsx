"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  ChevronDown,
  Copy,
  Image,
  Mail,
  Megaphone,
  Search,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { toast } from "sonner";
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
  google_ad?: string;
  email_campaign?: string;
  seo_description?: string;
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
      toast.success("Copied to clipboard.");
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
      toast.success("Marketing kit copied.");
    } catch {
      setError("Unable to copy content. Please copy manually.");
    }
  }

  const outputCards = marketing
    ? [
        {
          key: "facebook_ad",
          title: "Facebook Ad",
          icon: BadgeCheck,
          text: marketing.facebook_ad,
        },
        {
          key: "google_ad",
          title: "Google Ad",
          icon: Search,
          text: marketing.google_ad,
        },
        {
          key: "tiktok_hook",
          title: "TikTok Hook",
          icon: Megaphone,
          text: marketing.tiktok_hook,
        },
        {
          key: "instagram_caption",
          title: "Instagram Caption",
          icon: Image,
          text: marketing.instagram_caption,
        },
        {
          key: "email_campaign",
          title: "Email Campaign",
          icon: Mail,
          text: marketing.email_campaign,
        },
        {
          key: "seo_description",
          title: "SEO Description",
          icon: Search,
          text: marketing.seo_description || marketing.seo_title,
        },
      ].filter((card): card is {
        key: string;
        title: string;
        icon: typeof Sparkles;
        text: string;
      } => Boolean(card.text && card.text.trim().length > 0))
    : [];

  return (
    <motion.section
      className="relative mt-8 overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-br from-white via-slate-50/95 to-indigo-50/70 p-6 shadow-[0_38px_100px_-58px_rgba(30,41,59,0.42)] backdrop-blur-xl sm:p-8"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.35 }}
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/16 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-60 w-60 rounded-full bg-cyan-500/14 blur-3xl" />
      <div className="pointer-events-none absolute left-1/3 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-violet-500/12 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.95),transparent_40%),radial-gradient(circle_at_84%_14%,rgba(129,140,248,0.18),transparent_34%),radial-gradient(circle_at_40%_100%,rgba(34,211,238,0.16),transparent_40%)]" />

      <div className="relative z-10 space-y-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              AI Marketing Assistant
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              AI Marketing Workspace
            </h2>
            <p className="mt-2 text-sm font-medium text-slate-600">Generate platform-ready marketing assets.</p>
          </div>

          <button
            onClick={() => void copyAll()}
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white/75 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-white hover:text-slate-900"
          >
            <Copy size={14} aria-hidden="true" />
            Copy All
          </button>
        </div>

        <motion.button
          onClick={generateMarketing}
          disabled={loading}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.99 }}
          className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition duration-200 hover:shadow-[0_16px_38px_-12px_rgba(79,70,229,0.7)] disabled:opacity-55"
        >
          {loading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" aria-hidden="true" />
          ) : (
            <WandSparkles size={16} aria-hidden="true" />
          )}
          {loading ? "Generating..." : "Generate Marketing Kit"}
        </motion.button>

        {error ? (
          <p className="mt-4 rounded-xl border border-rose-300/40 bg-rose-50 px-4 py-2 text-sm text-rose-700">
            {error}
          </p>
        ) : null}

        {marketing && outputCards.length > 0 ? (
          <motion.div
            className="mt-2 grid gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.07,
                },
              },
            }}
          >
            {outputCards.map((card) => (
              <Block
                key={card.key}
                title={card.title}
                text={card.text}
                icon={card.icon}
                onCopy={() => void copy(card.text)}
              />
            ))}
          </motion.div>
        ) : null}

        {marketing && outputCards.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 text-sm text-slate-600 shadow-sm">
            Generated response is available but does not contain renderable marketing sections.
          </div>
        ) : null}

        {marketing?.hashtags ? (
          <div className="rounded-2xl border border-indigo-200/60 bg-indigo-50/70 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-600">Hashtags</p>
            <p className="mt-2 text-sm font-medium text-slate-700">{marketing.hashtags}</p>
            <button
              type="button"
              onClick={() => void copy(marketing.hashtags)}
              className="mt-3 inline-flex items-center gap-1 rounded-lg border border-indigo-200 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50"
            >
              <Copy size={12} aria-hidden="true" />
              Copy
            </button>
          </div>
        ) : null}

        <div className="pointer-events-none absolute inset-0 rounded-3xl border border-white/70" />
      </div>
    </motion.section>
  );
}

function Block({
  title,
  text,
  icon: Icon,
  onCopy,
}: {
  title: string;
  text: string;
  icon: typeof Sparkles;
  onCopy: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > 280;

  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 14 },
        visible: { opacity: 1, y: 0 },
      }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl bg-gradient-to-br from-indigo-400/70 via-violet-400/65 to-cyan-400/65 p-[1px] shadow-[0_18px_40px_-24px_rgba(79,70,229,0.4)]"
    >
      <div className="rounded-2xl border border-white/75 bg-white p-5 shadow-sm">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h3 className="inline-flex items-center gap-2 text-base font-bold text-slate-900">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
              <Icon size={15} aria-hidden="true" />
            </span>
            {title}
          </h3>

          <button
            type="button"
            onClick={onCopy}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <Copy size={12} aria-hidden="true" />
            Copy
          </button>
        </div>

        <p
          className={`whitespace-pre-wrap rounded-xl border border-slate-200/80 bg-slate-50/85 px-4 py-3 text-sm leading-7 text-slate-700 ${
            !expanded && isLong ? "line-clamp-5" : ""
          }`}
        >
          {text}
        </p>

        {isLong ? (
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="mt-3 inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <ChevronDown
              size={12}
              className={`transition-transform ${expanded ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
            {expanded ? "Show Less" : "Show More"}
          </button>
        ) : null}
      </div>
    </motion.article>
  );
}
