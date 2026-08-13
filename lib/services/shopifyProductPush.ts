import { Session } from "@shopify/shopify-api";
import { getShopify, SHOPIFY_API_VERSION } from "../shopify";
import type { Product } from "../../types/Product";

// Pushes a TrendPilot-discovered product INTO a merchant's connected store.
// This is the opposite direction from lib/services/shopifyProducts.ts
// (which reads a merchant's existing catalog); it requires the
// write_products scope granted in lib/shopify.ts.
//
// Three calls, not one: as of the API version this project targets,
// ProductInput no longer accepts variants/price directly, so price has to
// be set on the auto-created default variant via a second mutation. Image
// attachment is a third, independent mutation. A failure setting the price
// is treated as fatal (the product exists in Shopify but not as promised);
// a failure attaching the image is logged but not fatal, since a priced,
// titled product without a photo is still a real, usable product.

const PRODUCT_CREATE_MUTATION = `#graphql
  mutation ProductCreate($input: ProductInput!) {
    productCreate(input: $input) {
      product {
        id
        handle
        variants(first: 1) {
          edges {
            node {
              id
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const PRODUCT_VARIANT_PRICE_MUTATION = `#graphql
  mutation ProductVariantsBulkUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
    productVariantsBulkUpdate(productId: $productId, variants: $variants) {
      productVariants {
        id
        price
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const PRODUCT_MEDIA_MUTATION = `#graphql
  mutation ProductCreateMedia($productId: ID!, $media: [CreateMediaInput!]!) {
    productCreateMedia(productId: $productId, media: $media) {
      media {
        mediaContentType
        status
      }
      mediaUserErrors {
        field
        message
      }
    }
  }
`;

type ShopifyUserError = { field: string[] | null; message: string };

type ProductCreateResponse = {
  productCreate: {
    product: {
      id: string;
      handle: string;
      variants: { edges: Array<{ node: { id: string } }> };
    } | null;
    userErrors: ShopifyUserError[];
  };
};

type ProductVariantsBulkUpdateResponse = {
  productVariantsBulkUpdate: {
    productVariants: Array<{ id: string; price: string }>;
    userErrors: ShopifyUserError[];
  };
};

type ProductCreateMediaResponse = {
  productCreateMedia: {
    media: Array<{ mediaContentType: string; status: string }>;
    mediaUserErrors: ShopifyUserError[];
  };
};

export async function createShopifyProduct(input: {
  shopDomain: string;
  accessToken: string;
  product: Product;
}): Promise<{ id: string; adminUrl: string }> {
  const { shopDomain, accessToken, product } = input;

  const title = String(product.name ?? "").trim();
  if (!title) {
    throw new Error("Product is missing a name.");
  }

  const price = Number(product.selling_price ?? 0);
  if (!Number.isFinite(price) || price < 0) {
    throw new Error("Product has an invalid selling price.");
  }

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

  const createResponse = await client.request<ProductCreateResponse>(
    PRODUCT_CREATE_MUTATION,
    {
      variables: {
        input: {
          title,
          descriptionHtml: String(product.description ?? ""),
          vendor: String(product.platform ?? product.supplier ?? "TrendPilot AI"),
          productType: String(product.category ?? "General"),
          // Created as a draft so the merchant reviews it in Shopify admin
          // before it goes live in their storefront.
          status: "DRAFT",
        },
      },
    }
  );

  const createResult = createResponse.data?.productCreate;
  const createErrors = createResult?.userErrors ?? [];

  if (createErrors.length > 0) {
    throw new Error(
      `Shopify rejected the product: ${createErrors.map((e) => e.message).join("; ")}`
    );
  }

  const createdProduct = createResult?.product;

  if (!createdProduct) {
    throw new Error("Shopify did not return the created product.");
  }

  const variantId = createdProduct.variants.edges[0]?.node.id;

  if (!variantId) {
    throw new Error("Shopify did not return a default variant to price.");
  }

  const priceResponse = await client.request<ProductVariantsBulkUpdateResponse>(
    PRODUCT_VARIANT_PRICE_MUTATION,
    {
      variables: {
        productId: createdProduct.id,
        variants: [{ id: variantId, price: price.toFixed(2) }],
      },
    }
  );

  const priceErrors =
    priceResponse.data?.productVariantsBulkUpdate?.userErrors ?? [];

  if (priceErrors.length > 0) {
    throw new Error(
      `Product was created but its price could not be set: ${priceErrors
        .map((e) => e.message)
        .join("; ")}`
    );
  }

  if (product.image) {
    try {
      await client.request<ProductCreateMediaResponse>(PRODUCT_MEDIA_MUTATION, {
        variables: {
          productId: createdProduct.id,
          media: [
            {
              originalSource: String(product.image),
              mediaContentType: "IMAGE",
              alt: title,
            },
          ],
        },
      });
    } catch (error) {
      console.error("[shopify-product-push] media_attach_failed", {
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const numericId = createdProduct.id.split("/").pop();

  return {
    id: createdProduct.id,
    adminUrl: `https://${shopDomain}/admin/products/${numericId}`,
  };
}
