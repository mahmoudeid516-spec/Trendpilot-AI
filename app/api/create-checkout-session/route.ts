import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-06-24.dahlia",
});

export async function POST(req: Request) {
  try {
    const { planId, userId } = await req.json();

    const priceIds: Record<string, string> = {
      pro: process.env.STRIPE_PRO_PRICE_ID!,
      premium: process.env.STRIPE_PREMIUM_PRICE_ID!,
    };

    if (!priceIds[planId]) {
      return NextResponse.json(
        { error: "Invalid plan selected." },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      line_items: [
        {
          price: priceIds[planId],
          quantity: 1,
        },
      ],

      mode: "subscription",

      subscription_data: {
        trial_period_days: 14,
        metadata: {
          userId: userId ?? "",
        },
      },

      success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/#pricing`,
    });

    return NextResponse.json({
      url: session.url,
    });
  } catch (error: any) {
    console.error("========== STRIPE ERROR ==========");
    console.error(error);
  
    if (error instanceof Stripe.errors.StripeError) {
      console.error("Message:", error.message);
      console.error("Type:", error.type);
      console.error("Code:", error.code);
      console.error("Param:", error.param);
    }
  
    return NextResponse.json(
      {
        error: error.message,
        type: error.type,
        code: error.code,
        param: error.param,
      },
      { status: 500 }
    );
  }
}