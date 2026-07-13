import { NextResponse } from "next/server";
import { openai } from "../../../lib/openai";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const systemPrompt = `
    You are TrendPilot AI.

    Your job is to extract ecommerce search filters from the user's request.
    
    Return ONLY valid JSON.
    
    Schema:
    
    {
      "keyword": "",
      "max_price": null,
      "competition": null,
      "country": null,
      "category": null,
      "platform": null,
      "sort": "ai_score"
    }
    
    Rules:
    
    Competition:
    - Low
    - Medium
    - High
    
    Platform:
    - Shopify
    - Amazon
    - TikTok
    - AliExpress
    
    Category examples:
    Beauty
    Kitchen
    Fitness
    Pets
    Electronics
    Fashion
    Baby
    Home
    Car
    Gaming
    
    Extract ALL mentioned filters.
    
    Examples:
    
    User:
    Find products under $20
    
    Return:
    {
      "keyword":"products",
      "max_price":20,
      "competition":null,
      "country":null,
      "category":null,
      "platform":null,
      "sort":"ai_score"
     }
    
    User:
    Find low competition beauty products for Germany
    
    Return:
    {
     "max_price":null,
     "competition":"Low",
     "country":"Germany",
     "category":"Beauty",
     "platform":null,
     "sort":"ai_score"
     Sorting Rules:

If the user asks:

highest profit
best profit
most profitable

Return:

"sort":"profit"

If the user asks:

trending
viral
popular
hot products

Return:

"sort":"trend"

Otherwise

"sort":"ai_score"
    }
    
    User:
    Find TikTok products under $30
    
    Return:
    {
      "keyword":"products",
      "max_price":30,
      "competition":null,
      "country":null,
      "category":null,
      "platform":"TikTok",
      "sort":"ai_score"
     }
    
    Return JSON only.

- JSON only.
- No markdown.
- No explanation.
- Use null if the user didn't specify a value.
`;

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: `${systemPrompt}

User Request:

${prompt}`,
    });

    const text = response.output_text ?? "";

    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start === -1 || end === -1) {
      throw new Error("Invalid JSON returned.");
    }

    const result = JSON.parse(
      text.slice(start, end + 1)
    );

    if (!result.keyword || result.keyword.trim() === "") {
      result.keyword = prompt;
    }

    const lowerPrompt = prompt.toLowerCase();

// Trending
if (
  lowerPrompt.includes("trend") ||
  lowerPrompt.includes("trending") ||
  lowerPrompt.includes("viral")
) {
  result.sort = "trend";
}

// Profit
if (
  lowerPrompt.includes("profit") ||
  lowerPrompt.includes("profitable") ||
  lowerPrompt.includes("highest profit")
) {
  result.sort = "profit";
}

// Competition
if (lowerPrompt.includes("low competition")) {
  result.competition = "Low";
}

if (lowerPrompt.includes("medium competition")) {
  result.competition = "Medium";
}

if (lowerPrompt.includes("high competition")) {
  result.competition = "High";
}

// Platforms
if (lowerPrompt.includes("tiktok")) {
  result.platform = "TikTok";
}

if (lowerPrompt.includes("amazon")) {
  result.platform = "Amazon";
}

if (lowerPrompt.includes("shopify")) {
  result.platform = "Shopify";
}

if (lowerPrompt.includes("aliexpress")) {
  result.platform = "AliExpress";
}

    return NextResponse.json(result);

  } catch (error: any) {

    console.error(error);

    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );

  }
}