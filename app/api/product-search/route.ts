import {
  searchDataForSeoProducts,
  DataForSeoError,
} from "../../../lib/services/dataforseoProductSearch";
import { apiSuccess, apiError } from "../../../lib/apiResponse";

// Maps the provider's specific failure reason to a distinct API error code
// so the frontend can show an accurate state ("credentials missing" vs
// "provider auth failed" vs "provider timed out" vs "malformed response")
// instead of one generic error that looks like "no products found."
function mapDataForSeoError(error: DataForSeoError) {
  switch (error.code) {
    case "MISSING_CREDENTIALS":
      return apiError("PRODUCT_PROVIDER_ERROR", error.message, 503);
    case "AUTH_FAILED":
      return apiError("PRODUCT_PROVIDER_AUTH_FAILED", error.message, 502);
    case "TIMEOUT":
      return apiError("PRODUCT_PROVIDER_TIMEOUT", error.message, 504);
    case "MALFORMED_RESPONSE":
      return apiError("PRODUCT_PROVIDER_MALFORMED_RESPONSE", error.message, 502);
    case "REQUEST_FAILED":
    default:
      return apiError("PRODUCT_SEARCH_FAILED", error.message, 502);
  }
}

export async function POST(req: Request) {
  try {
    const filters = await req.json();

    const search =
      filters.keyword ||
      filters.query ||
      filters.search ||
      "wireless earbuds";

    const products = await searchDataForSeoProducts(String(search));

    // DataForSEO's merchant endpoint used here only pulls Amazon's catalog
    // (see lib/services/dataforseoProductSearch.ts) -- there is no real
    // AliExpress/Shopify data source behind this provider. Rather than
    // fabricate cross-platform results, the platform filter is applied
    // honestly against the inferred source of what the provider actually
    // returned: selecting a platform with no real matches correctly
    // yields zero results instead of silently ignoring the filter.
    const platform = typeof filters.platform === "string" ? filters.platform : "All";

    const filtered =
      platform === "All"
        ? products
        : products.filter((product) => product.platform === platform);

    console.log("[product-search] route_complete", {
      query: String(search),
      platform,
      providerProductCount: products.length,
      returnedProductCount: filtered.length,
    });

    return apiSuccess(filtered, {
      meta: { query: String(search), platform, total: filtered.length },
    });
  } catch (error: unknown) {
    if (error instanceof DataForSeoError) {
      console.error("[product-search] provider_error", {
        code: error.code,
        providerStatus: error.providerStatus,
        message: error.message,
      });

      return mapDataForSeoError(error);
    }

    const message =
      error instanceof Error ? error.message : "Product search failed.";

    console.error("[product-search] unexpected_error", { message });

    return apiError("PRODUCT_SEARCH_FAILED", message, 500);
  }
}
