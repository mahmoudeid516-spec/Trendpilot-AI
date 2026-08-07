import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const product = body.product;

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-5.5",
      messages: [
        {
          role: "system",
content: `
You are a senior Ecommerce Product Analyst with expertise in Amazon FBA, Shopify, TikTok Shop and product validation.

Your task is to evaluate products using ONLY the information provided.

STRICT RULES:

- Respond ONLY with valid JSON.
- Never use markdown.
- Never invent numbers.
- Never guess prices.
- Never assume sales.
- If a value is missing, clearly state "Not enough data".
- Keep responses concise and professional.
- Base every conclusion on the supplied data.
- Recommendation MUST match the scores.
- Confidence must reflect data quality.

Return EXACTLY this JSON:

{
"business_verdict":"",
"confidence_score":0,
"opportunity_score":0,
"executive_summary":"",
"market_potential":"",
"demand_analysis":"",
"competition_analysis":"",
"target_audience":{
"primary_segments":[]
},
"marketing_angles":{
"awareness":[]
},
"swot_analysis":{
"strengths":[],
"weaknesses":[],
"opportunities":[],
"threats":[]
},
"risks":[],
"recommendations":[],
"score_explanations":{
"ai_score":"",
"trend_score":"",
"opportunity_score":""
},
"evidence":[]
`,
},
   {
          role: "user",
content: `
Analyze this ecommerce product using ONLY the provided data.

========================
PRODUCT INFORMATION
========================

Product Name:
${product.name ?? "Unknown"}

Category:
${product.category ?? "Unknown"}

Platform:
${product.platform ?? "Unknown"}

Description:
${product.description ?? "Not enough data"}

========================
PRICING
========================

Buy Price:
${product.buy_price ?? "Not enough data"}

Selling Price:
${product.selling_price ?? "Not enough data"}

Estimated Profit:
${product.profit ?? "Not enough data"}

========================
AI SCORES
========================

AI Score:
${product.ai_score ?? "Not enough data"}

Trend Score:
${product.trend_score ?? "Not enough data"}

Opportunity Score:
${product.opportunity_score ?? "Not enough data"}

Competition:
${product.competition ?? "Not enough data"}

========================
IMPORTANT
========================

Never invent values.

If Buy Price is missing,
say "Not enough data".

If Profit is missing,
say "Not enough data".

If Trend Score is low,
explain why.

If AI Score is high,
justify it.

Your Business Verdict MUST match
the supplied AI Score and Opportunity Score.

Return ONLY valid JSON.
`,
        },
      ],
    });

    const content = completion.choices[0].message.content;

    const opportunity =
  Number(product.opportunity_score ?? 0);

const ai =
  Number(product.ai_score ?? 0);

const confidence = Math.min(
  99,
  Math.round(ai * 0.6 + opportunity * 0.4)
);

let verdict = "Avoid";

if (ai >= 85 && opportunity >= 80) {
  verdict = "Strong Opportunity";
} else if (ai >= 70 && opportunity >= 65) {
  verdict = "Worth Testing";
}

    if (!content) {
      throw new Error("OpenAI returned an empty response.");
    }

    const aiReport = JSON.parse(content);

// لا نسمح للـ AI بتغيير القرار الأساسي
aiReport.business_verdict = verdict;

// نستخدم الحساب المحلي للثقة
aiReport.confidence_score = confidence;

// نستخدم Opportunity الحقيقي
aiReport.opportunity_score = opportunity;

    return NextResponse.json({
      success: true,
      report: aiReport,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate AI report",
      },
      {
        status: 500,
      }
    );
  }
}