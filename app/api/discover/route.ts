import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = process.env.APIFY_TOKEN;

    if (!token) {
      return NextResponse.json(
        { error: "APIFY_TOKEN not found" },
        { status: 500 }
      );
    }

    const search =
      req.nextUrl.searchParams.get("search") ||
      "wireless earbuds";

    const actorId = "dky0rE40JOyXui6TR";

    console.log("Searching:", search);

    const response = await fetch(
      `https://api.apify.com/v2/acts/${actorId}/run-sync-get-dataset-items?token=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          searchQueries: [search],
          maxProductsPerQuery: 50,
          sortBy: "orders",
        }),
      }
    );

    console.log("Status:", response.status);

    if (!response.ok) {
      const text = await response.text();

      console.error(text);

      return NextResponse.json(
        {
          error: text,
        },
        {
          status: 500,
        }
      );
    }

    const products = await response.json();

    console.log("Products Found:", products.length);

    return NextResponse.json(products);

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