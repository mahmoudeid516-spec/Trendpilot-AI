export type StoreConnectionStatus = {
  connected: boolean;
  provider: "shopify";
  shopDomain?: string;
  scope?: string;
  status?: "connected" | "revoked";
  connectedAt?: string;
};
