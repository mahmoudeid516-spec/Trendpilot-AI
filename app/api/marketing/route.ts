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
    You are the world's best e-commerce growth consultant.
    
    You specialize in:
    - Shopify
    - Amazon
    - TikTok Shop
    - Meta Ads
    - Google Ads
    - SEO
    - Branding
    - Consumer Psychology
    - Conversion Rate Optimization
    
    Analyze the following product carefully.
    
    Product:
    
    ${JSON.stringify(product, null, 2)}
    
    Return ONLY valid JSON.
    
    Do not use markdown.
    Do not wrap the JSON inside triple backticks.
    Do not explain anything.
    Do not omit any field.
    Do not return null.
    Do not return empty strings.
    
    Return exactly this JSON structure:
    
    {
      "executive_summary": "",
      "target_audience": "",
      "usp": "",
      "facebook_ad": "",
      "instagram_caption": "",
      "tiktok_hook": "",
      "shopify_description": "",
      "email_campaign": "",
      "seo_title": "",
      "seo_description": "",
      "keywords": "",
      "hashtags": "",
      "pricing_strategy": "",
      "launch_strategy": "",
      "marketing_funnel": ""
    }
    
    Rules:
    
    executive_summary:
    Write a 2-3 sentence executive summary explaining why this product has strong market potential.
    
    target_audience:
    Describe the ideal customer including age, interests, lifestyle and buying behavior.
    
    usp:
    Write one strong unique selling proposition.
    
    facebook_ad:
    Write one complete Facebook advertisement including headline, body and CTA as ONE string.
    
    instagram_caption:
    Write a high-converting Instagram caption with emojis and CTA.
    
    tiktok_hook:
    Write one viral TikTok hook.
    
    shopify_description:
    Write a professional Shopify product description.
    
    email_campaign:
    Write a promotional email including subject and body.
    
    seo_title:
    Maximum 60 characters.
    
    seo_description:
    Maximum 155 characters.
    
    keywords:
    Write 10 SEO keywords separated by commas.
    
    hashtags:
    Write 10 trending hashtags separated by spaces.
    
    pricing_strategy:
    Suggest the best pricing strategy.
    
    launch_strategy:
    Explain how to launch this product successfully.
    
    marketing_funnel:
    Explain Awareness → Consideration → Purchase → Retention in one paragraph.
    `,
    });
  
    const text = response.output_text ?? "";
    console.log("RAW AI RESPONSE:");
    console.log(text);

    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start === -1 || end === -1) {
      throw new Error("Invalid JSON returned from AI.");
    }

    const json = text.slice(start, end + 1);

const marketing = JSON.parse(json);
console.dir(marketing, { depth: null });

console.log("MARKETING OBJECT:");
console.dir(marketing, { depth: null });

marketing.facebook_ad =
  typeof marketing.facebook_ad === "string" &&
  marketing.facebook_ad.trim()
    ? marketing.facebook_ad
    : `🚀 Discover ${product.name}! Premium quality, amazing value, and fast delivery. Order yours today!`;

marketing.instagram_caption =
  typeof marketing.instagram_caption === "string" &&
  marketing.instagram_caption.trim()
    ? marketing.instagram_caption
    : `✨ Upgrade your lifestyle with ${product.name}! Shop now and experience the difference.`;

return NextResponse.json({
  marketing,
});
} catch (err: any) {
  console.error("MARKETING ERROR:", err);

  return NextResponse.json(
    {
      error: err?.message || String(err),
    },
    {
      status: 500,
    }
  );
}
}