import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const keyword = searchParams.get("keyword") || "phone";

  const url =
    `https://aliexpress-business-api.p.rapidapi.com/textsearch.php?` +
    `keyWord=${encodeURIComponent(keyword)}` +
    `&pageSize=20&pageIndex=1&country=US&currency=USD&lang=en`;

  try {
    const response = await fetch(url, {
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY!,
        "X-RapidAPI-Host":
          "aliexpress-business-api.p.rapidapi.com",
      },

      next: {
        revalidate: 3600,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "AliExpress API Error",
        },
        {
          status: response.status,
        }
      );
    }

    const data = await response.json();

    console.log("========== RAPID API ==========");
    console.log(
      `${data?.data?.itemList?.length || 0} Products`
    );

    return NextResponse.json(data);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to fetch AliExpress products",
      },
      {
        status: 500,
      }
    );
  }
}