import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();

    console.log("Webhook received");
    console.log(body);

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Webhook Error" },
      { status: 400 }
    );
  }
}