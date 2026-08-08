// A self-contained neutral "no image" placeholder for products with no
// real image URL from their data source. Previously several components
// fell back to https://picsum.photos/* -- a random stock-photo service --
// which rendered an unrelated real photo as if it were the product image.
// That misrepresents fabricated visuals as real product data, so every
// fallback must go through this placeholder instead.
export const NO_PRODUCT_IMAGE_PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
      <rect width="400" height="400" fill="#e5e7eb"/>
      <g fill="none" stroke="#9ca3af" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">
        <rect x="90" y="120" width="220" height="160" rx="12"/>
        <circle cx="150" cy="170" r="18"/>
        <path d="M90 250 L160 190 L220 240 L260 210 L310 260"/>
      </g>
      <text x="200" y="320" font-family="sans-serif" font-size="20" fill="#6b7280" text-anchor="middle">No image available</text>
    </svg>`
  );

export function productImageOrPlaceholder(image: string | undefined | null): string {
  return image && image.trim() ? image : NO_PRODUCT_IMAGE_PLACEHOLDER;
}
