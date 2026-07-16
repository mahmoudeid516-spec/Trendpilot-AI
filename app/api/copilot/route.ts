import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    return NextResponse.json({
      answer: `You asked:\n\n"${question}"\n\nThis is the first version of TrendPilot AI Copilot. In the next step, it will use OpenAI to analyze products, suggest winning items, estimate profits, and build marketing strategies.`,
    });
  } catch {
    return NextResponse.json(
      { answer: "Something went wrong." },
      { status: 500 }
    );
  }
}