import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  getShopify,
  isValidShopDomain,
  SHOPIFY_CALLBACK_PATH,
  SHOPIFY_CONNECT_UID_COOKIE,
} from "../../../../lib/shopify";

export async function POST(req: NextRequest) {
  try {
    if (!process.env.SHOPIFY_API_KEY || !process.env.SHOPIFY_API_SECRET) {
      return NextResponse.json(
        { error: "Shopify integration is not configured." },
        { status: 503 }
      );
    }

    const authHeader = req.headers.get("authorization") ?? "";

    if (!authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json().catch(() => ({}))) as { shop?: unknown };
    const shop = String(body.shop ?? "")
      .trim()
      .toLowerCase();

    if (!isValidShopDomain(shop)) {
      return NextResponse.json(
        {
          error:
            "Enter a valid Shopify store domain, e.g. your-store.myshopify.com",
        },
        { status: 400 }
      );
    }

    const shopify = getShopify();

    // shopify.auth.begin() verifies nothing about our own user -- it only
    // sets up Shopify's own signed, short-lived CSRF state cookie and
    // returns a redirect to Shopify's authorize screen. We extract that
    // URL and forward its cookies ourselves (rather than letting the
    // browser follow a redirect from inside fetch(), which would silently
    // navigate the fetch call instead of the page).
    const beginResponse = await shopify.auth.begin({
      shop,
      callbackPath: SHOPIFY_CALLBACK_PATH,
      isOnline: false,
      rawRequest: req,
    });

    const authorizeUrl = beginResponse.headers.get("location");

    if (!authorizeUrl) {
      throw new Error("Shopify did not return an authorization URL.");
    }

    const response = NextResponse.json({ url: authorizeUrl });

    const setCookies =
      typeof beginResponse.headers.getSetCookie === "function"
        ? beginResponse.headers.getSetCookie()
        : [beginResponse.headers.get("set-cookie")].filter(
            (value): value is string => Boolean(value)
          );

    for (const cookie of setCookies) {
      response.headers.append("set-cookie", cookie);
    }

    // Remember which of our users this is for -- Shopify's callback request
    // carries no Supabase session, so this is how /callback learns who to
    // attach the connection to. Short-lived and single-use.
    response.cookies.set(SHOPIFY_CONNECT_UID_COOKIE, user.id, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 10 * 60,
    });

    return response;
  } catch (error: unknown) {
    console.error("Shopify connect error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Unable to start the Shopify connection.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
