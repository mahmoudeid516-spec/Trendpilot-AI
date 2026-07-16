import { searchProducts } from "../productSearch";

export async function AliExpressConnector(
  keyword: string
) {
  return await searchProducts(
    keyword,
    "AliExpress"
  );
}