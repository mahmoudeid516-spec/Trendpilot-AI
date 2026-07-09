import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { product } = await req.json();

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: `
You are a professional e-commerce marketing expert.

Create marketing content for this product:

${product}

Return ONLY valid JSON.

{
  "facebook_ad":"",
  "instagram_caption":"",
  "tiktok_hook":"",
  "seo_title":"",
  "seo_description":"",
  "hashtags":""
}
`,
    });

    const text = response.output_text ?? "";

    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start === -1 || end === -1) {
      throw new Error("Invalid JSON");
    }

    const json = text.slice(start, end + 1);

    return NextResponse.json(JSON.parse(json));
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error: "Marketing generation failed.",
      },
      {
        status: 500,
      }
    );
  }
}