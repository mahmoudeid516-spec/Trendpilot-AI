import type { Product } from "../../types/Product";

type ProductIdentitySource = Partial<Product> & {
  id?: unknown;
  name?: unknown;
  platform?: unknown;
  product_url?: unknown;
  supplier_url?: unknown;
  source?: unknown;
  category?: unknown;
  buy_price?: unknown;
  selling_price?: unknown;
};

function stableHash(input: string): string {
  let hash = 5381;
  for (let i = 0; i < input.length; i += 1) {
    hash = ((hash << 5) + hash) ^ input.charCodeAt(i);
  }

  return Math.abs(hash >>> 0).toString(36);
}

function normalizeSegment(value: unknown): string {
  const raw = asUsableIdSegment(value) ?? "";
  return raw.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function asUsableIdSegment(value: unknown): string | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const lowered = trimmed.toLowerCase();
  if (lowered === "nan" || lowered === "undefined" || lowered === "null") {
    return null;
  }

  return trimmed;
}

export function buildStableProductId(
  product: ProductIdentitySource
): string {
  const candidateId = asUsableIdSegment(product.id);
  if (candidateId) {
    return candidateId;
  }

  const productUrl = asUsableIdSegment(product.product_url);
  if (productUrl) {
    return productUrl;
  }

  const supplierUrl = asUsableIdSegment(product.supplier_url);
  if (supplierUrl) {
    return supplierUrl;
  }

  const fingerprint = [
    normalizeSegment(product.source),
    normalizeSegment(product.platform),
    normalizeSegment(product.category),
    normalizeSegment(product.name),
    normalizeSegment(product.buy_price),
    normalizeSegment(product.selling_price),
  ].join("|");

  const hash = stableHash(fingerprint || "product");
  const platform = normalizeSegment(product.platform) || "product";
  const name = normalizeSegment(product.name) || "item";

  return `${platform}-${name}-${hash}`;
}

export function normalizeProductId<T extends ProductIdentitySource>(
  product: T
): T {
  return {
    ...product,
    id: buildStableProductId(product),
  } as T;
}

export function ensureUniqueProductIds<T extends ProductIdentitySource>(
  products: T[]
): T[] {
  const seen = new Map<string, number>();

  return products.map((product) => {
    const baseId = buildStableProductId(product);
    let uniqueId = baseId;

    const count = seen.get(baseId) ?? 0;
    if (count > 0) {
      uniqueId = `${baseId}-${count + 1}`;
    }

    seen.set(baseId, count + 1);

    return {
      ...product,
      id: uniqueId,
    } as T;
  });
}