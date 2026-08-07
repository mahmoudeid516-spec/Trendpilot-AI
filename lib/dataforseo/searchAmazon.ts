import { normalizeDiscoverProducts } from "@/lib/normalizeDiscoverProducts";

export async function searchAmazon(keyword: string) {
  const login = process.env.DATAFORSEO_LOGIN;
  const password = process.env.DATAFORSEO_PASSWORD;

  if (!login || !password) {
    throw new Error("Missing DataForSEO credentials");
  }

  const auth = Buffer.from(`${login}:${password}`).toString("base64");

  const response = await fetch(
    "https://api.dataforseo.com/v3/merchant/amazon/products/live/advanced",
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        {
          keyword,
          language_code: "en_US",
          location_code: 2840,
        },
      ]),
      cache: "no-store",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error("DataForSEO request failed");
  }

  const items =
    data.tasks?.[0]?.result?.[0]?.items ?? [];

  const seen = new Set<string>();

  const uniqueItems = items.filter((item: any) => {
  const key = (
    item.data_asin ||
    item.title ||
    ""
  )
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

  if (seen.has(key)) return false;

  seen.add(key);

  return true;
});

const products = normalizeDiscoverProducts(uniqueItems);

// إزالة المنتجات الضعيفة
const filtered = products.filter((p) => {
  if (!p) return false;

  return (
    (p.ai_score ?? 0) >= 70 &&
    (p.trend_score ?? 0) >= 60 &&
    (p.rating ?? 0) >= 4 &&
    (p.reviews ?? 0) >= 100
  );
});

// ترتيب حسب أفضل فرصة
filtered.sort((a, b) => {
  const scoreA =
    (a.ai_score ?? 0) * 0.35 +
    (a.trend_score ?? 0) * 0.25 +
    (a.opportunity_score ?? 0) * 0.20 +
    (a.profit ?? 0) * 0.15 +
    ((a.competition === "Low"
      ? 10
      : a.competition === "Medium"
      ? 5
      : 0));

  const scoreB =
    (b.ai_score ?? 0) * 0.35 +
    (b.trend_score ?? 0) * 0.25 +
    (b.opportunity_score ?? 0) * 0.20 +
    (b.profit ?? 0) * 0.15 +
    ((b.competition === "Low"
      ? 10
      : b.competition === "Medium"
      ? 5
      : 0));

  return scoreB - scoreA;
});

// أفضل 20 منتج فقط
return filtered.slice(0, 20);
}