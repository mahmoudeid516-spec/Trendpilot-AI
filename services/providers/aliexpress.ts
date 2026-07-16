import { mapApifyProduct } from "../productMapper";

export async function searchAliExpress(keyword: string) {

  const response = await fetch(
    `/api/aliexpress-search?keyword=${encodeURIComponent(keyword)}`
  );

  const json = await response.json();

  const items = json.data?.itemList || [];

  console.log("FIRST PRODUCT:");
  console.log(items[0]);

  console.log(JSON.stringify(json.data, null, 2));

  return items.map(mapApifyProduct);

}