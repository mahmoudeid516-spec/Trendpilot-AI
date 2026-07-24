import { NextResponse } from "next/server";
import { openai } from "../../../lib/openai";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { product } = await req.json();
const userId = "test-user";
  /*
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }*/

    const { data: profile } = await supabaseAdmin
  .from("profiles")
  .select("*")
  .eq("id", userId)
  .single();

console.log("USER ID:", userId);
console.log("PROFILE:", profile);

    const plan = (profile?.plan || "Free").toLowerCase();
  
    console.log("PLAN =", plan);
    console.log("PROFILE =", profile);    
   /*
    if (plan === "free") {
      return NextResponse.json(
        {
          error: "Upgrade to Pro to use AI Product Analyzer.",
        },
        { status: 403 }
      );
    }. */

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: `
You are TrendPilot AI.

You are an expert Shopify consultant, Amazon consultant, TikTok Shop expert and Meta Ads strategist.

Analyze this product:

${JSON.stringify(product, null, 2)}

Return ONLY valid JSON.

{
  "name":"",
  "category":"",
  "description":"",
  "buy_price":0,
  "selling_price":0,
  "profit":0,
  "market_score":0,
  "trend_score":0,
  "competition":"Low",
  "country":"Worldwide",
  "pros":["","",""],
  "cons":["",""],
  "recommendation":"",
  "marketing":{
      "tiktok_hook":"",
      "facebook_ad":"",
      "seo_title":"",
      "seo_description":"",
      "hashtags":[]
  }
}
`,
    });

    const text = response.output_text ?? "";

    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start === -1 || end === -1) {
      throw new Error("Invalid JSON returned from OpenAI.");
    }

    const result = JSON.parse(text.slice(start, end + 1));

    return NextResponse.json({ result });
  } catch (err: any) {
    console.error(err);

    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}