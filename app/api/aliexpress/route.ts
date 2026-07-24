import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";

    if (!q) {
      return NextResponse.json(
        { success: false, error: "Keyword (q) is required" },
        { status: 400 }
      );
    }

    const login = process.env.DATAFORSEO_LOGIN!;
    const password = process.env.DATAFORSEO_PASSWORD!;
    const auth = Buffer.from(`${login}:${password}`).toString("base64");

    // Correct Endpoint: /merchant/amazon/search/live/advanced
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
            keyword: q,
            location_code: 2840, // United States
            language_code: "en_US",
          },
        ]),
        cache: "no-store",
      }
    );

    const result = await response.json();
    console.log("HTTP Status:", response.status);
console.dir(result, { depth: null });

    // Check DataForSEO overall API status (20000 = success)
    if (!response.ok) {
      console.log("HTTP Status:", response.status);
      console.dir(result, { depth: null });
    
      return NextResponse.json(
        {
          success: false,
          debug: result,
        },
        { status: response.status }
      );
    }

    if (result.status_code !== 20000) {
      return NextResponse.json(
        {
          success: false,
          error: result.status_message || "DataForSEO API Error",
        },
        { status: 500 }
      );
    }

    const task = result.tasks?.[0];

    // Check individual task status code
    if (task?.status_code !== 20000) {
      return NextResponse.json(
        {
          success: false,
          error: task?.status_message || "Task Processing Error",
        },
        { status: 500 }
      );
    }

    // Access items array returned from the Amazon Search endpoint
    const items = task?.result?.[0]?.items || [];
    console.log("===============");
console.log("Keyword:", q);
console.log("Products:", items.length);

items.slice(0, 5).forEach((item: any, i: number) => {
  console.log(
    i + 1,
    item.title,
    item.data_asin || item.asin
  );
});

console.log("===============");

    // Map and normalize fields while retaining your exact output schema
    const products = items.map((item: any, index: number) => ({
      id: item.data_asin || item.asin || item.url || `${index}-${item.title}`,

      title: item.title || null,

      image: item.image_url || item.image || null,

      price: item.price_from ?? item.price ?? item.price_value ?? 0,

      currency: item.currency ?? "USD",

      rating: item.rating?.value ?? item.rating ?? 0,

      reviews_count: item.rating?.votes_count ?? item.reviews_count ?? 0,

      seller: item.seller ?? null,

      product_url: item.url || item.product_url || null,

      asin: item.data_asin || item.asin || null,

      marketplace: "Amazon",

      rank: item.rank_absolute ?? index + 1,
    }));

    return NextResponse.json({
      success: true,
      total: products.length,
      products: products,
    });
  } catch (e) {
    console.error("TrendPilot API Error:", e);

    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}