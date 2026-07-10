import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("=== SEARCH ROUTE STARTED ===");

  try {
    const { product } = await req.json();
    console.log("SERP API KEY =", process.env.SERPAPI_API_KEY);
    const apiKey = process.env.SERPAPI_API_KEY;

    console.log("API Key exists:", !!apiKey);
    console.log("Length:", apiKey?.length);

    if (!apiKey) {
      return NextResponse.json(
        { error: "SERPAPI_API_KEY is missing." },
        { status: 500 }
      );
    }

    const url =
      `https://serpapi.com/search.json?engine=google_shopping` +
      `&q=${encodeURIComponent(product)}` +
      `&gl=us` +
      `&hl=en` +
      `&num=10` +
      `&api_key=${apiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("SERP API request failed.");
    }

    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
    console.log("SERP Response:");
    console.log(JSON.stringify(data, null, 2));

    const items =
      data.shopping_results ||
      data.shopping_results_results ||
      data.organic_results ||
      [];

    console.log("Items found:", items.length);

    if (items.length === 0) {
      return NextResponse.json(
        {
          error: "No products found.",
          serpResponse: data
        },
        { status: 404 }
      );
    }

    const first = items[0];

    return NextResponse.json({
      name: first.title,
      image: first.thumbnail,
      price: first.price,
      source: first.source,
      link: first.link,

      products: items.map((item: any) => ({
        name: item.title,
        image: item.thumbnail,
        price: item.price,
        source: item.source,
        rating: item.rating ?? 0,
        reviews: item.reviews ?? 0,
        link: item.link,
      })),
    });

    import { NextResponse } from "next/server";

    export async function POST(req: Request) {
      console.log("=== SEARCH ROUTE STARTED ===");
    
      try {
        const { product } = await req.json();
        console.log("SERP API KEY =", process.env.SERPAPI_API_KEY);
        const apiKey = process.env.SERPAPI_API_KEY;
    
        console.log("API Key exists:", !!apiKey);
        console.log("Length:", apiKey?.length);
    
        if (!apiKey) {
          return NextResponse.json(
            { error: "SERPAPI_API_KEY is missing." },
            { status: 500 }
          );
        }
    
        const url =
          `https://serpapi.com/search.json?engine=google_shopping` +
          `&q=${encodeURIComponent(product)}` +
          `&gl=us` +
          `&hl=en` +
          `&num=10` +
          `&api_key=${apiKey}`;
    
          const response = await fetch(url);
    
        if (!response.ok) {
          throw new Error("SERP API request failed.");
        }
    
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
        console.log("SERP Response:");
        console.log(JSON.stringify(data, null, 2));
    
        const items =
      data.shopping_results ||
      data.shopping_results_results ||
      data.organic_results ||
      [];
    
    console.log("Items found:", items.length);
    
    if (items.length === 0) {
      return NextResponse.json(
        {
          error: "No products found.",
          serpResponse: data
        },
        { status: 404 }
      );
    }
    
        const first = items[0];
    
        return NextResponse.json({
          name: first.title,
          image: first.thumbnail,
          price: first.price,
          source: first.source,
          link: first.link,
    
          products: items.map((item: any) => ({
            name: item.title,
            image: item.thumbnail,
            price: item.price,
            source: item.source,
            rating: item.rating ?? 0,
            reviews: item.reviews ?? 0,
            link: item.link,
          })),
        });
    
      }catch (error: any) {
        console.error("FULL ERROR:", error);
      
        return NextResponse.json(
          {
            error: error.message,
            stack: String(error),
          },
          {
            status: 500,
          }
        );
      }
    }