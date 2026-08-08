import { Session } from "@shopify/shopify-api";
import { getShopify, SHOPIFY_API_VERSION } from "../shopify";
import { buildStableProductId } from "./productIdentity";
import type { Product } from "../../types/Product";

// Deliberately minimal: this reads a connected store's own catalog. It is
// not a market-opportunity scorer (that's what DataForSEO search is for),
// so ai_score/trend_score/sales/reviews have no real source here and are
// left at safe defaults rather than fabricated.
const PRODUCTS_QUERY = `#graphql
  query FetchShopifyProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          descriptionHtml
          productType
          vendor
          handle
          onlineStoreUrl
          featuredImage {
            url
          }
          priceRangeV2 {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

type ShopifyProductNode = {
  id: string;
  title: string;
  descriptionHtml?: string;
  productType?: string;
  vendor?: string;
  handle: string;
  onlineStoreUrl?: string | null;
  featuredImage?: { url: string } | null;
  priceRangeV2?: {
    minVariantPrice?: { amount: string; currencyCode: string };
  };
};

type ProductsQueryResponse = {
  products: {
    edges: Array<{ node: ShopifyProductNode }>;
  };
};

function stripHtml(html: string | undefined): string {
  return (html ?? "").replace(/<[^>]+>/g, "").trim();
}

export async function fetchShopifyProducts(params: {
  shopDomain: string;
  accessToken: string;
  limit?: number;
}): Promise<Product[]> {
  const { shopDomain, accessToken, limit = 50 } = params;

  const shopify = getShopify();

  const session = new Session({
    id: `shopify-admin-${shopDomain}`,
    shop: shopDomain,
    state: "",
    isOnline: false,
    accessToken,
  });

  const client = new shopify.clients.Graphql({
    session,
    apiVersion: SHOPIFY_API_VERSION,
  });

  const response = await client.request<ProductsQueryResponse>(
    PRODUCTS_QUERY,
    {
      variables: { first: limit },
    }
  );

  const edges = response.data?.products.edges ?? [];

  return edges.map(({ node }) => {
    const sellingPrice = Number(
      node.priceRangeV2?.minVariantPrice?.amount ?? 0
    );

    const productUrl =
      node.onlineStoreUrl ?? `https://${shopDomain}/products/${node.handle}`;

    const product: Product = {
      id: buildStableProductId({
        id: node.id,
        name: node.title,
        platform: "Shopify",
        product_url: productUrl,
        supplier_url: productUrl,
        category: node.productType || "General",
        buy_price: 0,
        selling_price: sellingPrice,
      }),
      source: "Shopify",
      platform: "Shopify",
      data_source: "Shopify store (your catalog)",
      buy_price_confidence: "real",
      name: node.title,
      description: stripHtml(node.descriptionHtml),
      image: node.featuredImage?.url ?? "",
      category: node.productType || "General",
      brand: node.vendor,
      product_url: productUrl,
      supplier: node.vendor || shopDomain,
      supplier_url: productUrl,
      store_name: shopDomain,
      currency: node.priceRangeV2?.minVariantPrice?.currencyCode ?? "USD",
      buy_price: 0,
      selling_price: sellingPrice,
      profit: sellingPrice,
      sales: 0,
      reviews: 0,
      country: "Worldwide",
      ai_score: 0,
      trend_score: 0,
      viral_score: 0,
      decision: "Imported",
      competition: "Medium",
    };

    return product;
  });
}
