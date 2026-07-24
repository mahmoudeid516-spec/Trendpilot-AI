import { productSearch } from "../productSearch";

export async function searchAmazon(filters: any) {
  return await productSearch(filters);
}