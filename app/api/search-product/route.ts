import { NextResponse } from "next/server";
import { z } from "zod";

type ShoppingResult = {
  title?: string;
  thumbnail?: string;
  price?: string;
  source?: string;
  rating?: number;
  reviews?: number;
  link?: string;
};

const searchSchema = z.object({
  product: z.string().trim().min(1).max(100),
});

export async function POST(req: Request) {
  try {
    const body = searchSchema.parse(await req.json());

    const apiKey = process.env.SERPAPI_API_KEY;

    if (!apiKey) {
      console.error("Missing SERPAPI_API_KEY");

      return NextResponse.json(
        {
          error: "Server configuration error.",
        },
        {
          status: 500,
        }
      );
    }

    const url =
      `https://serpapi.com/search.json?engine=google_shopping` +
      `&q=${encodeURIComponent(body.product)}` +
      `&gl=us` +
      `&hl=en` +
      `&num=10` +
      `&api_key=${apiKey}`;

    const response = await fetch(url, {
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("SerpAPI request failed:", response.status);

      return NextResponse.json(
        {
          error: "Failed to search products.",
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
          error: "No products found.",
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
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid request data.",
        },
        {
          status: 400,
        }
      );
    }

    console.error("Search product error:", error);

    return NextResponse.json(
      {
        error: "Internal server error.",
      },
      {
        status: 500,
      }
    );
  }
}