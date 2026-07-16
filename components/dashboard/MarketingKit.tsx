"use client";

import { useState } from "react";

type Props = {
  productName: string;
};

export default function MarketingKit({
  productName,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [marketing, setMarketing] = useState<any>(null);

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

    navigator.clipboard.writeText(`
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
  }

  return (
    <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-8 shadow-2xl">

      <div className="flex items-center justify-between mb-6">

        <h2 className="text-3xl font-bold">
          🚀 AI Marketing Studio
        </h2>

        <button
          onClick={copyAll}
          className="rounded-xl bg-gray-900 px-5 py-2 font-semibold text-white transition hover:bg-black"
        >
          Copy All
        </button>

      </div>

      <button
        onClick={generateMarketing}
        disabled={loading}
        className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 font-bold text-white transition hover:scale-105 hover:shadow-xl"
      >
        {loading ? "Generating..." : "Generate Marketing Kit"}
      </button>

      {marketing && (
        <div className="space-y-6 mt-8">

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm transition hover:shadow-md">

            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-xl">📘 Facebook Ad</h3>

              <button
                onClick={() => copy(marketing.facebook_ad)}
                className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
              >
                Copy
              </button>
            </div>

            <p>{marketing.facebook_ad}</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm transition hover:shadow-md">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-xl">📷 Instagram Caption</h3>

              <button
                onClick={() => copy(marketing.instagram_caption)}
                className="text-sm bg-purple-600 text-white px-3 py-1 rounded-lg"
              >
                Copy
              </button>
            </div>

            <p>{marketing.instagram_caption}</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm transition hover:shadow-md">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-xl">🎬 TikTok Hook</h3>

              <button
                onClick={() => copy(marketing.tiktok_hook)}
                className="text-sm bg-purple-600 text-white px-3 py-1 rounded-lg"
              >
                Copy
              </button>
            </div>

            <p>{marketing.tiktok_hook}</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm transition hover:shadow-md">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-xl">🔍 SEO Title</h3>

              <button
                onClick={() => copy(marketing.seo_title)}
                className="text-sm bg-purple-600 text-white px-3 py-1 rounded-lg"
              >
                Copy
              </button>
            </div>

            <p>{marketing.seo_title}</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm transition hover:shadow-md">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-xl">🏷️ Hashtags</h3>

              <button
                onClick={() => copy(marketing.hashtags)}
                className="text-sm bg-purple-600 text-white px-3 py-1 rounded-lg"
              >
                Copy
              </button>
            </div>

            <p>{marketing.hashtags}</p>
          </div>

        </div>
      )}

    </div>
 
)}