import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get("q") || "";

    const login = process.env.DATAFORSEO_LOGIN!;
    const password = process.env.DATAFORSEO_PASSWORD!;

    const auth = Buffer.from(`${login}:${password}`).toString("base64");

    const response = await fetch(
      "https://api.dataforseo.com/v3/merchant/amazon/products/live/advanced",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          {
            language_code: "en_US",
            location_code: 2840,
            keyword: q,
          },
        ]),
        cache: "no-store",
      }
    );

    const data = await response.json();

    console.log("DATAFORSEO:", JSON.stringify(data, null, 2));

    return NextResponse.json(data);
  } catch (e) {
    console.error(e);

    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}