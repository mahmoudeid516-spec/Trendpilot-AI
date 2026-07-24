import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { keyword } = await req.json();

    // مؤقتًا نرجع بيانات تجريبية
    // في الخطوة التالية هنستبدلها بـ DataForSEO

    return NextResponse.json({
      products: [
        {
          id: "1",
          name: `${keyword} Pro Version`,
          price: 39.99,
          rating: 4.8,
          orders: 12540,
        },
        {
          id: "2",
          name: `${keyword} Premium`,
          price: 42.50,
          rating: 4.7,
          orders: 9840,
        },
        {
          id: "3",
          name: `${keyword} Budget`,
          price: 29.99,
          rating: 4.5,
          orders: 18210,
        },
      ],
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to load competitors" },
      { status: 500 }
    );
  }
}