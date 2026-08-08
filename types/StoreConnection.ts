// Non-secret shape only. Access/refresh tokens never appear in this type --
// anything derived from `store_connections` that reaches the browser must
// only ever look like this.
export interface StoreConnectionStatus {
  connected: boolean;
  provider: "shopify";
  shopDomain?: string;
  scope?: string;
  status?: "connected" | "revoked" | "error";
  connectedAt?: string;
}
