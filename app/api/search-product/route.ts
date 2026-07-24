import { NextResponse } from "next/server";

function parseBoughtCount(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const match = value.match(/\d[\d,]*/);
    if (match?.[0]) {
      const parsed = Number(match[0].replace(/,/g, ""));
      return Number.isFinite(parsed) ? parsed : 0;
    }
  }

  return 0;
}

export async function POST(req: Request) {
  try {
    const { product, provider } = (await req.json()) as {
      product?: string;
      provider?: string;
    };

    const query = String(product ?? "").trim();

    if (!query) {
      return NextResponse.json(
        {
          error: "Product query is required",
        },
        {
          status: 400,
        }
      );
    }

    const apiKey = process.env.SERPAPI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "SERPAPI_API_KEY is missing",
        },
        {
          status: 500,
        }
      );
    }

    const providerName =
      provider === "amazon" ? "amazon" : "google_shopping";

    const url =
      providerName === "amazon"
        ? `https://serpapi.com/search.json?engine=amazon` +
          `&k=${encodeURIComponent(query)}` +
          `&amazon_domain=amazon.com` +
          `&device=desktop` +
          `&api_key=${apiKey}`
        : `https://serpapi.com/search.json?engine=google_shopping` +
          `&q=${encodeURIComponent(query)}` +
          `&gl=us` +
          `&hl=en` +
          `&num=10` +
          `&api_key=${apiKey}`;

    console.log("Searching:", query, "Provider:", providerName);

    const response = await fetch(url);

    const data = await response.json();

    console.log("SERP STATUS:", response.status);
    console.log("SERP RESPONSE:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "SerpAPI request failed",
          status: response.status,
          serpResponse: data,
        },
        {
          status: response.status,
        }
      );
    }

    const items =
      providerName === "amazon"
        ? data.organic_results ?? []
        : data.shopping_results ?? [];

    if (items.length === 0) {
      return NextResponse.json(
        {
          error: "No products found",
          serpResponse: data,
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      name: items[0].title,
      image:
        providerName === "amazon"
          ? items[0].thumbnail
          : items[0].thumbnail,
      price:
        providerName === "amazon"
          ? `$${items[0].price ?? 0}`
          : items[0].price,
      source:
        providerName === "amazon"
          ? "Amazon"
          : items[0].source,
      link: items[0].link,

      products: items.map((item: any) => {
        const extractedPrice =
          providerName === "amazon"
            ? Number(item.price ?? 0)
            : Number(item.extracted_price ?? 0);

        return {
          name: item.title,
          image: item.thumbnail,
          price:
            providerName === "amazon"
              ? `$${extractedPrice}`
              : item.price,
          source:
            providerName === "amazon"
              ? "Amazon"
              : item.source,
          rating: Number(item.rating ?? 0),
          reviews: Number(item.reviews ?? 0),
          orders:
            providerName === "amazon"
              ? parseBoughtCount(item.bought)
              : 0,
          link: item.link,
        };
      }),
    });

  } catch (error: any) {
    console.error("FULL ERROR:", error);

    return NextResponse.json(
      {
        error: error.message,
        stack: error.stack,
      },
      {
        status: 500,
      }
    );
  }
}