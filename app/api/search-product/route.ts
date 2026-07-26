import { NextResponse } from "next/server";

type ShoppingResult = {
  title?: string;
  thumbnail?: string;
  price?: string;
  source?: string;
  rating?: number;
  reviews?: number;
  link?: string;
};

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

    const response = await fetch(url);

    const data = await response.json();

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

    const items = (data.shopping_results ?? []) as ShoppingResult[];

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

      products: items.map((item) => ({
        name: item.title,
        image: item.thumbnail,
        price: item.price,
        source: item.source,
        rating: item.rating ?? 0,
        reviews: item.reviews ?? 0,
        link: item.link,
      })),
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Product search failed.";
    const stack = error instanceof Error ? error.stack : undefined;

    return NextResponse.json(
      {
        error: message,
        stack,
      },
      {
        status: 500,
      }
    );
  }
}