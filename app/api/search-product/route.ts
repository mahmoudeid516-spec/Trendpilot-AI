import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { product } = await req.json();

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

    const url =
      `https://serpapi.com/search.json?engine=google_shopping` +
      `&q=${encodeURIComponent(product)}` +
      `&gl=us` +
      `&hl=en` +
      `&num=10` +
      `&api_key=${apiKey}`;

    console.log("Searching:", product);

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

    const items = data.shopping_results ?? [];

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
      image: items[0].thumbnail,
      price: items[0].price,
      source: items[0].source,
      link: items[0].link,

      products: items.map((item: any) => ({
        name: item.title,
        image: item.thumbnail,
        price: item.price,
        source: item.source,
        rating: item.rating ?? 0,
        reviews: item.reviews ?? 0,
        link: item.link,
      })),
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