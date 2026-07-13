import { NextResponse } from "next/server";
import { stripe } from "../../../../lib/stripe";

export async function POST() {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",

      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "usd",

            product_data: {
              name: "TrendPilot AI Pro",
            },

            recurring: {
              interval: "month",
            },

            unit_amount: 2900,
          },

          quantity: 1,
        },
      ],

      success_url: "http://localhost:3000/success",

      cancel_url: "http://localhost:3000/cancel",
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