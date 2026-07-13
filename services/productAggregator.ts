import { searchAliExpress } from "./providers/aliexpress";
import { searchAmazon } from "./providers/amazon";
import { searchShopify } from "./providers/shopify";

export async function searchAllPlatforms(filters: any) {
  const [ali, amazon, shopify] = await Promise.all([
    searchAliExpress(filters),
    searchAmazon(filters),
    searchShopify(filters),
  ]);

  return [
    ...ali,
    ...amazon,
    ...shopify,
  ];
}