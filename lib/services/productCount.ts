/**
 * Shared, client-safe product-count constants. Kept in their own module
 * (no server-only code, no env var access) so client components never need
 * to import anything from lib/services/dataforseoProductSearch.ts, which
 * contains the DataForSEO credential/fetch logic and must stay
 * server-only.
 */
export const PRODUCT_COUNT_OPTIONS = [10, 20, 30, 50, 100] as const;
export const DEFAULT_PRODUCT_COUNT = 20;
