import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("=== SEARCH ROUTE STARTED ===");

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
      `&gl=us` +
      `&hl=en` +
      `&num=10` +
      `&api_key=${apiKey}`;

      const response = await fetch(url);

      const data = await response.json();
      
      console.log("STATUS:", response.status);
      console.log("SERP RESPONSE:", JSON.stringify(data, null, 2));
      
      if (!response.ok) {
        return NextResponse.json(
          {
            status: response.status,
            serp: data,
          },
          {
            status: 500,
          }
        );
      }

    const items =
      data.shopping_results ||
      data.organic_results ||
      [];

    if (items.length === 0) {
      return NextResponse.json(
        {
          error: "No products found.",
          serpResponse: data,
        },
        {
          status: 404,
        }
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
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}