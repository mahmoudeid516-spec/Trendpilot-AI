import type { Product } from "../../types/Product";

/**
 * AliExpress provider module, mirroring the shape of
 * dataforseoProductSearch.ts so app/api/product-search/* can treat every
 * source uniformly.
 *
 * The identified real, legitimate data source for AliExpress product data
 * is AliExpress Open Platform (the official AliExpress Affiliate API) --
 * not a scraper, not an invented endpoint. It requires an approved
 * affiliate account and an APP_KEY/APP_SECRET credential pair used to sign
 * requests.
 *
 * What is NOT implemented below, and why: AliExpress Open Platform's exact
 * product-search method (e.g. aliexpress.affiliate.product.query), its
 * request-signing algorithm, and its response shape cannot be verified
 * from this environment (no network access to their documentation, no
 * existing credentials or prior integration in this repo to trace). Rather
 * than guess at any of that -- which risks silently calling a wrong
 * endpoint or fabricating a response shape -- this module's only
 * unconditional behavior is an honest configuration check. Once a real
 * APP_KEY/APP_SECRET pair is available, the request/response handling
 * below should be completed and verified against AliExpress Open
 * Platform's own documentation before this path is enabled.
 */

export type AliExpressCredentials = {
  appKey: string;
  appSecret: string;
};

export function getAliExpressCredentials(): AliExpressCredentials {
  const appKey = process.env.ALIEXPRESS_APP_KEY;
  const appSecret = process.env.ALIEXPRESS_APP_SECRET;

  if (!appKey || !appSecret) {
    throw new Error(
      "AliExpress integration is not configured. Set ALIEXPRESS_APP_KEY and ALIEXPRESS_APP_SECRET " +
        "(AliExpress Open Platform / Affiliate API credentials) to enable AliExpress product search."
    );
  }

  return { appKey, appSecret };
}

export async function searchAliExpressProducts(
  _keyword: string,
  _count: number
): Promise<Product[]> {
  // Always throws in any environment without real credentials -- this is
  // the honest, intended behavior for this phase of the integration, not
  // a bug to silently work around.
  getAliExpressCredentials();

  // Reachable only once real credentials exist, at which point the actual
  // AliExpress Open Platform request still needs to be implemented and
  // verified (see module comment above) -- so this still refuses to
  // fabricate a result rather than returning something unverified.
  throw new Error(
    "AliExpress product search is not yet implemented against a verified API contract."
  );
}
