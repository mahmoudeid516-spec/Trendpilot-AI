import { productSearch } from "../productSearch";

export async function searchAliExpress(filters: any) {
  return await productSearch(filters);
}