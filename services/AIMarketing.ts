import { getOpenAI } from "./OpenAI";

type MarketingProduct = {
  name?: string;
  category?: string;
  selling_price?: number;
  profit?: number;
  platform?: string;
  ai_score?: number;
};

export async function generateMarketing(product: MarketingProduct) {
  const openai = getOpenAI();

  const prompt = `
You are an expert Shopify marketing strategist.

Generate ONLY valid JSON.

Product:
Name: ${product.name}
Category: ${product.category}
Price: ${product.selling_price}
Profit: ${product.profit}
Platform: ${product.platform}
AI Score: ${product.ai_score}

Return this JSON exactly:

{
 "instagram_caption":"",
 "facebook_ad":"",
 "tiktok_ad":"",
 "seo_title":"",
 "seo_description":"",
 "cta":"",
 "recommendation":"",
 "pros":[],
 "cons":[]
}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-5.5",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: {
      type: "json_object",
    },
  });

  return JSON.parse(
    response.choices[0].message.content || "{}"
  );
}