import { searchAliExpress } from "./providers/aliexpress";
import { searchAmazon } from "./providers/amazon";
import { searchShopify } from "./providers/shopify";

export async function searchAllPlatforms(filters: any) {
  const [ali, amazon, shopify] = await Promise.allSettled([
    searchAliExpress(filters),
    searchAmazon(filters),
    searchShopify(filters),
  ]);

  const products = [
    ...(ali.status === "fulfilled" ? ali.value : []),
    ...(amazon.status === "fulfilled" ? amazon.value : []),
    ...(shopify.status === "fulfilled" ? shopify.value : []),
  ];

  // Remove duplicate products
  const uniqueProducts = products.filter(
    (product, index, self) =>
      index ===
      self.findIndex(
        (p) =>
          p.name?.toLowerCase() === product.name?.toLowerCase()
      )
  );

  return uniqueProducts;
}