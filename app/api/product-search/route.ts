import { NextResponse } from "next/server";
import { z } from "zod";

const productSearchSchema = z.object({
  keyword: z.string().trim().max(100).optional(),
  query: z.string().trim().max(100).optional(),
  search: z.string().trim().max(100).optional(),
});

export async function POST(req: Request) {
  try {
    const body = productSearchSchema.parse(await req.json());

    const search =
      body.keyword ||
      body.query ||
      body.search ||
      "wireless earbuds";

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/discover?search=${encodeURIComponent(search)}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Failed to fetch products.",
        },
        {
          status: response.status,
        }
      );
    }

    const products = await response.json();

    return NextResponse.json(products);
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

    console.error("Product search error:", error);

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