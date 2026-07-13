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

    const products = await response.json();
    console.log(products[0]);

    return NextResponse.json(products);

  } catch (e: any) {
    console.error(e);

    return NextResponse.json(
      {
        error: e?.message || String(e),
      },
      {
        status: 500,
      }
    );
  }
}