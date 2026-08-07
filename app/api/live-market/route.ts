import { NextResponse } from "next/server";
import { searchAmazon } from "@/lib/dataforseo/searchAmazon";

export async function GET() {
  try {
    const amazon = await searchAmazon("trending products");

    return NextResponse.json(amazon);
  } catch (e) {
    console.error(e);

    return NextResponse.json(
      { error: "Failed to load market" },
      { status: 500 }
    );
  }
}