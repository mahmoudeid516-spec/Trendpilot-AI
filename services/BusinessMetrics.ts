import type { Product } from "../types/Product";

export function calculateBusinessMetrics(product: Product): Product {
  // سعر الشراء
  const buyPrice =
    Number(product.buy_price) ||
    Number((product as any).price) ||
    0;

  // هامش ربح افتراضي 2.5x
  const sellingPrice =
    buyPrice > 0 ? Number((buyPrice * 2.5).toFixed(2)) : 0;

  // الربح
  const profit =
    Number((sellingPrice - buyPrice).toFixed(2));

  // ROI
  const roi =
    buyPrice > 0
      ? Number(((profit / buyPrice) * 100).toFixed(1))
      : 0;

  return {
    ...product,

    buy_price: buyPrice,

    selling_price: sellingPrice,

    profit,

    roi,
  };
}

export function calculateProductsMetrics(
  products: Product[]
): Product[] {
  return products.map(calculateBusinessMetrics);
}