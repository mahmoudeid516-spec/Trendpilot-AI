import { NextResponse } from "next/server";
import { stripe } from "../../../../lib/stripe";

export async function POST(req: Request) {
  try {
    const { plan } = await req.json();

    let priceId = "";

    switch (plan) {
      case "Pro":
        priceId = process.env.STRIPE_PRO_PRICE_ID!;
        break;

      case "Enterprise":
        priceId = process.env.STRIPE_ENTERPRISE_PRICE_ID!;
        break;

      default:
        return NextResponse.json(
          { error: "Invalid plan." },
          { status: 400 }
        );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",

      payment_method_types: ["card"],

      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],

      subscription_data: {
        trial_period_days: 14,
      },

      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,

      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
    });

    return NextResponse.json({
      url: session.url,
    });
  } catch (error: any) {
    console.error("Stripe Error:", error);

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