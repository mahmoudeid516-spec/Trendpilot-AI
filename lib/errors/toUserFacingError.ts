/**
 * Maps a raw internal error message to safe, professional user-facing copy.
 * Never surfaces raw provider payloads, stack traces, credentials, or
 * internal paths -- those stay in server/console logs only (the caller is
 * expected to console.error the raw message separately for debugging).
 * `hint` is a generic category, never the raw message text.
 */

export type UserFacingError = {
  title: string;
  message: string;
  hint?: string;
};

export function toUserFacingError(rawMessage: string): UserFacingError {
  const lower = rawMessage.toLowerCase();

  if (
    lower.includes("credentials are missing") ||
    lower.includes("location_code is required") ||
    lower.includes("location_code is not a valid number")
  ) {
    return {
      title: "Product search is temporarily unavailable",
      message: "The product data provider is not fully configured yet.",
      hint: "Configuration issue -- please verify the DataForSEO environment settings.",
    };
  }

  if (lower.includes("aliexpress")) {
    return {
      title: "AliExpress source is not configured",
      message: "AliExpress product search isn't set up yet.",
      hint: "Configuration issue -- ALIEXPRESS_APP_KEY / ALIEXPRESS_APP_SECRET are not set.",
    };
  }

  if (lower.includes("dataforseo")) {
    return {
      title: "Product search is temporarily unavailable",
      message: "The data provider returned an error. Please try again shortly.",
      hint: "Provider error -- technical details are in the server logs.",
    };
  }

  if (
    lower.includes("failed to fetch") ||
    lower.includes("networkerror") ||
    lower.includes("network error") ||
    lower.includes("load failed")
  ) {
    return {
      title: "Unable to reach the server",
      message: "Please check your connection and try again.",
    };
  }

  if (lower.includes("openai") || lower.includes("ai market analysis") || lower.includes("ai analysis")) {
    return {
      title: "AI market analysis is temporarily unavailable",
      message: "Product scoring and deterministic analysis are still available.",
    };
  }

  if (lower.includes("no products provided")) {
    return {
      title: "No products to analyze",
      message: "Run a product search first, then try again.",
    };
  }

  return {
    title: "Something went wrong",
    message: "We couldn't complete that search. Please try again.",
    hint: "Technical details are in the browser console and server logs.",
  };
}
