import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { product } = await req.json();

    const apiKey = process.env.SERPAPI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "SERPAPI_API_KEY is missing." },
        { status: 500 }
      );
    }

    const url =
      `https://serpapi.com/search.json?engine=google_shopping` +
      `&q=${encodeURIComponent(product)}` +
      `&api_key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    const item = data.shopping_results?.[0];

    if (!item) {
      return NextResponse.json(
        { error: "No products found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      name: item.title,
      image: item.thumbnail,
      price: item.price,
      source: item.source,
      link: item.link,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Search failed." },
      { status: 500 }
    );
  }
}