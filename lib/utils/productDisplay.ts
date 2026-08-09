import type { Product } from "../../types/Product";

export const NOT_AVAILABLE = "Not available";

export function formatCurrencyValue(
  value: number | undefined,
  currency = "USD"
): string {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return NOT_AVAILABLE;
  }

  const symbol = currency === "USD" ? "$" : `${currency} `;
  return `${symbol}${value.toFixed(2)}`;
}

export function formatPriceRange(product: Product): string {
  const buy = formatCurrencyValue(product.buy_price, product.currency);
  if (buy === NOT_AVAILABLE) return NOT_AVAILABLE;

  if (
    typeof product.price_to === "number" &&
    product.price_to > (product.buy_price ?? 0)
  ) {
    return `${buy} – ${formatCurrencyValue(product.price_to, product.currency)}`;
  }

  return buy;
}

export function hasRealRating(product: Product): boolean {
  return typeof product.store_rating === "number" && product.store_rating > 0;
}

export function formatRating(product: Product): string {
  if (!hasRealRating(product)) return NOT_AVAILABLE;
  return `${(product.store_rating as number).toFixed(1)}★`;
}

export function formatReviewCount(product: Product): string {
  if (!hasRealRating(product)) return NOT_AVAILABLE;
  return (product.reviews ?? 0).toLocaleString();
}

export function formatAsin(product: Product): string {
  return product.asin && product.asin.trim() ? product.asin : NOT_AVAILABLE;
}

export function formatDeliveryInfo(product: Product): string {
  return product.delivery_info && product.delivery_info.trim()
    ? product.delivery_info
    : NOT_AVAILABLE;
}

export function hasExternalUrl(product: Product): boolean {
  return Boolean(product.product_url && product.product_url.trim());
}
