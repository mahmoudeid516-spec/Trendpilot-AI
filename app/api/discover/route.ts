import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  search: z.string().min(2).max(100),
});

export async function GET(req: NextRequest) {
  try {
    const login = process.env.DATAFORSEO_LOGIN;
    const password = process.env.DATAFORSEO_PASSWORD;

    if (!login || !password) {
      return NextResponse.json(
        { error: "Missing DataForSEO credentials" },
        { status: 500 }
      );
    }

    const parsed = schema.safeParse({
      search:
        req.nextUrl.searchParams.get("search") ??
        "wireless earbuds",
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid search" },
        { status: 400 }
      );
    }

    const auth = Buffer.from(
      `${login}:${password}`
    ).toString("base64");

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
            keyword: parsed.data.search,
            language_code: "en_US",
            location_code: 2840,
          },
        ]),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, {
        status: response.status,
      });
    }

    const items =
  data.tasks?.[0]?.result?.[0]?.items ?? [];

const seen = new Set<string>();

const uniqueItems = items.filter((item: any) => {
  const key =
    (
      item.data_asin ||
      item.title ||
      ""
    )
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();

  if (seen.has(key)) {
    return false;
  }

  seen.add(key);
  return true;
});

return NextResponse.json(uniqueItems);
  } catch (e) {
    console.error(e);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}