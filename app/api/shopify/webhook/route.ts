import { NextRequest, NextResponse } from "next/server";
import { getShopify } from "../../../../lib/shopify";
import {
  revokeShopifyConnectionByShopDomain,
  deleteShopifyConnectionsByShopDomain,
} from "../../../../lib/services/shopifyConnections";

// Single receiver for all Shopify webhook topics, mirroring the Stripe
// webhook route's shape: verify the signature once, then dispatch by topic.
//
// This handles app/uninstalled and the three mandatory GDPR/privacy
// webhooks (customers/data_request, customers/redact, shop/redact).
// Shopify does not learn about this URL automatically -- each topic must
// be configured as an app-specific webhook subscription in the Partner
// Dashboard (or shopify.app.toml), pointing at
// `${NEXT_PUBLIC_SITE_URL}/api/shopify/webhook`. That configuration step
// happens outside this codebase.
export async function POST(req: NextRequest) {
  if (!process.env.SHOPIFY_API_KEY || !process.env.SHOPIFY_API_SECRET) {
    return NextResponse.json(
      { error: "Shopify integration is not configured." },
      { status: 503 }
    );
  }

  const rawBody = await req.text();

  let validation: Awaited<ReturnType<ReturnType<typeof getShopify>["webhooks"]["validate"]>>;

  try {
    const shopify = getShopify();

    validation = await shopify.webhooks.validate({
      rawBody,
      rawRequest: req,
    });
  } catch (error) {
    console.error("Shopify webhook validation threw:", error);

    return NextResponse.json(
      { error: "Unable to validate webhook." },
      { status: 500 }
    );
  }

  if (!validation.valid) {
    console.error(
      "Shopify webhook HMAC validation failed:",
      (validation as { reason?: string }).reason
    );

    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 401 }
    );
  }

  const { topic, domain } = validation;

  try {
    switch (topic) {
      case "app/uninstalled": {
        await revokeShopifyConnectionByShopDomain(domain);
        break;
      }

      case "shop/redact": {
        // Mandatory GDPR webhook: erase all stored data for this shop.
        await deleteShopifyConnectionsByShopDomain(domain);
        break;
      }

      case "customers/data_request":
      case "customers/redact": {
        // Mandatory GDPR webhooks. This app does not store Shopify
        // customer PII, so acknowledging is sufficient -- nothing to
        // return or erase beyond what shop/redact already covers.
        break;
      }

      default:
        console.log(`Unhandled Shopify webhook topic: ${topic}`);
    }
  } catch (error) {
    // Return a non-2xx so Shopify retries -- handlers above are safe to
    // re-run (idempotent revoke/delete), so a retry is the correct
    // response to a transient failure rather than silently dropping it.
    console.error(`Failed to process Shopify webhook topic ${topic}:`, error);

    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
