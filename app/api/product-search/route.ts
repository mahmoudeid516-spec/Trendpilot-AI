import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const filters = await req.json();

    const search =
      filters.keyword ||
      filters.query ||
      filters.search ||
      "wireless earbuds";

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/discover?search=${encodeURIComponent(search)}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const products = await response.json();

    return NextResponse.json(products);
  } catch (error: any) {
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