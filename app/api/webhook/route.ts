import { NextResponse } from "next/server";
import Stripe from "stripe";

// تهيئة Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-06-24.dahlia",
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    // التحقق من أن الطلب قادم فعلاً من Stripe
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // معالجة نجاح الدفع
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // هنا يجب أن تضيف الكود الذي يحدث قاعدة البيانات (مثلاً: تحديث حقل plan في المستخدم)
    console.log("Payment successful for user:", session.customer_details?.email);
  }

  return NextResponse.json({ received: true });
}