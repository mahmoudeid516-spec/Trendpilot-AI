import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const searchSchema = z.object({
  search: z.string().trim().min(1).max(100),
});

export async function GET(req: NextRequest) {
  try {
    const token = process.env.APIFY_TOKEN;

    if (!token) {
      console.error("Missing APIFY_TOKEN");

      return NextResponse.json(
        {
          error: "Server configuration error.",
        },
        {
          status: 500,
        }
      );
    }

    const parsed = searchSchema.safeParse({
      search:
        req.nextUrl.searchParams.get("search") ??
        "wireless earbuds",
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid search query.",
        },
        {
          status: 400,
        }
      );
    }

    const actorId = "dky0rE40JOyXui6TR";

    const response = await fetch(
      `https://api.apify.com/v2/acts/${actorId}/run-sync-get-dataset-items?token=${token}`,
      {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          searchQueries: [parsed.data.search],
          maxProductsPerQuery: 50,
          sortBy: "orders",
        }),
      }
    );

    if (!response.ok) {
      console.error(
        "Apify request failed:",
        response.status
      );

      return NextResponse.json(
        {
          error: "Failed to discover products.",
        },
        {
          status: response.status,
        }
      );
    }

    const products = await response.json();

    return NextResponse.json(products);
  } catch (error) {
    console.error("Discover API error:", error);

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