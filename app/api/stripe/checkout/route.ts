import { NextResponse } from "next/server";
import { stripe } from "../../../../lib/stripe";

export async function POST(req: Request) {
  try {
    const { plan } = await req.json();

    let amount = 2900;

    switch (plan) {
      case "Starter":
        amount = 2900;
        break;

      case "Pro":
        amount = 4900;
        break;

      case "Enterprise":
        amount = 9900;
        break;

      default:
        amount = 2900;
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",

      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "usd",

            product_data: {
              name: `TrendPilot AI ${plan}`,
            },

            recurring: {
              interval: "month",
            },

            unit_amount: amount,
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