import { NextResponse } from "next/server";
import { searchDataForSeoProducts } from "../../../lib/services/dataforseoProductSearch";

export async function POST(req: Request) {
  try {
    const filters = await req.json();

    const search =
      filters.keyword ||
      filters.query ||
      filters.search ||
      "wireless earbuds";
    const products = await searchDataForSeoProducts(String(search));

    return NextResponse.json(products);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Product search failed.";

    const status =
      error instanceof Error &&
      error.message.includes("DataForSEO credentials are missing")
        ? 503
        : 500;

    return NextResponse.json(
      {
        error: message,
      },
      {
        status,
      }
    );
  }
}