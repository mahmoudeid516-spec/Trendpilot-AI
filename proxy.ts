import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard", "/settings", "/billing", 
  "/analytics"];
const PREMIUM_PREFIXES = ["/analytics"];
const AUTH_ROUTES = new Set(["/login", "/register", "/auth"]);

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function isPremiumPath(pathname: string): boolean {
  return PREMIUM_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const { pathname, search } = request.nextUrl;

  if (!supabaseUrl || !supabaseAnonKey) {
    if (isProtectedPath(pathname)) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      redirectUrl.searchParams.set("redirectedFrom", `${pathname}${search}`);
      return NextResponse.redirect(redirectUrl);
    }

    return response;
  }

  let supabase;
  try {
    supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    });
  } catch {
    if (isProtectedPath(pathname)) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      redirectUrl.searchParams.set("redirectedFrom", `${pathname}${search}`);
      return NextResponse.redirect(redirectUrl);
    }

    return response;
  }

  let user = null;
  try {
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();
    user = currentUser;
  } catch {
    if (isProtectedPath(pathname)) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      redirectUrl.searchParams.set("redirectedFrom", `${pathname}${search}`);
      return NextResponse.redirect(redirectUrl);
    }

    return response;
  }

  if (!user && isProtectedPath(pathname)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("redirectedFrom", `${pathname}${search}`);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && AUTH_ROUTES.has(pathname)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  if (user && isPremiumPath(pathname)) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .maybeSingle<{ plan: string | null }>();

    const plan = (profile?.plan ?? "Free").toLowerCase();

    if (plan !== "premium") {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/pricing";
      redirectUrl.searchParams.set("requiredPlan", "Premium");
      redirectUrl.searchParams.set("redirectedFrom", pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/settings", "/billing", 
     "/analytics", "/login", "/register", "/auth"],
};