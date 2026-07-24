import { productSearch } from "./productSearch";

export async function searchAllPlatforms(filters: any) {
  const products = (await productSearch(filters)) as Array<{
    name?: string;
  }>;

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