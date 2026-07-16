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

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceIds[planId],
          quantity: 1,
        },
      ],
      mode: "subscription",
      metadata: {
        userId,
      },
      success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/#pricing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
