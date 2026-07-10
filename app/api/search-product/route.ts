import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { product } = await req.json();
    console.log("SERP API KEY =", process.env.SERPAPI_API_KEY);
    const apiKey = process.env.SERPAPI_API_KEY;

    console.log("API Key exists:", !!apiKey);
    console.log("Length:", apiKey?.length);

    if (!apiKey) {
      return NextResponse.json(
        { error: "SERPAPI_API_KEY is missing." },
        { status: 500 }
      );
    }

    const url =
      `https://serpapi.com/search.json?engine=google_shopping` +
      `&q=${encodeURIComponent(product)}` +
      `&gl=us` +
      `&hl=en` +
      `&num=10` +
      `&api_key=${apiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("SERP API request failed.");
    }

    const data = await response.json();

    const items = data.shopping_results || [];

    if (items.length === 0) {
      return NextResponse.json(
        { error: "No products found." },
        { status: 404 }
      );
    }

    const first = items[0];

    return NextResponse.json({
      name: first.title,
      image: first.thumbnail,
      price: first.price,
      source: first.source,
      link: first.link,

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

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Search failed.",
      },
      {
        status: 500,
      }
    );
  }
}